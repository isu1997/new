import { gameUtils } from './utils.js';

// auth.js
class AuthManager {
    constructor() {
        this.currentUser = null;
        this.initializeFromStorage();
        this.setupEventListeners();
    }

    initializeFromStorage() {
        const savedUser = localStorage.getItem('savedUser');
        if (savedUser) {
            try {
                const userData = JSON.parse(savedUser);
                if (userData.rememberMe) {
                    this.currentUser = userData;
                    this.showGameContainer();
                }
            } catch (error) {
                console.error('Error parsing saved user:', error);
                localStorage.removeItem('savedUser');
            }
        }
    }

    setupEventListeners() {
    // Registration form
    const registerForm = document.querySelector('#registerForm form');
    if (registerForm) {
        registerForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            this.handleRegistration(event);
        });
    }

        // Login form
        const loginForm = document.querySelector('#loginForm form');
        loginForm.addEventListener('submit', (e) => this.handleLogin(e));

        // Password reset
        const resetForm = document.querySelector('#resetPasswordForm form');
        resetForm.addEventListener('submit', (e) => this.handlePasswordReset(e));

        // Form switching
        document.getElementById('showLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('registerForm', 'loginForm');
        });

        document.getElementById('showRegister').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('loginForm', 'registerForm');
        });

        document.getElementById('forgotPassword').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('loginForm', 'resetPasswordForm');
        });

        document.getElementById('backToLogin').addEventListener('click', (e) => {
            e.preventDefault();
            this.switchForm('resetPasswordForm', 'loginForm');
        });

        // Logout
        document.getElementById('logout').addEventListener('click', () => {
            this.logout();
            window.location.reload();
        });
    }

    switchForm(hideFormId, showFormId) {
        document.getElementById(hideFormId).style.display = 'none';
        document.getElementById(showFormId).style.display = 'flex';
    }

    async handleRegistration(e) {
        e.preventDefault();
        try {
            const username = document.getElementById('registerUsername').value;
            const email = document.getElementById('registerEmail').value;
            const password = document.getElementById('registerPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            this.clearErrors();

            // Validation
            if (!this.validateUsername(username)) {
                this.showError('usernameError', 'שם משתמש חייב להכיל לפחות 3 תווים ורק אותיות ומספרים');
                return;
            }
            if (!this.validateEmail(email)) {
                this.showError('emailError', 'כתובת אימייל לא תקינה');
                return;
            }
            if (!this.validatePassword(password)) {
                this.showError('passwordError', 'סיסמה חייבת להכיל לפחות 8 תווים, אות גדולה, מספר וסימן מיוחד');
                return;
            }
            if (password !== confirmPassword) {
                this.showError('confirmPasswordError', 'הסיסמאות אינן תואמות');
                return;
            }

            await this.register(username, email, password);
            this.switchForm('registerForm', 'loginForm');
            
        } catch (error) {
            this.showError('registerError', error.message);
        }
    }

async handleLogin(e) {
    e.preventDefault();
    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const rememberMe = document.getElementById('rememberMe').checked;

        const user = await this.login(email, password, rememberMe);
        if (user) {
            // הסרת ניסיון נעילת הסיבוב ומעבר לגישה עדינה יותר
            if (gameUtils.isMobile) {
                try {
                    // הסתרת אזהרת הסיבוב
                    const landscapeWarning = document.querySelector('.landscape-warning');
                    if (landscapeWarning) {
                        landscapeWarning.style.display = 'none';
                    }
                    
                    // הצגת הטופס תמיד
                    document.querySelectorAll('.auth-container').forEach(container => {
                        container.style.zIndex = '2001';
                    });
                } catch (err) {
                    console.log('Screen orientation handling:', err);
                }
            }
            this.showGameContainer();
        }
    } catch (error) {
        this.showError('loginError', error.message);
    }
}

    async handlePasswordReset(e) {
        e.preventDefault();
        try {
            const email = document.getElementById('resetEmail').value;
            await this.initiatePasswordReset(email);
            alert('קוד איפוס נשלח לאימייל שלך');
            this.switchForm('resetPasswordForm', 'loginForm');
        } catch (error) {
            this.showError('resetError', error.message);
        }
    }

    showGameContainer() {
        document.querySelectorAll('.auth-container').forEach(container => {
            container.style.display = 'none';
        });
        document.getElementById('gameContainer').style.display = 'flex';
        document.getElementById('username').textContent = this.currentUser.username;
    }

    // Validation methods
    validateUsername(username) {
        return /^[a-zA-Z0-9]{3,}$/.test(username);
    }

    validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    validatePassword(password) {
        return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
    }

    // Error handling
    showError(elementId, message) {
        const errorElement = document.getElementById(elementId);
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        } else {
            alert(message);
        }
    }

    clearErrors() {
        document.querySelectorAll('.error-message').forEach(element => {
            element.textContent = '';
            element.style.display = 'none';
        });
    }

    // Core authentication methods
    async register(username, email, password) {
        const hashedPassword = await this.hashPassword(password);
        const newUser = {
            username,
            email,
            password: hashedPassword,
            created: new Date().toISOString(),
            gameData: {
                highScore: 0,
                currentLevel: 1,
                totalGamesPlayed: 0,
                preferences: {
                    soundEnabled: true,
                    musicEnabled: true
                }
            }
        };

        const users = JSON.parse(localStorage.getItem('users') || '[]');
        if (users.some(user => user.email === email)) {
            throw new Error('משתמש קיים במערכת');
        }

        users.push(newUser);
        localStorage.setItem('users', JSON.stringify(users));
        return newUser;
    }

    async login(email, password, rememberMe = false) {
        const users = JSON.parse(localStorage.getItem('users') || '[]');
        const user = users.find(u => u.email === email);

        if (!user) {
            throw new Error('משתמש לא קיים');
        }

        const isPasswordValid = await this.verifyPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('סיסמה שגויה');
        }

        this.currentUser = user;
        if (rememberMe) {
            localStorage.setItem('savedUser', JSON.stringify({ ...user, rememberMe }));
        }

        return user;
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('savedUser');
        document.getElementById('gameContainer').style.display = 'none';
        document.getElementById('loginForm').style.display = 'flex';
    }

    // Password handling
    async hashPassword(password) {
        const encoder = new TextEncoder();
        const data = encoder.encode(password);
        const hash = await crypto.subtle.digest('SHA-256', data);
        return Array.from(new Uint8Array(hash))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }

    async verifyPassword(inputPassword, hashedPassword) {
        const hashedInput = await this.hashPassword(inputPassword);
        return hashedInput === hashedPassword;
    }

    async initiatePasswordReset(email) {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email);
    
    if (!user) {
        throw new Error('לא נמצא משתמש עם כתובת האימייל הזו');
    }
    
    // יצירת קוד איפוס זמני
    const resetCode = Math.random().toString(36).substring(2, 8).toUpperCase();
    user.resetCode = resetCode;
    user.resetCodeExpiry = new Date(Date.now() + 3600000).toISOString(); // תוקף לשעה
    
    // שמירת המידע המעודכן
    localStorage.setItem('users', JSON.stringify(users));
    
    // כאן יכול להיות קוד לשליחת אימייל (במקרה אמיתי)
    console.log(`Reset code for ${email}: ${resetCode}`);
    
    return true;
}
}

export const authManager = new AuthManager();