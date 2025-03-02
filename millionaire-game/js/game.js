// Main class managing the Millionaire game logic and UI interactions
class TriviaGame {
    constructor() {
        // Game state variables
        this.currentQuestion = 0;
        this.currentMoney = 0;
        this.questions = [];
        this.currentLevel = 0;
        this.timer = null;
        this.timeLeft = 30;
        this.selectedCategory = null;
        this.guaranteedMoney = 0;
        
        // Initialize game components and setup
        this.initializeElements();
        this.addEventListeners();
        this.lifelines = new Lifelines(this);
    }

    initializeElements() {
        // Initialize main game screen elements
        this.openingScreen = document.getElementById('opening-screen');
        this.gameScreen = document.getElementById('game-screen');
        this.resultScreen = document.getElementById('result-screen');
        
        // Initialize gameplay UI elements
        this.questionText = document.getElementById('question-text');
        this.answerButtons = document.querySelectorAll('.answer-btn');
        this.moneyItems = document.querySelectorAll('.money-item');
        this.timerElement = document.querySelector('.timer');
        
        // Setup control buttons with initial states
        this.startButton = document.getElementById('start-game');
        this.startButton.disabled = true;
        this.startButton.classList.add('disabled');
        
        this.playAgainButton = document.getElementById('play-again');
        this.categoryButtons = document.querySelectorAll('.category-btn');
    }

    addEventListeners() {
        // Start game button click handler
        this.startButton.addEventListener('click', () => {
            if (this.selectedCategory) {
                this.showRules();
            }
        });
        
        // Reset game on play again click
        this.playAgainButton.addEventListener('click', () => this.resetGame());
        
        // Answer button click handlers
        this.answerButtons.forEach(button => {
            button.addEventListener('click', (e) => this.handleAnswer(e));
        });
        
        // Category selection handlers
        this.categoryButtons.forEach(button => {
            button.addEventListener('click', (e) => this.selectCategory(e));
        });
    }

