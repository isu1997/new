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

// Game initialization
function initGame() {
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

// Handle game start
function handleGameStart() {
    console.log("Starting new game");
    resetGameState();
    generateObstacles();
    spawnFood();
    startGame();
}

// Set up game event listeners
function setupEventListeners() {
    document.addEventListener('gameStart', handleGameStart);
    document.addEventListener('gameRestart', handleRestart);
    document.addEventListener('goldenSnakeCollision', handleGoldenSnakeCollision);
    
    window.addEventListener('unload', cleanup);
}

// Main game update loop
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

// Start game loop
function startGame() {
    if (gameState.gameLoop) {
        clearInterval(gameState.gameLoop);
    }
    
    const speed = getCurrentSpeed();
    gameState.gameLoop = setInterval(update, Math.max(speed, 50));
    draw();
}

// Handle game over
function handleGameOver() {
    clearInterval(gameState.gameLoop);
    showGameOver();
    
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
    }
    
    handleRestart();
}

// Handle level up
export function handleLevelUp() {
    console.log('Level up! Current level:', gameState.level, 'New level:', gameState.level + 1);
    clearInterval(gameState.gameLoop);
    
    // עדכון הרמה
    gameState.level++;
    
    // הפעלת הנחש הזהב ברמה 7
    if (gameState.level === 7) {
        const gridWidth = Math.floor(canvas.width / config.gridSize);
        gameState.goldenSnake = [
            { x: gridWidth - 5, y: gridWidth - 5 },
            { x: gridWidth - 4, y: gridWidth - 5 },
            { x: gridWidth - 3, y: gridWidth - 5 }
        ];
        console.log('Golden snake activated!', gameState.goldenSnake);
    }
    
    // עדכון מכשולים
    generateObstacles();
    
    // עדכון מהירות
    const speed = getCurrentSpeed();
    gameState.gameLoop = setInterval(update, Math.max(speed, 50));
}

// Handle game restart
function handleRestart() {
    clearInterval(gameState.gameLoop);
    resetGameState();
    generateObstacles();
    spawnFood();
    updateUI();
    startGame();
}

// Handle golden snake collision
function handleGoldenSnakeCollision() {
    gameState.hearts--;
    updateUI();
    
    if (gameState.hearts <= 0) {
        handleGameOver();
    }
}

// Clean up game resources
function cleanup() {
    clearInterval(gameState.gameLoop);
    cleanupControls();
    cleanupUI();
    
    document.removeEventListener('gameStart', startGame);
    document.removeEventListener('gameRestart', handleRestart);
    document.removeEventListener('goldenSnakeCollision', handleGoldenSnakeCollision);
}

// Start the game when the page loads
window.addEventListener('load', initGame);