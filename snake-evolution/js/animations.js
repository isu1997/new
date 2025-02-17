// animations.js
export class AnimationManager {
    constructor(game) {
        this.game = game;
        this.particles = [];
        this.backgroundEffects = [];
        this.activeAnimations = new Set();
        
        // Particle configurations
        this.particleConfigs = {
            food: {
                count: 10,
                color: '#ff0000',
                size: { min: 2, max: 5 },
                speed: { min: 2, max: 4 },
                lifetime: { min: 30, max: 60 },
                gravity: 0.1
            },
            powerup: {
                count: 20,
                color: '#ffff00',
                size: { min: 3, max: 6 },
                speed: { min: 3, max: 5 },
                lifetime: { min: 40, max: 80 },
                gravity: -0.05
            },
            collision: {
                count: 15,
                color: '#ff4444',
                size: { min: 4, max: 8 },
                speed: { min: 4, max: 6 },
                lifetime: { min: 20, max: 40 },
                gravity: 0.15
            },
            levelUp: {
                count: 30,
                color: '#44ff44',
                size: { min: 3, max: 7 },
                speed: { min: 3, max: 7 },
                lifetime: { min: 50, max: 100 },
                gravity: -0.1
            }
        };

        this.initBackgroundEffects();
    }

    createParticle(x, y, config) {
        const angle = Math.random() * Math.PI * 2;
        const speed = config.speed.min + Math.random() * (config.speed.max - config.speed.min);
        const size = config.size.min + Math.random() * (config.size.max - config.size.min);
        const lifetime = config.lifetime.min + Math.random() * (config.lifetime.max - config.lifetime.min);

        return {
            x,
            y,
            size,
            color: config.color,
            age: 0,
            maxAge: lifetime,
            velocity: {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            },
            gravity: config.gravity,
            alpha: 1,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 10
        };
    }

    update() {
        // Update particles
        this.particles = this.particles.filter(particle => {
            // Update position
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;
            
            // Apply gravity
            particle.velocity.y += particle.gravity;
            
            // Update rotation
            particle.rotation += particle.rotationSpeed;
            
            // Update alpha based on age
            particle.age++;
            particle.alpha = 1 - (particle.age / particle.maxAge);
            
            return particle.age < particle.maxAge;
        });

        // Update background effects
        this.backgroundEffects.forEach(effect => {
            effect.x += Math.cos(effect.angle) * effect.speed;
            effect.y += Math.sin(effect.angle) * effect.speed;
            effect.angle += effect.rotationSpeed;

            // Wrap around screen
            if (effect.x < 0) effect.x = this.game.canvas.width;
            if (effect.x > this.game.canvas.width) effect.x = 0;
            if (effect.y < 0) effect.y = this.game.canvas.height;
            if (effect.y > this.game.canvas.height) effect.y = 0;
        });
    }

    render(ctx) {
        // Render background effects
        ctx.save();
        ctx.globalAlpha = 0.15;
        this.backgroundEffects.forEach(effect => {
            ctx.beginPath();
            ctx.arc(effect.x, effect.y, effect.size, 0, Math.PI * 2);
            ctx.fillStyle = effect.color;
            ctx.fill();
        });
        ctx.restore();

        // Render particles
        this.particles.forEach(particle => {
            ctx.save();
            ctx.globalAlpha = particle.alpha;
            ctx.translate(particle.x, particle.y);
            ctx.rotate(particle.rotation * Math.PI / 180);
            
            // Draw particle shape
            if (particle.shape === 'star') {
                this.drawStar(ctx, 0, 0, particle.size);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = particle.color;
                ctx.fill();
            }
            
            ctx.restore();
        });
    }

    drawStar(ctx, x, y, size) {
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
            const angle = (i * Math.PI * 2) / 5 - Math.PI / 2;
            const length = i === 0 ? size : size / 2;
            if (i === 0) {
                ctx.moveTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
            } else {
                ctx.lineTo(x + length * Math.cos(angle), y + length * Math.sin(angle));
            }
        }
        ctx.closePath();
        ctx.fill();
    }

    triggerEffect(type, x, y) {
        const config = this.particleConfigs[type];
        if (!config) return;

        for (let i = 0; i < config.count; i++) {
            this.particles.push(this.createParticle(x, y, config));
        }

        // Add special effects based on type
        switch(type) {
            case 'levelUp':
                this.triggerScreenFlash('#44ff44', 0.3);
                break;
            case 'collision':
                this.triggerScreenShake(500, 5);
                break;
            case 'powerup':
                this.triggerPowerUpAnimation(x, y);
                break;
        }
    }

    triggerScreenFlash(color, intensity) {
        const flash = document.createElement('div');
        flash.style.position = 'fixed';
        flash.style.top = '0';
        flash.style.left = '0';
        flash.style.width = '100%';
        flash.style.height = '100%';
        flash.style.backgroundColor = color;
        flash.style.opacity = intensity;
        flash.style.pointerEvents = 'none';
        flash.style.transition = 'opacity 0.5s';
        
        document.body.appendChild(flash);
        
        setTimeout(() => {
            flash.style.opacity = '0';
            setTimeout(() => flash.remove(), 500);
        }, 50);
    }

    triggerScreenShake(duration, intensity) {
        const canvas = this.game.canvas;
        const originalStyle = canvas.style.transform;
        let start = performance.now();

        const shake = (timestamp) => {
            const elapsed = timestamp - start;
            if (elapsed < duration) {
                const x = (Math.random() - 0.5) * intensity;
                const y = (Math.random() - 0.5) * intensity;
                canvas.style.transform = `translate(${x}px, ${y}px)`;
                requestAnimationFrame(shake);
            } else {
                canvas.style.transform = originalStyle;
            }
        };

        requestAnimationFrame(shake);
    }

    triggerPowerUpAnimation(x, y) {
        const rings = 3;
        for (let i = 0; i < rings; i++) {
            setTimeout(() => {
                this.createExpandingRing(x, y, i * 20);
            }, i * 200);
        }
    }

    createExpandingRing(x, y, delay) {
        const ring = {
            x,
            y,
            radius: 0,
            maxRadius: 50,
            age: 0,
            maxAge: 30,
            delay
        };

        const animate = () => {
            if (ring.age >= ring.maxAge) return;
            
            ring.age++;
            ring.radius = (ring.age / ring.maxAge) * ring.maxRadius;
            
            this.game.ctx.save();
            this.game.ctx.beginPath();
            this.game.ctx.arc(ring.x, ring.y, ring.radius, 0, Math.PI * 2);
            this.game.ctx.strokeStyle = `rgba(255, 255, 255, ${1 - ring.age / ring.maxAge})`;
            this.game.ctx.lineWidth = 2;
            this.game.ctx.stroke();
            this.game.ctx.restore();
            
            requestAnimationFrame(animate);
        };

        setTimeout(animate, delay);
    }

    initBackgroundEffects() {
        const numEffects = 50;
        for (let i = 0; i < numEffects; i++) {
            this.backgroundEffects.push({
                x: Math.random() * this.game.canvas.width,
                y: Math.random() * this.game.canvas.height,
                size: Math.random() * 2 + 1,
                speed: Math.random() * 0.3 + 0.1,
                angle: Math.random() * Math.PI * 2,
                rotationSpeed: (Math.random() - 0.5) * 0.02,
                color: `rgba(255, 255, 255, ${Math.random() * 0.5 + 0.5})`
            });
        }
    }

    clearEffects() {
        this.particles = [];
        this.backgroundEffects = [];
        this.activeAnimations.clear();
    }
}