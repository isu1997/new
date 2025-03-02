// Weather display functions
import { formatDate, formatDay, translateWeatherCondition, getWeatherIconClass, categorizeUVIndex, categorizeAirQuality, getSeason } from './ui-utils.js';

/**
 * Format temperature with proper RTL/LTR handling
 * @param {Number} temp - Temperature value
 * @returns {String} Formatted temperature with proper direction
 */
function formatTemperature(temp) {
    const roundedTemp = Math.round(temp);
    // Wrap temperature in a span with forced LTR direction
    return `<span dir="ltr">${roundedTemp}°C</span>`;
}

/**
 * Display current weather information
 * @param {Object} data - Weather data from API
 * @param {HTMLElement} container - Container element to display weather
 */
export function displayCurrentWeather(data, container) {
    const date = new Date();
    const isDay = date.getHours() >= 6 && date.getHours() < 20;
    const weatherCondition = data.weather[0].main;
    const weatherIcon = getWeatherIconClass(weatherCondition, isDay);
    
    container.innerHTML = `
        <h2 class="city-name">${data.name}</h2>
        <p class="date">${formatDate(date)}</p>
        
        <div class="weather-visual-container">
            <!-- Visual weather elements will be added dynamically by JS -->
        </div>
        
        <div class="temp-container">
            <span class="temperature">${formatTemperature(data.main.temp)}</span>
            <i class="${weatherIcon} weather-icon"></i>
        </div>
        
        <p class="weather-description">${translateWeatherCondition(weatherCondition)}</p>
        
        <div class="weather-details">
            <div class="detail">
                <i class="fas fa-temperature-high"></i>
                <p class="detail-label">מקסימום</p>
                <p class="detail-value">${formatTemperature(data.main.temp_max)}</p>
            </div>
            <div class="detail">
                <i class="fas fa-temperature-low"></i>
                <p class="detail-label">מינימום</p>
                <p class="detail-value">${formatTemperature(data.main.temp_min)}</p>
            </div>
            <div class="detail">
                <i class="fas fa-tint"></i>
                <p class="detail-label">לחות</p>
                <p class="detail-value">${data.main.humidity}%</p>
            </div>
            <div class="detail">
                <i class="fas fa-wind"></i>
                <p class="detail-label">רוח</p>
                <p class="detail-value">${Math.round(data.wind.speed * 3.6)} קמ"ש</p>
            </div>
            <div class="detail">
                <i class="fas fa-compress-arrows-alt"></i>
                <p class="detail-label">לחץ אוויר</p>
                <p class="detail-value">${data.main.pressure} hPa</p>
            </div>
            <div class="detail">
                <i class="fas fa-eye"></i>
                <p class="detail-label">ראות</p>
                <p class="detail-value">${(data.visibility / 1000).toFixed(1)} ק"מ</p>
            </div>
        </div>
    `;
}

/**
 * Display 5-day forecast
 * @param {Object} data - Forecast data from API
 * @param {HTMLElement} container - Container element for forecast cards
 */
export function displayForecast(data, container) {
    container.innerHTML = '';
    
    data.list.forEach(day => {
        const date = new Date(day.dt * 1000);
        const weatherCondition = day.weather[0].main;
        const isDay = true; // Assume day for forecast icons
        const weatherIcon = getWeatherIconClass(weatherCondition, isDay);
        
        const forecastCard = document.createElement('div');
        forecastCard.className = 'forecast-card';
        forecastCard.innerHTML = `
            <h3 class="forecast-day">${formatDay(date)}</h3>
            <i class="${weatherIcon} forecast-icon"></i>
            <p class="forecast-temp">${formatTemperature(day.main.temp)}</p>
            <p class="forecast-description">${translateWeatherCondition(weatherCondition)}</p>
        `;
        
        container.appendChild(forecastCard);
    });
}

/**
 * Display extra weather data (Air Quality, UV Index)
 * @param {Object} weatherData - Weather data from API
 * @param {Object} airQualityData - Air quality data from API
 * @param {HTMLElement} container - Container element for extra data cards
 */
