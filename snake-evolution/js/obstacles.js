import { config, Colors } from './constants.js';
import { gameState } from './gameState.js';
import { canvas } from './canvas.js';

// Generate obstacles for current level
export function generateObstacles() {
    console.log('Generating obstacles for level:', gameState.level);
    gameState.obstacles = [];
    const obstacleCount = calculateObstacleCount();
    
    for (let i = 0; i < obstacleCount; i++) {
        spawnObstacle();
    }
    
    console.log('Generated obstacles:', gameState.obstacles.length);
}

// Calculate number of obstacles based on level
function calculateObstacleCount() {
    return config.obstacleCount + (gameState.level - 1) * config.obstacleIncrease;
}

// Spawn single obstacle at valid position
function spawnObstacle() {
    const gridWidth = canvas.width / config.gridSize;
    const gridHeight = canvas.height / config.gridSize;
    let position;
    
    do {
        position = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (
        isPositionOccupied(position) ||
        isNearSnakeHead(position)
    );
    
    gameState.obstacles.push(position);
}

// Check if position is occupied by any game element
function isPositionOccupied(position) {
    // Check player snake
    if (gameState.snake.some(segment => 
        segment.x === position.x && segment.y === position.y)) {
        return true;
    }
    
    // Check golden snake if active
    if (gameState.level >= 7 && gameState.goldenSnake.some(segment => 
        segment.x === position.x && segment.y === position.y)) {
        return true;
    }
    
    // Check food
    if (gameState.food.x === position.x && 
        gameState.food.y === position.y) {
        return true;
    }
    
    // Check other obstacles
    return gameState.obstacles.some(obs => 
        obs.x === position.x && obs.y === position.y
    );
}

// Check if position is too close to snake head
function isNearSnakeHead(position) {
    const head = gameState.snake[0];
    const distance = Math.abs(head.x - position.x) + 
                    Math.abs(head.y - position.y);
    return distance < 3; // Minimum safe distance
}

// Draw all obstacles on canvas
export function drawObstacles(ctx) {
    // Set shadow properties for all obstacles
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 8;
    
    gameState.obstacles.forEach(obstacle => {
        drawSingleObstacle(ctx, obstacle);
    });
    
    // Reset shadow
    ctx.shadowBlur = 0;
}

// Draw single obstacle with visual effects
function drawSingleObstacle(ctx, obstacle) {
    const x = obstacle.x * config.gridSize;
    const y = obstacle.y * config.gridSize;
    
    // Create gradient
    const gradient = ctx.createLinearGradient(
        x, y, 
        x + config.gridSize, 
        y + config.gridSize
    );
    gradient.addColorStop(0, Colors.obstacle.primary);
    gradient.addColorStop(1, Colors.obstacle.secondary);
    
    ctx.fillStyle = gradient;
    
    // Draw rounded rectangle
    const roundness = 4;
    drawRoundedRect(ctx, x, y, config.gridSize, config.gridSize, roundness);
    
    // Add border effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
}

// Helper function to draw rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
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
    ctx.fill();
}

// Check if a point collides with any obstacle
export function checkObstacleCollision(point) {
    return gameState.obstacles.some(obstacle => 
        obstacle.x === point.x && obstacle.y === point.y
    );
}

// Get safe spawn position away from obstacles
export function getSafePosition() {
    const gridWidth = canvas.width / config.gridSize;
    const gridHeight = canvas.height / config.gridSize;
    let position;
    
    do {
        position = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (isPositionOccupied(position));
    
    return position;
}