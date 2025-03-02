// Weather animations functions

/**
 * Render seasonal animation based on weather data
 * @param {Object} weatherData - Weather data from API
 */
export function renderSeasonalAnimation(weatherData) {
    const temp = weatherData.main.temp;
    const condition = weatherData.weather[0].main;
    const date = new Date();
    const month = date.getMonth();
    
    // Clear previous animation
    const container = document.querySelector('.weather-visual-container');
    container.innerHTML = '';
    
    // Determine season and weather condition
    let season = determineSeason(month, temp);
    
    // Create appropriate animation
    switch(condition) {
        case 'Clear':
            if (season === 'summer') {
                createSummerSunnyAnimation(container);
            } else {
                createSunnyAnimation(container, season);
            }
            break;
        case 'Clouds':
            createCloudyAnimation(container, season);
            break;
        case 'Rain':
        case 'Drizzle':
            if (temp < 2) {
                createSnowAnimation(container);
            } else {
                createRainAnimation(container, season);
            }
            break;
        case 'Thunderstorm':
            createHeavyRainAnimation(container);
            break;
        case 'Snow':
            if (weatherData.wind.speed > 8) {
                createBlizzardAnimation(container);
            } else {
                createSnowAnimation(container);
            }
            break;
        case 'Mist':
        case 'Fog':
        case 'Haze':
            createCloudyAnimation(container, season);
            break;
        default:
            createDefaultAnimation(container, season);
    }
}

/**
 * Determine season based on month and temperature
 * @param {number} month - Current month (0-11)
 * @param {number} temp - Current temperature
 * @returns {string} - Season name
 */
