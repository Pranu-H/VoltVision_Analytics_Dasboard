import pandas as pd
from django.http import JsonResponse
from django.shortcuts import render
from django.http import HttpResponse
from openpyxl import Workbook
from reportlab.platypus import Spacer

from reportlab.platypus import SimpleDocTemplate, Paragraph, Table
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.utils import timezone

import os
import json
import base64
from reportlab.platypus import Image
from io import BytesIO
from .models import EVData

from django.contrib.auth import authenticate, login
from .forms import CSVUploadForm, StyledUserCreationForm
from django.contrib.auth.models import User
from django.contrib import messages
from django.shortcuts import redirect

from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import PolynomialFeatures
import numpy as np

from .forms import CSVUploadForm, StyledUserCreationForm
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .serializers import EVDataSerializer

from django.contrib.auth.decorators import user_passes_test
from .models import Feedback
from django.db.models import Avg
def is_admin(user):
    return user.is_superuser


def is_analyst(user):
    return user.groups.filter(name='Analyst').exists()


def is_viewer(user):
    return user.groups.filter(name='Viewer').exists()

@login_required
def dashboard(request):
    #file_path = os.path.join(os.path.dirname(__file__), 'data/ev_data.csv')
    #df = pd.read_csv(file_path)

    data = EVData.objects.all()
    # Convert database data to DataFrame
    df = pd.DataFrame(list(data.values()))

    # Rename columns (important for clean code)
    df.rename(columns={
        "year": "Year",
        "vehicle_type": "Vehicle_Type",
        "electric_range": "Electric Range",
        "state": "State",
        "make": "Make"
    }, inplace=True)

    # Handle missing values
    df = df.dropna(subset=["Year", "State"])

    # Grouping (since no "Sales" column, we COUNT vehicles)
    yearly = df.groupby("Year").size()

    # ✅ YEAR OVER YEAR GROWTH
    sales_values = yearly.values.tolist()

    yoy_growth = []

    for i in range(len(sales_values)):

        if i == 0:
            yoy_growth.append(0)

        else:
            previous = sales_values[i - 1]
            current = sales_values[i]

            growth = ((current - previous) / previous) * 100

            yoy_growth.append(round(growth, 2))

        # ✅ STATE GROWTH RATE ANALYSIS

    state_growth_data = []

    for state_name in df["State"].unique():

        state_df = df[df["State"] == state_name]

        yearly_state = (
            state_df.groupby("Year")
            .size()
            .sort_index()
        )

        if len(yearly_state) >= 2:

            previous = yearly_state.iloc[-2]
            current = yearly_state.iloc[-1]

            growth_rate = (
                (current - previous) / previous
            ) * 100 if previous > 0 else 0

            # CAGR
            years_count = len(yearly_state) - 1

            cagr = (
                (
                    current / yearly_state.iloc[0]
                ) ** (1 / years_count) - 1
            ) * 100 if yearly_state.iloc[0] > 0 else 0

            state_growth_data.append({
                "state": state_name,
                "growth_rate": round(growth_rate, 2),
                "cagr": round(cagr, 2)
            })

    # Fastest growing states
    fastest_growing = sorted(
        state_growth_data,
        key=lambda x: x["growth_rate"],
        reverse=True
    )[:5]

    # Declining states
    declining_states = [
        x for x in state_growth_data
        if x["growth_rate"] < 0
    ]

    state = df.groupby("State").size().sort_values(ascending=False).head(10)
    vehicle = df.groupby("Vehicle_Type").size()
    make = df.groupby("Make").size().sort_values(ascending=False).head(10)

    battery_efficiency = (
        df.groupby("Make")["Electric Range"]
            .mean()
            .sort_values(ascending=False)
            .head(10)
    )

    vehicle_efficiency = (
        df.groupby("Vehicle_Type")["Electric Range"]
            .mean()
            .sort_values(ascending=False)
    )

    # Fit a simple linear regression model to the yearly sales data
    # Polynomial Regression Forecasting

    if len(yearly) > 1:

        years_list = np.array(yearly.index).reshape(-1, 1)

        sales_list = np.array(yearly.values)

        # Create polynomial features
        poly = PolynomialFeatures(degree=2)

        years_poly = poly.fit_transform(years_list)

        # Train model
        model = LinearRegression()

        model.fit(years_poly, sales_list)

        # Future years
        future_years = np.array(
            [2026, 2027, 2028]
        ).reshape(-1, 1)

        future_years_poly = poly.transform(future_years)

        future_predictions = model.predict(future_years_poly)

        forecast_years = future_years.flatten().tolist()

        forecast_sales = [
            int(x) for x in future_predictions
        ]

    else:

        forecast_years = []

        forecast_sales = []
            
    # KPI Calculations
    total_ev = len(df)

    avg_range = int(df["Electric Range"].mean())

    total_states = df["State"].nunique()

    top_make = df.groupby("Make").size().idxmax() if len(df.groupby("Make")) > 0 else "N/A"

    top_vehicle = df.groupby("Vehicle_Type").size().idxmax() if len(df.groupby("Vehicle_Type")) > 0 else "N/A"

    top_state = df.groupby("State").size().idxmax() if len(df.groupby("State")) > 0 else "N/A"

    lowest_state = df.groupby("State").size().idxmin() if len(df.groupby("State")) > 0 else "N/A"

    # ✅ MARKET SHARE %
    make_counts = df.groupby("Make").size()

    market_leader = make_counts.idxmax() if len(make_counts) > 0 else "N/A"

    market_share = round(
        (make_counts.max() / total_ev) * 100,
        2
    ) if len(make_counts) > 0 and total_ev > 0 else 0

    # Recent EV records table
    recent_data = df[
        ["Make", "Vehicle_Type", "State", "Electric Range", "Year"]
    ].tail(10)

    recent_data = recent_data.to_dict(orient="records")

    # Top States Data for PDF table
    top_states_data = (
        df.groupby("State")
        .size()
        .sort_values(ascending=False)
        .head(5)
        .items()
    )

    context = {
    "years": json.dumps([int(x) for x in yearly.index]),
    "sales": json.dumps([int(x) for x in yearly.values]),

    "yoy_growth": json.dumps(yoy_growth),

    "states": json.dumps(list(state.index)),
    "state_sales": json.dumps([int(x) for x in state.values]),

    "vehicle_types": json.dumps(list(vehicle.index)),
    "vehicle_sales": json.dumps([int(x) for x in vehicle.values]),

    "makes": json.dumps(list(make.index)),
    "make_sales": json.dumps([int(x) for x in make.values]),
    "battery_efficiency_labels": json.dumps(list(battery_efficiency.index)),
    "battery_efficiency_values": json.dumps([round(x, 2) for x in battery_efficiency.values]),
    "vehicle_efficiency_labels": json.dumps(list(vehicle_efficiency.index)),
    "vehicle_efficiency_values": json.dumps([round(x, 2) for x in vehicle_efficiency.values]),

    # KPI DATA
    "kpi_total_ev": total_ev,
    "kpi_avg_range": avg_range,
    "kpi_total_states": total_states,
    "kpi_top_make": top_make,
    "kpi_top_vehicle": top_vehicle,
    "kpi_top_state": top_state,
    "kpi_lowest_state": lowest_state,
    "kpi_market_leader": market_leader,
    "kpi_market_share": market_share,

    "forecast_years": json.dumps(forecast_years),
    "forecast_sales": json.dumps(forecast_sales),
    "recent_data": (recent_data),
    "top_states_data": top_states_data,
    "map_states": json.dumps(list(state.index)),
    "map_sales": json.dumps([int(x) for x in state.values]),
    "fastest_growing": json.dumps(fastest_growing),
    "declining_states":json.dumps( declining_states),
    }

    context.update({
    "states_list": sorted(df["State"].dropna().unique().tolist()),
    "years_list": sorted(df["Year"].dropna().unique().astype(int).tolist()),
    "vehicle_type_list": sorted(
        df["Vehicle_Type"]
            .dropna()
            .unique()
            .tolist()
    ),
    "make_list": sorted(df["Make"].dropna().unique().tolist()),
    })

    return render(request, "dashboard.html", context)

