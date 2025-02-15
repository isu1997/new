/**
 * AI Module for computer player logic
 * Implements different difficulty levels using various algorithms
 */

import { WINNING_COMBINATIONS, checkWinningCombination } from './gameState.js';

/**
 * Get computer move based on difficulty level
 * @param {Array} board Current game board
 * @param {String} difficulty Difficulty level (easy, medium, hard)
 * @returns {Number} Index for computer's move
 */
export function getComputerMove(board, difficulty) {
    switch (difficulty) {
        case 'easy':
            return getRandomMove(board);
        case 'medium':
            return getMediumMove(board);
        case 'hard':
            return getMinimaxMove(board);
        default:
            return getMediumMove(board);
    }
}

/**
 * Get a random valid move
 * @param {Array} board Current game board
 * @returns {Number} Random empty cell index
 */
function getRandomMove(board) {
    const emptyIndices = board
        .map((cell, index) => cell === '' ? index : null)
        .filter(index => index !== null);
    return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

/**
 * Get medium difficulty move (blocks wins or takes winning moves)
 * @param {Array} board Current game board
 * @returns {Number} Best move index for medium difficulty
 */
function getMediumMove(board) {
    // Try to win
    const winningMove = findBestMove(board, 'O');
    if (winningMove !== null) return winningMove;

    // Try to block opponent
    const blockingMove = findBestMove(board, 'X');
    if (blockingMove !== null) return blockingMove;

    // Take center if available
    if (board[4] === '') return 4;

    // Make a random move
    return getRandomMove(board);
}

/**
 * Find best move for a player
 * @param {Array} board Current game board
 * @param {String} player Current player (X or O)
 * @returns {Number|null} Best move index or null
 */
function findBestMove(board, player) {
    for (let combo of WINNING_COMBINATIONS) {
        const cells = combo.map(index => board[index]);
        const playerCells = cells.filter(cell => cell === player).length;
        const emptyCells = cells.filter(cell => cell === '').length;

        if (playerCells === 2 && emptyCells === 1) {
            return combo[cells.indexOf('')];
        }
    }
    return null;
}

/**
 * Get best move using minimax algorithm (hard difficulty)
 * @param {Array} board Current game board
 * @returns {Number} Best move index
 */
function getMinimaxMove(board) {
    let bestScore = -Infinity;
    let bestMove;

    for (let i = 0; i < board.length; i++) {
        if (board[i] === '') {
            board[i] = 'O';
            let score = minimax(board, 0, false);
            board[i] = '';
            if (score > bestScore) {
                bestScore = score;
                bestMove = i;
            }
        }
    }
    return bestMove;
}

/**
 * Minimax algorithm implementation
 * @param {Array} board Current game board
 * @param {Number} depth Current depth in the game tree
 * @param {Boolean} isMaximizing Whether current player is maximizing
 * @returns {Number} Best score for the current board state
 */
function minimax(board, depth, isMaximizing) {
    const scores = {
        X: -1,
        O: 1,
        draw: 0
    };

    // Check terminal states
    for (let combo of WINNING_COMBINATIONS) {
        if (checkWinningCombination(board, combo)) {
            return board[combo[0]] === 'O' ? scores.O : scores.X;
        }
    }

    if (board.every(cell => cell !== '')) return scores.draw;

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                bestScore = Math.max(bestScore, minimax(board, depth + 1, false));
                board[i] = '';
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                bestScore = Math.min(bestScore, minimax(board, depth + 1, true));
                board[i] = '';
            }
        }
        return bestScore;
    }
}