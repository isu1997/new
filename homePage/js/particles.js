// Particles Animation - Background visual effect with floating elements

document.addEventListener('DOMContentLoaded', function() {
    // Create canvas element dynamically
    const canvas = document.createElement('canvas');
    canvas.id = 'particles-canvas';
    document.body.prepend(canvas);
    
    // Get rendering context for drawing
    const ctx = canvas.getContext('2d');
    
    // Set canvas dimensions to match viewport
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    
    // Position canvas as fixed background layer
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.pointerEvents = 'none'; // Allow interaction with elements beneath
    canvas.style.zIndex = '-1'; // Place behind all content
    
    // Particle configuration
    const particlesArray = [];
    const numberOfParticles = Math.min(window.innerWidth / 15, 60); // Adaptive density based on screen size
    
    // Theme-specific color palettes
    const lightColors = ['#F2FCE2', '#FEF7CD', '#FEC6A1', '#E5DEFF', '#FFDEE2', '#FDE1D3', '#D3E4FD', '#F1F0FB'];
    const darkColors = ['#8B5CF6', '#D946EF', '#F97316', '#0EA5E9', '#1EAEDB', '#33C3F0', '#0FA0CE'];
    
    // Responsive canvas resizing
    window.addEventListener('resize', function() {
        // Update canvas dimensions on window resize
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        // Recreate particles for new dimensions
        particlesArray.length = 0;
        init();
    });
    
    // Particle class definition
    class Particle {
        constructor() {
            // Random initial position within canvas
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            // Varied particle sizes for depth effect
            this.size = Math.random() * 20 + 5;  
            // Subtle random movement in both axes
            this.speedX = Math.random() * 0.5 - 0.25; // Gentle horizontal drift
            this.speedY = Math.random() * 0.5 - 0.25; // Gentle vertical drift
            // Select color based on current theme
            this.color = document.body.classList.contains('dark') ? 
                darkColors[Math.floor(Math.random() * darkColors.length)] : 
                lightColors[Math.floor(Math.random() * lightColors.length)];
            // Varied transparency for layered effect
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        // Update particle position each frame
        update() {
            // Apply movement vectors
            this.x += this.speedX;
            this.y += this.speedY;
            
            // Bounce off canvas boundaries
            if (this.x < 0 || this.x > canvas.width) {
                this.speedX = -this.speedX;
            }
            if (this.y < 0 || this.y > canvas.height) {
                this.speedY = -this.speedY;
            }
        }
        
        // Render particle to canvas
        draw() {
            // Save current context state
            ctx.save();
            ctx.globalAlpha = this.opacity;
            ctx.fillStyle = this.color;
            
            // Create circular particle shape
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size / 2, 0, Math.PI * 2);
            ctx.fill();
            
            // Restore context to previous state
            ctx.restore();
        }
    }
    
    // Initialize particle system
    function init() {
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    
    // Main animation loop
    function animate() {
        // Clear previous frame
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Update and render each particle
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        
        // Continue animation loop
        requestAnimationFrame(animate);
    }
    
    // Start particle system
    init();
    animate();
    
    // Theme change handler - update particle colors
    document.getElementById('theme-toggle').addEventListener('click', function() {
        // Refresh all particle colors when theme toggles
        particlesArray.forEach(particle => {
            particle.color = document.body.classList.contains('dark') ? 
                darkColors[Math.floor(Math.random() * darkColors.length)] : 
                lightColors[Math.floor(Math.random() * lightColors.length)];
        });
    });
});