export function displayExtraData(weatherData, airQualityData, container) {
    container.innerHTML = '';
    
    // UV Index Card (using a fixed value for now as it's not directly available in the API)
    // In a real app, you might want to use a dedicated UV Index API
    const estimatedUVIndex = estimateUVIndex(weatherData);
    const uvData = categorizeUVIndex(estimatedUVIndex);
    
    const uvCard = document.createElement('div');
    uvCard.className = 'extra-data-card';
    uvCard.innerHTML = `
        <h3 class="extra-data-title">אינדקס UV</h3>
        <p class="extra-data-value ${uvData.class}">${estimatedUVIndex}</p>
        <p class="extra-data-description">${uvData.category}: ${uvData.description}</p>
    `;
    
    // Air Quality Card
    const aqiValue = airQualityData.list ? airQualityData.list[0].main.aqi : 1;
    const aqiData = categorizeAirQuality(aqiValue);
    
    const aqiCard = document.createElement('div');
    aqiCard.className = 'extra-data-card';
    aqiCard.innerHTML = `
        <h3 class="extra-data-title">איכות אוויר</h3>
        <p class="extra-data-value ${aqiData.class}">${aqiValue}/5</p>
        <p class="extra-data-description">${aqiData.category}: ${aqiData.description}</p>
    `;
    
    container.appendChild(uvCard);
    container.appendChild(aqiCard);
}

/**
 * Estimate UV Index based on cloud cover, time of day, and season
 * @param {Object} weatherData - Weather data from API
 * @returns {number} - Estimated UV Index (0-11)
 */
function estimateUVIndex(weatherData) {
    const clouds = weatherData.clouds ? weatherData.clouds.all : 0;
    const date = new Date();
    const hour = date.getHours();
    const season = getSeason(date, weatherData.main.temp);
    
    // Base UV based on season
    let baseUV = 0;
    if (season === 'summer') {
        baseUV = 10;
    } else if (season === 'spring' || season === 'autumn') {
        baseUV = 7;
    } else {
        baseUV = 4;
    }
    
    // Reduce based on cloud cover (0-100%)
    const cloudFactor = 1 - (clouds / 100) * 0.8;
    
    // Reduce based on time of day
    let timeFactor = 0;
    if (hour >= 10 && hour <= 16) {
        timeFactor = 1; // Peak hours
    } else if ((hour >= 7 && hour < 10) || (hour > 16 && hour <= 19)) {
        timeFactor = 0.6; // Morning/evening
    } else {
        timeFactor = 0.2; // Night/early morning
    }
    
    // Calculate final UV value and round to nearest integer
    return Math.round(baseUV * cloudFactor * timeFactor);
}

/**
 * Display clothing recommendations based on weather
 * @param {Object} data - Weather data from API
 * @param {HTMLElement} container - Container for recommendations
 */
