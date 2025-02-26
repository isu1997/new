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

// Initialize mobile controls (joysticks)
function initMobileControls() {
    const mobileControls = document.getElementById('mobileControls');
    const leftJoystick = document.getElementById('joystick');
    const rightJoystick = document.getElementById('rightJoystick');
    
    if (!mobileControls || !leftJoystick) return;

    mobileControls.style.display = 'none';
    mobileControls.style.opacity = '0';

    document.addEventListener('gameStart', () => {
        mobileControls.style.display = 'block';
        setTimeout(() => {
            mobileControls.style.opacity = '1';
        }, 100);
    });

    // Set up left joystick event listeners
    setupLeftJoystick(leftJoystick);
    
    // Set up right joystick event listeners if available
    if (rightJoystick) {
        setupRightJoystick(rightJoystick);
    }
    
    // Set initial joystick positions
    setInitialJoystickPositions();
    
    // Check orientation and adjust joysticks visibility
    checkOrientation();
    window.addEventListener('resize', checkOrientation);
}

// Check device orientation and adjust joysticks
function checkOrientation() {
    const rightJoystick = document.getElementById('rightJoystick');
    if (!rightJoystick) return;
    
    if (window.innerWidth > window.innerHeight) {
        // Landscape mode - show both joysticks
        rightJoystick.style.display = 'block';
    } else {
        // Portrait mode - hide right joystick
        rightJoystick.style.display = 'none';
    }
}

// Setup left joystick (main movement joystick)
function setupLeftJoystick(joystick) {
    const joystickTip = joystick.querySelector('.joystick-tip');
    if (!joystickTip) return;

    const state = {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0
    };

    joystick.addEventListener('touchstart', (e) => {
        handleLeftJoystickStart(e, joystick, joystickTip, state);
    });

    document.addEventListener('touchmove', (e) => {
        if (!state.isDragging) return;
        handleLeftJoystickMove(e, joystickTip, state);
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (state.isDragging) {
            handleLeftJoystickEnd(joystick, joystickTip, state);
        }
    });
}

// Setup right joystick (secondary action joystick)
function setupRightJoystick(joystick) {
    const joystickTip = joystick.querySelector('.joystick-tip');
    if (!joystickTip) return;

    const state = {
        isDragging: false,
        startX: 0,
        startY: 0,
        currentX: 0,
        currentY: 0
    };

    joystick.addEventListener('touchstart', (e) => {
        handleRightJoystickStart(e, joystick, joystickTip, state);
    });

    document.addEventListener('touchmove', (e) => {
        if (!state.isDragging) return;
        handleRightJoystickMove(e, joystickTip, state);
    }, { passive: false });

    document.addEventListener('touchend', () => {
        if (state.isDragging) {
            handleRightJoystickEnd(joystick, joystickTip, state);
        }
    });
}

// Handle left joystick touch start
function handleLeftJoystickStart(e, joystick, joystickTip, state) {
    state.isDragging = true;
    const touch = e.touches[0];
    state.startX = touch.clientX;
    state.startY = touch.clientY;

    joystick.classList.add('active');
    positionJoystick('left', state.startX, state.startY);
    joystickTip.style.transform = 'translate(0px, 0px)';

    e.preventDefault();
}

// Handle right joystick touch start
function handleRightJoystickStart(e, joystick, joystickTip, state) {
    state.isDragging = true;
    const touch = e.touches[0];
    state.startX = touch.clientX;
    state.startY = touch.clientY;

    joystick.classList.add('active');
    positionJoystick('right', state.startX, state.startY);
    joystickTip.style.transform = 'translate(0px, 0px)';

    e.preventDefault();
}

// Handle left joystick movement
function handleLeftJoystickMove(e, joystickTip, state) {
    if (!state.isDragging) return;

    // Find the touch that corresponds to this joystick
    let touchFound = false;
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const dx = Math.abs(touch.clientX - state.startX);
        const dy = Math.abs(touch.clientY - state.startY);
        
        // If this touch is close to where we started, it's ours
        if (dx + dy < 100) {  // Adjust threshold as needed
            state.currentX = touch.clientX;
            state.currentY = touch.clientY;
            touchFound = true;
            break;
        }
    }

    if (!touchFound) return;

    const deltaX = state.currentX - state.startX;
    const deltaY = state.currentY - state.startY;

    updateLeftJoystickPosition(deltaX, deltaY, joystickTip);
    e.preventDefault();
}

