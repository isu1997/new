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
        name: "ד״ר אלון דביר",
        expertise: ["פולסטאק", "מדע", "היסטוריה"],
        confidence: 0.9,
        experience: "מומחה",
        phrases: [
            "כמומחה בתחום, אוכל לומר ש...",
            "מהמחקר שערכתי בנושא...",
            "בהתבסס על שנים של לימוד בתחום..."
        ]
    },
    {
        name: "רותם כהן",
        expertise: ["פולסטאק", "אנימה", "גיימינג"],
        confidence: 0.6,
        experience: "חובב",
        phrases: [
            "אני מתעניין בנושא כבר כמה שנים...",
            "לפי מה שראיתי וקראתי...",
            "אני לא מומחה, אבל ממה שאני יודע..."
        ]
    },
    {
        name: "נועם לוי",
        expertise: ["טכנולוגיה", "גיאוגרפיה", "מדעי כדור הארץ"],
        confidence: 0.5,
        experience: "סטודנט",
        phrases: [
            "למדתי על זה בקורס באוניברסיטה...",
            "לפי מה שלמדנו בשיעור...",
            "אני נזכר במשהו מהלימודים שלי..."
        ]
    },
    {
        name: "יעל אברהם",
        expertise: ["תרבות פופולרית", "אנימה", "מנגה"],
        confidence: 0.7,
        experience: "חובבת ותיקה",
        phrases: [
            "כמי שצופה באנימה כבר עשור...",
            "מהיכרותי עם הז'אנר והסדרות הפופולריות...",
            "אני זוכרת שבסדרה הזו..."
        ]
    },
    {
        name: "דן כהן",
        expertise: ["היסטוריה", "גיאוגרפיה", "תרבויות"],
        confidence: 0.4,
        experience: "מתעניין",
        phrases: [
            "קראתי פעם על זה באיזה מאמר...",
            "אם אני זוכר נכון מהספר שקראתי...",
            "אני חושב שראיתי סרט תיעודי על זה ש..."
        ]
    },
    {
        name: "שירה אור-לי",
        expertise: ["אזוטריקה", "רוחניות", "קבלה", "רגרסיה וחיים קודמים"],
        confidence: 0.95,
        experience: "מורה ומטפלת בכירה",
        phrases: [
            "מניסיוני כמורה רוחנית, אני רואה כי...",
            "בעבודתי עם תלמידים במשך שנים רבות הבחנתי ש...",
            "כשמתרגלים את הטכניקות האזוטריות האותנטיות מגלים ש...",
            "המסורת הסודית מלמדת אותנו ש...",
            "מעבר לתפיסה המקובלת, החכמה העתיקה מראה לנו ש..."
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

    // Ask the Audience lifeline - completely rewritten to always give correct historical answers
// Ask the Audience lifeline - Improved version for early game stages
useAskAudience() {
    if (!this.lifelines.askTheAudience || this.isProcessing) return;
    this.isProcessing = true;
    
    // Get current question data
    const currentQuestion = questions[this.game.selectedCategory][this.game.currentQuestion % questions[this.game.selectedCategory].length];
    
    // Get question text from the UI
    const questionText = document.getElementById('question-text').textContent.trim();
    
    // Get current game level
    const currentLevel = this.game.currentLevel;
    console.log("Current level:", currentLevel);
    
    // What the game thinks is the correct answer
    const supposedCorrectIndex = currentQuestion.correct;
    console.log("Game thinks correct index is:", supposedCorrectIndex);
    
    // Known question corrections - mapping questions to their correct answer indices
    // 0=א, 1=ב, 2=ג, 3=ד
    const knownCorrections = {
    // General Category
    "מי היה ראש הממשלה הראשון של ישראל": 1, // David Ben-Gurion
    "איזה כוכב לכת הוא הקרוב ביותר לשמש": 2, // Mercury
    "מהו המטבע הרשמי של יפן": 2, // Yen
    "איזה צבע מתקבל מערבוב כחול וצהוב": 1, // Green
    "כמה שחקנים יש בקבוצת כדורגל": 2, // 11
    "מהי בירת צרפת": 3, // Paris
    "איזה חג נקרא גם חג האורים": 1, // Hanukkah
    "מי כתב את 'הנסיך הקטן'": 0, // Antoine de Saint-Exupéry
    "כמה צבעים יש בקשת": 2, // 7
    "איזה כלי נגינה הוא הגדול ביותר בתזמורת": 3, // Grand Piano
    "מהו החומר הקשה ביותר בטבע": 2, // Diamond
    "איזה איבר בגוף אחראי על ייצור אינסולין": 1, // Pancreas
    "מי המציא את הטלפון": 2, // Alexander Graham Bell
    "באיזו שנה הומצא האינטרנט": 0, // 1969
    "מהו הספורט הפופולרי ביותר בעולם": 0, // Soccer/Football

    // Science Category
    "מהו האיבר הגדול ביותר בגוף האדם": 3, // Skin
    "איזה יסוד כימי הוא הנפוץ ביותר ביקום": 3, // Hydrogen
    "מהי הטמפרטורה הנמוכה ביותר האפשרית": 1, // -273.15°C
    "איזה כוח מחזיק את כדור הארץ במסלולו סביב השמש": 0, // Gravity
    "מהו החוק הראשון של ניוטון": 1, // Law of Inertia
    "איזה גז הכרחי לפוטוסינתזה": 2, // Carbon Dioxide
    "כמה כרומוזומים יש בתא אנושי רגיל": 2, // 46
    "מהו החומר הבסיסי ביותר בכל החומרים": 1, // Atom
    "איזה איבר אחראי על שיווי המשקל בגוף": 1, // Inner Ear
    "מהי יחידת המדידה של כוח חשמלי": 2, // Watt
    "איזה סוג תא אחראי על העברת חמצן בדם": 0, // Red Blood Cells
    "מהו התהליך של הפיכת מים לאדים": 1, // Evaporation
    "איזה כוכב לכת הוא הגדול ביותר במערכת השמש": 1, // Jupiter
    "מהו החוק השני של התרמודינמיקה": 1, // Law of Entropy
    "איזה חומר גורם לצבע הירוק בצמחים": 1, // Chlorophyll

    // History Category
    "באיזו שנה הוקמה מדינת ישראל": 1, // 1948
    "מי כתב את מגילת העצמאות": 0, // Moshe Sharett
    "באיזו שנה הסתיימה מלחמת העולם השנייה": 1, // 1945
    "מי היה המלך הראשון של ישראל": 0, // Saul
    "באיזו שנה נחתם הסכם השלום עם מצרים": 2, // 1979
    "מי היה מנהיג המהפכה הצרפתית": 1, // Robespierre
    "באיזו שנה התרחשה המהפכה התעשייתית": 2, // 1750
    "מי היה אלכסנדר הגדול": 2, // King of Macedonia
    "באיזו שנה התגלתה אמריקה": 0, // 1492
    "מי היה הקיסר הראשון של רומא": 1, // Augustus
    "באיזו שנה נפלה חומת ברלין": 2, // 1989
    "מי היה מנהיג דרום אפריקה שנאבק באפרטהייד": 1, // Nelson Mandela
    "באיזו שנה הוקם האו\"ם": 2, // 1945
    "מי המציא את הדפוס": 0, // Johannes Gutenberg
    "באיזו שנה החלה המהפכה הצרפתית": 1, // 1789

    // Geography Category
    "מהי העיר הגדולה ביותר בישראל": 1, // Jerusalem
    "איזה ים הוא הנמוך ביותר בעולם": 2, // Dead Sea
    "מהי העיר הגדולה ביותר בעולם": 1, // Tokyo
    "איזו מדינה היא הגדולה ביותר בעולם": 3, // Russia
    "באיזו יבשת נמצאת מצרים": 0, // Africa
    "מהו ההר הגבוה בעולם": 2, // Everest
    "איזה נהר הוא הארוך ביותר בעולם": 0, // Nile
    "מהו המפרץ הגדול ביותר בעולם": 1, // Bay of Bengal
    "באיזו מדינה נמצא הקולוסיאום": 1, // Italy
    "מהו המדבר הגדול ביותר בעולם": 0, // Sahara
    "באיזו מדינה נמצא הפיורד הארוך ביותר": 0, // Norway
    "איזה אוקיינוס הוא הגדול ביותר": 3, // Pacific
    "איזו מדינה היא הקטנה ביותר בעולם": 2, // Vatican
    "באיזו עיר נמצא מגדל אייפל": 3, // Paris
    "מהו האי הגדול ביותר בעולם": 1, // Greenland

    // Anime Category
    "מי היוצר של 'דרגון בול'": 0, // Akira Toriyama
    "באיזו שנה יצא האנימה 'נארוטו'": 1, // 2002
    "מהו שמו של הטיטאן של ארן יגר": 2, // Attack Titan
    "מי הדמות הראשית ב'Death Note'": 1, // Light Yagami
    "איזה אנימה מחזיק בשיא הסרטים המצליח ביותר ביפן": 1, // Demon Slayer
    "מי הוא המורה של נארוטו": 0, // Kakashi
    "באיזה אנימה מופיע 'סייטמה'": 1, // One Punch Man
    "מהו שמו של הפוקימון הראשון בפוקדקס": 1, // Bulbasaur
    "מי היוצר של 'אוונגליון'": 0, // Hideaki Anno
    "באיזה אנימה מופיע ארגון 'אקאטסוקי'": 2, // Naruto
    "מהו שמו של האח הגדול ב'Fullmetal Alchemist'": 1, // Edward Elric
    "איזה כוח יש ל'גוקו' מדרגון בול": 1, // Ki
    "מי המפקד של חיל הסיירים ב'Attack on Titan'": 1, // Erwin Smith
    "באיזה אנימה מופיע 'איזוקו מידוריה'": 1, // My Hero Academia
    "מהו שמו של הפיראט המפורסם ב'One Piece'": 0, // Luffy

    // Fullstack Category
    "איך ניתן להגדיר משתנה פרטי בתוך מחלקה ב-JavaScript": 1, // Using # before variable name
    "מה ההבדל בין useEffect ו-useLayoutEffect ב-React": 2, // useLayoutEffect runs synchronously after DOM changes but before browser paint
    "כיצד ניתן לטפל ב-memory leak בקומפוננטת React": 1, // Return cleanup function from useEffect
    "איזו טכניקה CSS מתאימה ביותר ליצירת לייאאוט רספונסיבי מורכב": 2, // CSS Grid and Flexbox
    "מהי הדרך הנכונה לטפל באירוע שמופעל פעמים רבות כמו scroll או resize": 2, // Using debounce or throttle
    "כיצד ניתן למנוע SQL Injection בשרת Node.js": 2, // Using parameterized queries
    "מהו הפתרון הטוב ביותר לבעיית Callback Hell ב-Node.js": 3, // All answers are correct, depends on the case
    "מהי הדרך היעילה ביותר לשתף מידע בין קומפוננטות React שאינן קשורות ישירות בעץ הקומפוננטות": 2, // Redux or other state management library
    "איזו שיטה תאפשר טעינה מהירה יותר של אתר מורכב": 0, // Code splitting and lazy loading
    "כיצד ניתן לאפשר Virtual DOM optimization ב-React": 2, // Properly implement shouldComponentUpdate or use React.memo, useMemo, useCallback
    "איזו גישה מומלצת לניהול צורת האימות (Authentication) באפליקציית SPA": 1, // Use HttpOnly Cookie for token storage
    "מהי הדרך הנכונה לטפל בטיפוסים מורכבים ב-TypeScript עבור props של קומפוננטת React": 1, // Define interface or type with generics
    "כיצד ניתן לשפר את ביצועי CSS Selector": 1, // Prefer class selectors over tag selectors
    "מה הדרך המומלצת לטפל בבעיית CORS בעת פיתוח אפליקציית full-stack": 0, // Add appropriate Access-Control-* headers on server side
    "איזו שיטה ניתן להשתמש כדי למנוע את בעיית Flash of Unstyled Content (FOUC)": 2, // Use Critical CSS and load remaining CSS asynchronously

     // Esoteric & Spirituality Category
    "איזו טרנספורמציה מתרחשת בצ'אקרת הלב כאשר האדם מצליח לאחד את 'עץ החיים' ו'עץ הדעת' בעבודה הפנימית שלו?": 3,
    "מהו הקשר העמוק בין ה'רעד האוטונומי' בתהליך האלכימיה הלבנה לבין פעילות גל האלפא-תטא במוח בזמן כניסה למצבי טראנס מדיטטיביים?": 1,
    "בתהליך 'שריפת הקארמה' אזוטרי, מה המשמעות האמיתית של המושג 'משא ומתן על תנאי החיים' ואיך זה קשור להיררכיה של הלורדים הקארמתיים?": 2,
    "כיצד משתקפים שבעת ימי הבריאה בתהליך ההתעוררות הספיראלי של שבע הצ'אקרות, ומה הקשר שלהם לשבע הספירות התחתונות בעץ החיים?": 1,
    "מה הקשר הסודי בין המצב הטורקיז ב-Spiral Dynamics לבין התודעה הקריסטלית המתוארת בתורות האזוטריות, ואיך זה מתבטא בהתפתחות הקולקטיבית האנושית?": 0,
    "מהי המשמעות האזוטרית המדויקת של בניית 'גוף אסטרלי סולארי' ואיך היא נבדלת מהיכולת הטבעית לצאת מהגוף במצבי שינה או מדיטציה?": 1,
    "כיצד פועל מנגנון ה'אינטואיציה הנשית' מנקודת מבט של הבלוטות האנדוקריניות והקשר שלהן לצ'אקרת הגרון והכתר?": 3,
    "מהו 'הפרדוקס האלכימי' בתהליך של שחרור חוזים נשמתיים וכיצד הוא קשור לזיהוי של קוסמים שחורים ומאגיה שחורה?": 2,
    "מהי המערכת הסודית שמקשרת בין 22 האותיות העבריות, 22 נתיבות עץ החיים ו-22 קלפי הארקנה הגדולה של הטארוט?": 0,
    "במצבי טראנס עמוקים של 'אלכימיה לבנה', כיצד משפיעה הנשימה המעגלית על המבנה האנרגטי של המרידיאנים ומה הקשר לטכניקת 'הרעד האוטונומי'?": 3,
    "מהי המשמעות העמוקה של 'זוגיות קוסמית' בהשוואה לזוגיות קארמתית ודהרמתית, וכיצד היא קשורה למושג של 'גביש המרכבה הזוגי'?": 2,
    "כיצד פועל מנגנון 'היוגה של החלומות' להארת התודעה באסטרל וכיצד הוא קשור לפיתוח יכולות על-חושיות בעולם הערות?": 2,
    "מהי המשמעות האזוטרית העמוקה של 'דהרמה קוונטית' ביחס להתפתחות הרוחנית וכיצד היא קשורה לעקרונות ההשתקפות בין המיקרוקוסמוס למאקרוקוסמוס?": 2,
    "מהי המשמעות הסודית של 'חניכות אסטרליות' ומה ההבדל המהותי בינן לבין חניכות ארציות בהקשר של התפתחות היכולות המטאפיזיות?": 1,
    "מה הקשר העמוק בין 'קידוש חפצים' לבין 'טיהור מרחב' במסורת האזוטרית ומדוע שני התהליכים דורשים פעילות הרמונית של הצ'אקרות?": 2,
    "לפי מחקריה של דולורס קנון ושיטת 'Quantum Healing Hypnosis Technique', מה מתרחש ב'מרחב בין החיים' (Life Between Lives) שמייקל ניוטון חקר, וכיצד זה משפיע על תהליך בחירת הגלגול הבא?": 1

};
    
    // Determine the actual correct index - use correction if available, otherwise use default
    let actualCorrectIndex = supposedCorrectIndex;
    
    // Look for matches in question text
    for (const key in knownCorrections) {
        if (questionText.includes(key)) {
            actualCorrectIndex = knownCorrections[key];
            console.log(`Override applied for question "${key}": setting correct index to ${actualCorrectIndex}`);
            break;
        }
    }
    
    console.log("Final determined correct index:", actualCorrectIndex);
    
    // Generate audience voting results distribution
    let results = [0, 0, 0, 0];
    
    // For early game levels (0-4), ALWAYS give highest percentage to the actual correct answer
    if (currentLevel < 5) {
        // Give correct answer a very high percentage (75-85%)
        results[actualCorrectIndex] = 75 + Math.floor(Math.random() * 11);
        
        // Remainder to distribute
        const remainder = 100 - results[actualCorrectIndex];
        
        // Find the indices of wrong answers
        const wrongIndices = [0, 1, 2, 3].filter(i => i !== actualCorrectIndex);
        
        // Fixed distribution for wrong answers
        results[wrongIndices[0]] = Math.floor(remainder * 0.6);
        results[wrongIndices[1]] = Math.floor(remainder * 0.3);
        results[wrongIndices[2]] = remainder - results[wrongIndices[0]] - results[wrongIndices[1]];
    } else {
        // Higher levels - give high but not guaranteed percentage to correct answer
        const correctPercentage = 50 + Math.floor(Math.random() * 21); // 50-70%
        results[actualCorrectIndex] = correctPercentage;
        
        // Distribute remaining percentage among wrong answers
        let remaining = 100 - correctPercentage;
        const wrongIndices = [0, 1, 2, 3].filter(i => i !== actualCorrectIndex);
        
        // Random distribution of remainder
        wrongIndices.forEach((index, i) => {
            if (i === wrongIndices.length - 1) {
                results[index] = remaining;
            } else {
                const value = Math.floor(Math.random() * (remaining / 2));
                results[index] = value;
                remaining -= value;
            }
        });
    }
    
    // Final check - absolutely ensure the correct answer has the highest percentage
    const highestPercent = Math.max(...results);
    const highestIndex = results.indexOf(highestPercent);
    
    if (highestIndex !== actualCorrectIndex) {
        console.error("CRITICAL ERROR: Correct answer doesn't have highest percentage - fixing!");
        // Swap percentages to ensure the correct answer has the highest
        const temp = results[highestIndex];
        results[highestIndex] = results[actualCorrectIndex];
        results[actualCorrectIndex] = temp + 5; // Add 5% to ensure it's higher
    }
    
    // Ensure the percentages sum to exactly 100%
    const sum = results.reduce((a, b) => a + b, 0);
    if (sum !== 100) {
        const diff = 100 - sum;
        results[actualCorrectIndex] += diff;
    }
    
    console.log("Final audience results:", results);
    
    // Show audience graph
    this.showAudienceGraph(results);
    
    // Mark lifeline as used
    this.lifelines.askTheAudience = false;
    document.getElementById('ask-audience').disabled = true;
    document.getElementById('ask-audience').classList.add('used');
    
    this.isProcessing = false;
}
    
    // NEW METHOD: Generate results where correct answer is GUARANTEED to be highest
    generateGuaranteedCorrectResults(correctAnswer) {
        // Fixed pattern for first 5 levels to GUARANTEE correct answer has highest percentage
        const results = [0, 0, 0, 0];
        
        // Start by giving the correct answer a high percentage (75-85%)
        results[correctAnswer] = 75 + Math.floor(Math.random() * 11);
        
        // Distribute remaining percentage points among wrong answers
        const remaining = 100 - results[correctAnswer];
        const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correctAnswer);
        
        // Create a guaranteed pattern where no wrong answer can exceed the correct one
        const maxWrongPercentage = Math.floor(remaining / 3); // divide remaining evenly
        
        // First wrong answer gets a random percentage up to maxWrongPercentage
        results[wrongAnswers[0]] = Math.floor(Math.random() * maxWrongPercentage) + 5;
        
        // Second wrong answer gets a similar random percentage
        results[wrongAnswers[1]] = Math.floor(Math.random() * maxWrongPercentage) + 3;
        
        // Last wrong answer gets the remainder to ensure total is exactly 100%
        results[wrongAnswers[2]] = 100 - results[correctAnswer] - results[wrongAnswers[0]] - results[wrongAnswers[1]];
        
        return results;
    }
    
    // Standard results generation for higher levels (original logic)
    generateStandardResults(correctAnswer, difficulty) {
        // Standard behavior for higher levels (original implementation)
        let correctPercentage;
        switch (difficulty) {
            case 'easy':
                correctPercentage = 85 + Math.random() * 10; // 85-95%
                break;
            case 'medium':
                correctPercentage = 65 + Math.random() * 10; // 65-75%
                break;
            case 'hard':
                correctPercentage = 45 + Math.random() * 10; // 45-55%
                break;
            default:
                correctPercentage = 50 + Math.random() * 10;
        }
        
        // Initialize results array
        const results = [0, 0, 0, 0];
        results[correctAnswer] = correctPercentage;
        
        // Distribute remaining percentage among wrong answers
        let remaining = 100 - correctPercentage;
        const wrongAnswers = [0, 1, 2, 3].filter(i => i !== correctAnswer);
        
        wrongAnswers.forEach((index, i) => {
            if (i === wrongAnswers.length - 1) {
                results[index] = Math.round(remaining * 10) / 10;
            } else {
                const value = Math.random() * remaining;
                results[index] = Math.round(value * 10) / 10;
                remaining -= value;
            }
        });
        
        return results;
    }

    // Determine question difficulty based on game level
    getQuestionDifficulty(level) {
        if (level < 5) return 'easy';
        if (level < 10) return 'medium';
        return 'hard';
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