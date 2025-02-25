// Core game configuration
export const config = {
    initialSpeed: 150,          
    speedIncrease: 10,         
    maxHearts: 5,              
    maxLevel: 10,              
    pointsPerFood: 10,         
    heartRegainScore: 100,     
    gridSize: 20,              
    obstacleCount: 3,          
    obstacleIncrease: 2,       
    powerUpChance: 0.1,        
    timeFreezeAmount: 5000,    // 5 seconds time freeze duration
};
// Power-up types
export const PowerUpType = {
    NONE: 'none',              
    HEART: 'heart',            
    SHRINK: 'shrink',
    TIME_FREEZE: 'timeFreeze'  // New time freeze power-up
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
    snakeHead: {
        primary: '#00ff88',
        secondary: '#00cc44'
    },
    snakeBody: {
        primary: '#00dd66',
        secondary: '#00aa33'
    },
    goldenSnakeHead: {
        primary: '#FFD700',
        secondary: '#DAA520'
    },
    goldenSnakeBody: {
        primary: '#FFA500',
        secondary: '#FF8C00'
    },
    food: '#ff6b6b',
    heartPowerUp: '#F97316',
    shrinkPowerUp: '#00ff88',
    timeFreezePowerUp: '#000080', // Deep blue color for time freeze food
    obstacle: {
        primary: '#4A5568',
        secondary: '#2D3748'
    }
};