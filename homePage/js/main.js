// DOM Elements - Key interface elements selected for manipulation
const body = document.body;
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const themeToggle = document.getElementById('theme-toggle');
const backToTop = document.getElementById('back-to-top');
const contactForm = document.getElementById('contact-form');
const navLinks = document.querySelectorAll('.nav-menu a');

// Mobile-specific adjustments - Responsive design changes for smaller screens
const isMobile = window.innerWidth <= 768;
if (isMobile) {
    // Adjust title structure for mobile view
    const titleElement = document.querySelector('.title');
    if (titleElement) {
        const lines = titleElement.querySelectorAll('.typing-line');
        if (lines.length === 2) {
            // Modify text content for better mobile display
            lines[0].setAttribute('data-text', "I'm Israel");  // Remove | for mobile
            
            // Create new line element for better text distribution
            const newLine = document.createElement('span');
            newLine.className = 'typing-line';
            newLine.setAttribute('data-text', "Fullstack Developer");
            
            // Insert new line keeping original structure
            titleElement.insertBefore(newLine, lines[1]);
        }
    }
}

// Typing animation setup - Controls text rotation effect
let currentTypingIndex = 0;
const typingLines = document.querySelectorAll('.typing-line');

// Initialize typing lines visibility state
for (let i = 0; i < typingLines.length; i++) {
    if (i > 0) {
        typingLines[i].style.display = 'none';
    } else if (i === 0 && typingLines[i]) {
        // Display first line content initially
        typingLines[i].textContent = typingLines[i].getAttribute('data-text');
    }
}

// Animation function for typing effect rotation
function animateTyping() {
    // Guard clause for empty elements
    if (typingLines.length === 0) return;
    
    // Hide current line before transitioning
    typingLines[currentTypingIndex].style.display = 'none';
    
    // Cycle to next line with modulo for infinite rotation
    currentTypingIndex = (currentTypingIndex + 1) % typingLines.length;
    
    // Update and display next line
    typingLines[currentTypingIndex].textContent = typingLines[currentTypingIndex].getAttribute('data-text');
    typingLines[currentTypingIndex].style.display = 'block';
}

// Initialize typing animation if elements exist
if (typingLines.length > 0) {
    setInterval(animateTyping, 5000); // Change every 5 seconds
}

// Mobile Navigation - Hamburger menu toggle functionality
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close mobile menu when clicking outside navigation area
    document.addEventListener('click', (e) => {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });
}

// Smooth scroll functionality for navigation links
if (navLinks) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Only process internal page links
            if (link.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetSection = document.querySelector(targetId);
                if (targetSection) {
                    // Smooth scroll to target section
                    targetSection.scrollIntoView({ behavior: 'smooth' });
                    
                    // Update active state in navigation
                    navLinks.forEach(link => link.classList.remove('active'));
                    link.classList.add('active');
                    
                    // Close mobile menu after navigation
                    if (navToggle && navMenu) {
                        navToggle.classList.remove('active');
                        navMenu.classList.remove('active');
                    }
                }
            }
        });
    });
}

