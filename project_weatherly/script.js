/**
 * Weatherly Application - Core JavaScript
 * 
 * This script handles all weather data fetching, processing and UI updates
 * for the Weatherly application.
 */

// API Configuration
const API_KEY = '620970db4507c0a15af21ceef9ee5cb3';
const URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_KEY}&q=`;

// DOM Element References
const q = document.getElementById("inputCity");
const button = document.querySelector("button");
const h1 = document.getElementById("city");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const errorMessage = document.getElementById("errorMessage");

/**
 * Fetches current weather data for a specified city
 * @param {string} city - Name of the city to fetch weather for
*/
async function getWeather(city) {
    try {
        const response = await fetch(URL + city);
        const data = await response.json();
        
        if (data.cod === 200) {
            sessionStorage.setItem('lastCity', city);
            await getForecast(city); // Get forecast only if city is found
        } else {
            sessionStorage.removeItem('lastCity');
        }
        
        displayWeather(data);
    } catch (error) {
        console.error('Error fetching weather data:', error);
        errorMessage.innerText = "Error fetching weather data";
        sessionStorage.removeItem('lastCity');
    }
}

/**
 * Displays weather data in the UI
 * @param {Object} weatherData - Weather data returned from the API
 */
function displayWeather(weatherData) {
    if (weatherData.cod === 200) {
        // Clear any error messages
        errorMessage.innerText = "";

        // Display basic weather information
        h1.innerText = weatherData.name;
        temp.innerText = Math.round(weatherData.main.temp) + "°C";
        description.innerText = weatherData.weather[0].description;
        weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        weatherIcon.alt = weatherData.name;

        // Display additional weather metrics
        document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`;
        document.getElementById('wind').innerText = `${weatherData.wind.speed} m/s`;

        // Convert and display sunrise/sunset times
        const sunrise = new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        const sunset = new Date(weatherData.sys.sunset * 1000).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
        
        document.getElementById('sunrise').innerText = sunrise;
        document.getElementById('sunset').innerText = sunset;

        // Update background based on weather conditions
        const weatherType = weatherData.weather[0].main.toLowerCase();
        changeBackground(weatherType);
    } else {
        // Clear all fields in case of error
        h1.innerText = "";
        temp.innerText = "";
        description.innerText = "";
        weatherIcon.src = "";
        weatherIcon.alt = "";
        document.getElementById('humidity').innerText = "--";
        document.getElementById('wind').innerText = "--";
        document.getElementById('sunrise').innerText = "--";
        document.getElementById('sunset').innerText = "--";
        errorMessage.innerText = "City not found";
        document.body.className = 'bg-default';
        
        // Clear forecast data
        const forecastContainer = document.getElementById('forecast-container');
        if (forecastContainer) {
            forecastContainer.innerHTML = '';
        }
    }
}

/**
 * Updates the page background based on current weather conditions
 * @param {string} weatherType - Type of weather (clear, clouds, rain, etc.)
 */
function changeBackground(weatherType) {
    const body = document.body;
    body.className = '';
    
    switch(weatherType) {
        case 'clear':
            body.classList.add('bg-clear');
            break;
        case 'clouds':
            body.classList.add('bg-cloudy');
            break;
        case 'rain':
        case 'drizzle':
            body.classList.add('bg-rainy');
            break;
        case 'thunderstorm':
            body.classList.add('bg-storm');
            break;
        case 'snow':
            body.classList.add('bg-snow');
            break;
        case 'mist':
        case 'fog':
        case 'haze':
            body.classList.add('bg-misty');
            break;
        default:
            body.classList.add('bg-default');
    }
}

/**
 * Fetches 5-day weather forecast for a specified city
 * @param {string} city - Name of the city to fetch forecast for
 */
async function getForecast(city) {
    try {
        const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`;
        const response = await fetch(forecastURL);
        const data = await response.json();
        
        if (data.cod === "200") {
            displayForecast(data.list);
        }
    } catch (error) {
        console.error('Error fetching forecast:', error);
    }
}

/**
 * Displays the 5-day forecast in the UI
 * @param {Array} forecastData - Array of forecast data points
 */
function displayForecast(forecastData) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';
    
    // Filter forecast data to show only noon readings for 5 days
    const dailyData = forecastData
        .filter(item => item.dt_txt.includes('12:00:00'))
        .slice(0, 5);
    
    dailyData.forEach(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'short' });
        
        const forecastDay = document.createElement('div');
        forecastDay.className = 'forecast-day';
        forecastDay.innerHTML = `
            <span class="forecast-date">${dayName}</span>
            <img class="forecast-icon" 
                src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png" 
                alt="${day.weather[0].description}">
            <span class="forecast-temp">${Math.round(day.main.temp)}°C</span>
        `;
        
        container.appendChild(forecastDay);
    });
}

/**
 * Handles city search interactions
 */
function handleCitySearch() {
    const cityName = q.value.trim();
    if (cityName) {
        getWeather(cityName);
    }
}

// Initialize application and load last searched city
document.addEventListener('DOMContentLoaded', () => {
    const lastCity = sessionStorage.getItem('lastCity');
    if (lastCity) {
        q.value = lastCity;
        getWeather(lastCity);
    }
});

// Event Listeners
button.addEventListener("click", handleCitySearch);

// Listen for Enter key in search input
q.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleCitySearch();
    }
});