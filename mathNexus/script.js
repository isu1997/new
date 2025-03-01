// DOM Elements - Cache all HTML elements needed for the game
const elements = {
    numbersRange: document.getElementById('num-range'),
    operatorsRange: document.getElementById('operators-range'),
    firstNumber: document.getElementById('num1'),
    operator: document.getElementById('operator'),
    secondNumber: document.getElementById('num2'),
    answer: document.getElementById('answer'),
    checkButton: document.getElementById('sub-btn'),
    results: document.getElementById('results'),
    scoreDisplay: document.getElementById('score'),
    highScoreDisplay: document.getElementById('high-score'),
    levelDisplay: document.querySelector('#current-level'),
    timeDisplay: document.getElementById('time-display'),
    questionsCount: document.getElementById('questions-count'),
    progressBar: document.getElementById('level-progress'),
    modal: document.getElementById('game-modal'),
    modalTitle: document.getElementById('modal-title'),
    modalMessage: document.getElementById('modal-message'),
    modalButton: document.getElementById('modal-button')
};
console.log(elements.levelDisplay);

// Game State - Object to track all game variables and settings
const gameState = {
    score: 0,
    highScore: 0,
    currentLevel: 0,
    questionsAnswered: 0,
    correctAnswers: 0,
    timer: null,
    seconds: 0,
    levels: ['Easy', 'Medium', 'Hard'],
    questionTimer: null
};

// Audio Context - Variable to store the Web Audio API context
let audioContext;

// Initialize Audio Context - Set up the audio environment for sound effects
function initializeAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Play Sound Effects - Generate dynamic sounds for game feedback using Web Audio API
function playSound(type) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = audioContext.createGain();
    masterGain.connect(audioContext.destination);

    const sounds = {
        'correct': [
            // Major chord with harmonics for positive feedback
            { freq: 440, time: 0, type: 'sine', gain: 0.2, duration: 0.3 },     // Base note
            { freq: 554, time: 0, type: 'sine', gain: 0.15, duration: 0.3 },    // Harmony
            { freq: 659, time: 0, type: 'sine', gain: 0.15, duration: 0.3 },    // Harmony
            // Rising motivational sound
            { freq: 880, time: 0.1, type: 'sine', gain: 0.2, duration: 0.4 },   // Rise
            { freq: 1108, time: 0.2, type: 'sine', gain: 0.15, duration: 0.4 }, // Peak
            // Additional tone for achievement feeling
            { freq: 1318, time: 0.3, type: 'sine', gain: 0.1, duration: 0.5 }   // Finisher
        ],
        'wrong': [
        // Descending tones for incorrect answer feedback
        { freq: 400, time: 0, type: 'sawtooth', gain: 0.15, duration: 0.3 },
        { freq: 300, time: 0.1, type: 'sawtooth', gain: 0.2, duration: 0.3 },
        { freq: 200, time: 0.2, type: 'sawtooth', gain: 0.25, duration: 0.4 }
        ],
        'levelUp': [
            // Impressive ascending melody for level completion
            { freq: 440, time: 0, type: 'sine', gain: 0.15, duration: 0.15 },
            { freq: 554, time: 0.15, type: 'sine', gain: 0.15, duration: 0.15 },
            { freq: 659, time: 0.3, type: 'sine', gain: 0.15, duration: 0.15 },
            { freq: 880, time: 0.45, type: 'sine', gain: 0.2, duration: 0.3 },
            // Final impressive chord
            { freq: 1108, time: 0.6, type: 'sine', gain: 0.15, duration: 0.4 },
            { freq: 1318, time: 0.6, type: 'sine', gain: 0.12, duration: 0.4 },
            { freq: 1760, time: 0.6, type: 'sine', gain: 0.1, duration: 0.4 }
        ]
    };

    // Loop through each note in the selected sound type and play them
    sounds[type].forEach(note => {
        const oscillator = audioContext.createOscillator();
        const noteGain = audioContext.createGain();
        
        oscillator.connect(noteGain);
        noteGain.connect(masterGain);

        oscillator.type = note.type;
        oscillator.frequency.setValueAtTime(note.freq, audioContext.currentTime + note.time);

        // Improved volume curve for better sound quality
        const now = audioContext.currentTime + note.time;
        noteGain.gain.setValueAtTime(0, now);
        noteGain.gain.linearRampToValueAtTime(note.gain, now + 0.05);
        noteGain.gain.linearRampToValueAtTime(note.gain * 0.6, now + note.duration - 0.05);
        noteGain.gain.linearRampToValueAtTime(0, now + note.duration);

        oscillator.start(now);
        oscillator.stop(now + note.duration + 0.1);
    });
}

