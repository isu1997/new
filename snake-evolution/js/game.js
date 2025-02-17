// game.js
import { gameUtils } from './utils.js';

class Game {
    constructor(canvasId) {
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
         this.baseGameSpeed = 200; // מהירות התחלתית איטית יותר
        this.gameSpeed = this.baseGameSpeed;
        this.inputDirection = { x: 0, y: 0 };
        this.lastInputDirection = { x: 0, y: 0 };

        // Bind methods
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.gameLoop = this.gameLoop.bind(this);
        this.update = this.update.bind(this);
        this.render = this.render.bind(this);
        this.startGame = this.startGame.bind(this);
        this.resetGame = this.resetGame.bind(this);
        this.generateFood = this.generateFood.bind(this);
        this.resetGameState = this.resetGameState.bind(this);

        // Initialize
        this.init();

        document.getElementById('playAgain').addEventListener('click', () => {
        document.getElementById('gameOver').style.display = 'none';
        this.resetGame();
        this.startGame();
    });

    document.getElementById('backToMenu').addEventListener('click', () => {
        document.getElementById('gameOver').style.display = 'none';
        document.getElementById('gameContainer').style.display = 'flex';
        document.getElementById('startGame').style.display = 'block';
        this.resetGame();
    });
    }

    init() {
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        this.setupEventListeners();
        this.resetGameState();
    }

    setupEventListeners() {
        document.addEventListener('keydown', this.handleKeyPress);
        const startButton = document.getElementById('startGame');
        if (startButton) {
            startButton.addEventListener('click', this.startGame);
        }
    }

    resizeCanvas() {
        const minDimension = Math.min(window.innerWidth, window.innerHeight) * 0.8;
        this.canvas.width = minDimension;
        this.canvas.height = minDimension;
        this.cellSize = Math.floor(minDimension / this.gridSize);
    }

    startGame() {
        if (!this.isStarted) {
            console.log('Starting game...');
            this.isStarted = true;
            this.resetGameState();
            document.getElementById('startGame').style.display = 'none';
            this.lastRenderTime = 0;
            requestAnimationFrame(this.gameLoop);
            // SoundEffects.stopBackgroundMusic();
        }
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
        this.powerUp = null;
        this.inputDirection = { x: 0, y: 0 };
        this.lastInputDirection = { x: 0, y: 0 };
        this.isGameOver = false;
        
        // Update UI
        document.getElementById('score').textContent = '0';
        document.getElementById('level').textContent = '1';
    }

    resetGame() {
        this.isStarted = false;
        this.resetGameState();
        document.getElementById('startGame').style.display = 'block';
        document.getElementById('gameOver').style.display = 'none';
    }

    generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * this.gridSize),
                y: Math.floor(Math.random() * this.gridSize)
            };
        } while (this.snake.body.some(segment => 
            segment.x === newFood.x && segment.y === newFood.y));
        this.food = newFood;
    }

    gameLoop(currentTime) {
        if (!this.isStarted || this.isPaused) return;

        window.requestAnimationFrame(this.gameLoop);

        const secondsSinceLastRender = (currentTime - this.lastRenderTime) / 1000;
        if (secondsSinceLastRender < this.gameSpeed / 1000) return;

        this.lastRenderTime = currentTime;
        this.update();
        this.render();
    }

    update() {
        // Update snake direction
        if (this.inputDirection.x !== 0 || this.inputDirection.y !== 0) {
            this.snake.direction = this.inputDirection;
            this.lastInputDirection = this.inputDirection;
        }

        // Move snake
        const newHead = {
            x: this.snake.body[0].x + this.snake.direction.x,
            y: this.snake.body[0].y + this.snake.direction.y
        };

        this.snake.body.unshift(newHead);

        // Check for food collision
        if (this.hasEatenFood()) {
            this.handleFoodCollision();
        } else {
            this.snake.body.pop();
        }

        // Check for collisions
        this.checkCollisions();
    }

    hasEatenFood() {
        const head = this.snake.body[0];
        return head.x === this.food.x && head.y === this.food.y;
    }

    handleFoodCollision() {
    this.score += 10 * this.level;
    document.getElementById('score').textContent = this.score;
    // SoundEffects.play('food');  // אפקט אכילה
    this.generateFood();
    this.updateLevel();
}

    checkCollisions() {
        const head = this.snake.body[0];
        
        // Wall collision
        if (head.x < 0 || head.x >= this.gridSize || 
            head.y < 0 || head.y >= this.gridSize) {
            this.handleCollision();
            return;
        }

        // Self collision
        for (let i = 1; i < this.snake.body.length; i++) {
            if (head.x === this.snake.body[i].x && 
                head.y === this.snake.body[i].y) {
                this.handleCollision();
                return;
            }
        }
    }

    handleCollision() {
    // SoundEffects.play('collision');
    this.lives--;
    
    // עדכון הלבבות
    const hearts = document.querySelectorAll('.lives .heart');
    for (let i = 0; i < hearts.length; i++) {
        if (i < this.lives) {
            hearts[i].style.display = 'inline';
        } else {
            hearts[i].style.display = 'none';
        }
    }
    
    if (this.lives <= 0) {
        this.gameOver();
    } else {
        this.resetSnakePosition();
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
        this.inputDirection = { x: 0, y: 0 };
        this.lastInputDirection = { x: 0, y: 0 };
    }

    updateLevel() {
    const newLevel = Math.floor(this.score / 100) + 1;
    if (newLevel > this.level) {
        this.level = newLevel;
        this.gameSpeed = Math.max(this.baseGameSpeed * 0.95 ** (this.level - 1), 100);
        document.getElementById('level').textContent = this.level;
        // SoundEffects.play('levelUp');  // אפקט עלייה רמה
    }
}

    gameOver() {
        this.isGameOver = true;
        this.isStarted = false;
        // SoundEffects.play('gameOver');
        // SoundEffects.startBackgroundMusic();
        
        // Show game over screen
        document.getElementById('gameOver').style.display = 'flex';
        document.getElementById('finalScore').textContent = this.score;
        document.getElementById('finalLevel').textContent = this.level;
        
        // Save high score
        gameUtils.saveHighScore(this.score, this.level);
    }

    render() {
        // Clear canvas
        this.ctx.fillStyle = '#1a1b26';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw snake
        this.ctx.fillStyle = '#4ade80';
        this.snake.body.forEach(segment => {
            this.ctx.fillRect(
                segment.x * this.cellSize,
                segment.y * this.cellSize,
                this.cellSize - 1,
                this.cellSize - 1
            );
        });

        // Draw food
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

    togglePause() {
        this.isPaused = !this.isPaused;
        if (!this.isPaused) {
            this.lastRenderTime = 0;
            requestAnimationFrame(this.gameLoop);
        }
    }
}

export default Game;