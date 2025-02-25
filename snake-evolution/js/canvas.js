import { config } from './constants.js';
import { gameState } from './gameState.js';
import { drawSnake } from './snake.js';
import { drawGoldenSnake } from './goldenSnake.js';
import { drawFood } from './food.js';
import { drawObstacles } from './obstacles.js';

// Get canvas and context
export const canvas = document.getElementById('gameCanvas');
export const ctx = canvas.getContext('2d');

// Set up canvas size based on container
export function initCanvas() {
    setCanvasSize();
    window.addEventListener('resize', handleResize);
}

// Set canvas dimensions
export function setCanvasSize() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth - 40;  // Account for padding
    const containerHeight = container.clientHeight - 200;  // Account for UI elements
    
    // Ensure dimensions are multiples of grid size
    canvas.width = Math.floor(containerWidth / config.gridSize) * config.gridSize;
    canvas.height = Math.floor(containerHeight / config.gridSize) * config.gridSize;
}

// Handle window resize
function handleResize() {
    setCanvasSize();
    draw(); // Redraw game state
}

// Clear canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Main draw function
export function draw() {
    clearCanvas();
    
    // Draw game elements in correct order
    drawObstacles(ctx);
    drawFood(ctx);
    
    // Draw golden snake if active
    if (gameState.level >= 7 && gameState.goldenSnake.length > 0) {
        console.log('Drawing golden snake:', gameState.goldenSnake.length, 'segments');
        drawGoldenSnake(ctx);
    }
    
    // Draw player snake last so it appears on top
    drawSnake(ctx);
}

// Convert grid position to canvas coordinates
export function gridToCanvas(gridPos) {
    return {
        x: gridPos.x * config.gridSize,
        y: gridPos.y * config.gridSize
    };
}

// Convert canvas coordinates to grid position
export function canvasToGrid(canvasPos) {
    return {
        x: Math.floor(canvasPos.x / config.gridSize),
        y: Math.floor(canvasPos.y / config.gridSize)
    };
}

// Get current grid dimensions
export function getGridDimensions() {
    return {
        width: canvas.width / config.gridSize,
        height: canvas.height / config.gridSize
    };
}

// Draw rounded rectangle helper (used by multiple components)
export function drawRoundedRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
}

// Create gradient with shine effect
export function createShineGradient(ctx, x, y, width, height) {
    const shine = ctx.createLinearGradient(x, y, x + width, y + height);
    shine.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    shine.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
    return shine;
}

// Set glow effect
export function setGlowEffect(ctx, color, blur) {
    ctx.shadowColor = color;
    ctx.shadowBlur = blur;
}

// Reset glow effect
export function resetGlowEffect(ctx) {
    ctx.shadowBlur = 0;
    ctx.shadowColor = 'transparent';
}

// Clean up function
export function cleanup() {
    window.removeEventListener('resize', handleResize);
}