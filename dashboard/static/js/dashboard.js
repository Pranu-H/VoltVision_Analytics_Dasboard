let batteryEfficiencyChart = null;
let vehicleEfficiencyChart = null;

// Line Chart
const years = window.dashboardData.years;
const sales = window.dashboardData.sales;

let lineChart = new Chart(document.getElementById('lineChart'), {
    type: 'line',
    data: {
        labels: years,
        datasets: [{
            label: 'EV Count',
            data: sales,
            borderColor: '#2563eb',
            backgroundColor: 'rgba(37, 99, 235, 0.08)',
            fill: false,
            tension: 0.25,
            pointRadius: 4,
            pointBackgroundColor: '#2563eb',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            borderWidth: 4,
            segment: {
                borderCapStyle: 'round'
            }
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.15)'
                },
                ticks: {
                    color: '#0f172a'
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.15)'
                },
                ticks: {
                    color: '#0f172a'
                }
            }
        },
        animation: {
            duration: 1000
        }
    }
});

// Bar Chart
const states = window.dashboardData.states;
const state_sales = window.dashboardData.state_sales;

let barChart = new Chart(document.getElementById('barChart'), {
    type: 'bar',
    data: {
        labels: states,
        datasets: [{
            label: 'EV Count by State',
            data: state_sales,
            backgroundColor: '#2563eb',
            borderColor: '#1d4ed8',
            borderWidth: 2,
            borderRadius: 12,
            maxBarThickness: 36
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#0f172a'
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.18)'
                },
                ticks: {
                    color: '#0f172a'
                }
            }
        },
        animation: {
            duration: 1000
        }
    }
});

// ✅ Pie Chart (THIS WAS MISSING)
const vehicle_types = window.dashboardData.vehicle_types;
const vehicle_sales = window.dashboardData.vehicle_sales;

let pieChart = new Chart(document.getElementById('pieChart'), {
    type: 'doughnut',
    data: {
        labels: vehicle_types,
        datasets: [{
            data: vehicle_sales,
            backgroundColor: [
                '#2563eb',
                '#10b981',
                '#f59e0b',
                '#f97316',
                '#8b5cf6',
                '#14b8a6',
                '#ec4899',
                '#6366f1'
            ],
            borderColor: '#ffffff',
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#0f172a',
                    usePointStyle: true,
                    padding: 12
                }
            }
        },
        animation: {
            duration: 1000
        }
    }
});

// ✅ Make Chart
const makes = window.dashboardData.makes;
const make_sales = window.dashboardData.make_sales;

let makeChart = new Chart(document.getElementById('makeChart'), {
    type: 'bar',
    data: {
        labels: makes,
        datasets: [{
            label: 'EV Count by Manufacturer',
            data: make_sales
        }],
    },
    options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        plugins: {
            legend: {
                display: false
            }
        },
        animations: {
            duration: 1200
        }
    }
});


// ✅ Market Share Chart
let marketShareChart = new Chart(
    document.getElementById('marketShareChart'),
    {

    type: 'doughnut',

    data: {
        labels: makes,

        datasets: [{
            data: make_sales,
            backgroundColor: [
                '#2563eb',
                '#10b981',
                '#f59e0b',
                '#f97316',
                '#8b5cf6',
                '#14b8a6',
                '#ec4899',
                '#6366f1'
            ],
            borderColor: '#ffffff',
            borderWidth: 2
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '55%',
        plugins: {
            legend: {
                position: 'bottom',
                labels: {
                    color: '#0f172a',
                    usePointStyle: true,
                    padding: 12
                }
            }
        },
        animation: {
            duration: 1000
        }
    }
});

// ✅ YoY Growth Chart
const yoy_growth = window.dashboardData.yoy_growth;

let growthChart = new Chart(document.getElementById('growthChart'), {

    type: 'line',

    data: {
        labels: years,

        datasets: [{
            label: 'YoY Growth %',
            data: yoy_growth,
            borderColor: '#16a34a',
            backgroundColor: 'rgba(16, 163, 127, 0.08)',
            fill: false,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#16a34a',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            borderWidth: 3
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#0f172a'
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.18)'
                },
                ticks: {
                    color: '#0f172a'
                }
            }
        },
        animation: {
            duration: 1000
        }
    }
});

// Battery Efficiency Chart
function createBatteryEfficiencyChart(labels, values) {
    return new Chart(document.getElementById('batteryEfficiencyChart').getContext('2d'), {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Average Electric Range',
                data: values,
                borderWidth: 1,
                borderRadius: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2,
            plugins: {
                legend: { display: false }
            }
        }
    });
}