// Handle right joystick movement
function handleRightJoystickMove(e, joystickTip, state) {
    if (!state.isDragging) return;

    // Find the touch that corresponds to this joystick
    let touchFound = false;
    for (let i = 0; i < e.touches.length; i++) {
        const touch = e.touches[i];
        const dx = Math.abs(touch.clientX - state.startX);
        const dy = Math.abs(touch.clientY - state.startY);
        
        // If this touch is close to where we started, it's ours
        if (dx + dy < 100) {  // Adjust threshold as needed
            state.currentX = touch.clientX;
            state.currentY = touch.clientY;
            touchFound = true;
            break;
        }
    }

    if (!touchFound) return;

    const deltaX = state.currentX - state.startX;
    const deltaY = state.currentY - state.startY;

    updateRightJoystickPosition(deltaX, deltaY, joystickTip);
    e.preventDefault();
}

// Handle left joystick release
function handleLeftJoystickEnd(joystick, joystickTip, state) {
    state.isDragging = false;
    joystick.classList.remove('active');
    joystickTip.style.transform = 'translate(0px, 0px)';
    
    // Reset to default position
    setDefaultJoystickPosition('left');
}

// Handle right joystick release
function handleRightJoystickEnd(joystick, joystickTip, state) {
    state.isDragging = false;
    joystick.classList.remove('active');
    joystickTip.style.transform = 'translate(0px, 0px)';
    
    // Reset to default position
    setDefaultJoystickPosition('right');
}

// Update left joystick visual position and game direction
function updateLeftJoystickPosition(deltaX, deltaY, joystickTip) {
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

// Update right joystick visual position
function updateRightJoystickPosition(deltaX, deltaY, joystickTip) {
    const maxDistance = 40;
    const distance = Math.min(Math.hypot(deltaX, deltaY), maxDistance);
    const angle = Math.atan2(deltaY, deltaX);
    
    // Calculate new position
    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;
    
    // Update joystick visual
    joystickTip.style.transform = `translate(${moveX}px, ${moveY}px)`;
    
    // For now just handle the visual effect
    // You can add custom actions for the right joystick here
    if (distance > 8) {
        const degrees = ((angle * 180 / Math.PI) + 360) % 360;
        console.log('Right joystick moved:', { degrees, distance });
        
        // Add your custom right joystick actions here
        // For example:
        // if (degrees >= 315 || degrees < 45) {
        //     // Right action
        // } else if (degrees >= 45 && degrees < 135) {
        //     // Down action
        // } etc.
    }
}

// Position joystick element
function positionJoystick(side, x, y) {
    const joystick = side === 'left' 
        ? document.getElementById('joystick') 
        : document.getElementById('rightJoystick');
    
    if (!joystick) return;

    const joystickSize = 120;
    const halfSize = joystickSize / 2;
    
    // Keep within screen bounds
    x = Math.max(halfSize, Math.min(window.innerWidth - halfSize, x));
    y = Math.max(halfSize, Math.min(window.innerHeight - halfSize, y));
    
    joystick.style.left = `${x - halfSize}px`;
    joystick.style.top = `${y - halfSize}px`;
}

// Set specific joystick to its default position
function setDefaultJoystickPosition(side) {
    if (side === 'left') {
        const defaultX = 110;
        const defaultY = window.innerHeight - 110;
        positionJoystick('left', defaultX, defaultY);
    } else if (side === 'right') {
        const defaultX = window.innerWidth - 110;
        const defaultY = window.innerHeight - 110;
        positionJoystick('right', defaultX, defaultY);
    }
}

// Set initial joystick positions
function setInitialJoystickPositions() {
    // Set left joystick position
    setDefaultJoystickPosition('left');
    
    // Set right joystick position
    setDefaultJoystickPosition('right');
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
    window.removeEventListener('resize', checkOrientation);
}