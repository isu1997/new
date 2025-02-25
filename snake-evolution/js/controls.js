import { Directions } from './constants.js';
import { gameState } from './gameState.js';
import { changeDirection } from './snake.js';

// Initialize all control systems
export function initControls() {
    initKeyboardControls();
    initMobileControls();
    initButtons();
}

// Initialize keyboard controls
function initKeyboardControls() {
    document.addEventListener('keydown', handleKeyPress);
}

// Handle keyboard input
function handleKeyPress(event) {
    if (gameState.isPaused) return;

    switch(event.key) {
        case 'ArrowUp':
            changeDirection(Directions.UP);
            break;
        case 'ArrowDown':
            changeDirection(Directions.DOWN);
            break;
        case 'ArrowLeft':
            changeDirection(Directions.LEFT);
            break;
        case 'ArrowRight':
            changeDirection(Directions.RIGHT);
            break;
    }
}

// Initialize mobile controls (joystick)
function initMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    const joystick = document.getElementById('joystick');
    const joystickTip = document.querySelector('.joystick-tip');
    
    if (!mobileControls || !joystick || !joystickTip) return;

    // מסתירים את הבקרים בהתחלה
    mobileControls.style.display = 'none';
    mobileControls.style.opacity = '0';

    // מאזינים לאירוע התחלת המשחק
    document.addEventListener('gameStart', () => {
        mobileControls.style.display = 'block';
        setTimeout(() => {
            mobileControls.style.opacity = '1';
        }, 100);
    });

    // Set up joystick event listeners
    setupJoystickEvents(joystick, joystickTip);
    
    // Set initial joystick position
    setInitialJoystickPosition();
}

// Set up joystick event listeners
function setupJoystickEvents(joystick, joystickTip) {
    const state = {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0
    };

    joystick.addEventListener('touchstart', (e) => {
        handleJoystickStart(e, joystick, joystickTip, state);
    });

    document.addEventListener('touchmove', (e) => {
        if (!state.isDragging) return;
        handleJoystickMove(e, state, joystickTip);
    }, { passive: false });

    document.addEventListener('touchend', () => {
        handleJoystickEnd(joystick, joystickTip, state);
    });
}

// Handle joystick touch start
function handleJoystickStart(e, joystick, joystickTip, state) {
    state.isDragging = true;
    const touch = e.touches[0];
    state.startX = touch.clientX;
    state.startY = touch.clientY;

    joystick.classList.add('active');
    positionJoystick(state.startX, state.startY);
    joystickTip.style.transform = 'translate(0px, 0px)';

    e.preventDefault();
}

// Handle joystick movement
function handleJoystickMove(e, state, joystickTip) {
    if (!state.isDragging) return;

    const touch = e.touches[0];
    state.currentX = touch.clientX;
    state.currentY = touch.clientY;

    const deltaX = state.currentX - state.startX;
    const deltaY = state.currentY - state.startY;

    updateJoystickPosition(deltaX, deltaY, joystickTip);
    e.preventDefault();
}

// Handle joystick release
function handleJoystickEnd(joystick, joystickTip, state) {
    state.isDragging = false;
    joystick.classList.remove('active');
    joystickTip.style.transform = 'translate(0px, 0px)';
    
    const defaultX = 110;
    const defaultY = window.innerHeight - 110;
    positionJoystick(defaultX, defaultY);
}

// Update joystick visual position and game direction
function updateJoystickPosition(deltaX, deltaY, joystickTip) {
    const maxDistance = 40;
    const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    
    // Calculate new position
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    
    // Update joystick visual
    joystickTip.style.transform = `translate(${moveX}px, ${moveY}px)`;
    
    // Update game direction if moved beyond threshold
    if (distance > 8) {
        const degrees = ((angle * 180 / Math.PI) + 360) % 360;
        
        if (degrees >= 315 || degrees < 45) {
            changeDirection(Directions.RIGHT);
        } else if (degrees >= 45 && degrees < 135) {
            changeDirection(Directions.DOWN);
        } else if (degrees >= 135 && degrees < 225) {
            changeDirection(Directions.LEFT);
        } else if (degrees >= 225 && degrees < 315) {
            changeDirection(Directions.UP);
        }
    }
}

// Position joystick element
function positionJoystick(x, y) {
    const joystick = document.getElementById('joystick');
    if (!joystick) return;

    const joystickSize = 120;
    const halfSize = joystickSize / 2;
    
    // Keep within screen bounds
    x = Math.max(halfSize, Math.min(window.innerWidth - halfSize, x));
    y = Math.max(halfSize, Math.min(window.innerHeight - halfSize, y));
    
    joystick.style.left = `${x - halfSize}px`;
    joystick.style.top = `${y - halfSize}px`;
}

// Set initial joystick position
function setInitialJoystickPosition() {
    const defaultX = 110;
    const defaultY = window.innerHeight - 110;
    positionJoystick(defaultX, defaultY);
}

// Initialize game control buttons
function initButtons() {
    const pauseButton = document.getElementById('pauseButton');
    const restartButton = document.getElementById('restartButton');
    
    pauseButton?.addEventListener('click', togglePause);
    restartButton?.addEventListener('click', restartGame);
}

// Toggle game pause state
function togglePause() {
    gameState.isPaused = !gameState.isPaused;
    document.getElementById('pauseButton').textContent = 
        gameState.isPaused ? 'Resume' : 'Pause';
}

// Restart the game
function restartGame() {
    // Create custom event for game restart
    const event = new CustomEvent('gameRestart');
    document.dispatchEvent(event);
}

// Clean up event listeners
export function cleanup() {
    document.removeEventListener('keydown', handleKeyPress);
}