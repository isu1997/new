// Audio Context and Oscillator setup
let audioContext;
let oscillators = [];

// Initialize audio context
function initAudio() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
}

// Create and play a sound with specific frequency and duration
function playSound(frequency, duration, type = 'sine', volume = 0.3) {
    if (!audioContext) initAudio();
    
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.type = type;
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    
    gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.start();
    oscillators.push(oscillator);
    setTimeout(() => {
        oscillator.stop();
        oscillators = oscillators.filter(osc => osc !== oscillator);
    }, duration * 1000);
}

// Play multiple frequencies in sequence
function playSequence(notes) {
    let timeOffset = 0;
    notes.forEach(({frequency, duration, type, volume}) => {
        setTimeout(() => playSound(frequency, duration, type, volume), timeOffset * 1000);
        timeOffset += duration;
    });
}

// Different sound effects
export const sounds = {
    // Regular food collection (simple ascending notes)
    regularFood: () => playSequence([
        { frequency: 440, duration: 0.1, type: 'sine', volume: 0.3 },
        { frequency: 550, duration: 0.1, type: 'sine', volume: 0.3 }
    ]),
    
    // Heart power-up (sparkly sound)
    heartPowerUp: () => playSequence([
        { frequency: 880, duration: 0.1, type: 'sine', volume: 0.3 },
        { frequency: 1320, duration: 0.1, type: 'sine', volume: 0.3 },
        { frequency: 1760, duration: 0.1, type: 'sine', volume: 0.3 }
    ]),
    
    // Shrink power-up (descending scale)
    shrinkPowerUp: () => playSequence([
        { frequency: 880, duration: 0.1, type: 'square', volume: 0.2 },
        { frequency: 660, duration: 0.1, type: 'square', volume: 0.2 },
        { frequency: 440, duration: 0.1, type: 'square', volume: 0.2 }
    ]),
    
    // Level up (triumphant fanfare)
    levelUp: () => playSequence([
        { frequency: 440, duration: 0.1, type: 'square', volume: 0.3 },
        { frequency: 554, duration: 0.1, type: 'square', volume: 0.3 },
        { frequency: 659, duration: 0.1, type: 'square', volume: 0.3 },
        { frequency: 880, duration: 0.2, type: 'square', volume: 0.3 }
    ]),
    
    // Heart loss (short warning sound)
    heartLoss: () => playSequence([
        { frequency: 440, duration: 0.1, type: 'sawtooth', volume: 0.25 },
        { frequency: 220, duration: 0.2, type: 'sawtooth', volume: 0.25 }
    ]),
    
    // Game over (dramatic descending sequence)
    gameOver: () => playSequence([
        { frequency: 880, duration: 0.2, type: 'sawtooth', volume: 0.3 },
        { frequency: 784, duration: 0.2, type: 'sawtooth', volume: 0.3 },
        { frequency: 659, duration: 0.2, type: 'sawtooth', volume: 0.3 },
        { frequency: 587, duration: 0.3, type: 'sawtooth', volume: 0.3 }
    ]),
    
    // Time freeze (ethereal sound)
    timeFreeze: () => playSequence([
        { frequency: 880, duration: 0.3, type: 'sine', volume: 0.3 },
        { frequency: 440, duration: 0.3, type: 'sine', volume: 0.3 },
        { frequency: 880, duration: 0.3, type: 'sine', volume: 0.3 }
    ]),
    
    // Button clicks (short, gentle click)
    buttonClick: () => playSequence([
        { frequency: 1200, duration: 0.03, type: 'sine', volume: 0.1 }
    ]),
    
    // Pause button (subtle toggle sound)
    pauseButton: () => playSequence([
        { frequency: 660, duration: 0.05, type: 'sine', volume: 0.1 },
        { frequency: 880, duration: 0.05, type: 'sine', volume: 0.1 }
    ]),
    
    // Start/Restart button (gentle start sound)
    startButton: () => playSequence([
        { frequency: 440, duration: 0.05, type: 'sine', volume: 0.15 },
        { frequency: 660, duration: 0.05, type: 'sine', volume: 0.15 },
        { frequency: 880, duration: 0.1, type: 'sine', volume: 0.15 }
    ])
};

// Clean up function to stop all active sounds
export function cleanup() {
    oscillators.forEach(osc => {
        try {
            osc.stop();
        } catch (e) {
            // Ignore errors if oscillator is already stopped
        }
    });
    oscillators = [];
}