// Vehicle Type Efficiency Chart
function createVehicleEfficiencyChart(labels, values) {
    return new Chart(document.getElementById('vehicleTypeEfficiencyChart').getContext('2d'), {
        type: 'doughnut',
        data: {
            labels: labels,
            datasets: [{
                data: values,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            aspectRatio: 2
        }
    });
}

const initialBatteryEfficiencyLabels = Array.isArray(window.dashboardData.battery_efficiency_labels) && window.dashboardData.battery_efficiency_labels.length ? window.dashboardData.battery_efficiency_labels : ['No data'];
const initialBatteryEfficiencyValues = Array.isArray(window.dashboardData.battery_efficiency_values) && window.dashboardData.battery_efficiency_values.length ? window.dashboardData.battery_efficiency_values : [0];
const initialVehicleEfficiencyLabels = Array.isArray(window.dashboardData.vehicle_efficiency_labels) && window.dashboardData.vehicle_efficiency_labels.length ? window.dashboardData.vehicle_efficiency_labels : ['No data'];
const initialVehicleEfficiencyValues = Array.isArray(window.dashboardData.vehicle_efficiency_values) && window.dashboardData.vehicle_efficiency_values.length ? window.dashboardData.vehicle_efficiency_values : [0];

batteryEfficiencyChart = createBatteryEfficiencyChart(initialBatteryEfficiencyLabels, initialBatteryEfficiencyValues);
vehicleEfficiencyChart = createVehicleEfficiencyChart(initialVehicleEfficiencyLabels, initialVehicleEfficiencyValues);

// ===============================
// EV ADOPTION GROWTH ANALYSIS
// ===============================

// Find fastest growing & declining years

function analyzeGrowth(years, growthData) {

    let maxGrowth = Math.max(...growthData);

    let minGrowth = Math.min(...growthData);

    let fastestYear =
        years[growthData.indexOf(maxGrowth)];

    let decliningYear =
        years[growthData.indexOf(minGrowth)];

    // CAGR Calculation
    // CAGR = ((Ending / Beginning) ^ (1 / years)) - 1

    let beginningValue = sales[0];
    let endingValue = sales[sales.length - 1];

    let totalYears = years.length - 1;

    let cagr = 0;

    if (beginningValue > 0 && totalYears > 0) {

        cagr =
            (
                Math.pow(
                    (endingValue / beginningValue),
                    (1 / totalYears)
                ) - 1
            ) * 100;
    }

    // Update UI
    document.getElementById("growthInsights").innerHTML = `

        <div class="growth-item">
            🚀 Fastest Growth Year:
            <strong>${fastestYear}</strong>
            (${maxGrowth.toFixed(2)}%)
        </div>

        <div class="growth-item">
            📉 Declining Year:
            <strong>${decliningYear}</strong>
            (${minGrowth.toFixed(2)}%)
        </div>

        <div class="growth-item">
            📊 CAGR Growth:
            <strong>${cagr.toFixed(2)}%</strong>
        </div>
    `;
}

function renderStateGrowthCards(data) {
    const fastest = data.fastest_growing || [];
    const declining = data.declining_states || [];

    const fastestHtml = fastest.length > 0 ? fastest.map(item => `
        <div class="growth-card-item">
            <strong>${item.state}</strong>
            <span>${item.growth_rate}%</span>
        </div>
    `).join("") : `<div class="growth-card-empty">No growth data available.</div>`;

    const decliningHtml = declining.length > 0 ? declining.map(item => `
        <div class="growth-card-item">
            <strong>${item.state}</strong>
            <span>${item.growth_rate}%</span>
        </div>
    `).join("") : `<div class="growth-card-empty">No declining state data available.</div>`;

    document.getElementById("growthContainer").innerHTML = fastestHtml;
    document.getElementById("declineContainer").innerHTML = decliningHtml;
}

// Initial Call
analyzeGrowth(years, yoy_growth);
renderStateGrowthCards(window.dashboardData);
// FORECAST CHART

const forecast_years =
window.dashboardData.forecast_years;

const forecast_sales =
window.dashboardData.forecast_sales;

// Combine actual + forecast
const allYears = years.concat(forecast_years);

const allSales =
sales.concat(forecast_sales);

let forecastChart = new Chart(
    document.getElementById('forecastChart'),
    {

    type: 'line',

    data: {
        labels: allYears,

        datasets: [{
            label: 'Predicted EV Growth',
            data: allSales,
            borderColor: '#d97706',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            fill: false,
            tension: 0.35,
            pointRadius: 4,
            pointBackgroundColor: '#f59e0b',
            pointBorderColor: '#ffffff',
            pointBorderWidth: 2,
            borderWidth: 3
        }]
    },

    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    color: '#0f172a'
                }
            },
            y: {
                grid: {
                    color: 'rgba(148, 163, 184, 0.18)'
                },
                ticks: {
                    color: '#0f172a'
                }
            }
        },
        animation: {
            duration: 1000
        }
    }
});

