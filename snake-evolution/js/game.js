import { 
    playFoodSound, 
    playCollisionSound, 
    playGameOverSound, 
    playLevelUpSound,
    audioManager 
} from './audio.js';
import { gameUtils } from './utils.js';

// Mobile Controls
let gameInstance = null; // משתנה גלובלי לשמירת המופע של המשחק
let mobileControls = null; // משתנה גלובלי לשמירת אלמנט הבקרים


function initializeMobileControls() {
    if (mobileControls) {
        document.body.removeChild(mobileControls);
    }

    mobileControls = document.createElement('div');
    mobileControls.className = 'mobile-controls';
    
    // יצירת הכפתורים
    const buttonsConfig = [
    { direction: 'up', icon: 'fa-chevron-up', gridArea: 'up' },
    { direction: 'right', icon: 'fa-chevron-right', gridArea: 'right' },
    { direction: 'center', icon: 'fa-pause', gridArea: 'center' },
    { direction: 'left', icon: 'fa-chevron-left', gridArea: 'left' },
    { direction: 'down', icon: 'fa-chevron-down', gridArea: 'down' }
];

    let isDirectionLocked = false; // משתנה חדש למניעת תנועה בו-זמנית

    buttonsConfig.forEach(({ direction, icon }) => {
        const button = document.createElement('button');
        button.className = `control-btn ${direction}`;
        button.innerHTML = `<i class="fas ${icon}"></i>`;
        
        // הוספת מאזיני אירועים
        ['touchstart', 'mousedown'].forEach(eventType => {
            button.addEventListener(eventType, (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                if (direction === 'center') {
                    if (gameInstance) {
                        gameInstance.togglePause();
                        // עדכון האייקון בהתאם למצב המשחק
                        const iconElement = button.querySelector('i');
                        iconElement.className = `fas ${gameInstance.isPaused ? 'fa-play' : 'fa-pause'}`;
                    }
                } else {
                    if (gameInstance && !isDirectionLocked) {
                        isDirectionLocked = true;
                        gameInstance.handleDirectionChange(direction);
                        // שחרור הנעילה אחרי זמן קצר
                        setTimeout(() => {
                            isDirectionLocked = false;
                        }, 100);
                    }
                }
            }, { passive: false });
        });

        // שחרור הנעילה כשמרימים את האצבע/עכבר
        ['touchend', 'mouseup'].forEach(eventType => {
            button.addEventListener(eventType, () => {
                isDirectionLocked = false;
            });
        });
        
        mobileControls.appendChild(button);
    });

    document.body.appendChild(mobileControls);

    // בדיקה אם זה מכשיר מובייל
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        mobileControls.style.display = 'grid';
    }

    document.body.appendChild(mobileControls);

    // הוספת טיפול בשינוי אוריינטציה
    window.addEventListener('orientationchange', () => {
        if (isMobile) {
            setTimeout(() => {
                mobileControls.style.display = 'grid';
            }, 100);
        }
    });
}

// יצירת המשחק
class Game {
    constructor(canvasId) {
        // Core properties
        // יצירת ה-canvas אם הוא לא קיים
        if (!document.getElementById(canvasId)) {
            const canvas = document.createElement('canvas');
            canvas.id = canvasId;
            canvas.className = 'game-canvas';
            // הוספת ה-canvas למשחק באזור המתאים
            const gameContainer = document.createElement('div');
            gameContainer.className = 'game-container';
            gameContainer.appendChild(canvas);
            document.body.appendChild(gameContainer);
        }

        // Core properties
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.gridSize = 20;
        this.cellSize = 0;
        
        // Game state
        this.snake = null;
        this.food = null;
        this.powerUp = null;
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.isPaused = false;
        this.isGameOver = false;
        this.isStarted = false;
        this.lastRenderTime = 0;
        this.baseGameSpeed = 300; // מהירות התחלתית איטית יותר
        this.gameSpeed = this.baseGameSpeed;
        this.inputDirection = { x: 0, y: 0 };
        this.lastInputDirection = { x: 0, y: 0 };

        // Bind methods
        this.startGame = this.startGame.bind(this);
        this.resetGameState = this.resetGameState.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.handleKeyPress = this.handleKeyPress.bind(this);

        // Initialize
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        document.addEventListener('keydown', this.handleKeyPress);

        // Set initial direction
        this.snake = {
            body: [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 }
            ],
            direction: { x: 1, y: 0 }
        };

