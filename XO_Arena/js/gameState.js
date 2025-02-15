/**
 * Game state management module
 * Handles the core game state and its modifications
 */

// Initial game state
export const gameState = {
    board: Array(9).fill(''),
    currentPlayer: 'X',
    gameMode: 'PVC',
    difficulty: 'medium',
    scores: {
        X: 0,
        O: 0
    },
    isGameActive: true
};

// Winning combinations for the game board
export const WINNING_COMBINATIONS = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
];

/**
 * Check if current board state has a winner
 * @param {Array} board Current game board
 * @param {Array} combination Winning combination to check
 * @returns {Boolean} True if combination is winning
 */
export function checkWinningCombination(board, combination) {
    const [a, b, c] = combination;
    return board[a] && board[a] === board[b] && board[a] === board[c];
}

/**
 * Save game scores to localStorage
 * @param {Object} scores Current scores object
 */
export function saveScores(scores) {
    localStorage.setItem('tictactoeScores', JSON.stringify(scores));
}

/**
 * Load saved scores from localStorage
 * @returns {Object} Saved scores or default scores object
 */
export function loadScores() {
    const savedScores = localStorage.getItem('tictactoeScores');
    return savedScores ? JSON.parse(savedScores) : { X: 0, O: 0 };
}

/**
 * Check if the game is a draw
 * @param {Array} board Current game board
 * @returns {Boolean} True if game is a draw
 */
export function isDraw(board) {
    return board.every(cell => cell !== '');
}