// INDIA EV HEATMAP

const mapStates = window.dashboardData.map_states;
const mapSales = window.dashboardData.map_sales;

// Approximate state centers for fallback scatter map
const stateCoordinates = {
    "Maharashtra": [19.0760, 72.8777],
    "Delhi": [28.7041, 77.1025],
    "Karnataka": [15.3173, 75.7139],
    "Gujarat": [22.2587, 71.1924],
    "Rajasthan": [27.0238, 74.2179],
    "Madhya Pradesh": [22.9734, 78.6569],
    "Tamil Nadu": [11.1271, 78.6569],
    "Uttar Pradesh": [26.8467, 80.9462],
    "West Bengal": [22.9868, 87.8550],
    "Haryana": [29.0588, 76.0856],
    "Telangana": [18.1124, 79.0193],
    "Andhra Pradesh": [15.9129, 79.7400],
    "Punjab": [31.1471, 75.3412],
    "Kerala": [10.8505, 76.2711],
    "Odisha": [20.9517, 85.0985],
    "Jharkhand": [23.6102, 85.2799],
    "Chhattisgarh": [21.2787, 81.8661],
    "Uttarakhand": [30.0668, 79.0193],
    "Himachal Pradesh": [31.1048, 77.1734],
    "Jammu and Kashmir": [33.7782, 76.5762],
    "Goa": [15.2993, 74.1240],
    "Puducherry": [11.9416, 79.8083],
    "Chandigarh": [30.7333, 76.7794],
    "Sikkim": [27.5330, 88.5122],
    "Arunachal Pradesh": [28.2180, 94.7278],
    "Nagaland": [26.1584, 94.5624],
    "Manipur": [24.6637, 93.9063],
    "Mizoram": [23.1645, 92.9376],
    "Tripura": [23.9408, 91.9882],
    "Meghalaya": [25.4670, 91.3662],
    "Assam": [26.2006, 92.9376],
    "Bihar": [25.0961, 85.3131],
    "Dadra and Nagar Haveli and Daman and Diu": [20.3974, 72.8328]
};



// Function to create choropleth map data
function createChoroplethData(states, sales) {
    const maxSales = Math.max(...sales, 1);
    return [{
        type: "choropleth",
        geojson: indiaGeoJSON,
        locations: states,
        z: sales,
        zmin: 0,
        zmax: maxSales,
        featureidkey: "properties.ST_NM",
        text: states.map((state, index) => `${state}: ${sales[index]} EVs`),
        autocolorscale: false,
        colorscale: [
            [0, '#e3f2fd'],
            [0.2, '#90caf9'],
            [0.4, '#42a5f5'],
            [0.6, '#1e88e5'],
            [0.8, '#1565c0'],
            [1, '#0d47a1']
        ],
        colorbar: {
            title: {
                text: "EV Count",
                font: { size: 14, color: "#ffffff" }
            },
            tickfont: { color: "#ffffff" },
            bgcolor: "rgba(0,0,0,0.5)"
        },
        marker: {
            line: {
                color: "#ffffff",
                width: 2.5
            },
            opacity: 0.95
        },
        hovertemplate: "%{text}<extra></extra>",
        hoverlabel: {
            bgcolor: "rgba(0,0,0,0.8)",
            bordercolor: "#ffffff",
            font: { color: "#ffffff", size: 14 }
        }
    }];
}

// Function to create scatter map data (fallback)
function createScatterData(states, sales) {
    const lats = [];
    const lons = [];
    const texts = [];
    const sizes = [];
    const colors = [];

    states.forEach((state, index) => {
        if (stateCoordinates[state]) {
            lats.push(stateCoordinates[state][0]);
            lons.push(stateCoordinates[state][1]);
            texts.push(`${state}<br>${sales[index]} EVs`);
            const minSize = 15;
            const maxSize = 60;
            const maxSales = Math.max(...sales);
            const size = maxSales > 0 ? minSize + (sales[index] / maxSales) * (maxSize - minSize) : minSize;
            sizes.push(size);
            colors.push(sales[index]);
        }
    });

    return [{
        type: "scattergeo",
        mode: "markers+text",
        lat: lats,
        lon: lons,
        text: texts,
        hovertemplate: "%{text}<extra></extra>",
        marker: {
            size: sizes,
            color: colors,
            colorscale: [
                [0, '#e3f2fd'],
                [0.2, '#2196f3'],
                [0.4, '#1976d2'],
                [0.6, '#1565c0'],
                [0.8, '#0d47a1'],
                [1, '#001970']
            ],
            showscale: true,
            colorbar: {
                title: {
                    text: "EV Count",
                    font: { size: 14, color: "#ffffff" }
                },
                tickfont: { color: "#ffffff" },
                bgcolor: "rgba(0,0,0,0.5)"
            },
            line: {
                color: "white",
                width: 2
            },
            opacity: 0.8
        },
        textposition: "top center",
        textfont: {
            size: 12,
            color: "#ffffff",
            family: "Arial, sans-serif"
        },
        hoverlabel: {
            bgcolor: "rgba(0,0,0,0.8)",
            bordercolor: "#ffffff",
            font: { color: "#ffffff", size: 14 }
        }
    }];
}

