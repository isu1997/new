// Class managing game lifelines (50:50, Phone Friend, Ask Audience)
class Lifelines {
    constructor(game) {
        // Store reference to main game instance
        this.game = game;
        
        // Initialize lifelines state
        this.resetLifelines();
        
        this.modalTimeout = null;
        this.currentModal = null;
        // A flag to prevent multiple lifeline activations
        this.isProcessing = false;
    }

    // Reset all lifelines to their initial state
    resetLifelines() {
        // Reset lifelines availability
        this.lifelines = {
            fiftyFifty: true,
            phoneAFriend: true,
            askTheAudience: true
        };
        
        // Reset lifeline buttons visual state
        const lifelineButtons = document.querySelectorAll('.lifeline-btn');
        lifelineButtons.forEach(button => {
            button.disabled = false;
            button.classList.remove('used');
        });
        
        // Reset answer buttons visibility
        const answerButtons = document.querySelectorAll('.answer-btn');
        answerButtons.forEach(button => {
            button.style.visibility = 'visible';
        });
        
        // Reset processing flag
        this.isProcessing = false;
        
        // Cleanup old event listeners before adding new ones
        const fiftyFiftyBtn = document.getElementById('fifty-fifty');
        const phoneFriendBtn = document.getElementById('phone-friend');
        const askAudienceBtn = document.getElementById('ask-audience');
        
        fiftyFiftyBtn.replaceWith(fiftyFiftyBtn.cloneNode(true));
        phoneFriendBtn.replaceWith(phoneFriendBtn.cloneNode(true));
        askAudienceBtn.replaceWith(askAudienceBtn.cloneNode(true));
        
        // Setup event listeners
        this.initializeLifelines();
    }


    // Setup event listeners for lifeline buttons
    initializeLifelines() {
        document.getElementById('fifty-fifty').addEventListener('click', () => this.useFiftyFifty());
        document.getElementById('phone-friend').addEventListener('click', () => this.usePhoneFriend());
        document.getElementById('ask-audience').addEventListener('click', () => this.useAskAudience());
    }

    // 50:50 lifeline - removes two wrong answers
    useFiftyFifty() {
        // Prevent multiple activations
        if (!this.lifelines.fiftyFifty || this.isProcessing) return;
        this.isProcessing = true;
        
        // Get current question data
        const currentQuestion = questions[this.game.selectedCategory][this.game.currentQuestion % questions[this.game.selectedCategory].length];
        const correctIndex = currentQuestion.correct;
        
        // Get all answer buttons and filter out correct answer
        const answerButtons = document.querySelectorAll('.answer-btn');
        let indices = [0, 1, 2, 3].filter(i => i !== correctIndex);
        
        // Make sure we only hide exactly 2 wrong answers
        indices = indices.sort(() => Math.random() - 0.5).slice(0, 2);
        
        // Reset all answers visibility first
        answerButtons.forEach(button => button.style.visibility = 'visible');
        
        // Hide exactly two wrong answers
        indices.forEach(index => {
            answerButtons[index].style.visibility = 'hidden';
        });
        
        // Disable lifeline after use
        this.lifelines.fiftyFifty = false;
        document.getElementById('fifty-fifty').disabled = true;
        document.getElementById('fifty-fifty').classList.add('used');
        
        this.isProcessing = false;
    }

    // Phone a Friend lifeline - simulates expert advice
    usePhoneFriend() {
        // Prevent multiple activations
        if (!this.lifelines.phoneAFriend || this.isProcessing) return;
        this.isProcessing = true;
        
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
                name: "רותם",
                expertise: ["אנימה", "גיאוגרפיה"],
                confidence: 0.7,
                phrases: [
                    "אני חושבת שהתשובה היא...",
                    "לפי מה שאני יודעת...",
                    "אם אני לא טועה..."
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
        
        // Show response and disable lifeline
        setTimeout(() => {
            alert(`${expert.name}: ${phrase} אני חושב שהתשובה היא ${answer}.`);
            
            // Disable lifeline after use
            this.lifelines.phoneAFriend = false;
            document.getElementById('phone-friend').disabled = true;
            document.getElementById('phone-friend').classList.add('used');
            
            this.isProcessing = false;
        }, 100);
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
                correctPercentage = 65 + Math.random() * 10; // 65-75%
                break;
            case 'medium':
                correctPercentage = 55 + Math.random() * 10; // 55-65%
                break;
            case 'hard':
                correctPercentage = 35 + Math.random() * 10; // 35-45%
                break;
            default:
                correctPercentage = 50 + Math.random() * 10;
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
