// powerups.js
export class PowerUpManager {
    constructor(game) {
        this.game = game;
        this.activePowerUps = new Map();
        this.powerUpTypes = {
            SHIELD: 'shield',
            SPEED: 'speed',
            MAGNET: 'magnet',
            INVINCIBLE: 'invincible',
            MULTI_SCORE: 'multiScore',
            TIME_FREEZE: 'timeFreeze'
        };

        this.powerUpConfig = {
            [this.powerUpTypes.SHIELD]: {
                duration: 5000,
                color: '#4169E1',
                symbol: '🛡️',
                unlockLevel: 2,
                effect: () => this.game.hasShield = true,
                deactivate: () => this.game.hasShield = false
            },
            [this.powerUpTypes.SPEED]: {
                duration: 3000,
                color: '#FFD700',
                symbol: '⚡',
                unlockLevel: 3,
                effect: () => this.game.gameSpeed = this.game.baseGameSpeed * 0.5,
                deactivate: () => this.game.gameSpeed = this.game.baseGameSpeed
            },
            [this.powerUpTypes.MAGNET]: {
                duration: 4000,
                color: '#FF1493',
                symbol: '🧲',
                unlockLevel: 4,
                effect: () => this.game.hasMagnet = true,
                deactivate: () => this.game.hasMagnet = false
            },
            [this.powerUpTypes.INVINCIBLE]: {
                duration: 3000,
                color: '#9400D3',
                symbol: '⭐',
                unlockLevel: 5,
                effect: () => this.game.isInvincible = true,
                deactivate: () => this.game.isInvincible = false
            },
            [this.powerUpTypes.MULTI_SCORE]: {
                duration: 5000,
                color: '#32CD32',
                symbol: '×2',
                unlockLevel: 6,
                effect: () => this.game.scoreMultiplier = 2,
                deactivate: () => this.game.scoreMultiplier = 1
            },
            [this.powerUpTypes.TIME_FREEZE]: {
                duration: 3000,
                color: '#87CEEB',
                symbol: '❄️',
                unlockLevel: 7,
                effect: () => this.game.timeScale = 0.5,
                deactivate: () => this.game.timeScale = 1
            }
        };
    }

    generate(excludePositions) {
        if (Math.random() < 0.1 && !this.game.powerUp) {
            const availableTypes = Object.values(this.powerUpTypes)
                .filter(type => this.isUnlockedForLevel(type));
            
            if (availableTypes.length === 0) return null;
            
            const type = availableTypes[Math.floor(Math.random() * availableTypes.length)];
            const position = this.game.utils.getRandomPosition(
                this.game.gridSize,
                1,
                excludePositions
            );

            return {
                ...position,
                type,
                ...this.powerUpConfig[type]
            };
        }
        return null;
    }

    isUnlockedForLevel(type) {
        return this.game.level >= this.powerUpConfig[type].unlockLevel;
    }

    activate(type) {
        const powerUp = this.powerUpConfig[type];
        if (!powerUp) return;

        // Clear existing power-up of the same type
        if (this.activePowerUps.has(type)) {
            this.deactivate(type);
            clearTimeout(this.activePowerUps.get(type));
        }

        // Apply effect
        powerUp.effect();

        // Play sound effect
        this.game.audioManager.play('powerup');

        // Create visual effect
        this.game.animationManager.triggerPowerUpEffect(type);

        // Set timer for deactivation
        const timeout = setTimeout(() => {
            this.deactivate(type);
        }, powerUp.duration);

        this.activePowerUps.set(type, timeout);

        // Update UI
        this.updatePowerUpIndicator(type, powerUp.duration);
    }

    deactivate(type) {
        const powerUp = this.powerUpConfig[type];
        if (!powerUp) return;

        // Remove effect
        powerUp.deactivate();

        // Clear from active power-ups
        this.activePowerUps.delete(type);

        // Update UI
        this.removePowerUpIndicator(type);
    }

    updatePowerUpIndicator(type, duration) {
        const indicator = document.createElement('div');
        indicator.className = 'power-up-item active';
        indicator.innerHTML = `
            <span class="power-up-symbol">${this.powerUpConfig[type].symbol}</span>
            <span class="power-up-timer">${Math.ceil(duration / 1000)}s</span>
        `;
        
        const container = document.getElementById('powerUpIndicator');
        container.appendChild(indicator);

        // Start countdown
        let timeLeft = duration;
        const timer = setInterval(() => {
            timeLeft -= 1000;
            if (timeLeft <= 0) {
                clearInterval(timer);
                indicator.remove();
            } else {
                indicator.querySelector('.power-up-timer').textContent = 
                    `${Math.ceil(timeLeft / 1000)}s`;
            }
        }, 1000);
    }

    removePowerUpIndicator(type) {
        const container = document.getElementById('powerUpIndicator');
        const indicators = container.getElementsByClassName('power-up-item');
        for (const indicator of indicators) {
            if (indicator.querySelector('.power-up-symbol').textContent === 
                this.powerUpConfig[type].symbol) {
                indicator.remove();
                break;
            }
        }
    }

    clearAll() {
        this.activePowerUps.forEach((timeout, type) => {
            clearTimeout(timeout);
            this.deactivate(type);
        });
        this.activePowerUps.clear();
        
        // Clear all indicators
        const container = document.getElementById('powerUpIndicator');
        container.innerHTML = '';
    }

    getActivePowerUps() {
        return Array.from(this.activePowerUps.keys());
    }

    hasActivePowerUp(type) {
        return this.activePowerUps.has(type);
    }
}