def about(request):
    return render(request, 'about.html')

@login_required
def battery_efficiency_analysis(request):

    try:

        # Manufacturer efficiency
        manufacturer_data = (
            EVData.objects
            .values('make')
            .annotate(avg_range=Avg('electric_range'))
            .order_by('-avg_range')[:10]
        )

        # Vehicle type efficiency
        vehicle_type_data = (
            EVData.objects
            .values('vehicle_type')
            .annotate(avg_range=Avg('electric_range'))
            .order_by('-avg_range')
        )

        # State efficiency
        state_data = (
            EVData.objects
            .values('state')
            .annotate(avg_range=Avg('electric_range'))
            .order_by('-avg_range')[:10]
        )

        return JsonResponse({
            'manufacturer_efficiency': list(manufacturer_data),
            'vehicle_type_efficiency': list(vehicle_type_data),
            'state_efficiency': list(state_data)
        })

    except Exception as e:

        return JsonResponse({
            'error': str(e)
        }, status=500)
# AI-Generated Insights and Recommendations
def generate_ai_insights(df):


    insights = []

    # Top manufacturer

    top_make = (
        df.groupby("Make")
        .size()
        .idxmax()
    )

    insights.append(
        f"Top manufacturer is {top_make}"
    )

    # Top vehicle type

    top_vehicle = (
        df.groupby("Vehicle_Type")
        .size()
        .idxmax()
    )

    insights.append(
        f"Leading vehicle type is {top_vehicle}"
    )

    # Top state

    top_state = (
        df.groupby("State")
        .size()
        .idxmax()
    )

    insights.append(
        f"Top EV state is {top_state}"
    )

    # Market share

    market_share = round(
        (
            df.groupby("Make")
            .size()
            .max()
            / len(df)
        ) * 100,
        2
    )

    insights.append(
        f"Market leader owns {market_share}% market share"
    )

    # Average range

    avg_range = round(
        df["Electric Range"].mean(),
        2
    )

    insights.append(
        f"Average EV range is {avg_range} km"
    )

    # Growth insight

    yearly = (
        df.groupby("Year")
        .size()
        .sort_index()
    )

    if len(yearly) >= 2:

        growth = (
            (
                yearly.iloc[-1] -
                yearly.iloc[-2]
            )
            /
            yearly.iloc[-2]
        ) * 100

        insights.append(
            f"EV adoption grew by "
            f"{round(growth,2)}% "
            f"in the latest year"
        )

    return insights
