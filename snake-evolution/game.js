/**
 * Game Configuration Object
 * Contains all the game settings and parameters
 */
const config = {
    initialSpeed: 150,          // Base game speed in milliseconds
    speedIncrease: 10,         // How much speed increases per level
    maxHearts: 5,              // Maximum number of lives player can have
    maxLevel: 10,              // Maximum game level
    pointsPerFood: 10,         // Score awarded for eating food
    heartRegainScore: 100,     // Score needed to regain a heart
    gridSize: 20,              // Size of each grid cell in pixels
    obstacleCount: 3,          // Initial number of obstacles
    obstacleIncrease: 2,       // Number of obstacles added per level
    powerUpChance: 0.1,        // 10% chance for power-up food
};

/**
 * Power-up Types Enumeration
 * Defines different types of power-ups available in the game
 */
const PowerUpType = {
    NONE: 'none',              // Regular food
    HEART: 'heart',            // Gives extra life
    SHRINK: 'shrink'           // Shrinks snake length
};

/**
 * Game State Object
 * Holds all the dynamic game data and current state
 */
let gameState = {
    snake: [],                 // Player snake segments array
    goldenSnake: [],          // AI opponent snake (appears at level 7)
    food: { x: 0, y: 0, type: PowerUpType.NONE },
    obstacles: [],            // Array of obstacle positions
    direction: 'right',       // Player snake direction
    goldenSnakeDirection: 'left', // AI snake direction
    hearts: config.maxHearts, // Current lives
    score: 0,                 // Current score
    level: 1,                 // Current level
    gameLoop: null,           // Game loop interval reference
    isPaused: false,          // Game pause state
    highScore: localStorage.getItem('snakeHighScore') || 0
};

// Get canvas element and its context for drawing
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

/**
 * Sets the canvas size based on container dimensions
 * Ensures the game fits properly within the viewport
 */
function setCanvasSize() {
    const container = document.querySelector('.game-container');
    const containerWidth = container.clientWidth - 40;
    const containerHeight = container.clientHeight - 200;
    
    canvas.width = Math.floor(containerWidth / config.gridSize) * config.gridSize;
    canvas.height = Math.floor(containerHeight / config.gridSize) * config.gridSize;
}

/**
 * Initializes the game
 * Sets up initial state and event listeners
 */
function initGame() {
    setCanvasSize();
    resetGame();
    updateUI();
    generateObstacles();
    document.addEventListener('keydown', handleKeyPress);
    initMobileControls();
}

/**
 * Generates obstacles based on current level
 * More obstacles are added as levels progress
 */
function generateObstacles() {
    gameState.obstacles = [];
    const obstacleCount = config.obstacleCount + (gameState.level - 1) * config.obstacleIncrease;
    
    for (let i = 0; i < obstacleCount; i++) {
        spawnObstacle();
    }
}

/**
 * Spawns a single obstacle at a random position
 * Ensures obstacle doesn't overlap with snake, food, or other obstacles
 */
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

/**
 * Checks if a position is occupied by any game element
 * @param {Object} position - The position to check
 * @returns {boolean} - True if position is occupied
 */
function isPositionOccupied(position) {
    // Check player snake
    if (gameState.snake.some(segment => segment.x === position.x && segment.y === position.y)) {
        return true;
    }
    
    // Check golden snake (if active)
    if (gameState.level >= 7 && gameState.goldenSnake.some(segment => 
        segment.x === position.x && segment.y === position.y)) {
        return true;
    }
    
    // Check food
    if (gameState.food.x === position.x && gameState.food.y === position.y) {
        return true;
    }
    
    // Check other obstacles
    return gameState.obstacles.some(obs => obs.x === position.x && obs.y === position.y);
}

/**
 * Checks if a position is too close to snake head
 * Used to prevent obstacles from spawning too close to player
 */
function isNearSnakeHead(position) {
    const head = gameState.snake[0];
    const distance = Math.abs(head.x - position.x) + Math.abs(head.y - position.y);
    return distance < 3; // Minimum safe distance
}

/**
 * Resets the game state to initial values
 * Called when starting new game or after game over
 */
function resetGame() {
    gameState.snake = [
        { x: 5, y: 5 },
        { x: 4, y: 5 },
        { x: 3, y: 5 }
    ];
    
    // Initialize golden snake on the opposite side (only if level >= 7)
    if (gameState.level >= 7) {
        const gridWidth = canvas.width / config.gridSize;
        gameState.goldenSnake = [
            { x: gridWidth - 5, y: gridWidth - 5 },
            { x: gridWidth - 4, y: gridWidth - 5 },
            { x: gridWidth - 3, y: gridWidth - 5 }
        ];
    } else {
        gameState.goldenSnake = [];
    }
    
    gameState.direction = 'right';
    gameState.goldenSnakeDirection = 'left';
    gameState.hearts = config.maxHearts;
    gameState.score = 0;
    gameState.level = 1;
    gameState.isPaused = false;
    spawnFood();
    updateUI();
}

