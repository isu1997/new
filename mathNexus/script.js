// DOM Elements
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
// Game State
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

// Audio Context
let audioContext;

// Initialize Audio Context
function initializeAudioContext() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Play Sound Effects
function playSound(type) {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    switch(type) {
        case 'correct':
            oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            oscillator.type = 'sine';
            break;
        case 'wrong':
            oscillator.frequency.setValueAtTime(300, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            oscillator.type = 'triangle';
            break;
        case 'levelUp':
            oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            oscillator.type = 'square';
            break;
    }
    
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 0.2);
}

// High Score Management
function saveHighScore() {
    if (gameState.score > gameState.highScore) {
        gameState.highScore = gameState.score;
        localStorage.setItem('mathLabHighScore', gameState.highScore.toString());
        elements.highScoreDisplay.textContent = gameState.highScore;
    }
}

function loadHighScore() {
    const savedScore = localStorage.getItem('mathLabHighScore');
    if (savedScore !== null) {
        gameState.highScore = parseInt(savedScore);
        elements.highScoreDisplay.textContent = gameState.highScore;
    }
}

// Timer Functions
function startTimer() {
    if (gameState.timer) clearInterval(gameState.timer);
    gameState.timer = setInterval(() => {
        gameState.seconds++;
        updateTimeDisplay();
    }, 1000);
}