# AI-Generated Recommendations
def generate_recommendations(df):

    recommendations = []

    # Top vehicle type

    top_vehicle = (
        df.groupby("Vehicle_Type")
        .size()
        .idxmax()
    )

    recommendations.append(
        f"{top_vehicle} vehicles are currently dominating the EV market."
    )

    # High average range

    avg_range = df["Electric Range"].mean()

    if avg_range > 250:

        recommendations.append(
            "Consumers are preferring high-range EV vehicles."
        )

    else:

        recommendations.append(
            "Affordable low-range EVs are more common in this market."
        )

    # State recommendation

    top_state = (
        df.groupby("State")
        .size()
        .idxmax()
    )

    recommendations.append(
        f"{top_state} should expand charging infrastructure to support growing EV demand."
    )

    # Manufacturer trend

    top_make = (
        df.groupby("Make")
        .size()
        .idxmax()
    )

    recommendations.append(
        f"{top_make} is leading the market and may continue dominating future EV sales."
    )

    # Market growth

    yearly = (
        df.groupby("Year")
        .size()
        .sort_index()
    )

    if len(yearly) >= 2:

        growth = (
            (
                yearly.iloc[-1] -
                yearly.iloc[-2]
            )
            /
            yearly.iloc[-2]
        ) * 100

        if growth > 20:

            recommendations.append(
                "Rapid EV adoption indicates strong future market expansion."
            )

        elif growth < 0:

            recommendations.append(
                "Recent EV sales decline suggests market stabilization challenges."
            )

    return recommendations

