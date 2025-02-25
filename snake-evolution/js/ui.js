import { config } from './constants.js';
import { gameState } from './gameState.js';

// Initialize all UI components
export function initUI() {
    initOpeningAnimation();
    initRulesModal();
    initGameStats();
    updateUI();
}

// Initialize opening animation
function initOpeningAnimation() {
    const startButton = document.getElementById('startGame');
    const openingAnimation = document.querySelector('.opening-animation');
    
    startButton?.addEventListener('click', () => {
        openingAnimation.style.display = 'none';
        showRulesModal();
    });
}

// Initialize rules modal
function initRulesModal() {
    const startPlayingButton = document.getElementById('startPlaying');
    const rulesModal = document.getElementById('rulesModal');
    
    startPlayingButton?.addEventListener('click', () => {
        rulesModal.style.display = 'none';
        startGame();
    });
}

// Show rules modal
function showRulesModal() {
    const rulesModal = document.getElementById('rulesModal');
    rulesModal.style.display = 'flex';
}

// Initialize game stats display
function initGameStats() {
    updateHearts();
    updateScore();
    updateLevel();
}

// Update all UI elements
export function updateUI() {
    updateScore();
    updateHearts();
    updateLevel();
}

// Update score display
function updateScore() {
    const scoreElement = document.getElementById('score');
    const highScoreElement = document.getElementById('highScore');
    
    if (scoreElement) {
        scoreElement.textContent = gameState.score;
    }
    if (highScoreElement) {
        highScoreElement.textContent = gameState.highScore;
    }
}

// Update hearts display
function updateHearts() {
    const heartsContainer = document.querySelector('.hearts');
    if (!heartsContainer) return;
    
    heartsContainer.innerHTML = '';
    
    for (let i = 0; i < config.maxHearts; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart';
        heart.style.opacity = i < gameState.hearts ? '1' : '0.3';
        heartsContainer.appendChild(heart);
    }
}

// Update level display
function updateLevel() {
    const levelElement = document.getElementById('level');
    if (levelElement) {
        levelElement.textContent = gameState.level;
    }
}

// Show game over screen
export function showGameOver() {
    alert(`Game Over! Score: ${gameState.score}`);
}

// Handle level up UI updates
export function handleLevelUp() {
    updateLevel();
    
    // Special notification for golden snake appearance
    if (gameState.level === 7) {
        showGoldenSnakeNotification();
    }
}

// Show golden snake notification
function showGoldenSnakeNotification() {
    // Could be enhanced with a custom modal or animation
    alert('Warning: Golden Snake has appeared!');
}

// Start the game
function startGame() {
    // Create custom event for game start
    const event = new CustomEvent('gameStart');
    document.dispatchEvent(event);
}

// Show achievement notification
export function showAchievement(message) {
    // Could be enhanced with a custom achievement system
    console.log(`Achievement: ${message}`);
}

// Update UI for pause state
export function updatePauseUI(isPaused) {
    const pauseButton = document.getElementById('pauseButton');
    if (pauseButton) {
        pauseButton.textContent = isPaused ? 'Resume' : 'Pause';
    }
}

// Show power-up notification
export function showPowerUpNotification(type) {
    let message;
    switch(type) {
        case 'heart':
            message = 'Extra Life Gained!';
            break;
        case 'shrink':
            message = 'Snake Shrunk!';
            break;
    }
    
    if (message) {
        // Could be enhanced with custom notification system
        console.log(message);
    }
}

// Clean up UI event listeners
export function cleanup() {
    const startButton = document.getElementById('startGame');
    const startPlayingButton = document.getElementById('startPlaying');
    
    startButton?.removeEventListener('click', () => {});
    startPlayingButton?.removeEventListener('click', () => {});
}

// Mobile-specific UI adjustments
export function adjustForMobile() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    
    if (isMobile) {
        const mobileControls = document.getElementById('mobileControls');
        if (mobileControls) {
            mobileControls.style.display = 'block';
        }
    }
}

// Update UI for screen size changes
export function handleResize() {
    const gameContainer = document.querySelector('.game-container');
    if (gameContainer) {
        adjustUIForScreenSize();
    }
}

// Adjust UI elements for current screen size
function adjustUIForScreenSize() {
    const width = window.innerWidth;
    const gameContainer = document.querySelector('.game-container');
    
    if (width < 768) { // Mobile
        gameContainer.classList.add('mobile-layout');
    } else {
        gameContainer.classList.remove('mobile-layout');
    }
}