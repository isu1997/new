class AudioManager {
    constructor() {
        // Web Audio API setup
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // מצב השמע
        this.isMusicMuted = false;
        this.isSoundMuted = false;
        this.isInitialized = false;
        
        // יצירת נגן המוזיקה
        this.backgroundMusic = new Audio('assets/sounds/background-music.mp3');
        this.backgroundMusic.loop = true;
        this.backgroundMusic.volume = 0.3;
        
        // טעינת העדפות
        this.loadPreferences();

        // הפעלה אוטומטית בלחיצה ראשונה
        document.addEventListener('click', () => this.initializeAudioContext(), { once: true });

        // הוספת מאזינים לכפתורים
        this.setupButtonListeners();

        // קשירת המתודות לאובייקט
        this.playButtonSound = this.playButtonSound.bind(this);
        this.playFoodSound = this.playFoodSound.bind(this);
        this.playCollisionSound = this.playCollisionSound.bind(this);
        this.playGameOverSound = this.playGameOverSound.bind(this);
        this.playLevelUpSound = this.playLevelUpSound.bind(this);
    }

    setupButtonListeners() {
        document.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                this.playButtonSound();
            }
        });
    }

   async initializeAudioContext() {
    if (!this.isInitialized) {
        try {
            await this.audioContext.resume();
            
            // יצירת GainNode גלובלי
            this.masterGainNode = this.audioContext.createGain();
            this.masterGainNode.connect(this.audioContext.destination);
            
            // התאמת עוצמת הקול
            this.masterGainNode.gain.value = 0.3;
            
            this.isInitialized = true;
            console.log('AudioContext initialized successfully');
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
        }
    }
}

    createTone(frequency, duration, type = 'sine') {
    if (this.isSoundMuted || !this.isInitialized) return;
    
    try {
        const oscillator = this.audioContext.createOscillator();
        const gainNode = this.audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(this.masterGainNode);
        
        oscillator.type = type;
        oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
        
        gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, this.audioContext.currentTime + 0.01);
        gainNode.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
        
        oscillator.start(this.audioContext.currentTime);
        oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
        console.warn('Error creating tone:', error);
    }
}

    playButtonSound() {
        if (!this.isSoundMuted) {
            this.createTone(800, 0.1, 'sine');
        }
    }

    playFoodSound() {
        if (!this.isSoundMuted) {
            this.createTone(400, 0.1, 'sine');
            setTimeout(() => this.createTone(600, 0.1, 'sine'), 100);
        }
    }

    playCollisionSound() {
        if (!this.isSoundMuted) {
            this.createTone(200, 0.3, 'sawtooth');
        }
    }

    playGameOverSound() {
        if (!this.isSoundMuted) {
            this.createTone(600, 0.2, 'sine');
            setTimeout(() => this.createTone(400, 0.2, 'sine'), 200);
            setTimeout(() => this.createTone(200, 0.3, 'sine'), 400);
        }
    }

    playLevelUpSound() {
        if (!this.isSoundMuted) {
            this.createTone(400, 0.1, 'sine');
            setTimeout(() => this.createTone(600, 0.1, 'sine'), 100);
            setTimeout(() => this.createTone(800, 0.2, 'sine'), 200);
        }
    }

    startBackgroundMusic() {
        if (!this.isMusicMuted) {
            this.backgroundMusic.play().catch(error => {
                console.info('Auto-play prevented:', error);
            });
        }
    }

    stopBackgroundMusic() {
        this.backgroundMusic.pause();
        this.backgroundMusic.currentTime = 0;
    }

    loadPreferences() {
        try {
            const preferences = JSON.parse(localStorage.getItem('audioPreferences') || '{}');
            this.isMusicMuted = preferences.isMusicMuted || false;
            this.isSoundMuted = preferences.isSoundMuted || false;
        } catch (error) {
            console.warn('Error loading audio preferences:', error);
        }
    }

    savePreferences() {
        try {
            const preferences = {
                isMusicMuted: this.isMusicMuted,
                isSoundMuted: this.isSoundMuted
            };
            localStorage.setItem('audioPreferences', JSON.stringify(preferences));
        } catch (error) {
            console.warn('Error saving audio preferences:', error);
        }
    }

    toggleMusic() {
        this.isMusicMuted = !this.isMusicMuted;
        if (this.isMusicMuted) {
            this.stopBackgroundMusic();
        } else {
            this.startBackgroundMusic();
        }
        this.savePreferences();
        return this.isMusicMuted;
    }

    toggleSound() {
        this.isSoundMuted = !this.isSoundMuted;
        this.savePreferences();
        return this.isSoundMuted;
    }
}

// יצירת instance יחיד של מנהל האודיו
const audioManager = new AudioManager();

// חשיפת הפונקציות הנדרשות לשימוש חיצוני
export const {
    playFoodSound,
    playCollisionSound,
    playGameOverSound,
    playLevelUpSound,
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleMusic,
    toggleSound
} = audioManager;

export { audioManager };