document.addEventListener('DOMContentLoaded', function() {
    var searchButton = document.getElementById('searchButton');
    var cityInput = document.getElementById('cityInput');
    var forecastContainer = document.getElementById('forecastContainer');
    var forecastChart = document.getElementById('forecastChart').getContext('2d');

    var chart; // Variable to hold the chart instance

    // Store the current date when the application loads
    var initialDate = new Date();

    searchButton.addEventListener('click', function() {
        var city = cityInput.value.trim(); // Trim whitespace from city input
        if (city) {
            fetchWeatherData(city);
        } else {
            alert('Please enter a city name.');
        }
    });

    function fetchWeatherData(city) {
        var apiKey = 'Or8NFUEGIwTwiOFGAlJ5BOZSGerS6stt';
        var apiUrl = `https://api.tomorrow.io/v4/timelines?location=${city}&fields=temperature,windSpeed,humidity&units=metric&apikey=${apiKey}`;

        fetch(apiUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data?.data?.timelines?.length > 0) { // Check if there's valid data
                    displayForecast(data.data);
                } else {
                    alert('No forecast data available for the entered city.');
                }
            })
            .catch(error => {
                alert('Error fetching weather data: ' + error.message);
                console.error('Error fetching weather data:', error);
            });
    }

    function getSkyImageURL(temperature) {
        if (temperature < 0) {
            return 'freezing cloud.png'; // Replace with actual URL
        } else if (temperature < 10) {
            return 'verycold.png'; // Replace with actual URL
        } else if (temperature < 20) {
            return 'rainy.png'; // Replace with actual URL
        } else if (temperature < 30) {
            return 'cloud.png'; // Replace with actual URL
        } else {
            return 'sun.png'; // Replace with actual URL
        }
    }

    function displayForecast(data) {
        forecastContainer.innerHTML = ''; // Clear previous forecast

        var forecastDays = data.timelines[0].intervals.slice(0, 7); // Get the first 7 days
        var labels = [];
        var temperatures = [];
        var windSpeeds = [];
        var humidities = [];

        forecastDays.forEach((day, index) => {
            var date = new Date(initialDate); // Use the stored initial date
            date.setDate(initialDate.getDate() + index); // Increment the date by the index

            var options = { weekday: 'long', month: 'short', day: 'numeric' };
            var formattedDate = date.toLocaleDateString('en-US', options);

            var forecastBox = document.createElement('div');
            forecastBox.className = 'forecastBox';

            var skyImage = document.createElement('img');
            skyImage.src = getSkyImageURL(day.values.temperature); // Get the image based on temperature

            var dateElement = document.createElement('div');
            dateElement.className = 'date';
            dateElement.textContent = formattedDate;

            var tempElement = document.createElement('div');
            tempElement.className = 'temp';
            tempElement.textContent = `${day.values.temperature.toFixed(2)}°C`;

            var windElement = document.createElement('div');
            windElement.className = 'wind';
            windElement.textContent = `Wind: ${day.values.windSpeed.toFixed(2)} km/h`;

            var humidityElement = document.createElement('div');
            humidityElement.className = 'humidity';
            humidityElement.textContent = `Humidity: ${day.values.humidity.toFixed(2)}%`;

            forecastBox.appendChild(skyImage);
            forecastBox.appendChild(dateElement);
            forecastBox.appendChild(tempElement);
            forecastBox.appendChild(windElement);
            forecastBox.appendChild(humidityElement);

            forecastContainer.appendChild(forecastBox);

            // Collect data for the chart
            labels.push(formattedDate);
            temperatures.push(day.values.temperature);
            windSpeeds.push(day.values.windSpeed);
            humidities.push(day.values.humidity);
        });

        // Update the chart
        updateChart(labels, temperatures, windSpeeds, humidities);
    }

    function updateChart(labels, temperatures, windSpeeds, humidities) {
        if (chart) {
            chart.destroy(); // Destroy the previous chart instance if it exists
        }

        chart = new Chart(forecastChart, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [
                    {
                        label: 'Temperature (°C)',
                        data: temperatures,
                        borderColor: 'rgba(255, 99, 132, 1)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        fill: false,
                        yAxisID: 'y1',
                    },
                    {
                        label: 'Wind Speed (km/h)',
                        data: windSpeeds,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        fill: false,
                        yAxisID: 'y2',
                    },
                    {
                        label: 'Humidity (%)',
                        data: humidities,
                        borderColor: 'rgba(75, 192, 192, 1)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        fill: false,
                        yAxisID: 'y3',
                    }
                ]
            },
            options: {
                scales: {
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                    },
                    y2: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    },
                    y3: {
                        type: 'linear',
                        display: false,
                        position: 'right',
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    }
});