@login_required
def filter_data(request):

    data = EVData.objects.all()
    df = pd.DataFrame(list(data.values()))

    # Same preprocessing (keep consistent)
    df.rename(columns={
        "year": "Year",
        "vehicle_type": "Vehicle_Type",
        "electric_range": "Electric Range",
        "state": "State",
        "make": "Make"
    }, inplace=True)

    df = df.dropna(subset=["Year", "State"])

    # Get filter values from frontend
    states = request.GET.get('states')
    year = request.GET.get('year')
    make_search = request.GET.get('make_search')
    vehicle_type = request.GET.get('vehicle_type')
    min_range = request.GET.get('min_range')
    table_search = request.GET.get('table_search')
    advanced_search = request.GET.get('advanced_search')

    # Apply filters
    if states:
        state_list = [
            s for s in states.split(",")
            if s.strip()
        ]

        if len(state_list) > 0:
            df = df[df["State"].isin(state_list)]

    if year and year != "All":
        df = df[df["Year"] == int(year)]

    if make_search and make_search != "All":
        df = df[df["Make"].str.contains(make_search, case=False, na=False)]

    if vehicle_type and vehicle_type != "All":
        df = df[df["Vehicle_Type"] == vehicle_type]

    if min_range and int(min_range) > 0:
        df = df[df["Electric Range"] >= int(min_range)]

    if table_search:

        df = df[
            df["Make"].str.contains(table_search, case=False, na=False)
            |
            df["State"].str.contains(table_search, case=False, na=False)
            |
            df["Vehicle_Type"].str.contains(table_search, case=False, na=False)
        ]

    if advanced_search:
        search_str = advanced_search.strip()
        df = df[
            df["Make"].str.contains(search_str, case=False, na=False)
            |
            df["State"].str.contains(search_str, case=False, na=False)
            |
            df["Vehicle_Type"].str.contains(search_str, case=False, na=False)
            |
            df["Year"].astype(str).str.contains(search_str, case=False, na=False)
            |
            df["Electric Range"].astype(str).str.contains(search_str, case=False, na=False)
        ]

    if df.empty:
        return JsonResponse({
            "years": [],
            "sales": [],
            "states": [],
            "state_sales": [],
            "vehicle_types": [],
            "vehicle_sales": [],
            "makes": [],
            "make_sales": [],
            "battery_efficiency_labels": [],
            "battery_efficiency_values": [],
            "vehicle_efficiency_labels": [],
            "vehicle_efficiency_values": [],
            "total_ev": 0,
            "total_states": 0,
            "avg_range": 0,
            "top_make": "N/A",
            "top_vehicle": "N/A",
            "top_state": "N/A",
            "lowest_state": "N/A",
            "market_leader": "N/A",
            "market_share": 0,
            "yoy_growth": [],
            "forecast_years": [],
            "forecast_sales": [],
            "fastest_growing": [],
            "declining_states": [],
            "table_data": [],
            "current_page": 1,
            "total_pages": 0,
            "top_states_data": []
        })
    
    # Recalculate data after filtering
    yearly = df.groupby("Year").size()
    state_data = df.groupby("State").size().sort_values(ascending=False).head(10)
    vehicle = df.groupby("Vehicle_Type").size()
    make = df.groupby("Make").size().sort_values(ascending=False).head(10)

    # BATTERY EFFICIENCY ANALYSIS

    battery_efficiency = (
        df.groupby("Make")["Electric Range"]
            .mean()
            .sort_values(ascending=False)
            .head(10)
        )

    vehicle_efficiency = (
        df.groupby("Vehicle_Type")["Electric Range"]
            .mean()
            .sort_values(ascending=False)
        )   

    # YEAR OVER YEAR GROWTH

    sales_values = yearly.values.tolist()

    yoy_growth = []

    for i in range(len(sales_values)):

        if i == 0:
            yoy_growth.append(0)

        else:
            previous = sales_values[i - 1]
            current = sales_values[i]

            growth = (
                (current - previous) / previous
            ) * 100

            yoy_growth.append(round(growth, 2))
        # ✅ STATE GROWTH RATE ANALYSIS

    state_growth_data = []

    for state_name in df["State"].unique():

        state_df = df[df["State"] == state_name]

        yearly_state = (
            state_df.groupby("Year")
            .size()
            .sort_index()
        )

        if len(yearly_state) >= 2:

            previous = yearly_state.iloc[-2]
            current = yearly_state.iloc[-1]

            growth_rate = (
                (current - previous) / previous
            ) * 100 if previous > 0 else 0

            years_count = len(yearly_state) - 1

            cagr = (
                (
                    current / yearly_state.iloc[0]
                ) ** (1 / years_count) - 1
            ) * 100 if yearly_state.iloc[0] > 0 else 0

            state_growth_data.append({
                "state": state_name,
                "growth_rate": round(growth_rate, 2),
                "cagr": round(cagr, 2)
            })

    fastest_growing = sorted(
        state_growth_data,
        key=lambda x: x["growth_rate"],
        reverse=True
    )[:5]

    declining_states = [
        x for x in state_growth_data
        if x["growth_rate"] < 0
    ]

    # FORECASTING
    # Polynomial Regression Forecasting

    if len(yearly) > 1:

        years_list = np.array(yearly.index).reshape(-1, 1)

        sales_list = np.array(yearly.values)

        # Create polynomial features
        poly = PolynomialFeatures(degree=2)

        years_poly = poly.fit_transform(years_list)

        # Train model
        model = LinearRegression()

        model.fit(years_poly, sales_list)

        # Future years
        future_years = np.array(
            [2026, 2027, 2028]
        ).reshape(-1, 1)

        future_years_poly = poly.transform(future_years)

        future_predictions = model.predict(future_years_poly)

        forecast_years = future_years.flatten().tolist()

        forecast_sales = [
            int(x) for x in future_predictions
        ]

    else:

        forecast_years = []

        forecast_sales = []

    # TABLE PAGINATION

    page = int(request.GET.get("page", 1))
    per_page = 10

    table_data = df[
        ["Make", "Vehicle_Type", "State", "Electric Range", "Year"]
    ]

    total_records = len(table_data)

    start = (page - 1) * per_page
    end = start + per_page

    paginated_data = table_data.iloc[start:end]

    table_records = paginated_data.to_dict(orient="records")

    total_pages = (total_records + per_page - 1) // per_page
    
    ai_insights = generate_ai_insights(df)

    recommendations = generate_recommendations(df)

    # Convert to JSON-friendly format
    data = {
        "years": [int(x) for x in yearly.index],
        "sales": [int(x) for x in yearly.values],

        "states": list(state_data.index),
        "state_sales": [int(x) for x in state_data.values],

        "top_states_data": [
            {
                "state": state,
                "count": int(count)
            }
            for state, count in state_data.head(5).items()
        ],

        "vehicle_types": list(vehicle.index),
        "vehicle_sales": [int(x) for x in vehicle.values],

        "makes": list(make.index),
        "make_sales": [int(x) for x in make.values],
        "battery_efficiency_labels":
            list(battery_efficiency.index),

        "battery_efficiency_values":
            [round(x, 2)
            for x in battery_efficiency.values],

        "vehicle_efficiency_labels":
            list(vehicle_efficiency.index),

        "vehicle_efficiency_values":
            [round(x, 2)
            for x in vehicle_efficiency.values],

        "table_data": table_records,
        "current_page": page,
        "total_pages": total_pages,

        "total_ev": int(len(df)),
        "total_states": int(df["State"].nunique()),

        "avg_range": int(df["Electric Range"].mean()),
        "top_make": df.groupby("Make").size().idxmax() if len(df.groupby("Make")) > 0 else "N/A",

        "top_vehicle": df.groupby("Vehicle_Type").size().idxmax() if len(df.groupby("Vehicle_Type")) > 0 else "N/A",

        "top_state": df.groupby("State").size().idxmax() if len(df.groupby("State")) > 0 else "N/A",
        
        "lowest_state": df.groupby("State").size().idxmin() if len(df.groupby("State")) > 0 else "N/A",

        "market_leader": df.groupby("Make").size().idxmax() if len(df.groupby("Make")) > 0 else "N/A",
        "market_share": round((df.groupby("Make").size().max() / len(df)) * 100, 2) if len(df.groupby("Make")) > 0 and len(df) > 0 else 0,

        "yoy_growth": yoy_growth,

        "forecast_years": forecast_years,
        "forecast_sales": forecast_sales,
        "fastest_growing": fastest_growing,
        "declining_states": declining_states,
        "ai_insights": ai_insights,
        "recommendations": recommendations

    }

    return JsonResponse(data)

