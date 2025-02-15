/**
 * Main Game Module
 * Coordinates game logic and combines all other modules
 */

import { gameState, WINNING_COMBINATIONS, saveScores, loadScores, isDraw } from './gameState.js';
import { getComputerMove } from './ai.js';
import * as UI from './ui.js';

// DOM Elements
const cells = document.querySelectorAll('[data-cell]');
const resetButton = document.getElementById('reset-game');
const pvpButton = document.getElementById('pvp-mode');
const pvcButton = document.getElementById('pvc-mode');
const difficultyButtons = document.querySelectorAll('.difficulty-btn');
const statsButton = document.getElementById('show-stats');
const statsModal = new bootstrap.Modal(document.getElementById('statsModal'));

/**
 * Initialize game
 * Set up event listeners and initial state
 */
function initializeGame() {
    // Add event listeners
    cells.forEach(cell => cell.addEventListener('click', handleCellClick));
    resetButton.addEventListener('click', () => {
        UI.playSound('sound-button');
        resetGame();
    });
    
    pvpButton.addEventListener('click', () => {
        UI.playSound('sound-button');
        setGameMode('PVP');
    });
    
    pvcButton.addEventListener('click', () => {
        UI.playSound('sound-button');
        setGameMode('PVC');
    });
    
    difficultyButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            UI.playSound('sound-button');
            setDifficulty(e.target.dataset.level);
        });
    });

    statsButton.addEventListener('click', () => {
        UI.playSound('sound-button');
        UI.showStats(gameState.scores);
        statsModal.show();
    });

    // Load saved scores
    gameState.scores = loadScores();
    UI.updateScores(gameState.scores);

    // Initialize UI
    UI.initializeParticles();
    UI.updateGameMode(gameState.gameMode);
    UI.updateDifficulty(gameState.difficulty);
}

/**
 * Handle cell click event
 * @param {Event} e Click event
 */
function handleCellClick(e) {
    const cell = e.target;
    const index = Array.from(cells).indexOf(cell);

    // בדיקה אם התא תפוס או שהמשחק הסתיים
    if (gameState.board[index] !== '' || !gameState.isGameActive) return;
    
    // בדיקה שזה לא תור המחשב
    if (gameState.gameMode === 'PVC' && gameState.currentPlayer === 'O') return;

    makeMove(index);

    // תור המחשב רק אם המשחק עדיין פעיל
    if (gameState.gameMode === 'PVC' && gameState.isGameActive) {
        setTimeout(computerMove, 500);
    }
}

function makeMove(index) {
    gameState.board[index] = gameState.currentPlayer;
    cells[index].textContent = gameState.currentPlayer;
    cells[index].classList.add(gameState.currentPlayer.toLowerCase());
    
    UI.playSound(`sound-${gameState.currentPlayer.toLowerCase()}`);
    
    if (checkWin()) {
        endGame(false);
    } else if (isDraw(gameState.board)) {
        endGame(true);
    } else {
        gameState.currentPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';
        UI.updateStatus(`Player ${gameState.currentPlayer}'s Turn`);
    }
}

function computerMove() {
    if (!gameState.isGameActive || gameState.currentPlayer !== 'O') return;
    
    const index = getComputerMove(gameState.board, gameState.difficulty);
    if (index !== undefined && index !== null) {
        makeMove(index);
    }
}

/**
 * Check for a win
 * @returns {Boolean} True if there's a winner
 */
function checkWin() {
    return WINNING_COMBINATIONS.some(combination => {
        const win = combination.every(index => 
            gameState.board[index] === gameState.currentPlayer
        );
        if (win) {
            UI.highlightWinningCells(cells, combination);
        }
        return win;
    });
}

/**
 * End the game
 * @param {Boolean} isDraw True if game ended in a draw
 */
function endGame(isDraw) {
    gameState.isGameActive = false;
    
    if (isDraw) {
        UI.updateStatus("It's a Draw!");
        UI.playSound('sound-lose');
    } else {
        const winner = gameState.currentPlayer;
        UI.updateStatus(`Player ${winner} Wins!`);
        gameState.scores[winner]++;
        UI.updateScores(gameState.scores);
        saveScores(gameState.scores);
        
        // אם המנצח הוא X (השחקן) - צליל ניצחון, אם O (המחשב) - צליל הפסד
        if (gameState.gameMode === 'PVC') {
            UI.playSound(winner === 'X' ? 'sound-win' : 'sound-lose');
        } else {
            // במצב משחק נגד חבר תמיד נשמיע צליל ניצחון
            UI.playSound('sound-win');
        }
    }
}

/**
 * Reset the game
 */
function resetGame() {
    gameState.board = Array(9).fill('');
    gameState.currentPlayer = 'X';
    gameState.isGameActive = true;

    UI.resetCells(cells);
    UI.updateStatus("Player X's Turn");
    UI.playSound('sound-button');
}

/**
 * Set game mode
 * @param {String} mode Game mode ('PVP' or 'PVC')
 */
function setGameMode(mode) {
    gameState.gameMode = mode;
    UI.updateGameMode(mode);
    UI.playSound('sound-button');
    resetGame();
}

/**
 * Set difficulty level
 * @param {String} level Difficulty level
 */
function setDifficulty(level) {
    gameState.difficulty = level;
    UI.updateDifficulty(level);
    UI.playSound('sound-button');
    resetGame();
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeGame);