// Class managing game lifelines (50:50, Phone Friend, Ask Audience)
class Lifelines {
    constructor(game) {
        // Store reference to main game instance
        this.game = game;
        
        // Track available lifelines
        this.lifelines = {
            fiftyFifty: true,
            phoneAFriend: true,
            askTheAudience: true
        };
        
        // Setup lifelines and initialize state
        this.initializeLifelines();
        this.modalTimeout = null;
        this.currentModal = null;
    }

    // Setup event listeners for lifeline buttons
    initializeLifelines() {
        document.getElementById('fifty-fifty').addEventListener('click', () => this.useFiftyFifty());
        document.getElementById('phone-friend').addEventListener('click', () => this.usePhoneFriend());
        document.getElementById('ask-audience').addEventListener('click', () => this.useAskAudience());
    }

    // 50:50 lifeline - removes two wrong answers
    useFiftyFifty() {
        if (!this.lifelines.fiftyFifty) return;
        
        // Get current question data
        const currentQuestion = questions[this.game.selectedCategory][this.game.currentQuestion % questions[this.game.selectedCategory].length];
        const correctIndex = currentQuestion.correct;
        
        // Get all answer buttons and filter out correct answer
        const answerButtons = document.querySelectorAll('.answer-btn');
        let indices = [0, 1, 2, 3].filter(i => i !== correctIndex);
        
        // Randomly select two wrong answers to hide
        indices = indices.sort(() => Math.random() - 0.5).slice(0, 2);
        indices.forEach(index => {
            answerButtons[index].style.visibility = 'hidden';
        });
        
        // Disable lifeline after use
        this.lifelines.fiftyFifty = false;
        document.getElementById('fifty-fifty').disabled = true;
    }

    // Phone a Friend lifeline - simulates expert advice
    usePhoneFriend() {
        if (!this.lifelines.phoneAFriend) return;
        
        // Define expert profiles with their specialties and confidence levels
        const experts = [
            {
                name: "ד״ר כהן",
                expertise: ["היסטוריה", "גיאוגרפיה"],
                confidence: 0.8,
                phrases: [
                    "אני כמעט בטוח שהתשובה היא...",
                    "לפי הידע שלי...",
                    "אם אני זוכר נכון..."
                ]
            },
            {
                name: "פרופ׳ לוי",
                expertise: ["מדע", "היסטוריה"],
                confidence: 0.9,
                phrases: [
                    "לפי החישובים שלי...",
                    "מהניסיון שלי בתחום..."
                ]
            },
            {
                name: "ד״ר כהן",
                expertise: ["אנימה", "גיאוגרפיה"],
                confidence: 0.7,
                phrases: [
                    "אני כמעט בטוח שהתשובה היא...",
                    "לפי הידע שלי...",
                    "אם אני זוכר נכון..."
                ]
            }
        ];
        
        // Get current question and randomly select expert
        const currentQuestion = questions[this.game.selectedCategory][this.game.currentQuestion % questions[this.game.selectedCategory].length];
        const expert = experts[Math.floor(Math.random() * experts.length)];
        const phrase = expert.phrases[Math.floor(Math.random() * expert.phrases.length)];
        
        // Determine if expert gives correct answer based on confidence
        const isCorrect = Math.random() < expert.confidence;
        
        // Convert answer index to Hebrew letter (א,ב,ג,ד)
        const answer = String.fromCharCode(1488 + (isCorrect ? currentQuestion.correct : (currentQuestion.correct + 1) % 4));
        alert(`${expert.name}: ${phrase} אני חושב שהתשובה היא ${answer}.`);
        
        // Disable lifeline after use
        this.lifelines.phoneAFriend = false;
        document.getElementById('phone-friend').disabled = true;
    }

    // Ask the Audience lifeline - simulates audience voting
    useAskAudience() {
        if (!this.lifelines.askTheAudience) return;
        
        // Get current question and determine difficulty
        const currentQuestion = questions[this.game.selectedCategory][this.game.currentQuestion % questions[this.game.selectedCategory].length];
        const difficulty = this.getQuestionDifficulty(this.game.currentLevel);
        
        // Generate audience voting results
        const results = this.generateAudienceResults(currentQuestion.correct, difficulty);
        this.showAudienceGraph(results);
        
        // Disable lifeline after use
        this.lifelines.askTheAudience = false;
        document.getElementById('ask-audience').disabled = true;
    }

    // Determine question difficulty based on game level
    getQuestionDifficulty(level) {
        if (level < 5) return 'easy';
        if (level < 10) return 'medium';
        return 'hard';
    }

    // Generate simulated audience voting percentages
    generateAudienceResults(correctAnswer, difficulty) {
        // Set correct answer percentage based on difficulty
        let correctPercentage;
        switch (difficulty) {
            case 'easy':
                correctPercentage = 55 + Math.random() * 10; // 55-65%
                break;
            case 'medium':
                correctPercentage = 45 + Math.random() * 10; // 45-55%
                break;
            case 'hard':
                correctPercentage = 35 + Math.random() * 10; // 35-45%
                break;
            default:
                correctPercentage = 45 + Math.random() * 10;
        }
        
        // Initialize results array with correct answer percentage
        const results = Array(4).fill(0);
        results[correctAnswer] = correctPercentage;
        
        // Distribute remaining percentage among wrong answers
        let remaining = 100 - correctPercentage;
        const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correctAnswer);
        
        wrongAnswers.forEach((index, i) => {
            if (i === wrongAnswers.length - 1) {
                results[index] = remaining;
            } else {
                const value = Math.random() * remaining;
                results[index] = Math.round(value * 10) / 10;
                remaining -= value;
            }
        });
        
        return results;
    }

    // Display audience voting results in animated graph
    showAudienceGraph(results) {
        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        
        // Create and configure modal with graph
        const modal = document.createElement('div');
        modal.className = 'audience-modal';
        modal.innerHTML = `
            <button class="modal-close">×</button>
            <div class="audience-graph">
                ${results.map((percentage, index) => `
                    <div class="graph-bar">
                        <div class="bar" style="height: 0%"></div>
                        <div class="percentage">${Math.round(percentage)}%</div>
                        <div class="label">${String.fromCharCode(1488 + index)}</div>
                    </div>
                `).join('')}
            </div>
        `;

        // Add modal to DOM
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);
        this.currentModal = modal;

        // Setup modal close functionality
        const closeModal = () => {
            if (this.modalTimeout) {
                clearTimeout(this.modalTimeout);
            }
            backdrop.remove();
            modal.remove();
            this.currentModal = null;
        };

        // Add click listeners for closing
        modal.querySelector('.modal-close').addEventListener('click', closeModal);
        backdrop.addEventListener('click', closeModal);

        // Add keyboard escape handler
        const escHandler = (e) => {
            if (e.key === 'Escape') {
                closeModal();
                document.removeEventListener('keydown', escHandler);
            }
        };
        document.addEventListener('keydown', escHandler);
        
        // Animate graph bars after slight delay
        setTimeout(() => {
            const bars = modal.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                bar.style.height = `${results[index]}%`;
            });
        }, 50);
        
        // Auto-close modal after 5 seconds
        this.modalTimeout = setTimeout(closeModal, 5000);

        setTimeout(() => {
            modal.remove();
        }, 5000);
    }
}