@login_required
def compare_states(request):

    state1 = request.GET.get("state1")
    state2 = request.GET.get("state2")

    data = EVData.objects.all()

    df = pd.DataFrame(list(data.values()))

    df.rename(columns={
        "year": "Year",
        "state": "State"
    }, inplace=True)

    state1_df = df[df["State"] == state1]
    state2_df = df[df["State"] == state2]

    state1_yearly = (
        state1_df.groupby("Year")
        .size()
    )

    state2_yearly = (
        state2_df.groupby("Year")
        .size()
    )

    all_years = sorted(
        list(
            set(state1_yearly.index.tolist() +
                state2_yearly.index.tolist())
        )
    )

    state1_sales = [
        int(state1_yearly.get(year, 0))
        for year in all_years
    ]

    state2_sales = [
        int(state2_yearly.get(year, 0))
        for year in all_years
    ]

    return JsonResponse({
        "years": all_years,
        "state1_sales": state1_sales,
        "state2_sales": state2_sales,
        "state1": state1,
        "state2": state2
    })

# New view for downloading filtered data as CSV
@user_passes_test(
        lambda u: is_admin(u) or is_analyst(u)
)
@login_required
def download_data(request):
    #file_path = os.path.join(os.path.dirname(__file__), 'data/ev_data.csv')
    #df = pd.read_csv(file_path)
    data = EVData.objects.all()
    df = pd.DataFrame(list(data.values()))

    df.rename(columns={
        "year": "Year",
        "vehicle_type": "Vehicle_Type",
        "electric_range": "Electric Range",
        "state": "State",
        "make": "Make"
    }, inplace=True)

    df = df.dropna(subset=["Year", "State"])

    # Get filters
    state = request.GET.get('state')
    year = request.GET.get('year')

    if state and state != "All":
        df = df[df["State"] == state]

    if year and year != "All":
        df = df[df["Year"] == int(year)]

    # Create response
    response = HttpResponse(content_type='text/csv')
    response['Content-Disposition'] = 'attachment; filename="ev_report.csv"'

    df.to_csv(response, index=False)

    return response

