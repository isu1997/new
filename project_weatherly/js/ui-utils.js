// UI utility functions

/**
 * Display error message
 * @param {HTMLElement} errorElement - The error element to display
 * @param {string} message - The error message to show
 */
export function displayError(errorElement, message) {
    errorElement.textContent = message;
    errorElement.style.display = 'block';
    
    // Hide the error message after 5 seconds
    setTimeout(() => {
        errorElement.style.display = 'none';
    }, 5000);
}

/**
 * Show loading indicator
 */
export function showLoading() {
    document.getElementById('loading').classList.add('active');
}

/**
 * Hide loading indicator
 */
export function hideLoading() {
    document.getElementById('loading').classList.remove('active');
}

/**
 * Format date to Hebrew format
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export function formatDate(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('he-IL', options);
}

/**
 * Format day name in Hebrew
 * @param {Date} date - The date to format
 * @returns {string} - Hebrew day name
 */
export function formatDay(date) {
    const options = { weekday: 'long' };
    return date.toLocaleDateString('he-IL', options);
}

/**
 * Convert weather condition to Hebrew
 * @param {string} condition - The weather condition in English
 * @returns {string} - Hebrew translation
 */
export function translateWeatherCondition(condition) {
    const translations = {
        'Clear': 'בהיר',
        'Clouds': 'מעונן',
        'Rain': 'גשום',
        'Drizzle': 'טפטוף',
        'Thunderstorm': 'סופת רעמים',
        'Snow': 'שלג',
        'Mist': 'ערפל',
        'Smoke': 'עשן',
        'Haze': 'אובך',
        'Dust': 'אבק',
        'Fog': 'ערפל כבד',
        'Sand': 'חול',
        'Ash': 'אפר',
        'Squall': 'משב רוח',
        'Tornado': 'טורנדו'
    };
    
    return translations[condition] || condition;
}

/**
 * Get weather icon class based on weather condition and time
 * @param {string} condition - Weather condition
 * @param {boolean} isDay - Whether it's day or night
 * @returns {string} - CSS class for the weather icon
 */
export function getWeatherIconClass(condition, isDay) {
    if (condition === 'Clear') {
        return isDay ? 'fas fa-sun' : 'fas fa-moon';
    } else if (condition === 'Clouds') {
        return 'fas fa-cloud';
    } else if (condition === 'Rain' || condition === 'Drizzle') {
        return 'fas fa-cloud-rain';
    } else if (condition === 'Thunderstorm') {
        return 'fas fa-bolt';
    } else if (condition === 'Snow') {
        return 'fas fa-snowflake';
    } else if (condition === 'Mist' || condition === 'Fog' || condition === 'Haze') {
        return 'fas fa-smog';
    } else {
        return 'fas fa-cloud';
    }
}

/**
 * Categorize UV index and return description and class
 * @param {number} uvIndex - The UV index value
 * @returns {Object} - Object with category, description and class
 */
export function categorizeUVIndex(uvIndex) {
    if (uvIndex <= 2) {
        return { 
            category: 'נמוך', 
            description: 'אין צורך בהגנה מיוחדת', 
            class: 'uv-low' 
        };
    } else if (uvIndex <= 5) {
        return { 
            category: 'בינוני', 
            description: 'מומלץ להשתמש בקרם הגנה', 
            class: 'uv-medium' 
        };
    } else {
        return { 
            category: 'גבוה', 
            description: 'חובה להשתמש בקרם הגנה ולהגביל שהייה בשמש', 
            class: 'uv-high' 
        };
    }
}

/**
 * Categorize air quality index and return description and class
 * @param {number} aqi - The air quality index value (1-5)
 * @returns {Object} - Object with category, description and class
 */
export function categorizeAirQuality(aqi) {
    if (aqi <= 2) {
        return { 
            category: 'טובה', 
            description: 'איכות אוויר טובה, זיהום אוויר מהווה סיכון קטן או לא מהווה סיכון', 
            class: 'air-good' 
        };
    } else if (aqi <= 3) {
        return { 
            category: 'בינונית', 
            description: 'איכות אוויר מתקבלת. עשוי להיות סיכון לאנשים רגישים', 
            class: 'air-moderate' 
        };
    } else {
        return { 
            category: 'גרועה', 
            description: 'איכות אוויר לא טובה. אנשים רגישים עלולים לחוות השפעות בריאותיות', 
            class: 'air-poor' 
        };
    }
}

/**
 * Get season based on month and temperature
 * @param {Date} date - Current date
 * @param {number} temperature - Current temperature
 * @returns {string} - Season name (spring, summer, autumn, winter)
 */
export function getSeason(date, temperature) {
    const month = date.getMonth();
    
    // Base season determination by month (Northern Hemisphere)
    if (month >= 2 && month <= 4) {
        return 'spring';
    } else if (month >= 5 && month <= 7) {
        return 'summer';
    } else if (month >= 8 && month <= 10) {
        return 'autumn';
    } else {
        return 'winter';
    }
}