/**
 * Spawns food at random position with chance of power-up
 * Ensures food doesn't spawn on obstacles or snakes
 */
function spawnFood() {
    const gridWidth = canvas.width / config.gridSize;
    const gridHeight = canvas.height / config.gridSize;
    let position;
    
    do {
        position = {
            x: Math.floor(Math.random() * gridWidth),
            y: Math.floor(Math.random() * gridHeight)
        };
    } while (isPositionOccupied(position));
    
    // Determine if this food will be a power-up
    let type = PowerUpType.NONE;
    if (Math.random() < config.powerUpChance) {
        type = gameState.hearts < config.maxHearts ? 
            PowerUpType.HEART : PowerUpType.SHRINK;
    }
    
    gameState.food = { ...position, type };
}

/**
 * Controls AI movement for golden snake
 * Makes decisions based on food location and player position
 */
function moveGoldenSnake() {
    if (gameState.level < 7 || gameState.goldenSnake.length === 0) return;
    
    const head = { ...gameState.goldenSnake[0] };
    const food = gameState.food;
    const playerHead = gameState.snake[0];
    
    // Simple AI to chase food or player
    let newDirection = gameState.goldenSnakeDirection;
    
    // Decide whether to chase food or player (50% chance for each)
    const chasePlayer = Math.random() < 0.5;
    const target = chasePlayer ? playerHead : food;
    
    // Decide direction based on target position
    if (Math.abs(target.x - head.x) > Math.abs(target.y - head.y)) {
        if (target.x > head.x) newDirection = 'right';
        else if (target.x < head.x) newDirection = 'left';
    } else {
        if (target.y > head.y) newDirection = 'down';
        else if (target.y < head.y) newDirection = 'up';
    }
    
    // Avoid opposite direction
    const opposites = {
        'up': 'down',
        'down': 'up',
        'left': 'right',
        'right': 'left'
    };
    
    if (opposites[gameState.goldenSnakeDirection] !== newDirection) {
        gameState.goldenSnakeDirection = newDirection;
    }
    
    // Move golden snake
    switch(gameState.goldenSnakeDirection) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }
    
    // Wrap around edges
    const gridWidth = canvas.width / config.gridSize;
    const gridHeight = canvas.height / config.gridSize;
    head.x = (head.x + gridWidth) % gridWidth;
    head.y = (head.y + gridHeight) % gridHeight;
    
    // Check if golden snake got the food
    if (head.x === food.x && head.y === food.y) {
        gameState.goldenSnake.unshift(head);
        spawnFood();
    } else {
        gameState.goldenSnake.pop();
        gameState.goldenSnake.unshift(head);
    }
    
    // Check collision with player snake body
    gameState.snake.forEach((segment, index) => {
        if (head.x === segment.x && head.y === segment.y) {
            if (index === 0) {
                // Hit player's head - golden snake gets longer
                gameState.goldenSnake.push({ ...gameState.goldenSnake[0] });
                handleGoldenSnakeCollision();
            } else {
                // Hit player's body - golden snake gets longer
                gameState.goldenSnake.push({ ...gameState.goldenSnake[0] });
                handleGoldenSnakeCollision();
            }
        }
    });
}

/**
 * Main game update function
 * Called on each game tick to update game state
 */
function update() {
    if (gameState.isPaused) return;
    
    const head = { ...gameState.snake[0] };
    
    // Move snake
    switch(gameState.direction) {
        case 'up': head.y--; break;
        case 'down': head.y++; break;
        case 'left': head.x--; break;
        case 'right': head.x++; break;
    }

    // Wrap around edges
    const gridWidth = canvas.width / config.gridSize;
    const gridHeight = canvas.height / config.gridSize;
    head.x = (head.x + gridWidth) % gridWidth;
    head.y = (head.y + gridHeight) % gridHeight;

    // Check collisions
    if (checkSelfCollision(head) || checkObstacleCollision(head)) {
        handleCollision();
        return;
    }

    // Check food collision
    if (head.x === gameState.food.x && head.y === gameState.food.y) {
        handleFoodCollision();
    } else {
        gameState.snake.pop();
    }

    gameState.snake.unshift(head);
    
    // Move golden snake (if level >= 7)
    if (gameState.level >= 7) {
        moveGoldenSnake();
    }
    
    draw();
}

