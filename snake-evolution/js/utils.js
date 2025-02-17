// utils.js
class GameUtils {
    constructor() {
        // Device and display properties
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.isLandscape = window.innerWidth > window.innerHeight;
        this.hasTouch = 'ontouchstart' in window;
        
        // Game constants
        this.LEVEL_THRESHOLDS = [
            { score: 0, level: 1, speed: 1 },
            { score: 100, level: 2, speed: 0.95 },
            { score: 300, level: 3, speed: 0.9 },
            { score: 600, level: 4, speed: 0.85 },
            { score: 1000, level: 5, speed: 0.8 },
            { score: 1500, level: 6, speed: 0.75 },
            { score: 2500, level: 7, speed: 0.7 },
            { score: 4000, level: 8, speed: 0.65 },
            { score: 6000, level: 9, speed: 0.6 },
            { score: 10000, level: 10, speed: 0.55 }
        ];

        // Color themes
        this.colorThemes = {
            default: {
                background: '#1a1b26',
                snake: '#4ade80',
                food: '#ef4444',
                ui: '#ffffff',
                grid: 'rgba(255, 255, 255, 0.05)'
            },
            dark: {
                background: '#000000',
                snake: '#00ff00',
                food: '#ff0000',
                ui: '#ffffff',
                grid: 'rgba(255, 255, 255, 0.03)'
            },
            neon: {
                background: '#0a0a0a',
                snake: '#00ffff',
                food: '#ff00ff',
                ui: '#ffffff',
                grid: 'rgba(0, 255, 255, 0.05)'
            }
        };

        this.initializeEventListeners();
    }

    updateLeaderboardDisplay() {
        const leaderboard = document.getElementById('leaderboardEntries');
        const scores = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        
        if (scores.length === 0) {
            leaderboard.innerHTML = '<div class="no-scores">עדיין אין שיאים</div>';
            return;
        }

        leaderboard.innerHTML = scores
            .map((entry, index) => `
                <div class="leaderboard-entry">
                    <span class="rank">#${index + 1}</span>
                    <span class="username">${entry.username}</span>
                    <span class="score">${entry.score} נקודות</span>
                    <span class="level">רמה ${entry.level}</span>
                </div>
            `)
            .join('');
    }

    // Event handling
    initializeEventListeners() {
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
    }

    handleResize() {
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.isLandscape = window.innerWidth > window.innerHeight;
        this.dispatchOrientationEvent();
    }

    handleOrientationChange() {
        setTimeout(() => {
            this.handleResize();
        }, 100);
    }

    dispatchOrientationEvent() {
        window.dispatchEvent(new CustomEvent('orientationChanged', {
            detail: {
                isLandscape: this.isLandscape,
                width: this.screenWidth,
                height: this.screenHeight
            }
        }));
    }

    // Game mechanics utilities
    getRandomPosition(gridSize, padding = 1, exclude = []) {
        let attempts = 0;
        const maxAttempts = 100;
        let position;

        do {
            position = {
                x: Math.floor(Math.random() * (gridSize - 2 * padding)) + padding,
                y: Math.floor(Math.random() * (gridSize - 2 * padding)) + padding
            };
            attempts++;
        } while (this.isPositionInExcludeList(position, exclude) && attempts < maxAttempts);

        return attempts < maxAttempts ? position : null;
    }

    isPositionInExcludeList(position, excludeList) {
        return excludeList.some(pos => 
            pos.x === position.x && pos.y === position.y ||
            Math.abs(pos.x - position.x) <= 1 && Math.abs(pos.y - position.y) <= 1
        );
    }

    calculateScore(basePoints, level, comboMultiplier = 1, powerUpMultiplier = 1) {
        return Math.floor(
            basePoints * 
            (1 + (level - 1) * 0.1) * 
            comboMultiplier * 
            powerUpMultiplier
        );
    }

    getLevel(score) {
        for (let i = this.LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
            if (score >= this.LEVEL_THRESHOLDS[i].score) {
                return this.LEVEL_THRESHOLDS[i];
            }
        }
        return this.LEVEL_THRESHOLDS[0];
    }

    // Virtual joystick for mobile
    createVirtualJoystick(x, y) {
        return {
            baseX: x,
            baseY: y,
            currentX: x,
            currentY: y,
            maxDistance: 50
        };
    }

    updateJoystickPosition(joystick, x, y) {
        const dx = x - joystick.baseX;
        const dy = y - joystick.baseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance > joystick.maxDistance) {
            const angle = Math.atan2(dy, dx);
            joystick.currentX = joystick.baseX + Math.cos(angle) * joystick.maxDistance;
            joystick.currentY = joystick.baseY + Math.sin(angle) * joystick.maxDistance;
        } else {
            joystick.currentX = x;
            joystick.currentY = y;
        }

        return {
            dx: (joystick.currentX - joystick.baseX) / joystick.maxDistance,
            dy: (joystick.currentY - joystick.baseY) / joystick.maxDistance
        };
    }

    // High score management
saveHighScore(score, level) {
        let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
        const currentUser = JSON.parse(localStorage.getItem('savedUser') || '{}');
        const username = currentUser.username || 'Anonymous';

        const newScore = {
            username,
            score,
            level,
            date: new Date().toISOString()
        };

        const existingIndex = leaderboard.findIndex(entry => entry.username === username);
        if (existingIndex !== -1) {
            if (leaderboard[existingIndex].score < score) {
                leaderboard[existingIndex] = newScore;
            }
        } else {
            leaderboard.push(newScore);
        }

        leaderboard.sort((a, b) => b.score - a.score);
        leaderboard = leaderboard.slice(0, 10);
        
        localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
        this.updateLeaderboardDisplay();
    }

    getLeaderboard() {
        return JSON.parse(localStorage.getItem('leaderboard') || '[]');
    }

    // Mobile device utilities
    vibrate(pattern) {
        if (this.isMobile && window.navigator.vibrate) {
            window.navigator.vibrate(pattern);
        }
    }

    // Color utilities
    getLevelColors(level) {
        const theme = this.colorThemes.default;
        if (level > 5) {
            return {
                ...theme,
                snake: this.createGradient(theme.snake),
                food: this.addGlow(theme.food)
            };
        }
        return theme;
    }

    createGradient(color) {
        return {
            type: 'gradient',
            color: color,
            stops: [
                { offset: 0, color: color },
                { offset: 1, color: this.adjustColorBrightness(color, -0.3) }
            ]
        };
    }

    addGlow(color) {
        return {
            type: 'glow',
            color: color,
            blur: '10px',
            spread: '2px'
        };
    }

    adjustColorBrightness(color, factor) {
        const rgb = this.hexToRgb(color);
        if (!rgb) return color;

        const newRgb = Object.entries(rgb).reduce((acc, [key, value]) => {
            acc[key] = Math.max(0, Math.min(255, value + (factor * 255)));
            return acc;
        }, {});

        return `rgb(${newRgb.r}, ${newRgb.g}, ${newRgb.b})`;
    }

    hexToRgb(hex) {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    }

    // Performance utilities
    throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    debounce(func, wait) {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    }
}

export const gameUtils = new GameUtils();