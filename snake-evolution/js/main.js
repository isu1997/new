// main.js
import { config } from './constants.js';
import { gameState, resetGameState, getCurrentSpeed } from './gameState.js';
import { moveSnake } from './snake.js';
import { moveGoldenSnake } from './goldenSnake.js';
import { generateObstacles } from './obstacles.js';
import { spawnFood } from './food.js';
import { canvas, initCanvas, draw } from './canvas.js';
import { initControls, cleanup as cleanupControls } from './controls.js';
import { 
    initUI, 
    updateUI,
    showGameOver, 
    cleanup as cleanupUI 
} from './ui.js';

// Adjusts game objects size based on screen orientation
function adjustGameObjectsSize() {
    const isLandscape = window.innerWidth > window.innerHeight;
    
    // Update object sizes when device is in landscape mode
    if (isLandscape && window.innerWidth <= 926) { // Only for mobile in landscape
        // Reduce grid size by 15%
        config.gridSize = Math.floor(config.originalGridSize * 0.85);
    } else {
        // Restore original size
        config.gridSize = config.originalGridSize;
    }
    
    // Reinitialize canvas and redraw with new sizes
    if (canvas) {
        initCanvas();
        draw();
    }
}

// Initializes game components and saves reference sizes
function initGame() {
    // Store original grid size for responsive calculations
    if (!config.originalGridSize) {
        config.originalGridSize = config.gridSize;
    }
    
    // Check initial screen orientation and adjust sizes
    adjustGameObjectsSize();
    
    // Initialize canvas first
    initCanvas();
    console.log("Canvas initialized");
    
    // Initialize other systems
    initControls();
    console.log("Controls initialized");
    
    // Initialize UI last
    initUI();
    console.log("UI initialized");
    
    // Set up event listeners
    setupEventListeners();
}

// Handles game start by resetting state and initializing game elements
function handleGameStart() {
    console.log("Starting new game");
    resetGameState();
    generateObstacles();
    spawnFood();
    startGame();
}

// Sets up all event listeners for game interaction
function setupEventListeners() {
    document.addEventListener('gameStart', handleGameStart);
    document.addEventListener('gameRestart', handleRestart);
    document.addEventListener('goldenSnakeCollision', handleGoldenSnakeCollision);
    
    // Add listener for screen orientation changes
    window.addEventListener('resize', adjustGameObjectsSize);
    
    window.addEventListener('unload', cleanup);
}

// Main game loop that updates game state and UI each frame
function update() {
    if (gameState.isPaused) return;
    
    // Move player snake
    const isGameOver = moveSnake();
    if (isGameOver) {
        handleGameOver();
        return;
    }
    
    // Move golden snake if active
    if (gameState.level >= 7 && gameState.goldenSnake.length > 0) {
        console.log('Moving golden snake at level', gameState.level);
        moveGoldenSnake();
    }
    
    // Update display
    draw();
    updateUI();
}

// Starts game loop with appropriate speed based on level
function startGame() {
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
    }
    
    const speed = getCurrentSpeed();
    gameState.gameLoop = setInterval(update, Math.max(speed, 50));
    draw();
}

// Handles game over state, saves high score, and prepares for restart
function handleGameOver() {
    clearInterval(gameState.gameLoop);
    showGameOver();
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
    }
    
    handleRestart();
}

// Handles level progression and introduces new game elements at higher levels
export function handleLevelUp() {
    console.log('Level up! Current level:', gameState.level, 'New level:', gameState.level + 1);
    clearInterval(gameState.gameLoop);
    
    // Level update
    gameState.level++;
    
    // Activate the Golden Snake at level 7
    if (gameState.level === 7) {
        const gridWidth = Math.floor(canvas.width / config.gridSize);
        gameState.goldenSnake = [
            { x: gridWidth - 5, y: gridWidth - 5 },
            { x: gridWidth - 4, y: gridWidth - 5 },
            { x: gridWidth - 3, y: gridWidth - 5 }
        ];
        console.log('Golden snake activated!', gameState.goldenSnake);
    }
    
    // Obstacles update
    generateObstacles();
    
    // Speed update
    const speed = getCurrentSpeed();
    gameState.gameLoop = setInterval(update, Math.max(speed, 50));
}

// Restarts the game by resetting state and reinitializing game elements
function handleRestart() {
    clearInterval(gameState.gameLoop);
    resetGameState();
    generateObstacles();
    spawnFood();
    updateUI();
    startGame();
}

// Handles collision with golden snake and checks for game over condition
function handleGoldenSnakeCollision() {
    gameState.hearts--;
    updateUI();
    
    if (gameState.hearts <= 0) {
        handleGameOver();
    }
}

// Cleans up resources and removes event listeners when game is unloaded
function cleanup() {
    clearInterval(gameState.gameLoop);
    cleanupControls();
    cleanupUI();
    
    document.removeEventListener('gameStart', startGame);
    document.removeEventListener('gameRestart', handleRestart);
    document.removeEventListener('goldenSnakeCollision', handleGoldenSnakeCollision);
    window.removeEventListener('resize', adjustGameObjectsSize);
}

// Initialize the game when the page loads
window.addEventListener('load', initGame);