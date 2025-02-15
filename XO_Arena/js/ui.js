/**
 * UI Module
 * Handles all user interface interactions and updates
 */

/**
 * Update game status message
 * @param {String} message Status message to display
 */
export function updateStatus(message) {
    document.getElementById('status-message').textContent = message;
}

/**
 * Update score display
 * @param {Object} scores Current scores object
 */
export function updateScores(scores) {
    document.getElementById('scoreX').textContent = scores.X;
    document.getElementById('scoreO').textContent = scores.O;
}

/**
 * Highlight winning cells
 * @param {Array} cells Array of cell elements
 * @param {Array} combination Winning combination indices
 */
export function highlightWinningCells(cells, combination) {
    combination.forEach(index => {
        cells[index].classList.add('winner');
        // Add pulsing animation
        cells[index].style.animation = 'winnerPulse 1.5s infinite';
    });
}

/**
 * Reset all cell styles
 * @param {Array} cells Array of cell elements
 */
export function resetCells(cells) {
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'winner');
        cell.style.animation = '';
    });
}

/**
 * Initialize particles background
 */
export function initializeParticles() {
    particlesJS('particles-js', {
        particles: {
            number: { value: 80 },
            color: { value: '#ffffff' },
            shape: { type: 'circle' },
            opacity: { value: 0.5 },
            size: { value: 3 },
            move: {
                enable: true,
                speed: 2,
                direction: 'none',
                random: false,
                straight: false,
                outMode: 'out'
            }
        }
    });
}

/**
 * Show game statistics
 * @param {Object} scores Current scores object
 */
export function showStats(scores) {
    const statsContainer = document.querySelector('.stats-container');
    const totalGames = scores.X + scores.O;
    
    statsContainer.innerHTML = `
        <div class="stat-item">
            <h4>Total Games</h4>
            <p>${totalGames}</p>
        </div>
        <div class="stat-item">
            <h4>Player X Wins</h4>
            <p>${scores.X} (${((scores.X / totalGames) * 100 || 0).toFixed(1)}%)</p>
        </div>
        <div class="stat-item">
            <h4>Player O Wins</h4>
            <p>${scores.O} (${((scores.O / totalGames) * 100 || 0).toFixed(1)}%)</p>
        </div>
    `;
}

/**
 * Play sound effect
 * @param {String} soundId ID of the audio element to play
 */
export function playSound(soundId) {
    const sound = document.getElementById(soundId);
    if (sound) {
        sound.currentTime = 0;
        sound.play().catch(error => {
            console.error('Error playing sound:', error);
        });
    }
}

/**
 * Update game mode UI
 * @param {String} mode Selected game mode ('PVP' or 'PVC')
 */
export function updateGameMode(mode) {
    document.getElementById('pvp-mode').classList.toggle('active', mode === 'PVP');
    document.getElementById('pvc-mode').classList.toggle('active', mode === 'PVC');
    document.querySelector('.difficulty-selection').style.display = 
        mode === 'PVC' ? 'flex' : 'none';
}

/**
 * Update difficulty selection UI
 * @param {String} level Selected difficulty level
 */
export function updateDifficulty(level) {
    document.querySelectorAll('.difficulty-btn').forEach(button => {
        button.classList.toggle('active', button.dataset.level === level);
    });
}