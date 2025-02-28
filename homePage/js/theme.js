// theme.js - Global theme manager for light/dark mode functionality

(function() {
    // Retrieve saved theme preference or default to light mode
    const savedTheme = localStorage.getItem('theme') || 'light';
    
    // Apply saved theme to body element on initial load
    document.body.className = savedTheme;
    
    // Global theme toggle function - accessible from window object
    window.toggleTheme = function() {
        const isDark = document.body.classList.contains('dark');
        
        if (isDark) {
            // Switch to light theme
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            localStorage.setItem('theme', 'light');
            
            // Update all theme toggle buttons to show moon icon
            const themeToggles = document.querySelectorAll('.theme-toggle');
            themeToggles.forEach(toggle => {
                toggle.textContent = '🌙';
            });
        } else {
            // Switch to dark theme
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            
            // Update all theme toggle buttons to show sun icon
            const themeToggles = document.querySelectorAll('.theme-toggle');
            themeToggles.forEach(toggle => {
                toggle.textContent = '🌞';
            });
        }
    };
    
    // Initialize theme toggle buttons on page load
    document.addEventListener('DOMContentLoaded', function() {
        const themeToggles = document.querySelectorAll('.theme-toggle');
        
        themeToggles.forEach(toggle => {
            // Set initial icon based on current theme
            toggle.textContent = savedTheme === 'dark' ? '🌞' : '🌙';
            
            // Attach click handler to each theme toggle button
            toggle.addEventListener('click', window.toggleTheme);
        });
    });
})();