    showRules() {
        // Create and show game rules modal
        const modal = document.createElement('div');
        modal.className = 'audience-modal rules-modal';
        modal.innerHTML = `
            <button class="modal-close">×</button>
            <div class="rules-content">
                <h3>כללי המשחק</h3>
                <p>• לכל שאלה יש 30 שניות למענה</p>
                <p>• סכומי זכייה מובטחים:</p>
                <p>- שלב 5: ₪1,000</p>
                <p>- שלב 10: ₪32,000</p>
                <p>- שלב 15: ₪1,000,000</p>
                <p>• ניתן לפרוש עם הכסף שנצבר אחרי כל תשובה נכונה</p>
                <p>• במקרה של טעות, תקבלו את סכום העוגן האחרון שעברתם</p>
                <button class="take-money-btn" style="margin-top: 1rem;">הבנתי, בואו נתחיל!</button>
            </div>
        `;

        // Create modal backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'modal-backdrop';
        
        // Add modal and backdrop to DOM
        document.body.appendChild(backdrop);
        document.body.appendChild(modal);

        // Setup modal button handlers
        modal.querySelector('.take-money-btn').addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
            this.startGame();
        });

        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
            backdrop.remove();
        });
    }

    startGame() {
        // Switch to game screen and reset game state
        this.switchScreen(this.openingScreen, this.gameScreen);
        this.currentLevel = 0;
        this.currentMoney = 0;
        this.guaranteedMoney = 0;
        this.currentQuestion = 0;
        
        // Load and shuffle questions for selected category
        if (this.selectedCategory && questions[this.selectedCategory]) {
            this.questions = [...questions[this.selectedCategory]].sort(() => Math.random() - 0.5);
        }
        
        // Initialize game UI
        this.removeTakeMoneyButton();
        this.loadQuestion();
        this.startTimer();
        this.updateMoneyLadder();
        this.addTakeMoneyButton();
    }

    // Utility function to switch between game screens
    switchScreen(from, to) {
        from.classList.remove('active');
        to.classList.add('active');
    }

    // Remove existing take money buttons from DOM
    removeTakeMoneyButton() {
        const existingButtons = document.querySelectorAll('.take-money-btn');
        existingButtons.forEach(button => button.remove());
    }

    // Add take money button with current prize amount
    addTakeMoneyButton() {
        const container = document.querySelector('.question-container');
        const takeMoneyBtn = document.createElement('button');
        takeMoneyBtn.className = 'take-money-btn';
        takeMoneyBtn.textContent = `קח את הכסף (₪${this.currentMoney})`;
        takeMoneyBtn.addEventListener('click', () => this.takeMoney());
        container.appendChild(takeMoneyBtn);
    }

    // Handle player taking current prize money
    takeMoney() {
        this.endGame(false, true);
    }

    // Update guaranteed prize money based on current level
    updateGuaranteedMoney() {
        if (this.currentLevel >= 15) this.guaranteedMoney = 1000000;
        else if (this.currentLevel >= 10) this.guaranteedMoney = 32000;
        else if (this.currentLevel >= 5) this.guaranteedMoney = 1000;
        else this.guaranteedMoney = 0;
    }

     // Load and display current question
    loadQuestion() {
        // Validate question availability
        if (!this.selectedCategory || !this.questions || this.questions.length === 0) {
            console.error('No questions available');
            return;
        }

        // Get current question
        const question = this.questions[this.currentQuestion];
        
        // Validate question data
        if (!question) {
            console.error('Question not found');
            return;
        }

        // Update question text and answer buttons
        this.questionText.textContent = question.text;
        this.answerButtons.forEach((button, index) => {
            const letter = String.fromCharCode(1488 + index); // Convert to Hebrew letters א, ב, ג, ד
            button.textContent = `${letter}: ${question.answers[index]}`;
            
            // Reset all button classes and states completely
            button.className = 'answer-btn';
            button.classList.remove('correct', 'wrong', 'selected', 'active');
            button.style.visibility = 'visible';
            button.disabled = false;
            button.dataset.index = index.toString();
            
            // Ensure no active/focus state remains
            button.blur();
        });
        
        // Reset timer
        this.timeLeft = 30;
        this.updateTimer();
    }

    // Handle player answer selection
    handleAnswer(e) {
        const selectedButton = e.target;
        
        // Validate button click
        if (!selectedButton.classList.contains('answer-btn')) {
            return;
        }
        
        // Verify button has index data
        if (!selectedButton.hasAttribute('data-index')) {
            console.error('Answer button missing data-index attribute');
            return;
        }
        
        const selectedIndex = parseInt(selectedButton.dataset.index);
        
        // Validate question data
        if (!this.selectedCategory || !this.questions) {
            console.error('No questions available');
            return;
        }

        const currentQuestion = this.questions[this.currentQuestion];
        if (!currentQuestion || !Array.isArray(currentQuestion.answers)) {
            console.error('Invalid question data:', currentQuestion);
            return;
        }

        // Check if answer is correct
        const correct = selectedIndex === currentQuestion.correct;
        
        // Stop timer and show result
        clearInterval(this.timer);
        this.showResult(selectedButton, correct);
        
        // Disable all answer buttons
        this.answerButtons.forEach(button => button.disabled = true);
        
        // Process answer after delay
        setTimeout(() => {
            if (correct) {
                this.currentQuestion++;
                this.advanceLevel();
            } else {
                this.endGame(false);
            }
        }, 3000);
    }

    // Show answer result and play sound
    showResult(button, correct) {
        button.classList.add(correct ? 'correct' : 'wrong');
        const sound = document.getElementById(correct ? 'correct-sound' : 'wrong-sound');
        sound.play();
    }

    // Advance to next level after correct answer
    advanceLevel() {
        this.currentLevel++;
        // Prize money for each level
        const moneyValues = [100, 200, 300, 500, 1000, 2000, 4000, 8000, 16000, 32000, 64000, 125000, 250000, 500000, 1000000];
        this.currentMoney = moneyValues[this.currentLevel - 1];
        this.updateGuaranteedMoney();
        this.updateMoneyLadder();
        
        // Check if player won the game
        if (this.currentLevel >= 15) {
            this.endGame(true);
        } else {
            // Reset answer buttons for next question
            this.answerButtons.forEach(button => {
                button.disabled = false;
                button.className = 'answer-btn';
                button.style.visibility = 'visible';
            });
            
            // Load next question
            this.loadQuestion();
            this.startTimer();
            this.updateTakeMoneyButton();
        }
    }

    // Update take money button text with current prize
    updateTakeMoneyButton() {
        const takeMoneyBtn = document.querySelector('.take-money-btn');
        if (takeMoneyBtn) {
            takeMoneyBtn.textContent = `קח את הכסף (₪${this.currentMoney})`;
        }
    }

    // Update prize ladder display
    updateMoneyLadder() {
        // Update desktop prize ladder
        this.moneyItems.forEach(item => {
            item.classList.remove('active');
            if (parseInt(item.dataset.value) === this.currentMoney) {
                item.classList.add('active');
            }
        });

        // Update mobile prize display
        const mobileMoneyDisplay = document.querySelector('.money-display-mobile');
        if (!mobileMoneyDisplay) {
            const display = document.createElement('div');
            display.className = 'money-display-mobile';
            display.innerHTML = `
                <div>סכום נוכחי: <span class="current-level-mobile">₪${this.currentMoney.toLocaleString()}</span></div>
            `;
            this.gameScreen.insertBefore(display, this.gameScreen.firstChild);
        } else {
            const currentLevelSpan = mobileMoneyDisplay.querySelector('.current-level-mobile');
            if (currentLevelSpan) {
                currentLevelSpan.textContent = `₪${this.currentMoney.toLocaleString()}`;
            }
        }
    }

    // Start countdown timer
    startTimer() {
        this.timer = setInterval(() => {
            this.timeLeft--;
            this.updateTimer();
            
            // End game if time runs out
            if (this.timeLeft <= 0) {
                clearInterval(this.timer);
                this.endGame();
            }
        }, 1000);
    }

    // Update timer display
    updateTimer() {
        this.timerElement.textContent = this.timeLeft;
        if (this.timeLeft <= 5) {
            this.timerElement.classList.add('pulse');
        }
    }

    // End game and show final results
    endGame(winner = false, tookMoney = false) {
        clearInterval(this.timer);
        let finalAmount;
        
        // Calculate final prize amount
        if (winner) {
            finalAmount = 1000000;
        } else if (tookMoney) {
            finalAmount = this.currentMoney;
        } else {
            finalAmount = this.guaranteedMoney;
        }
        
        // Update and show result screen
        document.getElementById('final-amount').textContent = finalAmount.toLocaleString();
        this.switchScreen(this.gameScreen, this.resultScreen);
    }

    // Calculate final prize amount based on level reached
    calculateFinalAmount() {
        const guaranteedAmounts = [0, 1000, 32000];
        for (let i = guaranteedAmounts.length - 1; i >= 0; i--) {
            if (this.currentLevel >= i) {
                return guaranteedAmounts[i];
            }
        }
        return 0;
    }

   // Reset game state for new game
    resetGame() {
        // Reset game state variables
        this.currentQuestion = 0;
        this.currentLevel = 0;
        this.currentMoney = 0;
        this.guaranteedMoney = 0;
        this.timeLeft = 30;
        clearInterval(this.timer);
        this.removeTakeMoneyButton();
        
        // Reset answer buttons
        this.answerButtons.forEach(button => {
            button.disabled = false;
            button.className = 'answer-btn';
            button.classList.remove('correct', 'wrong', 'selected', 'active');
            button.style.visibility = 'visible';
            
            // Ensure no active/focus state remains
            button.blur();
        });
        
        // Reset category selection
        this.categoryButtons.forEach(btn => btn.classList.remove('selected'));
        this.selectedCategory = null;
        this.startButton.disabled = true;
        this.startButton.classList.add('disabled');
        
        // Update UI
        this.updateMoneyLadder();
        this.switchScreen(this.resultScreen, this.openingScreen);
        
        // Reset lifelines completely with a new instance
        this.lifelines = new Lifelines(this);
        this.lifelines.resetLifelines();

        // Remove mobile money display
        const mobileMoneyDisplay = document.querySelector('.money-display-mobile');
        if (mobileMoneyDisplay) {
            mobileMoneyDisplay.remove();
        }
    }


    // Handle category selection
    selectCategory(e) {
        // Update category selection UI
        this.categoryButtons.forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
        this.selectedCategory = e.target.dataset.category;
        this.currentQuestion = 0;
        
        // Enable start button
        this.startButton.disabled = false;
        this.startButton.classList.remove('disabled');
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new TriviaGame();
});

// Simple fix for the mobile auto-selection issue in general knowledge category
(function() {
    // Add a simple stylesheet to disable tap highlight on mobile
    const style = document.createElement('style');
    style.textContent = `
        .answer-btn {
            -webkit-tap-highlight-color: transparent;
            outline: none;
        }
    `;
    document.head.appendChild(style);

    // Add a small additional reset to the existing loadQuestion method
    const originalPrototype = TriviaGame.prototype;
    const originalLoadQuestion = originalPrototype.loadQuestion;
    
    originalPrototype.loadQuestion = function() {
        // Call the original method first
        originalLoadQuestion.apply(this, arguments);
        
        // Then apply our additional cleanup
        if (this.selectedCategory === 'general') {
            const buttons = document.querySelectorAll('.answer-btn');
            buttons.forEach(button => {
                // Remove any selection state
                button.blur();
                button.classList.remove('selected', 'active');
            });
        }
    };
})();