import { canvas } from './canvas.js';
import { config, Colors, Directions } from './constants.js';
import { gameState, takeDamage } from './gameState.js';
import { handleFoodCollision } from './food.js';
import { sounds } from './audio.js';

// Move snake based on current direction
export function moveSnake() {
    if (gameState.isPaused || gameState.isPlayerFrozen) return;
    
    const head = { ...gameState.snake[0] };
    
    // Calculate new head position
    switch(gameState.direction) {
        case Directions.UP: head.y--; break;
        case Directions.DOWN: head.y++; break;
        case Directions.LEFT: head.x--; break;
        case Directions.RIGHT: head.x++; break;
    }

    // Wrap around edges
    const gridWidth = canvas.width / config.gridSize;
    const gridHeight = canvas.height / config.gridSize;
    head.x = (head.x + gridWidth) % gridWidth;
    head.y = (head.y + gridHeight) % gridHeight;

    // Check collisions
    if (checkCollision(head)) {
        return handleCollision();
    }

    // Add new head
    gameState.snake.unshift(head);

    // Check if food was eaten
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        handleFoodCollision(false);
    } else {
        gameState.snake.pop();
    }
    
    // Check if player snake caught golden snake's tail using the checkSnakeCollision function
    if (gameState.goldenSnake.length > 0 && checkSnakeCollision(head, gameState.goldenSnake)) {
        handleSnakeEating(gameState.snake, gameState.goldenSnake);
    }
    
    return false; // No game over
}

// Check for collisions with self or obstacles
export function checkCollision(head) {
    return checkSelfCollision(head) || checkObstacleCollision(head);
}
// Check if snake hits itself
function checkSelfCollision(head) {
    return gameState.snake.some((segment, index) => {
        return index !== 0 && segment.x === head.x && segment.y === head.y;
    });
}
// Check if snake hits obstacles
function checkObstacleCollision(head) {
    return gameState.obstacles.some(obstacle => 
        obstacle.x === head.x && obstacle.y === head.y
    );
}
// Handle snake collision
export function handleCollision() {
    const isGameOver = takeDamage();
    
    if (!isGameOver) {
        sounds.heartLoss();
        resetSnakePosition();
    } else {
        sounds.gameOver();
    }
    
    return isGameOver;
}
// Reset snake position after collision while maintaining length
function resetSnakePosition() {
    const snakeLength = gameState.snake.length;
    gameState.snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    gameState.direction = Directions.RIGHT;
    
    // Regrow snake to previous length
    while (gameState.snake.length < snakeLength) {
        gameState.snake.push({ ...gameState.snake[0] });
    }
}
// Change snake direction if valid
export function changeDirection(newDirection) {
    if (gameState.isPaused) return;
    const opposites = {
        [Directions.UP]: Directions.DOWN,
        [Directions.DOWN]: Directions.UP,
        [Directions.LEFT]: Directions.RIGHT,
        [Directions.RIGHT]: Directions.LEFT
    };
    if (opposites[gameState.direction] !== newDirection) {
        gameState.direction = newDirection;
    }
}
// Shrink snake to initial size
export function shrinkSnake() {
    while (gameState.snake.length > 3) {
        gameState.snake.pop();
    }
}
// Draw snake on canvas
export function drawSnake(ctx) {
    gameState.snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            (segment.x + 1) * config.gridSize,
            (segment.y + 1) * config.gridSize
        );
        
        if (index === 0) {
            // Head colors and gradient
            gradient.addColorStop(0, Colors.snakeHead.primary);
            gradient.addColorStop(1, Colors.snakeHead.secondary);
            drawSnakeEyes(ctx, segment);
        } else {
            // Body segments gradient
            gradient.addColorStop(0, Colors.snakeBody.primary);
            gradient.addColorStop(1, Colors.snakeBody.secondary);
        }
        drawSnakeSegment(ctx, segment, gradient);
    });
}
// Draw snake eyes
function drawSnakeEyes(ctx, head) {
    const eyeSize = config.gridSize / 6;
    ctx.fillStyle = '#000';
    
    // Left eye
    ctx.beginPath();
    ctx.arc(
        (head.x + 0.3) * config.gridSize,
        (head.y + 0.3) * config.gridSize,
        eyeSize,
        0,
        Math.PI * 2
    );
    ctx.fill();
    
    // Right eye
    ctx.beginPath();
    ctx.arc(
        (head.x + 0.7) * config.gridSize,
        (head.y + 0.3) * config.gridSize,
        eyeSize,
        0,
        Math.PI * 2
    );
    ctx.fill();
}
// Draw a single snake segment
function drawSnakeSegment(ctx, segment, gradient) {
    ctx.shadowColor = 'rgba(0, 255, 100, 0.3)';
    ctx.shadowBlur = 10;
    ctx.fillStyle = gradient;
    
    const roundness = config.gridSize / 4;
    const x = segment.x * config.gridSize;
    const y = segment.y * config.gridSize;
    const size = config.gridSize - 1;
    
    // Draw rounded rectangle
    ctx.beginPath();
    ctx.moveTo(x + roundness, y);
    ctx.lineTo(x + size - roundness, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + roundness);
    ctx.lineTo(x + size, y + size - roundness);
    ctx.quadraticCurveTo(x + size, y + size, x + size - roundness, y + size);
    ctx.lineTo(x + roundness, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - roundness);
    ctx.lineTo(x, y + roundness);
    ctx.quadraticCurveTo(x, y, x + roundness, y);
    ctx.closePath();
    ctx.fill();
    
    ctx.shadowBlur = 0;
}
// Check collision between snakes
export function checkSnakeCollision(head, otherSnake) {
    // Check if head hits other snake's tail
    if (otherSnake.length > 0) {
        const tail = otherSnake[otherSnake.length - 1];
        return head.x === tail.x && head.y === tail.y;
    }
    return false;
}

// Handle snake eating other snake's tail
export function handleSnakeEating(eatingSnake, eatenSnake) {
    // Extend eating snake
    eatingSnake.push({ ...eatingSnake[eatingSnake.length - 1] });
    
    // If player snake eats golden snake
    if (eatingSnake === gameState.snake) {
        // Restore all hearts
        gameState.hearts = config.maxHearts;
        // Clear the eaten snake array
        eatenSnake.length = 0;
    }
    
    sounds.levelUp(); // Play eating sound
}   