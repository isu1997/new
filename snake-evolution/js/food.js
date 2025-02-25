import { config, PowerUpType, Colors } from './constants.js';
import { gameState } from './gameState.js';
import { shrinkSnake } from './snake.js';
import { handleLevelUp } from './main.js';
import { canvas } from './canvas.js';
import { sounds } from './audio.js';

// Spawn new food at random position
export function spawnFood() {
    const gridWidth = canvas.width / config.gridSize;
    const gridHeight = canvas.height / config.gridSize;
    let position;
    let attempts = 0;
    const maxAttempts = 100;
    
    do {
        position = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
        attempts++;
        
        if (attempts >= maxAttempts) {
            for (let x = 0; x < gridWidth; x++) {
                for (let y = 0; y < gridHeight; y++) {
                    if (!isPositionOccupied({x, y})) {
                        position = {x, y};
                        break;
                    }
                }
            }
            break;
        }
    } while (isPositionOccupied(position));
    
    const type = determineFoodType();
    gameState.food = { ...position, type };
}
// Check if position is occupied
function isPositionOccupied(position) {
    // Check player snake
    if (gameState.snake.some(segment => 
        segment.x === position.x && segment.y === position.y)) {
        return true;
    }
    
    // Check golden snake
    if (gameState.level >= 7 && gameState.goldenSnake.some(segment => 
        segment.x === position.x && segment.y === position.y)) {
        return true;
    }
    
    // Check obstacles
    return gameState.obstacles.some(obs => 
        obs.x === position.x && obs.y === position.y
    );
}
// Determine food type
function determineFoodType() {
    // Only spawn time freeze food at level 7 or higher
    if (gameState.level >= 7 && Math.random() < 0.2) {
        return PowerUpType.TIME_FREEZE;
    }
    
    if (Math.random() >= config.powerUpChance) {
        return PowerUpType.NONE;
    }
    
    return gameState.hearts < config.maxHearts ? 
        PowerUpType.HEART : 
        PowerUpType.SHRINK;
}
// Handle snake eating food
export function handleFoodCollision(isGoldenSnake = false) {
    // Play appropriate sound effect based on food type
    switch(gameState.food.type) {
        case PowerUpType.TIME_FREEZE:
            sounds.timeFreeze();
            handleTimeFreeze(isGoldenSnake);
            break;
        case PowerUpType.HEART:
            sounds.heartPowerUp();
            if (!isGoldenSnake && gameState.hearts < config.maxHearts) {
                gameState.hearts++;
            }
            break;
        case PowerUpType.SHRINK:
            sounds.shrinkPowerUp();
            if (!isGoldenSnake) shrinkSnake();
            break;
        default:
            sounds.regularFood();
            break;
    }
    
    gameState.score += config.pointsPerFood;
    
    if (gameState.score % (config.pointsPerFood * 10) === 0) {
        if (gameState.level < config.maxLevel) {
            sounds.levelUp();
            handleLevelUp();
        }
    }
    
    spawnFood();
    return true;
}

// Handle time freeze power-up
function handleTimeFreeze(isGoldenSnake) {
    if (isGoldenSnake) {
        // Freeze player snake
        gameState.isPlayerFrozen = true;
        setTimeout(() => {
            gameState.isPlayerFrozen = false;
        }, config.timeFreezeAmount);
    } else {
        // Freeze golden snake
        gameState.isGoldenFrozen = true;
        setTimeout(() => {
            gameState.isGoldenFrozen = false;
        }, config.timeFreezeAmount);
    }
}
// Get food color based on type
function getFoodColor(type) {
    switch(type) {
        case PowerUpType.HEART:
            return Colors.heartPowerUp;
        case PowerUpType.SHRINK:
            return Colors.shrinkPowerUp;
        case PowerUpType.TIME_FREEZE:
            return Colors.timeFreezePowerUp;
        default:
            return Colors.food;
    }
}
// Draw food on canvas
export function drawFood(ctx) {
    const foodX = (gameState.food.x + 0.5) * config.gridSize;
    const foodY = (gameState.food.y + 0.5) * config.gridSize;
    const foodRadius = config.gridSize / 2;
    const foodColor = getFoodColor(gameState.food.type);
    ctx.shadowColor = foodColor;
    ctx.shadowBlur = 15;
    const foodGradient = createFoodGradient(ctx, foodX, foodY, foodRadius, foodColor);
    ctx.fillStyle = foodGradient;
    
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius * 0.8, 0, Math.PI * 2);
    ctx.fill();
    drawFoodShine(ctx, foodX, foodY, foodRadius);
    
    ctx.shadowBlur = 0;
}
// Create gradient for food
function createFoodGradient(ctx, x, y, radius, color) {
    const gradient = ctx.createRadialGradient(
        x - radius/3,
        y - radius/3,
        radius/4,
        x,
        y,
        radius
    );
    
    gradient.addColorStop(0, color);
    gradient.addColorStop(0.6, color);
    gradient.addColorStop(1, color);
    
    return gradient;
}
// Add shine effect to food
function drawFoodShine(ctx, x, y, radius) {
    ctx.beginPath();
    ctx.arc(
        x - radius/3,
        y - radius/3,
        radius/4,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
}