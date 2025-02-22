// Audio manager class for handling all game sound effects and controls
class AudioManager {
    constructor() {
        // Store references to audio DOM elements
        this.backgroundMusic = document.getElementById('background-music');
        this.correctSound = document.getElementById('correct-sound');
        this.wrongSound = document.getElementById('wrong-sound');
        
        // Set initial mute state
        this.isMuted = false;
        this.initializeAudio();
    }

    initializeAudio() {
        // Create mute button element
        const muteButton = document.createElement('button');
        muteButton.className = 'mute-btn';
        muteButton.innerHTML = '🔊';
        muteButton.onclick = () => this.toggleMute();
        document.body.appendChild(muteButton);
        
        // Initialize background music on first click
        document.addEventListener('click', () => {
            this.backgroundMusic.play();
        }, { once: true });
    }

    toggleMute() {
        // Switch mute state
        this.isMuted = !this.isMuted;
        
        // Update all audio elements mute status
        [this.backgroundMusic, this.correctSound, this.wrongSound].forEach(sound => {
            sound.muted = this.isMuted;
        });
        
        // Switch mute button icon based on state
        document.querySelector('.mute-btn').innerHTML = this.isMuted ? '🔈' : '🔊';
    }

    playSound(type) {
        switch(type) {
            case 'correct':
                // Play correct answer sound
                this.correctSound.currentTime = 0;
                this.correctSound.play();
                break;
            case 'wrong':
                // Play wrong answer sound
                this.wrongSound.currentTime = 0;
                this.wrongSound.play();
                break;
        }
    }
}