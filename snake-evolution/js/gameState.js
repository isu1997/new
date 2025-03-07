import { config, PowerUpType, Directions } from './constants.js';
import { canvas } from './canvas.js';

// Initialize game state
export let gameState = {
    snake: [],                 
    goldenSnake: [],          
    food: { x: 0, y: 0, type: PowerUpType.NONE },
    obstacles: [],            
    direction: Directions.RIGHT,
    goldenSnakeDirection: Directions.LEFT,
    hearts: config.maxHearts,
    score: 0,
    level: 1,
    gameLoop: null,          
    isPaused: false,
    isPlayerFrozen: false,    // tracks if player snake is frozen
    isGoldenFrozen: false,    // tracks if golden snake is frozen
    highScore: localStorage.getItem('snakeHighScore') || 0
};


// Reset game state to initial values
export function resetGameState() {
    const gridWidth = Math.floor(canvas.width / config.gridSize);
    
    gameState.snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    
    // Initialize golden snake if level >= 7
    if (gameState.level >= 7) {
        gameState.goldenSnake = [
            { x: gridWidth - 5, y: gridWidth - 5 },
            { x: gridWidth - 4, y: gridWidth - 5 },
            { x: gridWidth - 3, y: gridWidth - 5 }
        ];
    } else {
        gameState.goldenSnake = [];
    }
    
    gameState.direction = Directions.RIGHT;
    gameState.goldenSnakeDirection = Directions.LEFT;
    gameState.hearts = config.maxHearts;
    gameState.score = 0;
    gameState.level = 1;
    gameState.isPaused = false;
}

// Update score and check for level up
export function updateScore(points) {
    gameState.score += points;
    
    // Check for level up
    if (gameState.score % (config.pointsPerFood * 10) === 0) {
        if (gameState.level < config.maxLevel) {
            levelUp();
        }
    }
    
    // Update high score if needed
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
    }
}

// Handle level up
export function levelUp() {
    gameState.level++;
    
    // Initialize golden snake at level 7
    if (gameState.level === 7) {
        const gridWidth = Math.floor(canvas.width / config.gridSize);
        gameState.goldenSnake = [
            { x: gridWidth - 5, y: gridWidth - 5 },
            { x: gridWidth - 4, y: gridWidth - 5 },
            { x: gridWidth - 3, y: gridWidth - 5 }
        ];
        console.log('Golden snake activated at level 7!', gameState.goldenSnake);
    } else if (gameState.level > 7) {
        // Reinitialize golden snake if it's been eaten
        reinitializeGoldenSnake();
    }
}

// Handle collision damage
export function takeDamage() {
    gameState.hearts--;
    return gameState.hearts <= 0;
}

// Get current game speed based on level
export function getCurrentSpeed() {
    return Math.max(
        config.initialSpeed - (gameState.level - 1) * config.speedIncrease,
        50
    );
}

// Toggle pause state
export function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    return gameState.isPaused;
}

// Check if golden snake is active
export function isGoldenSnakeActive() {
    return gameState.level >= 7;
}

// Reinitialize golden snake if it should exist but doesn't
export function reinitializeGoldenSnake() {
    // Only reinitialize if we're at level 7+ and the snake doesn't exist
    if (isGoldenSnakeActive() && gameState.goldenSnake.length === 0) {
        console.log('Reinitializing golden snake');
        
        const gridWidth = Math.floor(canvas.width / config.gridSize);
        const gridHeight = Math.floor(canvas.height / config.gridSize);
        
        // Find a position away from the player snake
        let x, y;
        let validPosition = false;
        
        while (!validPosition) {
            // Generate random position
            x = Math.floor(Math.random() * (gridWidth - 10)) + 5;
            y = Math.floor(Math.random() * (gridHeight - 10)) + 5;
            
            // Make sure it's not too close to player snake
            validPosition = !gameState.snake.some(segment => 
                Math.abs(segment.x - x) < 5 && Math.abs(segment.y - y) < 5
            );
            
            // Make sure it's not on an obstacle
            if (validPosition) {
                validPosition = !gameState.obstacles.some(obstacle =>
                    obstacle.x === x && obstacle.y === y
                );
            }
        }
        
        // Create new golden snake
        gameState.goldenSnake = [
            { x: x, y: y },
            { x: x - 1, y: y },
            { x: x - 2, y: y }
        ];
        
        // Set random direction
        const directions = [Directions.UP, Directions.DOWN, Directions.LEFT, Directions.RIGHT];
        gameState.goldenSnakeDirection = directions[Math.floor(Math.random() * directions.length)];
    }
}