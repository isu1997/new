// Event handling functions

/**
 * Set up all event listeners
 * @param {HTMLElement} searchBtn - Search button element
 * @param {HTMLElement} resetBtn - Reset button element
 * @param {HTMLElement} cityInput - City input element
 * @param {HTMLElement} autocompleteContainer - Autocomplete container element
 */
export function setupEventListeners(searchBtn, resetBtn, cityInput, autocompleteContainer) {
    // Search button click event
    searchBtn.addEventListener('click', () => {
        const city = cityInput.value.trim();
        
        if (city) {
            window.fetchWeatherData(city);
            autocompleteContainer.style.display = 'none';
        }
    });
    
    // Enter key press event
    cityInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            const city = cityInput.value.trim();
            
            if (city) {
                window.fetchWeatherData(city);
                autocompleteContainer.style.display = 'none';
            }
        }
    });
    
    // Reset button click event
    resetBtn.addEventListener('click', () => {
        // Clear session storage and input field
        sessionStorage.removeItem('lastCity');
        sessionStorage.removeItem('searchHistory');
        cityInput.value = '';
        
        // Hide all weather containers
        document.getElementById('weather-container').classList.remove('visible');
        document.getElementById('forecast-container').classList.remove('visible');
        document.getElementById('extra-data-container').classList.remove('visible');
    });
    
    // Focus event for city input
    cityInput.addEventListener('focus', () => {
        if (autocompleteContainer.children.length > 0) {
            autocompleteContainer.style.display = 'block';
        }
    });
    
    // Blur event for city input
    cityInput.addEventListener('blur', (e) => {
        // Delay hiding the autocomplete to allow for item clicks
        setTimeout(() => {
            autocompleteContainer.style.display = 'none';
        }, 200);
    });
}

/**
 * Set up autocomplete functionality
 * @param {HTMLElement} cityInput - City input element
 * @param {HTMLElement} autocompleteContainer - Autocomplete container element
 */
export function setupAutocomplete(cityInput, autocompleteContainer) {
    // Cities list for autocomplete (can be expanded)
    const popularCities = [
        'ירושלים', 'תל אביב', 'חיפה', 'באר שבע', 'אילת',
        'נתניה', 'אשדוד', 'רמת גן', 'פתח תקווה', 'חולון',
        'בני ברק', 'רחובות', 'אשקלון', 'בת ים', 'כפר סבא',
        'הרצליה', 'מודיעין', 'רעננה', 'לוד', 'רמלה',
        'נצרת', 'קריית אתא', 'קריית גת', 'קריית ביאליק', 'קריית ים',
        'אריאל', 'נס ציונה', 'דימונה', 'קריית מוצקין', 'יבנה'
    ];
    
    // Load search history from sessionStorage
    const searchHistory = JSON.parse(sessionStorage.getItem('searchHistory')) || [];
    
    // Combine history and popular cities
    const combinedCities = [...new Set([...searchHistory, ...popularCities])];
    
    // Input event for city input
    cityInput.addEventListener('input', () => {
        const inputValue = cityInput.value.trim().toLowerCase();
        
        // Clear previous autocomplete items
        autocompleteContainer.innerHTML = '';
        
        if (inputValue.length > 1) {
            // Filter cities that match input
            const matchingCities = combinedCities.filter(city => 
                city.toLowerCase().includes(inputValue)
            );
            
            // Display matching cities
            if (matchingCities.length > 0) {
                matchingCities.slice(0, 5).forEach(city => {
                    const item = document.createElement('div');
                    item.className = 'autocomplete-item';
                    item.textContent = city;
                    
                    // Item click event
                    item.addEventListener('click', () => {
                        cityInput.value = city;
                        window.fetchWeatherData(city);
                        autocompleteContainer.style.display = 'none';
                        
                        // Add to search history
                        if (!searchHistory.includes(city)) {
                            searchHistory.unshift(city);
                            
                            // Keep only the last 10 searches
                            if (searchHistory.length > 10) {
                                searchHistory.pop();
                            }
                            
                            // Save updated history to sessionStorage
                            sessionStorage.setItem('searchHistory', JSON.stringify(searchHistory));
                        }
                    });
                    
                    autocompleteContainer.appendChild(item);
                });
                
                autocompleteContainer.style.display = 'block';
            } else {
                autocompleteContainer.style.display = 'none';
            }
        } else {
            autocompleteContainer.style.display = 'none';
        }
    });
}