export function displayClothingRecommendation(data, container) {
    const temp = Math.round(data.main.temp);
    const windSpeed = data.wind.speed;
    const hasRain = data.weather[0].main === 'Rain' || data.weather[0].main === 'Drizzle';
    const rainProb = hasRain ? 80 : (data.clouds ? data.clouds.all : 0);
    
    // Get clothing recommendations for each sensitivity group
    const coldSensitive = getClothingForTemperature(temp, 'cold', windSpeed);
    const regular = getClothingForTemperature(temp, 'regular', windSpeed);
    const warmSensitive = getClothingForTemperature(temp, 'warm', windSpeed);
    
    // Create recommendation HTML
    container.innerHTML = `
        <h2 class="recommendation-title">מה ללבוש היום?</h2>
        
        <div class="clothing-container">
            <div class="sensitivity-group">
                <h3 class="sensitivity-title">לרגישי קור</h3>
                <div class="human-figure">
                    <div class="head"></div>
                    <div class="body"></div>
                    <div class="arms"></div>
                    <div class="legs"></div>
                    ${coldSensitive.layers >= 3 ? '<div class="jacket"></div>' : ''}
                    ${coldSensitive.layers >= 4 ? '<div class="scarf"></div>' : ''}
                    ${coldSensitive.layers >= 4 ? '<div class="hat"></div>' : ''}
                </div>
                <div class="layer-indicator">
                    ${Array(coldSensitive.layers).fill('<div class="layer"></div>').join('')}
                </div>
                <ul class="clothing-list">
                    ${coldSensitive.items.map(item => `<li><i class="fas fa-tshirt"></i>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="sensitivity-group">
                <h3 class="sensitivity-title">לרגישות ממוצעת</h3>
                <div class="human-figure">
                    <div class="head"></div>
                    <div class="body"></div>
                    <div class="arms"></div>
                    <div class="legs"></div>
                    ${regular.layers >= 3 ? '<div class="jacket"></div>' : ''}
                    ${regular.layers >= 4 ? '<div class="scarf"></div>' : ''}
                    ${regular.layers >= 4 ? '<div class="hat"></div>' : ''}
                </div>
                <div class="layer-indicator">
                    ${Array(regular.layers).fill('<div class="layer"></div>').join('')}
                </div>
                <ul class="clothing-list">
                    ${regular.items.map(item => `<li><i class="fas fa-tshirt"></i>${item}</li>`).join('')}
                </ul>
            </div>
            
            <div class="sensitivity-group">
                <h3 class="sensitivity-title">לרגישי חום</h3>
                <div class="human-figure">
                    <div class="head"></div>
                    <div class="body"></div>
                    <div class="arms"></div>
                    <div class="legs"></div>
                    ${warmSensitive.layers >= 3 ? '<div class="jacket"></div>' : ''}
                    ${warmSensitive.layers >= 3 ? '<div class="scarf"></div>' : ''}
                    ${warmSensitive.layers >= 4 ? '<div class="hat"></div>' : ''}
                </div>
                <div class="layer-indicator">
                    ${Array(warmSensitive.layers).fill('<div class="layer"></div>').join('')}
                </div>
                <ul class="clothing-list">
                    ${warmSensitive.items.map(item => `<li><i class="fas fa-tshirt"></i>${item}</li>`).join('')}
                </ul>
            </div>
        </div>
        
        <div class="rain-chance">
            <p>סיכוי למשקעים: ${rainProb}%</p>
            ${rainProb > 40 ? 
                '<p class="umbrella-recommendation"><i class="fas fa-umbrella"></i> מומלץ לקחת מטריה</p>' : 
                ''}
        </div>
    `;
}

/**
 * Get clothing recommendations for a specific temperature and sensitivity
 * @param {number} temp - Temperature in Celsius
 * @param {string} sensitivity - Sensitivity type (cold, regular, warm)
 * @param {number} windSpeed - Wind speed in m/s
 * @returns {Object} - Object with clothing items and layer count
 */
function getClothingForTemperature(temp, sensitivity, windSpeed) {
    // Adjust temperature for wind chill effect
    const windFactor = windSpeed > 4 ? Math.min(windSpeed / 4, 2) : 0;
    const adjustedTemp = temp - (sensitivity === 'cold' ? windFactor * 2 : 
                               (sensitivity === 'regular' ? windFactor : windFactor * 0.5));
    
    // Clothing recommendations based on temperature range
    if (adjustedTemp < -30) {
    // Extreme cold (below -30°C)
    if (sensitivity === 'cold') {
        return {
            layers: 6,
            items: ['חולצה תרמית כפולה', 'סוודר עבה במיוחד', 'מעיל חורף מבודד עבה', 'צעיף כפול', 'כובע צמר', 'כפפות מבודדות', 'גרביים תרמיות כפולות', 'מחממי אוזניים', 'מסכת פנים תרמית']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 5,
            items: ['חולצה תרמית', 'סוודר עבה', 'מעיל חורף עבה במיוחד', 'צעיף', 'כובע צמר', 'כפפות מבודדות', 'גרביים תרמיות', 'מחממי אוזניים']
        };
    } else { // warm
        return {
            layers: 4,
            items: ['חולצה תרמית', 'סוודר עבה', 'מעיל חורף מבודד', 'צעיף', 'כובע צמר', 'כפפות', 'גרביים תרמיות']
        };
    }
    } else if (adjustedTemp < -15) {
    // Very extreme cold (below -15°C)
    if (sensitivity === 'cold') {
        return {
            layers: 5,
            items: ['חולצה תרמית', 'סוודר עבה במיוחד', 'מעיל חורף מבודד עבה', 'צעיף', 'כובע צמר', 'כפפות מבודדות', 'גרביים תרמיות', 'מחממי אוזניים']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 4,
            items: ['חולצה תרמית', 'סוודר עבה', 'מעיל חורף מבודד', 'צעיף', 'כובע צמר', 'כפפות', 'גרביים תרמיות']
        };
    } else { // warm
        return {
            layers: 3,
            items: ['חולצה תרמית', 'סוודר', 'מעיל חורף מבודד', 'צעיף', 'כובע', 'כפפות']
        };
    }
    } else if (adjustedTemp < 0) {
    // Below 0°C (freezing)
    if (sensitivity === 'cold') {
        return {
            layers: 5,
            items: ['חולצה תרמית', 'סוודר עבה', 'מעיל חורף מבודד', 'צעיף', 'כובע צמר', 'כפפות', 'גרביים תרמיות']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 4,
            items: ['חולצה תרמית', 'סוודר', 'מעיל חורף', 'צעיף', 'כובע', 'כפפות']
        };
    } else { // warm
        return {
            layers: 3,
            items: ['חולצה ארוכה', 'סוודר', 'מעיל חורף', 'כובע']
        };
    }
    } else if (adjustedTemp < 5) {
       // 0-5°C (very cold)
    if (sensitivity === 'cold') {
        return {
            layers: 4,
            items: ['חולצה תרמית', 'סוודר עבה', 'מעיל חורף', 'צעיף', 'כובע', 'כפפות', 'גרביים תרמיות']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 3,
            items: ['חולצה תרמית', 'סוודר', 'מעיל חורף או מעיל קל', 'צעיף', 'כובע']
        };
    } else { // warm
        return {
            layers: 2,
            items: ['חולצה ארוכה', 'סוודר דק', 'מעיל או ז\'קט קל']
        };
    }
    } else if (adjustedTemp < 10) {
    // 5-10°C (cold)
    if (sensitivity === 'cold') {
        return {
            layers: 3,
            items: ['חולצה תרמית דקה', 'סוודר', 'מעיל קל', 'צעיף דק', 'כפפות דקות']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 2,
            items: ['חולצה ארוכה', 'סוודר דק או עבה', 'ז\'קט או מעיל קל']
        };
    } else { // warm
        return {
            layers: 1,
            items: ['חולצה ארוכה', 'ז\'קט קל (אופציונלי)']
        };
    }
    } else if (adjustedTemp < 15) {
    // 10-15°C (cool)
    if (sensitivity === 'cold') {
        return {
            layers: 2,
            items: ['חולצה ארוכה', 'סוודר דק', 'ז\'קט קל']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 2,
            items: ['חולצה ארוכה', 'ז\'קט או סוודר דק']
        };
    } else { // warm
        return {
            layers: 1,
            items: ['חולצה ארוכה או קצרה (לבחירה)']
        };
    }
    } else if (adjustedTemp < 20) {
    // 15-20°C (mild)
    if (sensitivity === 'cold') {
        return {
            layers: 2,
            items: ['חולצה ארוכה', 'סוודר דק או קרדיגן']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 1,
            items: ['חולצה ארוכה', 'שכבה דקה למקרה שיתקרר']
        };
    } else { // warm
        return {
            layers: 1,
            items: ['חולצה קצרה', 'מכנסיים קלים']
        };
    }
    } else if (adjustedTemp < 25) {
    // 20-25°C (warm)
    if (sensitivity === 'cold') {
        return {
            layers: 1,
            items: ['חולצה ארוכה קלה או חולצה קצרה', 'קרדיגן דק']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 1,
            items: ['חולצה קצרה', 'מכנסיים קלים']
        };
    } else { // warm
        return {
            layers: 1,
            items: ['חולצה קצרה קלה', 'מכנסיים קצרים', 'כובע להגנה מהשמש']
        };
    }
    } else if (adjustedTemp < 30) {
    // 25-30°C (very warm)
    if (sensitivity === 'cold') {
        return {
            layers: 1,
            items: ['חולצה קצרה', 'מכנסיים קלים', 'כובע להגנה מהשמש']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 1,
            items: ['חולצה קצרה קלה', 'מכנסיים קצרים', 'כובע רחב']
        };
    } else { // warm
        return {
            layers: 1,
            items: ['חולצה קצרה מחומר נושם במיוחד', 'מכנסיים קצרים קלים', 'כובע רחב', 'מטלית קירור']
        };
    }
    } else {
    // 30°C and above (hot)
    if (sensitivity === 'cold') {
        return {
            layers: 1,
            items: ['חולצה קצרה וקלה', 'מכנסיים קצרים', 'כובע', 'משקפי שמש', 'בקבוק מים']
        };
    } else if (sensitivity === 'regular') {
        return {
            layers: 1,
            items: ['חולצה קצרה מחומר נושם', 'מכנסיים קצרים', 'כובע רחב', 'משקפי שמש', 'בקבוק מים']
        };
    } else { // warm
        return {
            layers: 1,
            items: ['חולצת ספורט מחומר מנדף זיעה', 'מכנסיים קצרים קלים במיוחד', 'כובע רחב', 'משקפי שמש', 'מטליות קירור', 'בקבוק מים מקורר']
        };
    }
}
}