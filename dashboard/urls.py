from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name='dashboard'),
    path('filter-data/', views.filter_data, name='filter_data'),
    path('download-data/', views.download_data, name='download_data'),
    path('download-excel/', views.download_excel, name='download_excel'),
    path('download-pdf/', views.download_pdf, name='download_pdf'),
     # state comparison urls
    path(
    'compare-states/',
    views.compare_states,
    name='compare_states'
    ),

    path(
    'upload-csv/',
    views.upload_csv,
    name='upload_csv'
    ),

     path(
        'api/dashboard/',
        views.api_dashboard,
        name='api_dashboard'
    ),

    path(
        'api/states/',
        views.api_states,
        name='api_states'
    ),

    path(
        'api/forecast/',
        views.api_forecast,
        name='api_forecast'
    ),
    path('about/', views.about, name='about'),
    path('submit-feedback/', views.submit_feedback, name='submit_feedback'),
    path(
    'battery-efficiency/',
    views.battery_efficiency_analysis,
    name='battery_efficiency_analysis'
    ),
    
]