# New view for downloading filtered data as Excel

@user_passes_test(
        lambda u: is_admin(u) or is_analyst(u)
)
@login_required
def download_excel(request):
    #file_path = os.path.join(os.path.dirname(__file__), 'data/ev_data.csv')
    #df = pd.read_csv(file_path)
    data = EVData.objects.all()
    df = pd.DataFrame(list(data.values()))

    df.rename(columns={
        "year": "Year",
        "vehicle_type": "Vehicle_Type",
        "electric_range": "Electric Range",
        "state": "State",
        "make": "Make"
    }, inplace=True)

    df = df.dropna(subset=["Year", "State"])

    # Filters
    state = request.GET.get('state')
    year = request.GET.get('year')

    if state and state != "All":
        df = df[df["State"] == state]

    if year and year != "All":
        df = df[df["Year"] == int(year)]

    # Create Excel file
    wb = Workbook()
    ws = wb.active
    ws.title = "EV Data"

    # Add headers
    ws.append(list(df.columns))

    # Add rows
    for row in df.itertuples(index=False):
        ws.append(list(row))

    # Response
    response = HttpResponse(
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = 'attachment; filename=ev_report.xlsx'

    wb.save(response)

    return response

# New view for downloading filtered data as PDF
@user_passes_test(
        lambda u: is_admin(u) or is_analyst(u)
)
@login_required
def download_pdf(request):

    if request.method != "POST":
        return JsonResponse({"error": "Only POST allowed"}, status=400)

    try:
        request_data = json.loads(request.body)
    except:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    state = request_data.get('state')
    year = request_data.get('year')
    charts = request_data.get('charts', {})

    data = EVData.objects.all()
    df = pd.DataFrame(list(data.values()))

    df.rename(columns={
        "year": "Year",
        "vehicle_type": "Vehicle_Type",
        "electric_range": "Electric Range",
        "state": "State",
        "make": "Make"
    }, inplace=True)

    df = df.dropna(subset=["Year", "State"])

    if state and state != "All":
        df = df[df["State"] == state]

    if year and year != "All":
        df = df[df["Year"] == int(year)]

    response = HttpResponse(content_type='application/pdf')
    response['Content-Disposition'] = 'attachment; filename="ev_report.pdf"'

    doc = SimpleDocTemplate(response)
    elements = []
    styles = getSampleStyleSheet()

    # Title
    elements.append(Paragraph("EV Dashboard Report", styles['Title']))

    # KPI
    elements.append(Paragraph(f"Total EVs: {len(df)}", styles['Normal']))
    
    elements.append(Paragraph(
        f"Total States: {df['State'].nunique()}", 
        styles['Normal']
    ))

    elements.append(Paragraph(
        f"Top State: {df.groupby('State').size().idxmax()}",
        styles['Normal']
    ))

    elements.append(Paragraph(
        f"Lowest State: {df.groupby('State').size().idxmin()}",
        styles['Normal']
    ))

    market_leader = df.groupby("Make").size().idxmax()

    market_share = round(
        (df.groupby("Make").size().max() / len(df)) * 100,
        2
    )

    elements.append(Paragraph(
        f"Market Leader: {market_leader}",
        styles['Normal']
    ))

    elements.append(Paragraph(
        f"Market Share: {market_share}%",
        styles['Normal']
    ))

    elements.append(Paragraph(
        f"Average Range: {int(df['Electric Range'].mean())} miles",
        styles['Normal']
    ))

    elements.append(Paragraph(
        f"Top Vehicle Type: {df.groupby('Vehicle_Type').size().idxmax()}",
        styles['Normal']    
    ))

    elements.append(Paragraph(
        f"Top Manufacturer: {df.groupby('Make').size().idxmax()}",
        styles['Normal']
    ))

    # Top States Table
    state_data = df.groupby("State").size().sort_values(ascending=False).head(5)

    state_table_data = [["State", "EV Count"]]
    for state, count in state_data.items():
        state_table_data.append([state, int(count)])

    # Top Manufacturers Table
    make_data = df.groupby("Make").size().sort_values(ascending=False).head(5)

    make_table_data = [["Manufacturer", "EV Count"]]
    for make, count in make_data.items():
        make_table_data.append([make, int(count)])

    # ADD STATE TABLE TO PDF
    state_table = Table(state_table_data)

    state_table.setStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.grey),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.beige),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ])

    elements.append(Spacer(1, 20))
    elements.append(Paragraph("Top States Summary", styles['Heading2']))
    elements.append(state_table)
    
    # ADD MANUFACTURER TABLE TO PDF
    make_table = Table(make_table_data)

    make_table.setStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('BACKGROUND', (0, 1), (-1, -1), colors.lightgrey),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
    ])

    elements.append(Spacer(1, 20))
    elements.append(Paragraph("Top Manufacturers Summary", styles['Heading2']))
    elements.append(make_table)

    # Add charts
    for key, img_data in charts.items():
        if img_data:
            elements.append(Spacer(1, 20))
            elements.append(Paragraph(key.upper(), styles['Heading2']))

            img_str = img_data.split(",")[1]
            img_bytes = base64.b64decode(img_str)

            image = Image(BytesIO(img_bytes))
            image.drawHeight = 200
            image.drawWidth = 350
            elements.append(image)

    doc.build(elements)

    return response

