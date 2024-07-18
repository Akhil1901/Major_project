// Function to update weather information on the webpage
function updateWeatherInfo(weatherData) {
    // Validate weather data
    if (!weatherData || !weatherData.data || !weatherData.data.timelines || weatherData.data.timelines.length === 0) {
        console.error('Invalid weather data');
        alert('Invalid weather data received. Please try again.');
        return;
    }

    // Get display elements by their IDs
    const cityNameDisplay = document.getElementById('cityNameDisplay');
    const temperatureDisplay = document.getElementById('temperatureDisplay');
    const natureOfSkyDisplay = document.getElementById('natureOfSkyDisplay');
    const humidityDisplay = document.getElementById('humidityDisplay');
    const windSpeedDisplay = document.getElementById('windSpeedDisplay');

    // Extract current weather from the data
    const timeline = weatherData.data.timelines[0];
    const currentWeather = timeline.intervals[0].values;

    const temperature = currentWeather.temperature;
    const humidity = currentWeather.humidity;
    const windSpeed = currentWeather.windSpeed;

    // Update city name and temperature display
    cityNameDisplay.textContent = document.getElementById('cityInput').value;
    temperatureDisplay.textContent = `${temperature}°C`;

    // Update humidity and wind speed display
    humidityDisplay.textContent = `Humidity: ${humidity}%`;
    windSpeedDisplay.textContent = `Wind Speed: ${windSpeed} km/h`;

    // Determine nature of the sky based on temperature
    let natureOfSky = '';

    if (temperature < 0) {
        natureOfSky = 'Looks like Freezing Cold';
    } else if (temperature < 10) {
        natureOfSky = 'Looks like Very Cold';
    } else if (temperature < 20) {
        natureOfSky = 'Looks like Cool';
    } else if (temperature < 30) {
        natureOfSky = 'Looks like Warm';
    } else {
        natureOfSky = 'Looks like Hot';
    }

    // Update nature of sky display
    natureOfSkyDisplay.textContent = `${natureOfSky}`;
}

// Function to fetch weather data from Tomorrow.io API
async function fetchWeatherData(endpoint) {
    try {
        const response = await fetch(endpoint);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const weatherData = await response.json();
        return weatherData;
    } catch (error) {
        console.error('Error fetching weather data:', error);
        alert('Failed to fetch weather data. Please try again later.');
        return null;
    }
}

// Event listener for search button click
document.getElementById('searchButton').addEventListener('click', async () => {
    const city = document.getElementById('cityInput').value;
    if (city) {
        const apiKey = 'BozObFuivGYq8Eonb25byyvb1JWdhBA1';
        const endpoint = `https://api.tomorrow.io/v4/timelines?location=${city}&fields=temperature,humidity,windSpeed&timesteps=1h&units=metric&apikey=${apiKey}`;
        const weatherData = await fetchWeatherData(endpoint);
        if (weatherData) {
            updateWeatherInfo(weatherData);
            document.getElementById('weatherResult').style.display = 'block';
        }
    } else {
        alert('Please enter a city name.');
    }
});

// Event listener for current location button click
document.querySelector('.currentlocation .buttons').addEventListener('click', async () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
            const { latitude, longitude } = position.coords;
            const apiKey = 'BozObFuivGYq8Eonb25byyvb1JWdhBA1';
            const endpoint = `https://api.tomorrow.io/v4/timelines?location=${latitude},${longitude}&fields=temperature,humidity,windSpeed&timesteps=1h&units=metric&apikey=${apiKey}`;
            const weatherData = await fetchWeatherData(endpoint);
            if (weatherData) {
                updateWeatherInfo(weatherData);
                document.getElementById('weatherResult').style.display = 'block';
            }
        }, (error) => {
            console.error('Error getting current position:', error.message);
            alert('Failed to get your current location. Please try again later.');
        });
    } else {
        alert('Geolocation is not supported by your browser');
    }
});
