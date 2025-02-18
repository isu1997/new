// utils.js
class GameUtils {
    constructor() {
        // יכולות המכשיר
        this.screenWidth = window.innerWidth;
        this.screenHeight = window.innerHeight;
        this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
        this.isLandscape = window.innerWidth > window.innerHeight;
        
        // מאזיני אירועים
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

    // פונקציות משחק
    getRandomPosition(gridSize, padding = 1, exclude = []) {
        let position;
        let attempts = 0;
        const maxAttempts = 100;

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
        return excludeList.some(pos => pos.x === position.x && pos.y === position.y);
    }

    // ניהול טבלת שיאים
    saveHighScore(score, level) {
        try {
            let leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '[]');
            const currentUser = JSON.parse(localStorage.getItem('savedUser') || '{}');
            const username = currentUser.username || 'אנונימי';

            const newScore = {
                username,
                score,
                level,
                date: new Date().toISOString()
            };

            // בדיקה אם יש כבר שיא למשתמש זה
            const existingIndex = leaderboard.findIndex(entry => entry.username === username);
            if (existingIndex !== -1) {
                if (leaderboard[existingIndex].score < score) {
                    leaderboard[existingIndex] = newScore;
                }
            } else {
                leaderboard.push(newScore);
            }

            // מיון ושמירת 10 התוצאות הטובות ביותר
            leaderboard.sort((a, b) => b.score - a.score);
            leaderboard = leaderboard.slice(0, 10);
            
            localStorage.setItem('leaderboard', JSON.stringify(leaderboard));
            this.updateLeaderboardDisplay();
            
            return leaderboard;
        } catch (error) {
            console.error('Error saving high score:', error);
            return [];
        }
    }

    updateLeaderboardDisplay() {
        try {
            const leaderboardContainer = document.getElementById('leaderboardEntries');
            const scores = JSON.parse(localStorage.getItem('leaderboard') || '[]');

            if (scores.length === 0) {
                leaderboardContainer.innerHTML = '<div class="no-scores">אין עדיין שיאים</div>';
                return;
            }

            leaderboardContainer.innerHTML = scores
                .map((entry, index) => `
                    <div class="leaderboard-entry">
                        <span class="rank">#${index + 1}</span>
                        <span class="username">${entry.username}</span>
                        <span class="score">${entry.score} נקודות</span>
                        <span class="level">רמה ${entry.level}</span>
                    </div>
                `)
                .join('');
        } catch (error) {
            console.error('Error updating leaderboard display:', error);
        }
    }

    vibrate(pattern) {
        if (this.isMobile && window.navigator.vibrate) {
            window.navigator.vibrate(pattern);
        }
    }
}

export const gameUtils = new GameUtils();