function updateTimeDisplay() {
    const minutes = Math.floor(gameState.seconds / 60);
    const seconds = gameState.seconds % 60;
    elements.timeDisplay.textContent = 
        `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Game Progress Functions
function updateProgress() {
    const progress = (gameState.questionsAnswered / 10) * 100;
    elements.progressBar.style.width = `${progress}%`;
    elements.questionsCount.textContent = `${gameState.questionsAnswered}/10`;
}

function generateNewProblem() {
    // ניקוי טיימר קודם אם קיים
    if (gameState.questionTimer) clearTimeout(gameState.questionTimer);
    
    const range = parseInt(elements.numbersRange.value);
    console.log('Range selected:', range); // בדיקה שהערך מתקבל נכון
    let num1, num2;
    
    // לוגיקה חדשה ליצירת מספרים
    if (elements.operatorsRange.value === '/') {
        // מוודא חילוק ללא שארית
        num2 = Math.floor(Math.random() * 10) + 1;
        num1 = num2 * (Math.floor(Math.random() * (range/num2)) + 1);
    } else if (elements.operatorsRange.value === '-') {
        // מוודא תוצאה חיובית
        num1 = Math.floor(Math.random() * range) + 1;
        num2 = Math.floor(Math.random() * num1) + 1;
    } else {
        num1 = Math.floor(Math.random() * range) + 1;
        num2 = Math.floor(Math.random() * range) + 1;
    }
    
    // עדכון תצוגת הרמה
    if (range === 10) {
        elements.levelDisplay.textContent = 'Easy';
    } else if (range === 100) {
        elements.levelDisplay.textContent = 'Medium';
    } else if (range === 1000) {
        elements.levelDisplay.textContent = 'Hard';
    }

    elements.firstNumber.textContent = num1;
    elements.secondNumber.textContent = num2;
    elements.operator.textContent = elements.operatorsRange.value;
    elements.answer.value = '';
    elements.answer.focus();

    // הגדרת טיימר לשאלה
    gameState.questionTimer = setTimeout(() => {
        addResultRow(
            `${elements.firstNumber.textContent} ${elements.operator.textContent} ${elements.secondNumber.textContent}`,
            calculateCorrectAnswer(),
            "Time's up!",
            '✗'
        );
        gameState.questionsAnswered++;
        updateProgress();
        
        if (gameState.questionsAnswered === 10) {
            checkLevelCompletion();
        } else {
            generateNewProblem();
        }
    }, 10000); // 10 שניות לכל שאלה
}

// Answer Checking
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

function addResultRow(exercise, correct, user, result) {
    const tbody = elements.results.querySelector('tbody');
    const row = document.createElement('tr');
    
    // יוצר תאים עם תוויות למובייל
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
    
    if (tbody.firstChild) {
        tbody.insertBefore(row, tbody.firstChild);
    } else {
        tbody.appendChild(row);
    }
}

function checkAnswer() {
    if (elements.answer.value === '') return;
    
    // ניקוי טיימר השאלה הנוכחית
    if (gameState.questionTimer) clearTimeout(gameState.questionTimer);
    
    const correctAnswer = calculateCorrectAnswer();
    const userAnswer = parseFloat(elements.answer.value);
    const isCorrect = Math.abs(userAnswer - correctAnswer) < 0.0001;
    
     // מוסיף את האפקט לכל הקונטיינר
    const container = document.querySelector('.problem-container');
    container.classList.add(isCorrect ? 'correct-answer' : 'wrong-answer');
    
    // מסיר את הקלאס אחרי האנימציה
    setTimeout(() => {
        container.classList.remove('correct-answer', 'wrong-answer');
    }, 600);

    if (isCorrect) {
        gameState.score += 10;
        gameState.correctAnswers++;
        elements.scoreDisplay.textContent = gameState.score;
        saveHighScore();
        playSound('correct');
    } else {
        playSound('wrong');
    }
    
    addResultRow(
        `${elements.firstNumber.textContent} ${elements.operator.textContent} ${elements.secondNumber.textContent}`,
        correctAnswer,
        userAnswer,
        isCorrect ? '✓' : '✗'
    );
    
    gameState.questionsAnswered++;
    updateProgress();
    
    if (gameState.questionsAnswered === 10) {
        checkLevelCompletion();
    } else {
        generateNewProblem();
    }
}

// Level Management
function startNewLevel(level) {
    if (gameState.questionTimer) clearTimeout(gameState.questionTimer);
    gameState.currentLevel = level;
    gameState.questionsAnswered = 0;
    gameState.correctAnswers = 0;
    
    elements.levelDisplay.textContent = gameState.levels[level];
    elements.numbersRange.value = level === 0 ? '10' : level === 1 ? '100' : '1000';
    updateProgress();
    generateNewProblem();
}

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

function gameComplete() {
    clearInterval(gameState.timer);
    saveHighScore();
    showModal('Game Complete!', 
            `Final Score: ${gameState.score}\nHigh Score: ${gameState.highScore}`, 
            resetGame);
}

// Modal Management
function showModal(title, message, callback) {
    elements.modalTitle.textContent = title;
    elements.modalMessage.textContent = message;
    elements.modal.style.display = 'flex';
    elements.modalButton.onclick = () => {
        elements.modal.style.display = 'none';
        if (callback) callback();
    };
}

// Game Reset
function resetGame() {
    if (gameState.questionTimer) clearTimeout(gameState.questionTimer);
    gameState.score = 0;
    elements.scoreDisplay.textContent = '0';
    gameState.seconds = 0;
    updateTimeDisplay();
    startNewLevel(0);
    startTimer();
}

// Event Listeners
function setupEventListeners() {
    // Input controls
    elements.numbersRange.addEventListener('change', generateNewProblem);
    elements.operatorsRange.addEventListener('change', generateNewProblem);
    
    // Game controls
    elements.checkButton.addEventListener('click', checkAnswer);
    elements.answer.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') checkAnswer();
    });
}

// Initialize Game
function initGame() {
    // הצגת מודל הפתיחה
    const welcomeModal = document.getElementById('welcome-modal');
    const startGameBtn = document.getElementById('start-game-btn');
    
    welcomeModal.style.display = 'flex';
    
    startGameBtn.addEventListener('click', () => {
        welcomeModal.style.display = 'none';
        // התחלת המשחק
        loadHighScore();
        setupEventListeners();
        initializeAudioContext();
        startNewLevel(0);
        startTimer();
    });
}

// Start the game
document.addEventListener('DOMContentLoaded', initGame);