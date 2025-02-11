const API_KEY = '620970db4507c0a15af21ceef9ee5cb3';
const URL = `https://api.openweathermap.org/data/2.5/weather?units=metric&appid=${API_KEY}&q=`;

const q = document.getElementById("inputCity");
const button = document.querySelector("button");
const h1 = document.getElementById("city");
const temp = document.getElementById("temp");
const description = document.getElementById("description");
const weatherIcon = document.getElementById("weatherIcon");
const errorMessage = document.getElementById("errorMessage");

async function getWeather(city) {
    try {
        const response = await fetch(URL + city);
        const data = await response.json();
        
        if (data.cod === 200) {
            sessionStorage.setItem('lastCity', city);
            await getForecast(city); // מביא את התחזית רק אם העיר נמצאה
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

function displayWeather(weatherData) {
    if (weatherData.cod === 200) {
        // ניקוי הודעת שגיאה
        errorMessage.innerText = "";

        // הצגת נתוני מזג אוויר בסיסיים
        h1.innerText = weatherData.name;
        temp.innerText = Math.round(weatherData.main.temp) + "°C";
        description.innerText = weatherData.weather[0].description;
        weatherIcon.src = `https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`;
        weatherIcon.alt = weatherData.name;

        // הצגת נתונים נוספים
        document.getElementById('humidity').innerText = `${weatherData.main.humidity}%`;
        document.getElementById('wind').innerText = `${weatherData.wind.speed} m/s`;

        // המרת זמני זריחה ושקיעה
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

        // עדכון הרקע לפי מזג האוויר
        const weatherType = weatherData.weather[0].main.toLowerCase();
        changeBackground(weatherType);
    } else {
        // ניקוי כל השדות במקרה של שגיאה
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
        
        // ניקוי התחזית
        const forecastContainer = document.getElementById('forecast-container');
        if (forecastContainer) {
            forecastContainer.innerHTML = '';
        }
    }
}

// פונקציה לשינוי הרקע
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

// פונקציה לקבלת תחזית 5 ימים
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

// פונקציה להצגת התחזית
function displayForecast(forecastData) {
    const container = document.getElementById('forecast-container');
    container.innerHTML = '';
    
    // סינון התחזית ל-12:00 בכל יום (5 ימים)
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

// פונקציה לטיפול בחיפוש
function handleCitySearch() {
    const cityName = q.value.trim();
    if (cityName) {
        getWeather(cityName);
    }
}

// בדיקה בטעינת הדף אם יש עיר שמורה
document.addEventListener('DOMContentLoaded', () => {
    const lastCity = sessionStorage.getItem('lastCity');
    if (lastCity) {
        q.value = lastCity;
        getWeather(lastCity);
    }
});

// האזנה לאירועים
button.addEventListener("click", handleCitySearch);

// האזנה ללחיצה על Enter
q.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        handleCitySearch();
    }
});