# New view for user signup
def signup(request):

    if request.method == 'POST':

        form = StyledUserCreationForm(request.POST)

        if form.is_valid():

            form.save()

            messages.success(
                request,
                "Account created successfully!"
            )

            return redirect('login')

    else:

        form = StyledUserCreationForm()

    return render(
        request,
        'signup.html',
        {'form': form}
    )
# New view for user login
def custom_login(request):

    if request.method == "POST":

        username = request.POST.get("username")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=username,
            password=password
        )

        if user is not None:

            login(request, user)

            # ✅ If admin
            if user.is_superuser:
                return redirect('/admin/')

            # ✅ Normal user
            return redirect('/dashboard/')

        else:
            messages.error(request, "Invalid username or password")

    return render(request, "login.html")

# New view for uploading CSV (admin only)
@user_passes_test(is_admin)
@login_required
def upload_csv(request):

    if not request.user.is_superuser:
        return redirect('/dashboard/')

    if request.method == "POST":

        form = CSVUploadForm(
            request.POST,
            request.FILES
        )

        if form.is_valid():

            csv_file = request.FILES['file']

            df = pd.read_csv(csv_file)

            # Rename columns if needed
            df.columns = [
                col.strip().lower()
                for col in df.columns
            ]

            # Insert into DB
            for _, row in df.iterrows():

                # Skip missing values
                if pd.isna(row['year']) or pd.isna(row['state']):
                    continue

                # Prevent negative range
                if row['electric_range'] < 0:
                    continue

                # Prevent duplicates
                exists = EVData.objects.filter(
                    year=row['year'],
                    make=row['make'],
                    state=row['state'],
                    vehicle_type=row['vehicle_type']
                ).exists()

                if exists:
                    continue

                EVData.objects.create(

                    year=row['year'],

                    vehicle_type=row['vehicle_type'],

                    electric_range=row['electric_range'],

                    state=row['state'],

                    make=row['make']
                )

            messages.success(
                request,
                "CSV uploaded successfully!"
            )

            return redirect('/dashboard/')

    else:

        form = CSVUploadForm()

    return render(
        request,
        'upload_csv.html',
        {'form': form}
    )