// Back to Top Button - Shows/hides button based on scroll position
if (backToTop) {
    window.addEventListener('scroll', () => {
        // Toggle button visibility based on scroll position
        if (window.scrollY > 100) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
        
        // Update active navigation link based on current scroll position
        const sections = document.querySelectorAll('section');
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 100;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                if (navLinks) {
                    navLinks.forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === '#' + section.id) {
                            link.classList.add('active');
                        }
                    });
                }
            }
        });
    });

    // Smooth scroll to top when button is clicked
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Project data - Static content for portfolio showcase
// Page Center project collection - Basic HTML/CSS projects
const pageCenterProjects = [
    {
        id: 'coffee-shop',
        title: "Coffee Shop",
        description: "Unlock a world of indulgence with our café store! Sign up now and treat yourself to a complimentary cup of coffee on us.",
        image: "homePage/images/coffeeShop.png",
        link: "homePage/project.html?project=1",
        tech: ["html", "css"]
    },
    {
        id: 'fashion-store',
        title: "Fashion Store",
        description: "Your one-stop destination for fashion. Discover latest trends and unique styles, all in one place!",
        image: "homePage/images/fashionStore.png",
        link: "homePage/project.html?project=2",
        tech: ["html", "css"]
    },
    {
        id: 'gift-store',
        title: "Gift Store",
        description: "Find the perfect gift for every occasion. Make moments special with our curated collection!",
        image: "homePage/images/giftStore.png",
        link: "homePage/project.html?project=3",
        tech: ["html", "css"]
    },
    {
        id: 'custom-website',
        title: "Custom Website",
        description: "A showcase of modern web design. Clean, responsive, and user-friendly interface.",
        image: "homePage/images/customWebsite.png",
        link: "homePage/project.html?project=4",
        tech: ["html", "css"]
    },
    {
        id: 'consulting-services',
        title: "Consulting Services",
        description: "Professional consulting services for your business needs. Expert guidance, proven results.",
        image: "homePage/images/consultingServices.png",
        link: "homePage/project.html?project=5",
        tech: ["html", "css"]
    },
    {
        id: 'digital-marketing',
        title: "Digital Marketing",
        description: "Boost your online presence with our digital marketing solutions. Reach, engage, and grow!",
        image: "homePage/images/digitalMarketing.png",
        link: "homePage/project.html?project=6",
        tech: ["html", "css"]
    },
    {
        id: 'nature-gallery',
        title: "Nature Gallery",
        description: "Explore the beauty of nature through our stunning photography collection.",
        image: "homePage/images/natureGallery.png",
        link: "homePage/project.html?project=7",
        tech: ["html", "css"]
    },
    {
        id: 'facebook-website',
        title: "Facebook Website",
        description: "Connect with your passion, share your journey, and inspire others!",
        image: "homePage/images/facebook.png",
        link: "homePage/project.html?project=8",
        tech: ["html", "css", "scss"]
    }
];

// Play Center project collection - Interactive JavaScript projects
const playCenterProjects = [
    {
        id: 'weatherly-app',
        title: "Weatherly App",
        description: "Get real-time weather updates for any location. Plan your day with confidence!",
        image: "homePage/images/weatherly.png",
        link: "homePage/project.html?project=project_weatherly",
        tech: ["html", "css", "scss", "js"]
    },
    {
        id: 'countries-explorer',
        title: "Countries Explorer",
        description: "Explore countries and their flags around the world. Save your favorites with just one click!",
        image: "homePage/images/countries.png",
        link: "homePage/project.html?project=countries_project",
        tech: ["html", "css", "bootstrap", "js"]
    },
    {
        id: 'page-builder',
        title: "Page Builder",
        description: "Create and customize pages easily with this page builder. Save your work and share it with others.",
        image: "homePage/images/pageBuilder.PNG",
        link: "homePage/project.html?project=pageBuilder",
        tech: ["html", "css", "js"]
    },
    {
        id: 'math-nexus',
        title: "Math Nexus Game",
        description: "Boost your math skills through fun, fast-paced exercises. Start from basic calculations, advance through levels, and watch your progress grow!",
        image: "homePage/images/MathNexus.png",
        link: "homePage/project.html?project=mathNexus",
        tech: ["html", "css", "scss", "js"]
    },
    {
        id: 'xo-arena',
        title: "XO Arena",
        description: "In a world where X's and O's wage an eternal battle, legends tell of an ancient game that holds the power to crown the ultimate strategist.",
        image: "homePage/images/ticTacToe.png",
        link: "homePage/project.html?project=XO_Arena",
        tech: ["html", "css", "bootstrap", "js"]
    },
    {
        id: 'memory-challenge',
        title: "Memory Challenge",
        description: "Test your memory and focus with this classic card-matching game. Flip cards, match pairs and set new records!",
        image: "homePage/images/memory_challenge.png",
        link: "homePage/project.html?project=memory_challenge",
        tech: ["html", "css", "js"]
    },
    {
        id: 'anime-store',
        title: "Anime Collect Store",
        description: "Your ultimate anime collection hub. Create your perfect wishlist and track your favorite merchandise!",
        image: "homePage/images/AnimeStore.png",
        link: "homePage/project.html?project=AnimeStore",
        tech: ["html", "css", "scss", "js"]
    },
    {
        id: 'millionaire-game',
        title: "Who Wants to Be a Millionaire?",
        description: "Welcome to the ultimate trivia challenge! Test your knowledge, answer questions, and win big!",
        image: "homePage/images/millionaire-game.png",
        link: "homePage/project.html?project=millionaire-game",
        tech: ["html", "css", "js"]
    },
    {
        id: 'snake-evolution',
        title: "Snake Evolution Game",
        description: "Embark on a journey to become the ultimate snake master! Use your arrow keys to control your snake, avoid obstacles, and grow stronger!",
        image: "homePage/images/snake-evolution.png",
        link: "homePage/project.html?project=snake-evolution",
        tech: ["html", "css", "js"]
    }
];

