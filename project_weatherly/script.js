// Import utility functions and modules
import { displayError, showLoading, hideLoading } from './js/ui-utils.js';
import { getWeatherData, getForecastData } from './js/api.js';
import { displayCurrentWeather, displayForecast, displayExtraData, displayClothingRecommendation } from './js/weather-display.js';
import { setupAutocomplete, setupEventListeners } from './js/event-handlers.js';
import { renderSeasonalAnimation } from './js/weather-animations.js';

// Global constants
const API_KEY = '620970db4507c0a15af21ceef9ee5cb3';
const WEATHER_URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_KEY}&q=`;
const FORECAST_URL = `https://api.openweathermap.org/data/2.5/forecast?units=metric&appid=${API_KEY}&q=`;
const AIR_QUALITY_URL = `https://api.openweathermap.org/data/2.5/air_pollution?appid=${API_KEY}`;

// DOM Elements
const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const resetBtn = document.getElementById('reset-btn');
const weatherContainer = document.getElementById('weather-container');
const currentWeather = document.getElementById('current-weather');
const clothingRecommendation = document.getElementById('clothing-recommendation');
const forecastContainer = document.getElementById('forecast-container');
const forecastCards = document.getElementById('forecast-cards');
const extraDataContainer = document.getElementById('extra-data-container');
const extraDataCards = document.getElementById('extra-data-cards');
const autocompleteContainer = document.getElementById('autocomplete-container');
const errorMessage = document.getElementById('error-message');

// Initialize the app
function initApp() {
    setupEventListeners(searchBtn, resetBtn, cityInput, autocompleteContainer);
    setupAutocomplete(cityInput, autocompleteContainer);
    checkSessionStorage();
}

// Check if there's a saved city in sessionStorage
function checkSessionStorage() {
    const savedCity = sessionStorage.getItem('lastCity');
    if (savedCity) {
        cityInput.value = savedCity;
        fetchWeatherData(savedCity);
    }
}

// Main function to fetch weather data
async function fetchWeatherData(city) {
    try {
        showLoading();
        
        // Fetch current weather
        const weatherData = await getWeatherData(WEATHER_URL + city);
        
        // Fetch 5-day forecast
        const forecastData = await getForecastData(FORECAST_URL + city);
        
        // Fetch air quality data using coordinates from weather data
        const airQualityData = await getWeatherData(
            `${AIR_QUALITY_URL}&lat=${weatherData.coord.lat}&lon=${weatherData.coord.lon}`
        );
        
        // Display all weather information
        displayCurrentWeather(weatherData, currentWeather);
        displayForecast(forecastData, forecastCards);
        displayExtraData(weatherData, airQualityData, extraDataCards);
        displayClothingRecommendation(weatherData, clothingRecommendation);
        
        // Render seasonal animation based on weather data
        renderSeasonalAnimation(weatherData);
        
        // Show all containers
        weatherContainer.classList.add('visible');
        forecastContainer.classList.add('visible');
        extraDataContainer.classList.add('visible');
        
        // Save city to sessionStorage
        sessionStorage.setItem('lastCity', city);
        
        hideLoading();
    } catch (error) {
        hideLoading();
        displayError(errorMessage, `לא ניתן למצוא את העיר "${city}". אנא בדוק את השם ונסה שוב.`);
        console.error('Error fetching weather data:', error);
    }
}

// Export for other modules
window.fetchWeatherData = fetchWeatherData;

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);