// High Score Management - Save high score to localStorage
function saveHighScore() {
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('mathLabHighScore', gameState.highScore.toString());
        elements.highScoreDisplay.textContent = gameState.highScore;
    }
}

// Load high score from localStorage on game initialization
function loadHighScore() {
    const savedScore = localStorage.getItem('mathLabHighScore');
    if (savedScore !== null) {
        gameState.highScore = parseInt(savedScore);
        elements.highScoreDisplay.textContent = gameState.highScore;
    }
}

// Timer Functions - Start the game timer for tracking session duration
function startTimer() {
    if (gameState.timer) clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        gameState.seconds++;
        updateTimeDisplay();
    }, 1000);
}

// Format and display the elapsed time in MM:SS format
function updateTimeDisplay() {
    const minutes = Math.floor(gameState.seconds / 60);
    const seconds = gameState.seconds % 60;
    elements.timeDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Game Progress Functions - Update the visual progress bar and counter
function updateProgress() {
    const progress = (gameState.questionsAnswered / 10) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.questionsCount.textContent = `${gameState.questionsAnswered}/10`;
}

// Generate a new math problem based on current difficulty settings
function generateNewProblem() {
    // Clear previous question timer if exists
    if (gameState.questionTimer) clearTimeout(gameState.questionTimer);
    
    const range = parseInt(elements.numbersRange.value);
    console.log('Range selected:', range); // Debug log to verify correct range value
    let num1, num2;
    
    // Logic for generating appropriate numbers based on operation
    if (elements.operatorsRange.value === '/') {
        // Ensure clean division without remainder
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * (Math.floor(Math.random() * (range/num2)) + 1);
    } else if (elements.operatorsRange.value === '-') {
        // Ensure positive result for subtraction
        num1 = Math.floor(Math.random() * range) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
    } else {
        num1 = Math.floor(Math.random() * range) + 1;
        num2 = Math.floor(Math.random() * range) + 1;
    }
    
    // Update level display text based on selected range
    if (range === 10) {
        elements.levelDisplay.textContent = 'Easy';
    } else if (range === 100) {
        elements.levelDisplay.textContent = 'Medium';
    } else if (range === 1000) {
        elements.levelDisplay.textContent = 'Hard';
    }

    // Update the problem display with new numbers and operator
    elements.firstNumber.textContent = num1;
    elements.secondNumber.textContent = num2;
    elements.operator.textContent = elements.operatorsRange.value;
    elements.answer.value = '';
    elements.answer.focus();

    // Set timer for current question (10 seconds per question)
    gameState.questionTimer = setTimeout(() => {
        addResultRow(
            `${elements.firstNumber.textContent} ${elements.operator.textContent} ${elements.secondNumber.textContent}`,
            calculateCorrectAnswer(),
            "Time's up!",
            '✗'
        );
        gameState.questionsAnswered++;
        updateProgress();
        
        // Check if level is complete after 10 questions
        if (gameState.questionsAnswered === 10) {
            checkLevelCompletion();
        } else {
            generateNewProblem();
        }
    }, 10000); // 10 seconds per question
}

// Answer Checking - Calculate the correct answer based on the current problem
function calculateCorrectAnswer() {
    const num1 = parseInt(elements.firstNumber.textContent);
    const num2 = parseInt(elements.secondNumber.textContent);
    const op = elements.operator.textContent;
    
    switch(op) {
        case '+': return num1 + num2;
        case '-': return num1 - num2;
        case '*': return num1 * num2;
        case '/': return num1 / num2;
        default: return 0;
    }
}

// Add a new row to the results table with problem details and outcome
function addResultRow(exercise, correct, user, result) {
    const tbody = elements.results.querySelector('tbody');
    const row = document.createElement('tr');
    
    // Create cells with labels for mobile view
    const data = [
        { label: 'Exercise', value: exercise },
        { label: 'Correct', value: correct },
        { label: 'Your Answer', value: user },
        { label: 'Result', value: result }
    ];
    
    data.forEach(item => {
        const cell = document.createElement('td');
        cell.setAttribute('data-label', item.label);
        cell.textContent = item.value;
        row.appendChild(cell);
    });
    
    // Insert new row at the top of the table for better visibility
    if (tbody.firstChild) {
        tbody.insertBefore(row, tbody.firstChild);
    } else {
        tbody.appendChild(row);
    }
}

// Validate user's answer against the correct answer
function checkAnswer() {
    if (elements.answer.value === '') return;
    
    // Clear the current question timer
    if (gameState.questionTimer) clearTimeout(gameState.questionTimer);
    
    const correctAnswer = calculateCorrectAnswer();
    const userAnswer = parseFloat(elements.answer.value);
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.0001;
    
    // Add visual feedback effect to the problem container
    const container = document.querySelector('.problem-container');
    container.classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
    
    // Remove the effect class after animation completes
    setTimeout(() => {
        container.classList.remove('correct-answer', 'wrong-answer');
    }, 600);

    // Update score and play appropriate sound effect
    if (isCorrect) {
        gameState.score += 10;
        gameState.correctAnswers++;
        elements.scoreDisplay.textContent = gameState.score;
        saveHighScore();
        playSound('correct');
    } else {
        playSound('wrong');
    }
    
    // Add the result to the history table
    addResultRow(
        `${elements.firstNumber.textContent} ${elements.operator.textContent} ${elements.secondNumber.textContent}`,
        correctAnswer,
        userAnswer,
        isCorrect ? '✓' : '✗'
    );
    
    gameState.questionsAnswered++;
    updateProgress();
    
    // Check if level is complete after 10 questions
    if (gameState.questionsAnswered === 10) {
        checkLevelCompletion();
    } else {
        generateNewProblem();
    }
}

// Level Management - Initialize a new level with appropriate settings
function startNewLevel(level) {
    if (gameState.questionTimer) clearTimeout(gameState.questionTimer);
    gameState.currentLevel = level;
    gameState.questionsAnswered = 0;
    gameState.correctAnswers = 0;
    
    // Update UI to reflect the new level
    elements.levelDisplay.textContent = gameState.levels[level];
    elements.numbersRange.value = level === 0 ? '10' : level === 1 ? '100' : '1000';
    updateProgress();
    generateNewProblem();
}

// Evaluate level performance and determine if player advances
function checkLevelCompletion() {
    if (gameState.correctAnswers >= 7) {
        if (gameState.currentLevel < 2) {
            showModal('Level Complete!', 
                    'Congratulations! You\'re moving to the next level!', 
                    () => startNewLevel(gameState.currentLevel + 1));
            playSound('levelUp');
        } else {
            gameComplete();
        }
    } else {
        showModal('Level Failed', 
                'You need at least 7 correct answers to advance. Try again!', 
                () => startNewLevel(gameState.currentLevel));
    }
}

// Handle game completion after all levels are finished
function gameComplete() {
    clearInterval(gameState.timer);
    saveHighScore();
    showModal('Game Complete!', 
            `Final Score: ${gameState.score}\nHigh Score: ${gameState.highScore}`, 
            resetGame);
}

// Modal Management - Display modal with custom title, message and callback
function showModal(title, message, callback) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modal.style.display = 'flex';
    elements.modalButton.onclick = () => {
        elements.modal.style.display = 'none';
        if (callback) callback();
    };
}

