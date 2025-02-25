import { canvas } from './canvas.js';
import { config, Colors, Directions } from './constants.js';
import { gameState, isGoldenSnakeActive } from './gameState.js';

// Move golden snake using AI logic
let lastMoveTime = 0;

export function moveGoldenSnake() {
    if (!isGoldenSnakeActive() || gameState.goldenSnake.length === 0 || gameState.isGoldenFrozen) return;
    
    const currentTime = Date.now();
    const currentPlayerSpeed = config.initialSpeed - (gameState.level - 1) * config.speedIncrease;
    const goldenSnakeSpeed = currentPlayerSpeed + config.goldenSnakeSpeedOffset;
    
    if (currentTime - lastMoveTime < goldenSnakeSpeed) return;
    
    lastMoveTime = currentTime;
    
    const head = { ...gameState.goldenSnake[0] };
    const food = gameState.food;
    const playerHead = gameState.snake[0];
    
    // Calculate new direction using AI
    const newDirection = calculateNextMove(head, food, playerHead);
    updateDirection(newDirection);
    
    // Move golden snake based on direction
    switch(gameState.goldenSnakeDirection) {
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
    
    // Check if golden snake got food
    if (head.x === food.x && head.y === food.y) {
        handleFoodCollision(true);
        gameState.goldenSnake.unshift(head);
    } else {
        gameState.goldenSnake.pop();
        gameState.goldenSnake.unshift(head);
    }
    
    checkPlayerCollision(head);
}


// AI logic to calculate next move
function calculateNextMove(head, food, playerHead) {
    // 50% chance to chase player or food
    const chasePlayer = Math.random() < 0.5;
    const target = chasePlayer ? playerHead : food;
    
    // Choose direction based on target position
    if (Math.abs(target.x - head.x) > Math.abs(target.y - head.y)) {
        return target.x > head.x ? Directions.RIGHT : Directions.LEFT;
    } else {
        return target.y > head.y ? Directions.DOWN : Directions.UP;
    }
}

// Update golden snake direction if valid
function updateDirection(newDirection) {
    const opposites = {
        [Directions.UP]: Directions.DOWN,
        [Directions.DOWN]: Directions.UP,
        [Directions.LEFT]: Directions.RIGHT,
        [Directions.RIGHT]: Directions.LEFT
    };
    
    if (opposites[gameState.goldenSnakeDirection] !== newDirection) {
        gameState.goldenSnakeDirection = newDirection;
    }
}

// Handle golden snake eating food
function handleFoodCollision(head) {
    gameState.goldenSnake.unshift(head);
    return true; // Food was eaten
}

// Check collision with player snake
function checkPlayerCollision(head) {
    gameState.snake.forEach(segment => {
        if (head.x === segment.x && head.y === segment.y) {
            
            gameState.goldenSnake.push({ ...gameState.goldenSnake[gameState.goldenSnake.length-1] });
            
            handlePlayerCollision();
        }
    });
}

// Handle collision with player
function handlePlayerCollision() {
    // Notify game state about collision
    const event = new CustomEvent('goldenSnakeCollision');
    document.dispatchEvent(event);
}

// Draw golden snake on canvas
export function drawGoldenSnake(ctx) {
    if (!isGoldenSnakeActive()) return;
    
    gameState.goldenSnake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            (segment.x + 1) * config.gridSize,
            (segment.y + 1) * config.gridSize
        );
        
        if (index === 0) {
            // Head colors and gradient
            gradient.addColorStop(0, Colors.goldenSnakeHead.primary);
            gradient.addColorStop(1, Colors.goldenSnakeHead.secondary);
            drawGoldenSnakeEyes(ctx, segment);
        } else {
            // Body segments with gradient
            gradient.addColorStop(0, Colors.goldenSnakeBody.primary);
            gradient.addColorStop(1, Colors.goldenSnakeBody.secondary);
        }
        
        drawGoldenSnakeSegment(ctx, segment, gradient);
    });
}

// Draw golden snake eyes
function drawGoldenSnakeEyes(ctx, head) {
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

// Draw a single golden snake segment
function drawGoldenSnakeSegment(ctx, segment, gradient) {
    // Enhanced glow effect for golden snake
    ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
    ctx.shadowBlur = 20;
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
    
    // Add metallic shine effect
    const shine = ctx.createLinearGradient(x, y, x + size, y + size);
    shine.addColorStop(0, 'rgba(255, 255, 255, 0.3)');
    shine.addColorStop(0.5, 'rgba(255, 255, 255, 0.1)');
    shine.addColorStop(1, 'rgba(255, 255, 255, 0)');
    ctx.fillStyle = shine;
    ctx.fill();
    
    ctx.shadowBlur = 0;
}