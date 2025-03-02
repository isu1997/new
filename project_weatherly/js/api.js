// API handling functions

/**
 * Generic function to fetch data from API
 * @param {string} url - The API endpoint URL
 * @returns {Promise<Object>} - The response data
 */
async function fetchData(url) {
    const response = await fetch(url);
    
    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
}

/**
 * Get current weather data
 * @param {string} url - The weather API URL with query parameters
 * @returns {Promise<Object>} - Weather data
 */
export async function getWeatherData(url) {
    return await fetchData(url);
}

/**
 * Get forecast data and process it
 * @param {string} url - The forecast API URL with query parameters
 * @returns {Promise<Object>} - Processed forecast data
 */
export async function getForecastData(url) {
    const data = await fetchData(url);
    
    // Process the forecast data to get one forecast per day
    const processedData = processForecastData(data);
    
    return processedData;
}

/**
 * Process 3-hour forecast data into daily forecasts
 * @param {Object} data - Raw forecast data
 * @returns {Object} - Processed data with one forecast per day
 */
function processForecastData(data) {
    const dailyForecasts = [];
    const forecastMap = {};
    
    // Group forecasts by day
    data.list.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toISOString().split('T')[0];
        
        if (!forecastMap[day]) {
            forecastMap[day] = [];
        }
        
        forecastMap[day].push(forecast);
    });
    
    // Get the midday forecast for each day
    Object.keys(forecastMap).forEach(day => {
        const forecasts = forecastMap[day];
        
        // Try to get the forecast for around noon
        let middayForecast = forecasts.find(f => {
            const hour = new Date(f.dt * 1000).getHours();
            return hour >= 11 && hour <= 13;
        });
        
        // If no midday forecast, take the first one
        if (!middayForecast && forecasts.length > 0) {
            middayForecast = forecasts[0];
        }
        
        if (middayForecast) {
            dailyForecasts.push(middayForecast);
        }
    });
    
    // Take only the next 5 days
    const fiveDayForecast = dailyForecasts.slice(0, 5);
    
    // Return in the same format as the original API response
    return {
        ...data,
        list: fiveDayForecast
    };
}