// Reset game state for a new game session
function resetGame() {
    if (gameState.questionTimer) clearTimeout(gameState.questionTimer);
    gameState.score = 0;
    elements.scoreDisplay.textContent = '0';
    gameState.seconds = 0;
    updateTimeDisplay();
    startNewLevel(0);
    startTimer();
}

// Event Listeners - Set up all event handlers for game controls
function setupEventListeners() {
    // Input controls for changing difficulty and operators
    elements.numbersRange.addEventListener('change', generateNewProblem);
    elements.operatorsRange.addEventListener('change', generateNewProblem);
    
    // Game controls for submitting answers
    elements.checkButton.addEventListener('click', checkAnswer);
    elements.answer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
}

// Initialize Game - Set up the welcome screen and game startup
function initGame() {
    // Display welcome modal on game load
    const welcomeModal = document.getElementById('welcome-modal');
    const startGameBtn = document.getElementById('start-game-btn');
    
    welcomeModal.style.display = 'flex';
    
    // Set up start game button functionality
    startGameBtn.addEventListener('click', () => {
        welcomeModal.style.display = 'none';
        // Start the game session
        loadHighScore();
        setupEventListeners();
        initializeAudioContext();
        startNewLevel(0);
        startTimer();
    });
}

// Start the game when DOM is fully loaded
document.addEventListener('DOMContentLoaded', initGame);