function determineSeason(month, temp) {
    // Basic season determination by month
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

/**
 * Create sunny day animation
 * @param {HTMLElement} container - Container element
 * @param {string} season - Current season
 */
function createSunnyAnimation(container, season) {
    const sun = document.createElement('div');
    sun.className = 'sun';
    container.appendChild(sun);
    
    // Add seasonal elements
    if (season === 'spring') {
        createSpringFlowers(container);
    } else if (season === 'autumn') {
        createFallingLeaves(container);
    }
}

/**
 * Create summer sunny day animation with heat waves
 * @param {HTMLElement} container - Container element
 */
function createSummerSunnyAnimation(container) {
    const sun = document.createElement('div');
    sun.className = 'strong-sun';
    container.appendChild(sun);
    
    // Add heat waves
    for (let i = 0; i < 3; i++) {
        const heatWave = document.createElement('div');
        heatWave.className = 'heat-wave';
        container.appendChild(heatWave);
    }
}

/**
 * Create cloudy animation
 * @param {HTMLElement} container - Container element
 * @param {string} season - Current season
 */
function createCloudyAnimation(container, season) {
    const cloud = document.createElement('div');
    cloud.className = 'weather-cloud';
    container.appendChild(cloud);
    
    // Add seasonal elements
    if (season === 'spring') {
        createSpringFlowers(container);
    } else if (season === 'autumn') {
        createFallingLeaves(container);
    }
}

/**
 * Create light rain animation
 * @param {HTMLElement} container - Container element
 * @param {string} season - Current season
 */
function createRainAnimation(container, season) {
    const cloud = document.createElement('div');
    cloud.className = 'weather-cloud';
    container.appendChild(cloud);
    
    const rainContainer = document.createElement('div');
    rainContainer.className = 'rain-container';
    
    // Create raindrops
    for (let i = 0; i < 15; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'raindrop';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${0.8 + Math.random() * 0.5}s`;
        raindrop.style.animationDelay = `${Math.random() * 0.5}s`;
        rainContainer.appendChild(raindrop);
    }
    
    container.appendChild(rainContainer);
    
    // Add autumn elements for medium rain in autumn
    if (season === 'autumn') {
        createMediumRain(container);
    }
}

/**
 * Create medium rain animation (autumn)
 * @param {HTMLElement} container - Container element
 */
function createMediumRain(container) {
    const rainContainer = document.createElement('div');
    rainContainer.className = 'medium-rain-container';
    
    // Create raindrops with angle
    for (let i = 0; i < 15; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'medium-raindrop';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${1 + Math.random() * 0.5}s`;
        raindrop.style.animationDelay = `${Math.random() * 0.5}s`;
        rainContainer.appendChild(raindrop);
    }
    
    container.appendChild(rainContainer);
}

/**
 * Create heavy rain animation
 * @param {HTMLElement} container - Container element
 */
function createHeavyRainAnimation(container) {
    const cloud = document.createElement('div');
    cloud.className = 'weather-cloud';
    container.appendChild(cloud);
    
    const rainContainer = document.createElement('div');
    rainContainer.className = 'heavy-rain-container';
    
    // Create many heavy raindrops
    for (let i = 0; i < 30; i++) {
        const raindrop = document.createElement('div');
        raindrop.className = 'heavy-raindrop';
        raindrop.style.left = `${Math.random() * 100}%`;
        raindrop.style.animationDuration = `${0.6 + Math.random() * 0.3}s`;
        raindrop.style.animationDelay = `${Math.random() * 0.3}s`;
        rainContainer.appendChild(raindrop);
    }
    
    container.appendChild(rainContainer);
}

/**
 * Create snow animation
 * @param {HTMLElement} container - Container element
 */
function createSnowAnimation(container) {
    const cloud = document.createElement('div');
    cloud.className = 'weather-cloud';
    container.appendChild(cloud);
    
    // Create snowflakes
    for (let i = 0; i < 20; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'snowflake';
        snowflake.style.left = `${Math.random() * 100}%`;
        snowflake.style.top = `${Math.random() * 20}%`;
        snowflake.style.width = `${4 + Math.random() * 4}px`;
        snowflake.style.height = snowflake.style.width;
        snowflake.style.animationDuration = `${2 + Math.random() * 2}s`;
        snowflake.style.animationDelay = `${Math.random()}s`;
        container.appendChild(snowflake);
    }
}

/**
 * Create blizzard animation
 * @param {HTMLElement} container - Container element
 */
function createBlizzardAnimation(container) {
    const cloud = document.createElement('div');
    cloud.className = 'weather-cloud';
    container.appendChild(cloud);
    
    const blizzardContainer = document.createElement('div');
    blizzardContainer.className = 'blizzard-container';
    
    // Create many diagonal snowflakes
    for (let i = 0; i < 40; i++) {
        const snowflake = document.createElement('div');
        snowflake.className = 'blizzard-snowflake';
        snowflake.style.left = `${Math.random() * 20}%`;
        snowflake.style.top = `${Math.random() * 30}%`;
        snowflake.style.width = `${2 + Math.random() * 3}px`;
        snowflake.style.height = snowflake.style.width;
        snowflake.style.animationDuration = `${1 + Math.random()}s`;
        snowflake.style.animationDelay = `${Math.random() * 0.5}s`;
        blizzardContainer.appendChild(snowflake);
    }
    
    container.appendChild(blizzardContainer);
}

/**
 * Create spring flowers animation
 * @param {HTMLElement} container - Container element
 */
function createSpringFlowers(container) {
    const flowerContainer = document.createElement('div');
    flowerContainer.className = 'flower-container';
    
    // Create blooming flowers
    for (let i = 0; i < 15; i++) {
        const flower = document.createElement('div');
        flower.className = 'flower';
        flower.style.left = `${Math.random() * 100}%`;
        flower.style.top = `${30 + Math.random() * 60}%`;
        flower.style.animationDelay = `${Math.random() * 5}s`;
        flowerContainer.appendChild(flower);
    }
    
    container.appendChild(flowerContainer);
}

/**
 * Create falling leaves animation
 * @param {HTMLElement} container - Container element
 */
function createFallingLeaves(container) {
    const leafContainer = document.createElement('div');
    leafContainer.className = 'leaf-container';
    
    // Create falling leaves
    for (let i = 0; i < 10; i++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.style.left = `${Math.random() * 100}%`;
        leaf.style.top = '-5%';
        leaf.style.animationDelay = `${Math.random() * 5}s`;
        leafContainer.appendChild(leaf);
    }
    
    container.appendChild(leafContainer);
}

/**
 * Create default animation based on season
 * @param {HTMLElement} container - Container element
 * @param {string} season - Current season
 */
function createDefaultAnimation(container, season) {
    switch(season) {
        case 'spring':
            createSunnyAnimation(container, 'spring');
            break;
        case 'summer':
            createSummerSunnyAnimation(container);
            break;
        case 'autumn':
            createCloudyAnimation(container, 'autumn');
            break;
        case 'winter':
            createSnowAnimation(container);
            break;
        default:
            createSunnyAnimation(container, 'spring');
    }
}