        // Add button handlers initialization
        this.initializeButtons();
    }

    initializeButtons() {
        // Play Again button
        document.getElementById('playAgain')?.addEventListener('click', () => {
            document.getElementById('gameOver').style.display = 'none';
            this.resetGameState();
            this.isGameOver = false;
            this.isStarted = true;
            this.lastRenderTime = 0;
            requestAnimationFrame(this.gameLoop);
        });

        // Back to Menu button
        document.getElementById('backToMenu')?.addEventListener('click', () => {
            document.getElementById('gameOver').style.display = 'none';
            document.getElementById('startGame').style.display = 'block';
            this.isGameOver = false;
            this.isStarted = false;
            this.resetGameState();
            audioManager.startBackgroundMusic();
        });
    }

    resetGameState() {
        this.snake = {
            body: [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 }
            ],
            direction: { x: 1, y: 0 }
        };
        
        this.score = 0;
        this.level = 1;
        this.lives = 3;
        this.gameSpeed = this.baseGameSpeed;
        this.generateFood();
        
        // איפוס כיוון
        this.inputDirection = { x: 0, y: 0 };
        this.lastInputDirection = { x: 0, y: 0 };
        
        // עדכון תצוגה
        document.getElementById('score').textContent = '0';
        document.getElementById('level').textContent = '1';
        
        // איפוס לבבות
        const hearts = document.querySelectorAll('.lives .heart');
        hearts.forEach(heart => {
            heart.style.visibility = 'visible';
        });
    }

    generateFood() {
    if (!this.snake || !this.snake.body) return; // בדיקת הגנה

    let newFood;
    let attempts = 0;
    const maxAttempts = 50; // הגבלת מספר הניסיונות

    do {
        newFood = {
            x: Math.floor(Math.random() * this.gridSize),
            y: Math.floor(Math.random() * this.gridSize)
        };
        attempts++;
    } while (
        attempts < maxAttempts && 
        this.snake.body.some(segment => segment.x === newFood.x && segment.y === newFood.y)
    );

    if (attempts < maxAttempts) {
        this.food = newFood;
    } else {
        console.warn('Could not generate food after max attempts');
    }
}

    startGame() {
        if (!this.isStarted) {
        console.log('Starting game...');
        this.isStarted = true;
        this.resetGameState();
        
        // וידוא שה-canvas מוצג
        const canvas = document.getElementById('gameCanvas');
        if (canvas) {
            canvas.style.display = 'block';
            canvas.style.visibility = 'visible';
        }
        
        document.getElementById('startGame').style.display = 'none';
        audioManager.stopBackgroundMusic();
        this.lastRenderTime = 0;
        requestAnimationFrame(this.gameLoop);
    }
    }

    checkHeartBonus() {
    if (this.score > 0 && this.score % 500 === 0 && this.lives < 3) {
        this.lives++;
        // עדכון תצוגת הלבבות
        const hearts = document.querySelectorAll('.lives .heart');
        Array.from(hearts).forEach((heart, index) => {
            heart.style.visibility = index < this.lives ? 'visible' : 'hidden';
        });
    }
}

    eatFood() {
    playFoodSound();
    this.score += 10 * this.level;
    document.getElementById('score').textContent = this.score;
    this.generateFood();
    this.updateLevel();
    this.checkHeartBonus(); // קריאה לבדיקת בונוס לבבות
}

handleCollision() {
    if (this.isGameOver) return; // מניעת קריאות כפולות
    
    playCollisionSound();
    this.lives--;
    
    // עדכון תצוגת הלבבות
    const hearts = document.querySelectorAll('.lives .heart');
    Array.from(hearts).forEach((heart, index) => {
        heart.style.visibility = index < this.lives ? 'visible' : 'hidden';
    });
    
    if (this.lives <= 0) {
        this.isGameOver = true;
        this.isStarted = false;
        cancelAnimationFrame(this.animationFrameId);
        
        // מעכבים את הצגת מסך הסיום
        setTimeout(() => {
            this.gameOver();
        }, 1000);
    } else {
        this.resetSnakePosition();
    }
}