# REST API VIEWS

@api_view(['GET'])
def api_dashboard(request):

    data = EVData.objects.all()

    serializer = EVDataSerializer(data, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def api_states(request):

    data = EVData.objects.all()

    df = pd.DataFrame(list(data.values()))

    df.rename(columns={
        "state": "State"
    }, inplace=True)

    state_data = (
        df.groupby("State")
        .size()
        .sort_values(ascending=False)
        .head(10)
    )

    response_data = {
        "states": list(state_data.index),
        "ev_counts": [int(x) for x in state_data.values]
    }

    return Response(response_data)


@api_view(['GET'])
def api_forecast(request):

    data = EVData.objects.all()

    df = pd.DataFrame(list(data.values()))

    df.rename(columns={
        "year": "Year"
    }, inplace=True)

    yearly = df.groupby("Year").size()

    if len(yearly) > 1:

        years_list = np.array(
            yearly.index
        ).reshape(-1, 1)

        sales_list = np.array(
            yearly.values
        )

        poly = PolynomialFeatures(degree=2)

        years_poly = poly.fit_transform(
            years_list
        )

        model = LinearRegression()

        model.fit(
            years_poly,
            sales_list
        )

        future_years = np.array(
            [2026, 2027, 2028]
        ).reshape(-1, 1)

        future_poly = poly.transform(
            future_years
        )

        predictions = model.predict(
            future_poly
        )

        response_data = {
            "forecast_years":
                future_years.flatten().tolist(),

            "forecast_sales":
                [int(x) for x in predictions]
        }

    else:

        response_data = {
            "forecast_years": [],
            "forecast_sales": []
        }

    return Response(response_data)

# Feedback submission view
@csrf_exempt
@login_required
def submit_feedback(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)

            rating = data.get('rating', 5)

            feedback_text = data.get('feedback', '').strip()

            if not feedback_text:
                return JsonResponse({'error': 'Feedback cannot be empty'}, status=400)

            # Save feedback to database
            Feedback.objects.create(
                user=request.user,
                name=request.user.username,
                email=request.user.email,
                message=feedback_text,
                rating=rating
            )            # Send email with feedback
            from django.core.mail import send_mail
            from django.conf import settings

            subject = f'VoltVision Dashboard Feedback from {request.user.username}'
            
            message = f"""
User: {request.user.username} 
Email: {request.user.email}
Date: {timezone.now()}

Feedback:
{feedback_text}
Rating: {rating}/5
"""
            recipient_list = ['support@voltvision.com']  # You can change this to actual support email

            try:
                send_mail(
                    subject=subject,
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=recipient_list,
                    fail_silently=False,
                )
                return JsonResponse({'message': 'Thank you for your feedback! We have received your message.'})
            
            except Exception as e:
                print(f"Email sending failed: {e}")

                return JsonResponse({'message': 'Thank you for your feedback! (Note: Email delivery may be delayed)'})

        except json.JSONDecodeError:

            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
        
        except Exception as e:

            return JsonResponse({'error': 'An error occurred'}, status=500)

    return JsonResponse({'error': 'Only POST method allowed'}, status=405)