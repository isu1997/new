// Project Page JavaScript - Core functionality for the project details page

document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements - Key interface elements selected for manipulation
    const projectTitle = document.getElementById('project-title');
    const projectDescription = document.getElementById('project-description');
    const downloadLink = document.getElementById('download-link');
    const projectLink = document.getElementById('project-link');
    const slideImage1 = document.getElementById('slide-image-1');
    const slideImage2 = document.getElementById('slide-image-2');
    const techIconsContainer = document.getElementById('tech-icons');
    const sliderDots = document.querySelectorAll('.dot');
    const slides = document.querySelectorAll('.slide');
    const prevButton = document.querySelector('.slider-nav.prev');
    const nextButton = document.querySelector('.slider-nav.next');
    const footerCopyright = document.querySelector('.copyright');

    // Set copyright notice in footer
    if (footerCopyright) {
    footerCopyright.textContent = `© Israel Eliav | All Rights Reserved 2024`;
    footerCopyright.style.display = 'block'; // Ensure visibility
    }

    // Extract project identifier from URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const projectId = urlParams.get('project') || 'default';

    // Technology icon mapping with FontAwesome classes
    const techIcons = {
        html: { icon: 'fa-html5', name: 'HTML' },
        css: { icon: 'fa-css3-alt', name: 'CSS' },
        scss: { icon: 'fa-sass', name: 'SCSS' },
        js: { icon: 'fa-js', name: 'JavaScript' },
        bootstrap: { icon: 'fa-bootstrap', name: 'Bootstrap' }
    };

    // Project data repository - Static content that could be replaced with API/database in production
    const projectsData = {
        "1": {
            title: "Coffee Shop",
            description: "Unlock a world of indulgence with our café store! Sign up now and treat yourself to a complimentary cup of coffee on us. Get ready to sip, savor, and enjoy the ultimate coffee experience!",
            images: [
                'images/coffeeShop.png',
                'images/coffeeShop2.png',
            ],
            downloadUrl: "../project1/project1.rar",
            projectUrl: "../project1/index.html",
            technologies: ["html", "css"]
        },
        "2": {
            title: "Fashion Store",
            description: "Your one-stop destination for fashion. Discover latest trends and unique styles, all in one place!",
            images: [
                'images/fashionStore.png',
                'images/fashionStore2.png',
            ],
            downloadUrl: "../project2/project2.rar",
            projectUrl: "../project2/index.html",
            technologies: ["html", "css"]
        },
        "3": {
            title: "Gift Store",
            description: "Find the perfect gift for every occasion. Make moments special with our curated collection!",
            images: [
                'images/giftStore.png',
                'images/giftStore2.png',
            ],
            downloadUrl: "../project3/project3.rar",
            projectUrl: "../project3/index.html",
            technologies: ["html", "css"]
        },
        "4": {
            title: "Custom Website",
            description: "A showcase of modern web design. Clean, responsive, and user-friendly interface.",
            images: [
                'images/customWebsite.png',
                'images/customWebsite2.png',
            ],
            downloadUrl: "../project4/project4.rar",
            projectUrl: "../project4/index.html",
            technologies: ["html", "css"]
        },
        "5": {
            title: "Consulting Services",
            description: "Professional consulting services for your business needs. Expert guidance, proven results.",
            images: [
                'images/consultingServices.png',
                'images/consultingServices2.png',
            ],
            downloadUrl: "../project5/project5.rar",
            projectUrl: "../project5/index.html",
            technologies: ["html", "css"]
        },
        "6": {
            title: "Digital Marketing",
            description: "Boost your online presence with our digital marketing solutions. Reach, engage, and grow!",
            images: [
                'images/digitalMarketing.png',
                'images/digitalMarketing2.png',
            ],
            downloadUrl: "../project6/project6.rar",
            projectUrl: "../project6/index.html",
            technologies: ["html", "css"]
        },
        "7": {
            title: "Nature Gallery",
            description: "Explore the beauty of nature through our stunning photography collection.",
            images: [
                'images/natureGallery.png',
                'images/natureGallery2.png',
            ],
            downloadUrl: "../project7/project7.rar",
            projectUrl: "../project7/index.html",
            technologies: ["html", "css"]
        },
        "8": {
            title: "Facebook Website",
            description: "Connect with your passion, share your journey, and inspire others!",
            images: [
                'images/facebook.png',
                'images/facebook2.png',
            ],
            downloadUrl: "../project8/project8.rar",
            projectUrl: "../project8/index.html",
            technologies: ["html", "css", "scss"]
        },
        "project_weatherly": {
            title: "Weatherly App",
            description: "Ever wonder what to wear today? Get targeted clothing recommendations for cold-sensitive, average, and warm-natured individuals, plus umbrella alerts—all based on real-time weather data. Smart forecasting for your comfort zone.",
            images: [
                'images/weatherly.png',
                'images/weatherly2.png',
            ],
            downloadUrl: "../project_weatherly/project_weatherly.rar",
            projectUrl: "../project_weatherly/index.html",
            technologies: ["html", "css", "scss", "js"]
        },
        "countries_project": {
            title: "Countries Explorer",
            description: "Explore countries and their flags around the world. Save your favorites with just one click!",
            images: [
                'images/countries.png',
                'images/countries2.png',
            ],
            downloadUrl: "../countries_project/countries_project.rar",
            projectUrl: "../countries_project/index.html",
            technologies: ["html", "css", "bootstrap", "js"]
        },
        "pageBuilder": {
            title: "Page Builder",
            description: "Create and customize pages easily with this page builder. Save your work and share it with others.",
            images: [
                'images/pageBuilder.PNG',
                'images/pageBuilder2.png',
            ],
            downloadUrl: "../pageBuilder/pageBuilder.rar",
            projectUrl: "../pageBuilder/index.html",
            technologies: ["html", "css", "js"]
        },
        "mathNexus": {
            title: "Math Nexus Game",
            description: "Boost your math skills through fun, fast-paced exercises. Start from basic calculations, advance through levels, and watch your progress grow!",
            images: [
                'images/MathNexus.png',
                'images/MathNexus2.png',
            ],
            downloadUrl: "../mathNexus/mathNexus.rar",
            projectUrl: "../mathNexus/index.html",
            technologies: ["html", "css", "scss", "js"]
        },
        "XO_Arena": {
            title: "XO Arena",
            description: "In a world where X's and O's wage an eternal battle, legends tell of an ancient game that holds the power to crown the ultimate strategist. Step into XO Arena, where three mighty AI guardians test the wit and wisdom of those who dare to challenge them. Every move shapes your destiny, every victory brings you closer to immortal glory. Will you answer the call and claim your place in the eternal battle of minds?",
            images: [
                'images/ticTacToe.png',
                'images/ticTacToe2.png',
            ],
            downloadUrl: "../XO_Arena/XO_Arena.rar",
            projectUrl: "../XO_Arena/index.html",
            technologies: ["html", "css", "bootstrap", "js"]
        },
        "memory_challenge": {
            title: "Memory Challenge",
            description: "Test your memory and focus with this classic card-matching game. Flip cards, match pairs and set new records!",
            images: [
                'images/memory_challenge.png',
                'images/memory_challenge2.png',
            ],
            downloadUrl: "../memory_challenge/memory_challenge.rar",
            projectUrl: "../memory_challenge/index.html",
            technologies: ["html", "css", "js"]
        },
        "AnimeStore": {
            title: "Anime Collect Store",
            description: "Your ultimate anime collection hub. Create your perfect wishlist and track your favorite merchandise!",
            images: [
                'images/AnimeStore.png',
                'images/AnimeStore2.png',
            ],
            downloadUrl: "../AnimeStore/AnimeStore.rar",
            projectUrl: "../AnimeStore/index.html",
            technologies: ["html", "css", "scss", "js"]
        },
        "millionaire-game": {
            title: "Who Wants to Be a Millionaire?",
            description: "Welcome to the ultimate trivia challenge! Test your knowledge, answer questions, and win big!",
            images: [
                'images/millionaire-game.png',
                'images/millionaire-game2.png',
            ],
            downloadUrl: "../millionaire-game/millionaire-game.rar",
            projectUrl: "../millionaire-game/index.html",
            technologies: ["html", "css", "js"]
        },
        "snake-evolution": {
            title: "Snake Evolution Game",
            description: "Embark on a journey to become the ultimate snake master! Use your arrow keys to control your snake, avoid obstacles, and grow stronger as you progress!",
            images: [
                'images/snake-evolution.png',
                'images/snake-evolution2.png',
            ],
            downloadUrl: "../snake-evolution/snake-evolution.rar",
            projectUrl: "../snake-evolution/index.html",
            technologies: ["html", "css", "scss", "js"]
        },
        'default': {
    title: 'Project Showcase',
    description: 'This is a sample project showcasing my web development skills and approach to creating intuitive, beautiful digital experiences that convey meaning and purpose.',
    images: [
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22200%22%20viewBox%3D%220%200%20200%20200%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%22%23999%22%3ENo%20Preview%3C%2Ftext%3E%3C%2Fsvg%3E',
        'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22200%22%20height%3D%22200%22%20viewBox%3D%220%200%20200%20200%22%3E%3Crect%20width%3D%22200%22%20height%3D%22200%22%20fill%3D%22%23f0f0f0%22%2F%3E%3Ctext%20x%3D%2250%25%22%20y%3D%2250%25%22%20font-family%3D%22Arial%22%20font-size%3D%2214%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%20fill%3D%22%23999%22%3ENo%20Preview%3C%2Ftext%3E%3C%2Fsvg%3E'
    ],
    downloadUrl: '#',
    projectUrl: '#',
    technologies: ['html', 'css', 'js']
}
    };

    // Slider state variables
    let currentSlide = 0;
    let slideInterval;

    // Image slider control functions
    function showSlide(index) {
        // Remove active state from all slides and indicators
        slides.forEach(slide => slide.classList.remove('active'));
        sliderDots.forEach(dot => dot.classList.remove('active'));
        
        // Activate requested slide and indicator
        slides[index].classList.add('active');
        sliderDots[index].classList.add('active');
        currentSlide = index;
    }

    // Navigate to next slide with circular navigation
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }

    // Navigate to previous slide with circular navigation
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }

    // Populate UI with project data
    function loadProjectData() {
        // Get project data or fallback to default
        const project = projectsData[projectId] || projectsData['default'];
        
        // Update page title with project name
        document.title = `${project.title} | Israel Eliav`;
        
        // Populate text content
        if (projectTitle) projectTitle.textContent = project.title;
        if (projectDescription) projectDescription.textContent = project.description;
        
        // Set action button URLs
        if (downloadLink) downloadLink.href = project.downloadUrl;
        if (projectLink) projectLink.href = project.projectUrl;
        
        // Load project images into slider
        if (project.images.length > 0 && slideImage1) {
            slideImage1.src = project.images[0];
            slideImage1.alt = `${project.title} - Screenshot 1`;
        }
        
        if (project.images.length > 1 && slideImage2) {
            slideImage2.src = project.images[1];
            slideImage2.alt = `${project.title} - Screenshot 2`;
        }
        
        // Create technology icon elements
        if (techIconsContainer) {
            techIconsContainer.innerHTML = '';
            project.technologies.forEach(tech => {
                if (techIcons[tech]) {
                    const techElement = document.createElement('div');
                    techElement.className = `tech-icon ${tech}`;
                    techElement.innerHTML = `
                        <i class="fab ${techIcons[tech].icon}"></i>
                        ${techIcons[tech].name}
                    `;
                    techIconsContainer.appendChild(techElement);
                }
            });
        }

        // Initialize slider to first position
        if (slides.length > 0) {
            showSlide(0);
        }
    }

    // Attach event listeners to slider navigation elements
    if (prevButton) {
        prevButton.addEventListener('click', (e) => {
            e.preventDefault();
            prevSlide();
        });
    }

    if (nextButton) {
        nextButton.addEventListener('click', (e) => {
            e.preventDefault();
            nextSlide();
        });
    }

    // Attach click handlers to slider indicator dots
    sliderDots.forEach((dot, index) => {
        dot.addEventListener('click', () => showSlide(index));
    });

    // Automated slideshow functions
    function startSlideShow() {
        slideInterval = setInterval(nextSlide, 5000); // Change slide every 5 seconds
    }

    function stopSlideShow() {
        if (slideInterval) {
            clearInterval(slideInterval);
        }
    }

    // Pause slideshow on hover for better user experience
    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopSlideShow);
        sliderContainer.addEventListener('mouseleave', startSlideShow);
    }

    // Initialize page content and start automatic slideshow
    loadProjectData();
    startSlideShow();

    // Back to Top Button - Shows/hides button based on scroll position
    const backToTop = document.getElementById('back-to-top');

    if (backToTop) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        // Smooth scroll to top when button is clicked
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
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

    // Initialize entrance animations
    handleScrollAnimations();
});
