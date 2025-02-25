// Core game configuration
export const config = {
    initialSpeed: 150,          // Base game speed in milliseconds
    speedIncrease: 10,         // Speed increment per level
    maxHearts: 5,              // Maximum number of lives
    maxLevel: 10,              // Maximum game level
    pointsPerFood: 10,         // Score awarded for eating food
    heartRegainScore: 100,     // Score needed to regain a heart
    gridSize: 20,              // Size of each grid cell in pixels
    obstacleCount: 3,          // Initial number of obstacles
    obstacleIncrease: 2,       // Number of obstacles added per level
    powerUpChance: 0.1,        // Chance for power-up food (0.1 = 10%)
};

// Power-up types
export const PowerUpType = {
    NONE: 'none',              // Regular food
    HEART: 'heart',            // Gives extra life
    SHRINK: 'shrink'           // Shrinks snake length
};

// Direction mappings
export const Directions = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
};

// Colors used throughout the game
export const Colors = {
    // Snake colors
    snakeHead: {
        primary: '#00ff88',
        secondary: '#00cc44'
    },
    snakeBody: {
        primary: '#00dd66',
        secondary: '#00aa33'
    },
    // Golden snake colors
    goldenSnakeHead: {
        primary: '#FFD700',
        secondary: '#DAA520'
    },
    goldenSnakeBody: {
        primary: '#FFA500',
        secondary: '#FF8C00'
    },
    // Food colors
    food: '#ff6b6b',
    heartPowerUp: '#F97316',
    shrinkPowerUp: '#00ff88',
    // Obstacle colors
    obstacle: {
        primary: '#4A5568',
        secondary: '#2D3748'
    }
};