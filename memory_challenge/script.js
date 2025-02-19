// Game Configuration
const CARD_PAIRS = 8;
const PLACEHOLDER_IMAGES = [
    'photo-1649972904349-6e44c42644a7', // laptop woman
    'photo-1488590528505-98d2b5aba04b', // gray laptop
    'photo-1518770660439-4636190af475', // circuit board
    'photo-1461749280684-dccba630e2f6', // coding screen
    'photo-1486312338219-ce68d2c6f44d', // macbook
    'photo-1581091226825-a6a2a5aee158', // woman laptop
    'photo-1485827404703-89b55fcc595e', // white robot
    'photo-1526374965328-7f61d4dc18c5'  // matrix screen
].map(id => `https://images.unsplash.com/${id}?w=400&q=80`);

// Sound Effects
const SOUNDS = {
    flip: new Audio('./sounds/flip.wav'),
    match: new Audio('./sounds/match.wav'),
    wrong: new Audio('./sounds/wrong.wav'),
    win: new Audio('./sounds/win.wav')
};

// Preload sounds
Object.values(SOUNDS).forEach(sound => {
    sound.load();
});

// Game State
const state = {
    flippedCards: [],
    matchedPairs: 0,
    moves: 0,
    score: 0,
    gameStarted: false,
    timer: null,
    isPaused: false
};

// Initialize Game
function initializeGame() {
    createGeometricBackground();
    createCards();
    setupEventListeners();
    startTimer();
}

// Create Geometric Background
function createGeometricBackground() {
    const container = document.createElement('div');
    container.className = 'geometric-background';
    document.body.appendChild(container);

    for (let i = 0; i < 50; i++) {
        const shape = document.createElement('div');
        shape.className = 'geometric-shape';
        shape.style.left = `${Math.random() * 100}%`;
        shape.style.top = `${Math.random() * 100}%`;
        shape.style.animationDelay = `${Math.random() * 5}s`;
        container.appendChild(shape);
    }
}

// Create Cards
function createCards() {
    const gameContainer = document.querySelector('.game-container');
    const cardPairs = createCardPairs();
    const shuffledCards = shuffleArray(cardPairs);

    shuffledCards.forEach((card, index) => {
        const cardElement = createCardElement(card.value, card.imageUrl);
        gameContainer.appendChild(cardElement);
    });
}

// Create Card Pairs with Unique Images
function createCardPairs() {
    const pairs = [];
    for (let i = 0; i < CARD_PAIRS; i++) {
        // Create two cards with the same value and image
        pairs.push(
            { value: i, imageUrl: PLACEHOLDER_IMAGES[i] },
            { value: i, imageUrl: PLACEHOLDER_IMAGES[i] }
        );
    }
    return pairs;
}

// Create Card Element
function createCardElement(value, imageUrl) {
    const card = document.createElement('div');
    card.className = 'memory-card';
    card.dataset.value = value;

    const front = document.createElement('div');
    front.className = 'card-front';
    const img = document.createElement('img');
    img.src = imageUrl;
    img.className = 'card-image';
    front.appendChild(img);

    const back = document.createElement('div');
    back.className = 'card-back';

    card.appendChild(front);
    card.appendChild(back);

    return card;
}

// Event Handlers
function handleCardClick(card) {
    if (
        state.flippedCards.length === 2 ||
        state.flippedCards.includes(card) ||
        card.classList.contains('matched') ||
        state.isPaused
    ) {
        return;
    }

    try {
        // Play flip sound
        SOUNDS.flip.currentTime = 0;
        SOUNDS.flip.play().catch(err => console.log('Sound play error:', err));
    } catch (err) {
        console.log('Sound error:', err);
    }

    card.classList.add('flipped');
    state.flippedCards.push(card);

    if (state.flippedCards.length === 2) {
        state.moves++;
        updateMoves();
        checkMatch();
    }
}


// Check for Match
function checkMatch() {
    const [card1, card2] = state.flippedCards;
    const match = card1.dataset.value === card2.dataset.value;

    if (match) {
        handleMatch(card1, card2);
    } else {
        handleMismatch(card1, card2);
    }
}

// Handle Match
function handleMatch(card1, card2) {
    try {
        // Play match sound
        SOUNDS.match.currentTime = 0;
        SOUNDS.match.play().catch(err => console.log('Sound play error:', err));
    } catch (err) {
        console.log('Sound error:', err);
    }

    card1.classList.add('matched');
    card2.classList.add('matched');
    state.matchedPairs++;
    updateScore(10);

    if (state.matchedPairs === CARD_PAIRS) {
        endGame();
    }

    state.flippedCards = [];
}

// Handle Mismatch
function handleMismatch(card1, card2) {
    try {
        // Play wrong match sound
        SOUNDS.wrong.currentTime = 0;
        SOUNDS.wrong.play().catch(err => console.log('Sound play error:', err));
    } catch (err) {
        console.log('Sound error:', err);
    }

    setTimeout(() => {
        card1.classList.remove('flipped');
        card2.classList.remove('flipped');
        state.flippedCards = [];
    }, 1000);
    
    updateScore(-2);
}

// Timer
function startTimer() {
    const startTime = Date.now();
    const timerElement = document.getElementById('timer');

    state.timer = setInterval(() => {
        if (state.isPaused) return;
        
        const currentTime = Date.now();
        const difference = currentTime - startTime;
        const minutes = Math.floor(difference / 60000);
        const seconds = Math.floor((difference % 60000) / 1000);
        
        timerElement.textContent = 
            `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

// Update Score
function updateScore(points) {
    state.score += points;
    document.getElementById('score').textContent = state.score;
}

// Update Moves
function updateMoves() {
    document.getElementById('moves').textContent = state.moves;
}

// End Game
function endGame() {
    clearInterval(state.timer);
    
    try {
        // Play win sound
        SOUNDS.win.currentTime = 0;
        SOUNDS.win.play().catch(err => console.log('Sound play error:', err));
    } catch (err) {
        console.log('Sound error:', err);
    }
    
    showConfetti();
    
    setTimeout(() => {
        alert(`Congratulations! You won!\nFinal Score: ${state.score}\nMoves: ${state.moves}`);
    }, 1000);
}

// Show Confetti
function showConfetti() {
    const colors = ['#9b87f5', '#1EAEDB', '#7E69AB', '#D6BCFA'];
    
    for (let i = 0; i < 100; i++) {
        createConfettiPiece(colors[Math.floor(Math.random() * colors.length)]);
    }
}

// Create Confetti Piece
function createConfettiPiece(color) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    confetti.style.backgroundColor = color;
    confetti.style.left = Math.random() * 100 + 'vw';
    confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
    confetti.style.opacity = (Math.random() * 0.5 + 0.5).toString();
    document.body.appendChild(confetti);
    
    confetti.addEventListener('animationend', () => {
        confetti.remove();
    });
}

// Setup Event Listeners
function setupEventListeners() {
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', () => handleCardClick(card));
    });

    const pauseButton = document.getElementById('pauseButton');
    pauseButton.addEventListener('click', togglePause);
}

// Toggle Pause
function togglePause() {
    state.isPaused = !state.isPaused;
    document.getElementById('pauseButton').textContent = state.isPaused ? 'Resume' : 'Pause';
}

// Utility Functions
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize game when document is loaded
document.addEventListener('DOMContentLoaded', initializeGame);