/**
 * Checks if snake has collided with itself
 * @param {Object} head - The position to check
 * @returns {boolean} - True if collision detected
 */
function checkSelfCollision(head) {
    return gameState.snake.some((segment, index) => {
        return index !== 0 && segment.x === head.x && segment.y === head.y;
    });
}

/**
 * Checks if snake has collided with obstacles
 * @param {Object} head - The position to check
 * @returns {boolean} - True if collision detected
 */
function checkObstacleCollision(head) {
    return gameState.obstacles.some(obstacle => 
        obstacle.x === head.x && obstacle.y === head.y
    );
}

/**
 * Handles snake collision with obstacles or itself
 * Reduces lives and resets position if lives remain
 */
function handleCollision() {
    gameState.hearts--;
    updateUI();
    
    if (gameState.hearts <= 0) {
        gameOver();
    } else {
        // Reset snake position but keep length
        const snakeLength = gameState.snake.length;
        gameState.snake = [
            { x: 5, y: 5 },
            { x: 4, y: 5 },
            { x: 3, y: 5 }
        ];
        gameState.direction = 'right';
        
        // Regrow snake to previous length
        for(let i = 3; i < snakeLength; i++) {
            gameState.snake.push({ ...gameState.snake[0] });
        }
    }
}

/**
 * Handles snake eating food
 * Updates score, handles power-ups, and checks for level up
 */
function handleFoodCollision() {
    gameState.score += config.pointsPerFood;
    
    // Handle power-ups
    switch(gameState.food.type) {
        case PowerUpType.HEART:
            if (gameState.hearts < config.maxHearts) {
                gameState.hearts++;
            }
            break;
        case PowerUpType.SHRINK:
            const initialLength = 3;
            while (gameState.snake.length > initialLength) {
                gameState.snake.pop();
            }
            break;
    }

    // Check for level up
    if (gameState.score % (config.pointsPerFood * 10) === 0) {
        if (gameState.level < config.maxLevel) {
            gameState.level++;
            
            // Initialize golden snake when reaching level 7
            if (gameState.level === 7) {
                const gridWidth = canvas.width / config.gridSize;
                gameState.goldenSnake = [
                    { x: gridWidth - 5, y: gridWidth - 5 },
                    { x: gridWidth - 4, y: gridWidth - 5 },
                    { x: gridWidth - 3, y: gridWidth - 5 }
                ];
                console.log('Golden snake activated!');
            }
            
            generateObstacles();
            clearInterval(gameState.gameLoop);
            startGame();
        }
    }

    spawnFood();
    updateUI();
}