const indiaPlotlyOptions = {
    responsive: true,
    displayModeBar: false
};

const indiaLayout = {
    geo: {
        scope: "asia",
        showland: true,
        landcolor: "#0f172a",
        countrycolor: "#ffffff",
        coastlinecolor: "#ffffff",
        showcoastlines: true,
        showframe: true,
        framecolor: "#ffffff",
        projection: {
            type: "mercator"
        },
        center: {
            lat: 22,
            lon: 80
        },
        lataxis: {
            range: [6, 38]
        },
        lonaxis: {
            range: [68, 98]
        },
        bgcolor: "rgba(0,0,0,0)",
        showcountries: true,
        countrywidth: 1.5
    },
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "rgba(0,0,0,0)",
    font: {
        color: "#ffffff"
    },
    showlegend: false,
    margin: {
        l: 0,
        r: 0,
        t: 0,
        b: 0
    }
};

// Load India states GeoJSON
let indiaGeoJSON = null;
fetch('/static/js/india_states.geojson')
    .then(response => response.json())
    .then(data => {
        indiaGeoJSON = data;
        initializeMap();
    })
    .catch(error => {
        console.error('Error loading GeoJSON:', error);
        initializeScatterMap();
    });
// Initialize map with scatter (circles)
function initializeMap() {
    initializeScatterMap();
}

// Fallback scatter map
function initializeScatterMap() {
    const indiaData = createScatterData(mapStates, mapSales);

    try {
        Plotly.newPlot(
            "indiaMap",
            indiaData,
            indiaLayout,
            indiaPlotlyOptions
        );
    } catch (error) {
        console.error('Scatter map render failed:', error);
    }
}

// Comparison Chart

let comparisonChart = new Chart(
    document.getElementById('comparisonChart'),
    {

    type: 'line',

    data: {
        labels: [],

        datasets: [
            {
                label: 'State 1',
                data: [],
                borderWidth: 3
            },

            {
                label: 'State 2',
                data: [],
                borderWidth: 3
            }
        ]
    },

    options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        tension: 0.3,
        animations: {
            duration: 1200
        }
    }
});

// Filter Logic

document.getElementById("stateFilter")
.addEventListener("change", updateCharts);

document.getElementById("yearFilter")
.addEventListener("change", updateCharts);

document.getElementById("makeSearch")
.addEventListener("input", debounceUpdate);

document.getElementById("vehicleFilter")
.addEventListener("change", updateCharts);

document.getElementById("rangeFilter")
.addEventListener("input", debounceUpdate);

document.getElementById("tableSearch")
.addEventListener("input", debounceUpdate);

document.getElementById("advancedSearchQuery")
.addEventListener("input", debounceUpdate);

// Debounce function to limit API calls while typing
let searchTimeout;

function debounceUpdate() {

    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        updateCharts();
    }, 500);
}

// Pagination variables
let currentPage = 1;

