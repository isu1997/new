class AudioManager {
    constructor() {
        // Web Audio API setup
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.sounds = {
            background: this.createAudio('./assets/sounds/background-music.mp3', { loop: true, volume: 0.3 })
        };
        this.isMusicMuted = false;
        this.isSoundMuted = false;

        this.loadPreferences();
    }

    playButtonSound() {
        if (this.isSoundMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime); // A4 note
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.15);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.15);
    }

    playCollisionSound() {
        if (this.isSoundMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sawtooth';
        oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(50, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    playFoodSound() {
        if (this.isSoundMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(600, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.2, this.audioContext.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.1);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.1);
    }

    playGameOverSound() {
        if (this.isSoundMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(100, this.audioContext.currentTime + 0.5);
        
        gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.5);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.5);
    }

    playLevelUpSound() {
        if (this.isSoundMuted) return;
        
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
        oscillator.frequency.linearRampToValueAtTime(800, this.audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + 0.2);
        
        oscillator.connect(gainNode);
        gainNode.connect(this.audioContext.destination);
        
        oscillator.start();
        oscillator.stop(this.audioContext.currentTime + 0.2);
    }

    // המשך הפונקציות הקיימות למוזיקת רקע
    createAudio(filename, options = {}) {
        const audio = new Audio(filename);
        audio.loop = options.loop || false;
        audio.volume = options.volume || 1;
        return audio;
    }

    loadPreferences() {
        const preferences = JSON.parse(localStorage.getItem('audioPreferences') || '{}');
        this.isMusicMuted = preferences.isMusicMuted || false;
        this.isSoundMuted = preferences.isSoundMuted || false;
    }

    startBackgroundMusic() {
        if (!this.isMusicMuted) {
            this.sounds.background.play().catch(error => {
                console.info('Auto-play prevented:', error);
            });
        }
    }

    stopBackgroundMusic() {
        this.sounds.background.pause();
        this.sounds.background.currentTime = 0;
    }

    toggleMusic() {
        this.isMusicMuted = !this.isMusicMuted;
        if (this.isMusicMuted) {
            this.stopBackgroundMusic();
        } else {
            this.startBackgroundMusic();
        }
        return this.isMusicMuted;
    }

    toggleSound() {
        this.isSoundMuted = !this.isSoundMuted;
        return this.isSoundMuted;
    }
}

export const audioManager = new AudioManager();