/**
 * Main draw function
 * Renders all game elements on the canvas
 */
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw obstacles
    ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';
    ctx.shadowBlur = 8;
    gameState.obstacles.forEach(obstacle => {
        const x = obstacle.x * config.gridSize;
        const y = obstacle.y * config.gridSize;
        
        // Create gradient for obstacles
        const gradient = ctx.createLinearGradient(x, y, x + config.gridSize, y + config.gridSize);
        gradient.addColorStop(0, '#4A5568');
        gradient.addColorStop(1, '#2D3748');
        
        ctx.fillStyle = gradient;
        
        // Draw rounded rectangle for obstacles
        const roundness = 4;
        ctx.beginPath();
        ctx.moveTo(x + roundness, y);
        ctx.lineTo(x + config.gridSize - roundness, y);
        ctx.quadraticCurveTo(x + config.gridSize, y, x + config.gridSize, y + roundness);
        ctx.lineTo(x + config.gridSize, y + config.gridSize - roundness);
        ctx.quadraticCurveTo(x + config.gridSize, y + config.gridSize, x + config.gridSize - roundness, y + config.gridSize);
        ctx.lineTo(x + roundness, y + config.gridSize);
        ctx.quadraticCurveTo(x, y + config.gridSize, x, y + config.gridSize - roundness);
        ctx.lineTo(x, y + roundness);
        ctx.quadraticCurveTo(x, y, x + roundness, y);
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
    });
    ctx.shadowBlur = 0;
    
    // Draw golden snake (if level >= 7)
    if (gameState.level >= 7 && gameState.goldenSnake.length > 0) {
        gameState.goldenSnake.forEach((segment, index) => {
            const gradient = ctx.createLinearGradient(
                segment.x * config.gridSize,
                segment.y * config.gridSize,
                (segment.x + 1) * config.gridSize,
                (segment.y + 1) * config.gridSize
            );
            
            if (index === 0) {
                // Head colors (more vibrant gold)
                gradient.addColorStop(0, '#FFD700');
                gradient.addColorStop(1, '#DAA520');
                
                // Draw eyes
                const eyeSize = config.gridSize / 6;
                ctx.fillStyle = '#000';
                
                // Left eye
                ctx.beginPath();
                ctx.arc(
                    (segment.x + 0.3) * config.gridSize,
                    (segment.y + 0.3) * config.gridSize,
                    eyeSize,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                
                // Right eye
                ctx.beginPath();
                ctx.arc(
                    (segment.x + 0.7) * config.gridSize,
                    (segment.y + 0.3) * config.gridSize,
                    eyeSize,
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else {
                // Body segments with gradient (more vibrant orange-gold)
                gradient.addColorStop(0, '#FFA500');
                gradient.addColorStop(1, '#FF8C00');
            }
            
            // Enhanced glow effect
            ctx.shadowColor = 'rgba(255, 215, 0, 0.8)';
            ctx.shadowBlur = 20;
            ctx.fillStyle = gradient;
            
            // Draw segment with rounded corners
            const roundness = config.gridSize / 4;
            const x = segment.x * config.gridSize;
            const y = segment.y * config.gridSize;
            const size = config.gridSize - 1;
            
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
        });
    }

    // Draw player snake
    gameState.snake.forEach((segment, index) => {
        const gradient = ctx.createLinearGradient(
            segment.x * config.gridSize,
            segment.y * config.gridSize,
            (segment.x + 1) * config.gridSize,
            (segment.y + 1) * config.gridSize
        );
        
        if (index === 0) {
            // Head colors
            gradient.addColorStop(0, '#00ff88');
            gradient.addColorStop(1, '#00cc44');
            
            // Draw eyes
            const eyeSize = config.gridSize / 6;
            ctx.fillStyle = '#000';
            
            // Left eye
            ctx.beginPath();
            ctx.arc(
                (segment.x + 0.3) * config.gridSize,
                (segment.y + 0.3) * config.gridSize,
                eyeSize,
                0,
                Math.PI * 2
            );
            ctx.fill();
            
            // Right eye
            ctx.beginPath();
            ctx.arc(
                (segment.x + 0.7) * config.gridSize,
                (segment.y + 0.3) * config.gridSize,
                eyeSize,
                0,
                Math.PI * 2
            );
            ctx.fill();
        } else {
            // Body segments gradient
            gradient.addColorStop(0, '#00dd66');
            gradient.addColorStop(1, '#00aa33');
        }

        ctx.shadowColor = 'rgba(0, 255, 100, 0.3)';
        ctx.shadowBlur = 10;
        ctx.fillStyle = gradient;
        
        const roundness = config.gridSize / 4;
        const x = segment.x * config.gridSize;
        const y = segment.y * config.gridSize;
        const size = config.gridSize - 1;
        
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
    });

    // Draw food
    const foodX = (gameState.food.x + 0.5) * config.gridSize;
    const foodY = (gameState.food.y + 0.5) * config.gridSize;
    const foodRadius = config.gridSize / 2;

    // Set food color based on type
    let foodColor;
    switch(gameState.food.type) {
        case PowerUpType.HEART:
            foodColor = '#F97316'; // Orange for heart power-up
            break;
        case PowerUpType.SHRINK:
            foodColor = '#00ff88'; // Green for shrink
            break;
        default:
            foodColor = '#ff6b6b'; // Default food color
    }

    // Enhanced glowing effect
    ctx.shadowColor = foodColor;
    ctx.shadowBlur = 15;

    // Gradient for food
    const foodGradient = ctx.createRadialGradient(
        foodX - foodRadius/3,
        foodY - foodRadius/3,
        foodRadius/4,
        foodX,
        foodY,
        foodRadius
    );
    foodGradient.addColorStop(0, foodColor);
    foodGradient.addColorStop(0.6, foodColor);
    foodGradient.addColorStop(1, foodColor);
    
    ctx.fillStyle = foodGradient;
    ctx.beginPath();
    ctx.arc(foodX, foodY, foodRadius * 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Enhanced shine effect
    ctx.beginPath();
    ctx.arc(
        foodX - foodRadius/3,
        foodY - foodRadius/3,
        foodRadius/4,
        0,
        Math.PI * 2
    );
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();

    ctx.shadowBlur = 0;
}

/**
 * Handles keyboard input for snake movement
 * @param {KeyboardEvent} event - The keyboard event
 */
function handleKeyPress(event) {
    if (gameState.isPaused) return;

    switch(event.key) {
        case 'ArrowUp':
            if (gameState.direction !== 'down') gameState.direction = 'up';
            break;
        case 'ArrowDown':
            if (gameState.direction !== 'up') gameState.direction = 'down';
            break;
        case 'ArrowLeft':
            if (gameState.direction !== 'right') gameState.direction = 'left';
            break;
        case 'ArrowRight':
            if (gameState.direction !== 'left') gameState.direction = 'right';
            break;
    }
}

/**
 * Initializes mobile controls using touch events
 * Implements virtual joystick functionality
 */
function initMobileControls() {
    const mobileControls = document.querySelector('.mobile-controls');
    const joystick = document.querySelector('.joystick');
    const joystickTip = document.querySelector('.joystick-tip');
    let isDragging = false;
    let startX, startY, initialTouchX, initialTouchY;
    let currentX, currentY;

    function positionJoystick(x, y) {
        const joystickSize = 120;
        const halfSize = joystickSize / 2;
        
        // Keep joystick within screen bounds
        x = Math.max(halfSize, Math.min(window.innerWidth - halfSize, x));
        y = Math.max(halfSize, Math.min(window.innerHeight - halfSize, y));
        
        joystick.style.transform = `translate(${x - halfSize}px, ${y - halfSize}px)`;
    }
}
    /**
 * Updates the joystick tip position and game state based on touch input
 * @param {number} deltaX - The change in X position
 * @param {number} deltaY - The change in Y position
 */
function updateJoystickTip(deltaX, deltaY) {
    // Calculate distance and limit it
    const maxDistance = 40;
    const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    
    // Calculate new position
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    
    // Update joystick visual position
    const joystickTip = document.querySelector('.joystick-tip');
    if (joystickTip) {
        joystickTip.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
    
    // Convert angle to degrees and normalize to 0-360 range
    const degrees = ((angle * 180 / Math.PI) + 360) % 360;
    
    // Only update direction if joystick is moved beyond threshold
    if (distance > 8) {
        const oldDirection = gameState.direction;
        
        // Determine new direction based on angle
        if (degrees >= 315 || degrees < 45) {
            if (gameState.direction !== 'left') {
                gameState.direction = 'right';
            }
        } else if (degrees >= 45 && degrees < 135) {
            if (gameState.direction !== 'up') {
                gameState.direction = 'down';
            }
        } else if (degrees >= 135 && degrees < 225) {
            if (gameState.direction !== 'right') {
                gameState.direction = 'left';
            }
        } else if (degrees >= 225 && degrees < 315) {
            if (gameState.direction !== 'down') {
                gameState.direction = 'up';
            }
        }
        
        // If direction changed, update UI
        if (oldDirection !== gameState.direction) {
            updateUI();
        }
    }
    
    // Return the calculated distance and angle for potential use by other functions
    return {
        distance,
        angle,
        degrees
    };
}

/**
 * Updates UI elements with current game state
 */
function updateUI() {
    document.getElementById('score').textContent = gameState.score;
    document.getElementById('highScore').textContent = gameState.highScore;
    document.getElementById('level').textContent = gameState.level;
    
    const heartsContainer = document.querySelector('.hearts');
    heartsContainer.innerHTML = '';
    
    for (let i = 0; i < config.maxHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.opacity = i < gameState.hearts ? '1' : '0.3';
        heartsContainer.appendChild(heart);
    }
}

/**
 * Handles game over state
 * Updates high score and resets game
 */
function gameOver() {
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('snakeHighScore', gameState.highScore);
    }
    
    clearInterval(gameState.gameLoop);
    alert(`Game Over! Score: ${gameState.score}`);
    resetGame();
    startGame();
}

/**
 * Starts or restarts the game loop
 * Adjusts game speed based on current level
 */
function startGame() {
    if (gameState.gameLoop) clearInterval(gameState.gameLoop);
    const currentSpeed = config.initialSpeed - 
        (gameState.level - 1) * config.speedIncrease;
    gameState.gameLoop = setInterval(update, Math.max(currentSpeed, 50));
}

// Event listeners for game controls
document.getElementById('startGame').addEventListener('click', () => {
    document.querySelector('.opening-animation').style.display = 'none';
    document.getElementById('rulesModal').style.display = 'flex';
});

document.getElementById('startPlaying').addEventListener('click', () => {
    document.getElementById('rulesModal').style.display = 'none';
    initGame();
    startGame();
});

document.getElementById('pauseButton').addEventListener('click', () => {
    gameState.isPaused = !gameState.isPaused;
    document.getElementById('pauseButton').textContent = gameState.isPaused ? 'Resume' : 'Pause';
});

document.getElementById('restartButton').addEventListener('click', () => {
    resetGame();
    startGame();
});

// Handle window resize
window.addEventListener('resize', () => {
    setCanvasSize();
    draw();
});