// Project card generator - Creates HTML for project display
function createProjectCard(project) {
    // Generate technology tag elements
    const techTagsHTML = project.tech.map(tech => 
        `<span class="tech-tag ${tech}">${tech.toUpperCase()}</span>`
    ).join('');
    
    // Return complete card HTML structure
    return `
        <div class="project-card scale-in">
            <img src="${project.image}" alt="${project.title}">
            <div class="project-card-content">
                <div class="tech-tags">
                    ${techTagsHTML}
                </div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}">View Project →</a>
            </div>
        </div>
    `;
}

// Populate project grids with dynamic content
const pageCenterGrid = document.querySelector('.project-section:first-child .project-grid');
const playCenterGrid = document.querySelector('.project-section:last-child .project-grid');

// Add Page Center projects to DOM if container exists
if (pageCenterGrid) {
    pageCenterGrid.innerHTML = pageCenterProjects.map(createProjectCard).join('');
}

// Add Play Center projects to DOM if container exists
if (playCenterGrid) {
    playCenterGrid.innerHTML = playCenterProjects.map(createProjectCard).join('');
}

// Contact Form - Form validation and submission handler
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Collect form input values
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const prefix = document.getElementById('prefix').value;
        const phone = document.getElementById('phone').value;
        const message = document.getElementById('message').value;
        
        // Phone number validation - must be exactly 7 digits
        const phoneRegex = /^\d{7}$/;
        const isValidPhone = phoneRegex.test(phone);
        
        // Combine prefix with phone number
        const fullPhone = prefix + phone;
        
        // Validate all form fields
        if (name && email && isValidPhone && message.length >= 10) {
            // Store form data in localStorage
            const formData = {
                name,
                email,
                phone: fullPhone,
                message,
                submittedAt: new Date().toISOString()
            };
            
            localStorage.setItem('contactFormData', JSON.stringify(formData));
            
            // Create success notification element
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = 'Message received successfully!';
            document.body.appendChild(notification);
            
            // Apply styles to notification
            Object.assign(notification.style, {
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: '#4CAF50',
                color: 'white',
                padding: '1rem 2rem',
                borderRadius: '4px',
                opacity: '0',
                transition: 'opacity 0.3s',
                zIndex: '1000'
            });
            
            // Animate notification appearance and disappearance
            setTimeout(() => {
                notification.style.opacity = '1';
            }, 100);
            
            setTimeout(() => {
                notification.style.opacity = '0';
                setTimeout(() => {
                    document.body.removeChild(notification);
                }, 300);
            }, 3000);
            
            // Reset form after successful submission
            contactForm.reset();
        } else {
            // Display error for invalid phone number
            if (!isValidPhone) {
                const phoneInput = document.getElementById('phone');
                phoneInput.classList.add('error');
                
                // Add error message if not already present
                let errorMsg = document.getElementById('phone-error');
                if (!errorMsg) {
                    errorMsg = document.createElement('div');
                    errorMsg.id = 'phone-error';
                    errorMsg.className = 'error-message';
                    errorMsg.textContent = 'Phone number must be exactly 7 digits';
                    phoneInput.parentNode.appendChild(errorMsg);
                }
                
                // Remove error state when user starts typing
                phoneInput.addEventListener('input', function() {
                    this.classList.remove('error');
                    if (errorMsg) {
                        errorMsg.remove();
                    }
                }, { once: true });
            }
        }
    });
}

// Scroll-based animations - Reveal elements as they enter viewport
function handleScrollAnimations() {
    const animatedElements = document.querySelectorAll('.fade-in, .scale-in');
    
    // Create intersection observer for animation triggers
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation class when element is visible
                entry.target.classList.add('animate');
                // Keep observing for scroll-up animations
            } else {
                // Remove animation class when out of view
                entry.target.classList.remove('animate');
            }
        });
    }, {
        threshold: 0.1, // Trigger when 10% of element is visible
        rootMargin: '0px 0px -50px 0px' // Adjust trigger point
    });
    
    // Observe all animated elements
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

// Initialize animations when DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    handleScrollAnimations();
});

// Responsive layout handler - Detect major viewport changes
window.addEventListener('resize', () => {
    const isMobileNow = window.innerWidth <= 768;
    
    // Reload page if device type changes (mobile/desktop)
    if (isMobileNow !== isMobile) {
        location.reload(); // Refresh to apply responsive layout changes
    }
});