// להוסיף את הפונקציה החדשה הזו
stopGame() {
    this.isGameOver = true;
    this.isStarted = false;
    if (this.animationFrameId) {
        cancelAnimationFrame(this.animationFrameId);
    }
}

    hasEatenFood() {
        const head = this.snake.body[0];
        return this.food && head.x === this.food.x && head.y === this.food.y;
    }

    gameOver() {
    console.log('Starting gameOver function');
    
    playGameOverSound();
    this.isGameOver = true;
    this.isStarted = false;
    
    // עדכון התצוגה
    const gameOverElement = document.getElementById('gameOver');
    const gameContainer = document.getElementById('gameContainer');
    
    if (gameOverElement && gameContainer) {
        // וידוא שה-container מוצג
        gameContainer.style.display = 'flex';
        // הצגת מסך הסיום
        gameOverElement.style.display = 'flex';
        
        // עדכון הסטטיסטיקות
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
    }
    
    gameUtils.saveHighScore(this.score, this.level);
}


    updateLevel() {
    const newLevel = Math.floor(this.score / 100) + 1;
    if (newLevel > this.level) {
        this.level = newLevel;
        document.getElementById('level').textContent = this.level;
        playLevelUpSound();
        
        // נגביר את המהירות (נקטין את ה-gameSpeed) בכל רמה
        this.gameSpeed = Math.min(this.baseGameSpeed * 0.95 ** (this.level - 1), 100);
        console.log('Current level:', this.level, 'New game speed:', this.gameSpeed);
    }
}

    resizeCanvas() {
    const isMobile = window.innerWidth <= 768;
    
    if (isMobile) {
        const minDimension = Math.min(window.innerWidth * 0.95, window.innerHeight * 0.7);
        this.canvas.width = minDimension;
        this.canvas.height = minDimension;
    } else {
        const minDimension = Math.min(window.innerWidth, window.innerHeight) * 0.8;
        this.canvas.width = minDimension;
        this.canvas.height = minDimension;
    }
    
    this.cellSize = Math.floor(this.canvas.width / this.gridSize);
    
    // מיד אחרי שינוי הגודל, נצייר מחדש
    if (this.isStarted && !this.isGameOver) {
        this.render();
    }
}

    gameLoop(currentTime) {
    if (!this.isStarted || this.isPaused || this.isGameOver) {
        return;
    }

    window.requestAnimationFrame(this.gameLoop);

    const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
    if (secondsSinceLastRender < this.gameSpeed / 1000) {
        return;
    }

    this.lastRenderTime = currentTime;
    this.update();
    this.render();
}

    update() {
        // Update snake direction from input
        if (this.inputDirection.x !== 0 || this.inputDirection.y !== 0) {
            this.snake.direction = this.inputDirection;
            this.lastInputDirection = this.inputDirection;
        }

        this.updateSnake();
        this.checkCollisions();
    }

    checkCollisions() {
        const head = this.snake.body[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
            this.handleCollision();
            return;
        }

        // Self collision
        for (let i = 1; i < this.snake.body.length; i++) {
            if (head.x === this.snake.body[i].x && head.y === this.snake.body[i].y) {
                this.handleCollision();
                return;
            }
        }
    }

    updateSnake() {
        const newHead = {
            x: this.snake.body[0].x + this.snake.direction.x,
            y: this.snake.body[0].y + this.snake.direction.y
        };

        this.snake.body.unshift(newHead);

        if (this.hasEatenFood()) {
            this.eatFood();
        } else {
            this.snake.body.pop();
        }
    }

    render() {
    if (!this.ctx || !this.canvas) return;
    
    // ניקוי ה-canvas
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // וידוא שה-canvas גלוי
    this.canvas.style.visibility = 'visible';
    this.canvas.style.display = 'block';
    
    // ציור הרקע
    this.ctx.fillStyle = '#1a1b26';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // ציור הנחש
    this.ctx.fillStyle = '#4ade80';
    this.snake.body.forEach(segment => {
        this.ctx.fillRect(
            segment.x * this.cellSize,
            segment.y * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
        );
    });

    // ציור האוכל
    if (this.food) {
        this.ctx.fillStyle = '#ef4444';
        this.ctx.fillRect(
            this.food.x * this.cellSize,
            this.food.y * this.cellSize,
            this.cellSize - 1,
            this.cellSize - 1
        );
    }
}

    handleKeyPress(event) {
        if (!this.isStarted) return;

        switch(event.key) {
            case 'ArrowUp':
                if (this.lastInputDirection.y !== 1) {
                    this.inputDirection = { x: 0, y: -1 };
                }
                break;
            case 'ArrowDown':
                if (this.lastInputDirection.y !== -1) {
                    this.inputDirection = { x: 0, y: 1 };
                }
                break;
            case 'ArrowLeft':
                if (this.lastInputDirection.x !== 1) {
                    this.inputDirection = { x: -1, y: 0 };
                }
                break;
            case 'ArrowRight':
                if (this.lastInputDirection.x !== -1) {
                    this.inputDirection = { x: 1, y: 0 };
                }
                break;
            case ' ':
                this.togglePause();
                break;
        }
    }

    handleDirectionChange(direction) {
        const directionMap = {
        'up': { x: 0, y: -1 },
        'down': { x: 0, y: 1 },
        'right': { x: 1, y: 0 },
        'left': { x: -1, y: 0 }
        };

        if (directionMap[direction] && !this.isGameOver && this.isStarted) {
            const newDirection = directionMap[direction];
            const currentDirection = this.lastInputDirection;
            
            // מניעת תנועה בכיוון ההפוך
            if (!(newDirection.x === -currentDirection.x && newDirection.y === -currentDirection.y)) {
                this.inputDirection = newDirection;
                console.log('Direction updated:', direction);
            }
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.lastRenderTime = 0;
            requestAnimationFrame(this.gameLoop);
        }
    }

    resetSnakePosition() {
        this.snake = {
            body: [
                { x: 10, y: 10 },
                { x: 9, y: 10 },
                { x: 8, y: 10 }
            ],
            direction: { x: 1, y: 0 }
        };
    }
}

// יצירה והפעלה של המשחק
window.addEventListener('load', () => {
    gameInstance = new Game('gameCanvas');
    initializeMobileControls();
    
    // הוספת טיפול במקרה של שינוי אוריינטציה
    window.addEventListener('orientationchange', () => {
        setTimeout(() => {
            if (gameInstance) {
                gameInstance.resizeCanvas();
                initializeMobileControls(); // יצירה מחדש של הכפתורים
            }
        }, 100);
    });
});

export default Game;