// Main function to fetch filtered data and update charts
function updateCharts() {

    setLoadingState(true);

    const stateSelect = 
        document.getElementById("stateFilter");

    const selectedStates = 
        Array.from(stateSelect.selectedOptions)
             .map(option => option.value);

    const year = 
    document.getElementById("yearFilter").value;

    const makeSearch =
    document.getElementById("makeSearch").value;

    const vehicleType =
    document.getElementById("vehicleFilter").value;

    const minRange =
    document.getElementById("rangeFilter").value;

    const tableSearch =
    document.getElementById("tableSearch").value;

    const advancedSearch =
    document.getElementById("advancedSearchQuery").value;

    const params = new URLSearchParams({
        states: selectedStates.join(","),
        year: year,
        make_search: makeSearch,
        vehicle_type: vehicleType,
        min_range: minRange,
        table_search: tableSearch,
        advanced_search: advancedSearch,
        page: currentPage
    });

    fetch(`/dashboard/filter-data/?${params}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Server error");
            }
            return response.json();
        })
        .then(data => {

            // ✅ UPDATE KPI HERE (after data arrives)
            document.getElementById("totalEV").innerText = 
                data.total_ev;

            document.getElementById("totalStates").innerText = 
                data.total_states;

            document.getElementById("avgRange").innerText = 
                data.avg_range;

            document.getElementById("topMake").innerText = 
                data.top_make;

            document.getElementById("topVehicle").innerText = 
                data.top_vehicle;

            document.getElementById("topState").innerText =
                data.top_state;

            document.getElementById("lowestState").innerText =
                data.lowest_state;

            document.getElementById("marketLeader").innerText =
                data.market_leader;

            document.getElementById("marketShare").innerText =
                data.market_share + "% Share";

           let insightsHTML = "";

                data.ai_insights.forEach(insight => {

                    insightsHTML += `
                        <li>${insight}</li>
                    `;
                });

                document.getElementById(
                    "insightsList"
                ).innerHTML = insightsHTML;
            
           let recommendationHTML = "";

                data.recommendations.forEach(item => {

                    recommendationHTML += `
                        <li>${item}</li>
                    `;
                });

                document.getElementById(
                    "recommendationList"
                ).innerHTML = recommendationHTML;
            
            // Update Top 5 Leaderboard

            let leaderboardHTML = "";

            data.top_states_data.forEach((item, index) => {

                let rankClass = "rank-other";

                if (index === 0) {
                    rankClass = "rank-1";
                }
                else if (index === 1) {
                    rankClass = "rank-2";
                }
                else if (index === 2) {
                    rankClass = "rank-3";
                }

                leaderboardHTML += `

                    <div class="leaderboard-item">

                        <div class="d-flex align-items-center gap-3">

                            <div class="rank-badge ${rankClass}">
                                ${index + 1}
                            </div>

                            <div class="state-name">
                                ${item.state}
                            </div>

                        </div>

                        <div class="ev-count">
                            ${item.count} EVs
                        </div>

                    </div>
                `;
               
               
            });

            document.getElementById("leaderboardContainer").innerHTML =
                leaderboardHTML;

            // Charts update
            lineChart.data.labels = data.years;
            lineChart.data.datasets[0].data = data.sales;
            lineChart.update();

            barChart.data.labels = data.states;
            barChart.data.datasets[0].data = data.state_sales;
            barChart.update();

            // Update India Map with filtered data
            const updatedIndiaData = createScatterData(data.states, data.state_sales);
            Plotly.react("indiaMap", updatedIndiaData, indiaLayout, indiaPlotlyOptions);

            pieChart.data.labels = data.vehicle_types;
            pieChart.data.datasets[0].data = data.vehicle_sales;
            pieChart.update();

            // ✅ Update Make Chart
            makeChart.data.labels = data.makes;
            makeChart.data.datasets[0].data = data.make_sales;
            makeChart.update();

            // ✅ Update Forecast Chart with combined actual + forecast data
            forecastChart.data.labels =
                data.years.concat(data.forecast_years);

            forecastChart.data.datasets[0].data =
                data.sales.concat(data.forecast_sales);

            forecastChart.update();

            updateBatteryEfficiencyChart(
                    data.battery_efficiency_labels || [],
                    data.battery_efficiency_values || []
                );

            updateVehicleEfficiencyChart(
                    data.vehicle_efficiency_labels || [],
                    data.vehicle_efficiency_values || []
                );

            // ✅ Update Market Share Chart
            marketShareChart.data.labels = data.makes;

            marketShareChart.data.datasets[0].data =
            data.make_sales;

            marketShareChart.update();

            // ✅ Update YoY Growth Chart
            growthChart.data.labels = data.years;

            growthChart.data.datasets[0].data =
            data.yoy_growth;

            growthChart.update();

            //update fastest -growing/declining state cards
            renderStateGrowthCards(data);
            // Update Growth Analysis
            analyzeGrowth(data.years, data.yoy_growth);
            // UPDATE TABLE

            let tableHTML = "";

            data.table_data.forEach(row => {

                tableHTML += `
                    <tr>
                        <td><strong>${row.Make}</strong></td>
                        <td>${row.Vehicle_Type}</td>
                        <td>${row.State}</td>
                        <td>🔋 ${row["Electric Range"]} km</td>
                        <td>${row.Year}</td>
                    </tr>
                `;
            });

            document.getElementById("vehicleTableBody").innerHTML = tableHTML;

            // PAGE INFO
            document.getElementById("pageInfo").innerText =
                `Page ${data.current_page} of ${data.total_pages}`;

            if(currentPage > data.total_pages) {
                currentPage = data.total_pages || 1;
            }

            // Show "No data" message if total EV count is zero
            if (data.total_ev === 0) {

                document.getElementById("noDataMessage")
                    .style.display = "block";

            } else {

                document.getElementById("noDataMessage")
                    .style.display = "none";
            }

            // Hide loader and skeletons after charts are updated
            setLoadingState(false);
            addNotification('Filters refreshed successfully');
            if (window.AOS) {
                AOS.refresh();
            }
            console.log(data);
        })
        
        .catch(error => {
            console.log(error);
            setLoadingState(false);
        });

}

function changePage(direction) {

    const totalText =
        document.getElementById("pageInfo").innerText;

    const totalPages =
        parseInt(totalText.split("of")[1]);

    if (direction === 1 && currentPage >= totalPages) {
        return;
    }

    if (direction === -1 && currentPage <= 1) {
        return;
    }

    currentPage += direction;

    updateCharts();
}

function compareStates() {

    const state1 =
    document.getElementById("compareState1").value;

    const state2 =
    document.getElementById("compareState2").value;

    if (!state1 || !state2) {

        alert("Please select both states");

        return;
    }

    fetch(
        `/dashboard/compare-states/?state1=${state1}&state2=${state2}`
    )

    .then(response => response.json())

    .then(data => {

        comparisonChart.data.labels =
            data.years;

        comparisonChart.data.datasets[0].label =
            data.state1;

        comparisonChart.data.datasets[0].data =
            data.state1_sales;

        comparisonChart.data.datasets[1].label =
            data.state2;

        comparisonChart.data.datasets[1].data =
            data.state2_sales;

        comparisonChart.update();
    })

    .catch(error => console.log(error));
}

// ✅ Download CSV/Excel/PDF
function downloadReport() {
    const state = document.getElementById("stateFilter").value;
    const year = document.getElementById("yearFilter").value;

    window.location.href = `/dashboard/download-data/?state=${state}&year=${year}`;
}

function downloadExcel() {
    const state = document.getElementById("stateFilter").value;
    const year = document.getElementById("yearFilter").value;

    window.location.href = `/dashboard/download-excel/?state=${state}&year=${year}`;
}

// ✅ Download PDF with Charts
function downloadPDF() {
    const state = document.getElementById("stateFilter").value;
    const year = document.getElementById("yearFilter").value;

    const charts = {
        lineChart: lineChart.toBase64Image(),
        barChart: barChart.toBase64Image(),
        pieChart: pieChart.toBase64Image(),
        makeChart: makeChart.toBase64Image(),
        forecastChart: forecastChart.toBase64Image(),
        growthChart: growthChart.toBase64Image(),
        marketShareChart: marketShareChart.toBase64Image()
    };

    fetch('/dashboard/download-pdf/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify({
            state: state,
            year: year,
            charts: charts
        })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("PDF generation failed");
        }
        return response.blob();
    })
    .catch(error => {
        console.log(error);
        alert("Error generating PDF");
    })
    .then(blob => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = "ev_report.pdf";
        a.click();
    });
}

// Battery Efficiency Chart
function updateBatteryEfficiencyChart(
    labels,
    values
) {
    const chartLabels = Array.isArray(labels) && labels.length ? labels : ['No data'];
    const chartValues = Array.isArray(values) && values.length ? values : [0];

    if (!batteryEfficiencyChart) {
        batteryEfficiencyChart = createBatteryEfficiencyChart(chartLabels, chartValues);
        return;
    }

    batteryEfficiencyChart.data.labels = chartLabels;
    batteryEfficiencyChart.data.datasets[0].data = chartValues;
    batteryEfficiencyChart.update();
}

// Vehicle Type Efficiency Chart
function updateVehicleEfficiencyChart(
    labels,
    values
) {
    const chartLabels = Array.isArray(labels) && labels.length ? labels : ['No data'];
    const chartValues = Array.isArray(values) && values.length ? values : [0];

    if (!vehicleEfficiencyChart) {
        vehicleEfficiencyChart = createVehicleEfficiencyChart(chartLabels, chartValues);
        return;
    }

    vehicleEfficiencyChart.data.labels = chartLabels;
    vehicleEfficiencyChart.data.datasets[0].data = chartValues;
    vehicleEfficiencyChart.update();
}

// ✅ Reset Filter Values
function resetFilters() {

    //document.getElementById("stateFilter").value = "All";

    document.getElementById("yearFilter").value = "All";

    document.getElementById("vehicleFilter").value = "All";

    document.getElementById("makeSearch").value = "";

    document.getElementById("advancedSearchQuery").value = "";

    document.getElementById("rangeFilter").value = "0";

    document.getElementById("rangeValue").innerText = "0";

    document.getElementById("compareState1").value = "";

    document.getElementById("compareState2").value = "";

    // Clear comparison chart data
    comparisonChart.data.labels = [];

    comparisonChart.data.datasets[0].data = [];

    comparisonChart.data.datasets[1].data = [];

    comparisonChart.update();

    const stateOptions =
        document.getElementById("stateFilter").options;

    for(let option of stateOptions){
        option.selected = false;
    }

    updateCharts();
}

// ✅ Get CSRF Token for POST request
function getCSRFToken() {
    const cookie = 
        document.cookie.split('; ')
        .find(row => row.startsWith('csrftoken'));

    return cookie ? cookie.split('=')[1] : '';
}

// RANGE SLIDER VALUE
const rangeFilter =
    document.getElementById("rangeFilter");

const rangeValue =
    document.getElementById("rangeValue");

/* INITIAL VALUE */
rangeValue.innerText =
    rangeFilter.value;

/* UPDATE ON SLIDE */
rangeFilter.addEventListener("input", () => {

    rangeValue.innerText =
        rangeFilter.value;

    updateCharts();
});

// Feedback form submission handler
document.getElementById('feedbackForm').addEventListener('submit', function(e) {
    e.preventDefault();

    const feedbackText = document.getElementById('feedbackText').value.trim();
    const feedbackRating =
    document.getElementById('feedbackRating').value;
    const submitBtn = document.getElementById('submitFeedbackBtn');
    const spinner = submitBtn.querySelector('.spinner-border');

    if (!feedbackText) {
        alert('Please enter your feedback before submitting.');
        return;
    }

    // Show loading state
    submitBtn.disabled = true;
    spinner.classList.remove('d-none');

    // Prepare data
    const data = {
        feedback: feedbackText,
        rating: feedbackRating
    };

    // Send feedback
    fetch('/dashboard/submit-feedback/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': getCSRFToken()
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        if (data.message) {
            // Success
            alert(data.message);
            document.getElementById('feedbackText').value = '';
              document.getElementById(
                'feedbackRating'
            ).value = '5';
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('feedbackModal'));
            modal.hide();
        } else {
            // Error
            alert(data.error || 'An error occurred while submitting feedback.');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert('An error occurred while submitting feedback.');
    })
    .finally(() => {
        // Hide loading state
        submitBtn.disabled = false;
        spinner.classList.add('d-none');
    });
});

// ================================
// THEME TOGGLE FUNCTIONALITY
// ================================

// Initialize theme on page load
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    updateThemeToggleIcon(savedTheme);

    document.querySelectorAll('.chart-card, .kpi-card, .leaderboard-card, .table-card, .insight-box, .sidebar-filter, .quick-actions, .support-box').forEach(el => {
        el.dataset.aos = 'fade-up';
        el.dataset.aosDuration = '800';
    });

    if (window.AOS) {
        AOS.init({
            once: true,
            duration: 850,
            easing: 'ease-out-cubic',
            delay: 100
        });
    }

    initializeNotifications();
    loadFilterPresets();
});

function setLoadingState(loading) {
    document.querySelectorAll('.chart-card, .table-card, .leaderboard-card, .insight-box').forEach(el => {
        el.classList.toggle('loading', loading);
    });
    document.getElementById('loader').style.display = loading ? 'block' : 'none';
}

function toggleChartLoadingState(show) {
    setLoadingState(show);
}

function initializeNotifications() {
    const bell = document.getElementById('notificationBell');
    const closeBtn = document.getElementById('closeNotificationsBtn');
    const clearBtn = document.getElementById('clearNotificationsBtn');

    bell.addEventListener('click', toggleNotificationPanel);
    closeBtn.addEventListener('click', closeNotificationPanel);
    clearBtn.addEventListener('click', clearNotifications);

    renderNotifications();
}

function addNotification(message) {
    const notifications = JSON.parse(localStorage.getItem('dashboardNotifications') || '[]');
    const nextNotification = {
        id: Date.now(),
        message,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    notifications.unshift(nextNotification);
    localStorage.setItem('dashboardNotifications', JSON.stringify(notifications.slice(0, 10)));
    renderNotifications();
}

function renderNotifications() {
    const list = document.getElementById('notificationList');
    const badge = document.getElementById('notificationBadge');
    const notifications = JSON.parse(localStorage.getItem('dashboardNotifications') || '[]');

    list.innerHTML = notifications.length ? notifications.map(notification => `
        <div class="notification-item">
            ${notification.message}
            <span class="notification-time">${notification.timestamp}</span>
        </div>
    `).join('') : '<div class="notification-item">No notifications yet.</div>';

    if (notifications.length > 0) {
        badge.style.display = 'inline-flex';
        badge.innerText = notifications.length;
    } else {
        badge.style.display = 'none';
    }
}

function toggleNotificationPanel() {
    const panel = document.getElementById('notificationPanel');
    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function closeNotificationPanel() {
    document.getElementById('notificationPanel').style.display = 'none';
}

function clearNotifications() {
    localStorage.removeItem('dashboardNotifications');
    renderNotifications();
}

function loadFilterPresets() {
    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}');
    const list = document.getElementById('presetList');

    const keys = Object.keys(presets);
    list.innerHTML = keys.length ? keys.map(name => `
        <div class="preset-item">
            <span>${name}</span>
            <div class="d-flex gap-1">
                <button class="btn btn-sm btn-outline-primary" onclick="loadFilterPreset('${name}')">Load</button>
                <button class="btn btn-sm btn-outline-danger" onclick="deleteFilterPreset('${name}')">Delete</button>
            </div>
        </div>
    `).join('') : '<div class="preset-item">No saved presets yet.</div>';
}

function saveFilterPreset() {
    const nameInput = document.getElementById('presetName');
    const name = nameInput.value.trim();
    if (!name) {
        alert('Please enter a preset name.');
        return;
    }

    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}');
    presets[name] = getCurrentFilters();
    localStorage.setItem('filterPresets', JSON.stringify(presets));

    nameInput.value = '';
    loadFilterPresets();
    addNotification(`Preset saved: ${name}`);
}

function loadFilterPreset(name) {
    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}');
    const preset = presets[name];
    if (!preset) {
        alert('Preset not found.');
        return;
    }

    document.getElementById('advancedSearchQuery').value = preset.advanced_search || '';
    document.getElementById('makeSearch').value = preset.make_search || '';
    document.getElementById('yearFilter').value = preset.year || 'All';
    document.getElementById('vehicleFilter').value = preset.vehicle_type || 'All';
    document.getElementById('rangeFilter').value = preset.min_range || '0';
    document.getElementById('rangeValue').innerText = preset.min_range || '0';

    const stateSelect = document.getElementById('stateFilter');
    const options = Array.from(stateSelect.options);
    options.forEach(option => {
        option.selected = preset.states ? preset.states.includes(option.value) : false;
    });

    updateCharts();
    addNotification(`Loaded preset: ${name}`);
}

function deleteFilterPreset(name) {
    const presets = JSON.parse(localStorage.getItem('filterPresets') || '{}');
    delete presets[name];
    localStorage.setItem('filterPresets', JSON.stringify(presets));
    loadFilterPresets();
    addNotification(`Deleted preset: ${name}`);
}

function getCurrentFilters() {
    const stateSelect = document.getElementById('stateFilter');
    const selectedStates = Array.from(stateSelect.selectedOptions).map(option => option.value);

    return {
        states: selectedStates,
        year: document.getElementById('yearFilter').value,
        make_search: document.getElementById('makeSearch').value,
        vehicle_type: document.getElementById('vehicleFilter').value,
        min_range: document.getElementById('rangeFilter').value,
        advanced_search: document.getElementById('advancedSearchQuery').value
    };
}

// Theme toggle button event listener
document.getElementById('themeToggle').addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggleIcon(newTheme);
});

// Function to set theme
function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeToggleIcon(theme);
}

// Function to update theme toggle icon
function updateThemeToggleIcon(theme) {
    const themeToggle = document.getElementById('themeToggle');
    themeToggle.innerHTML = theme === 'light' ? '🌙' : '☀️';
    themeToggle.setAttribute('title', theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode');
}

// ================================
// COLLAPSIBLE SIDEBAR FUNCTIONALITY
// ================================

// Sidebar toggle button event listener
document.getElementById('sidebarToggle').addEventListener('click', function() {
    toggleSidebar();
});

// Mobile sidebar open button
document.getElementById('sidebarOpenBtn').addEventListener('click', function() {
    openSidebar();
});

// Sidebar overlay click to close (mobile)
document.getElementById('sidebarOverlay').addEventListener('click', function() {
    closeSidebar();
});

// Function to toggle sidebar
function toggleSidebar() {
    const body = document.body;
    const sidebarContainer = document.getElementById('sidebarContainer');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    if (window.innerWidth >= 992) {
        // Desktop: collapse/expand sidebar
        body.classList.toggle('sidebar-collapsed');
    } else {
        // Mobile: show/hide sidebar with overlay
        const isOpen = sidebarContainer.classList.contains('sidebar-open');
        if (isOpen) {
            closeSidebar();
        } else {
            openSidebar();
        }
    }
}

// Function to open sidebar (mobile)
function openSidebar() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    sidebarContainer.classList.add('sidebar-open');
    sidebarOverlay.classList.add('active');
}

// Function to close sidebar (mobile)
function closeSidebar() {
    const sidebarContainer = document.getElementById('sidebarContainer');
    const sidebarOverlay = document.getElementById('sidebarOverlay');

    sidebarContainer.classList.remove('sidebar-open');
    sidebarOverlay.classList.remove('active');
}

// Handle window resize to reset sidebar state
window.addEventListener('resize', function() {
    if (window.innerWidth >= 992) {
        // Reset mobile sidebar state on desktop
        closeSidebar();
    }
});

