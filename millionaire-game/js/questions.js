const questions = {
    general: [
        {
            text: "מי היה ראש הממשלה הראשון של ישראל?",
            answers: ["משה שרת", "דוד בן גוריון", "גולדה מאיר", "מנחם בגין"],
            correct: 1
        },
        {
            text: "איזה כוכב לכת הוא הקרוב ביותר לשמש?",
            answers: ["נוגה", "מאדים", "כוכב חמה", "צדק"],
            correct: 2
        },
        {
            text: "מהו המטבע הרשמי של יפן?",
            answers: ["וון", "יואן", "ין", "דולר"],
            correct: 2
        },
        {
            text: "איזה צבע מתקבל מערבוב כחול וצהוב?",
            answers: ["סגול", "ירוק", "כתום", "חום"],
            correct: 1
        },
        {
            text: "כמה שחקנים יש בקבוצת כדורגל?",
            answers: ["9", "10", "11", "12"],
            correct: 2
        },
        {
            text: "מהי בירת צרפת?",
            answers: ["לונדון", "ברלין", "מדריד", "פריז"],
            correct: 3
        },
        {
            text: "איזה חג נקרא גם חג האורים?",
            answers: ["פורים", "חנוכה", "פסח", "סוכות"],
            correct: 1
        },
        {
            text: "מי כתב את 'הנסיך הקטן'?",
            answers: ["אנטואן דה סנט-אכזופרי", "ויקטור הוגו", "אלברט קאמי", "ז'ול ורן"],
            correct: 0
        },
        {
            text: "כמה צבעים יש בקשת?",
            answers: ["5", "6", "7", "8"],
            correct: 2
        },
        {
            text: "איזה כלי נגינה הוא הגדול ביותר בתזמורת?",
            answers: ["צ'לו", "קונטרבס", "טובה", "פסנתר כנף"],
            correct: 3
        },
        {
            text: "מהו החומר הקשה ביותר בטבע?",
            answers: ["זהב", "פלטינה", "יהלום", "טיטניום"],
            correct: 2
        },
        {
            text: "איזה איבר בגוף אחראי על ייצור אינסולין?",
            answers: ["כבד", "לבלב", "טחול", "כליות"],
            correct: 1
        },
        {
            text: "מי המציא את הטלפון?",
            answers: ["תומאס אדיסון", "ניקולה טסלה", "אלכסנדר גרהם בל", "גוליילמו מרקוני"],
            correct: 2
        },
        {
            text: "באיזו שנה הומצא האינטרנט?",
            answers: ["1969", "1975", "1983", "1989"],
            correct: 0
        },
        {
            text: "מהו הספורט הפופולרי ביותר בעולם?",
            answers: ["כדורגל", "כדורסל", "טניס", "קריקט"],
            correct: 0
        }
    ],
    science: [
        {
            text: "מהו האיבר הגדול ביותר בגוף האדם?",
            answers: ["הכבד", "המוח", "הריאות", "העור"],
            correct: 3
        },
        {
            text: "איזה יסוד כימי הוא הנפוץ ביותר ביקום?",
            answers: ["חמצן", "פחמן", "הליום", "מימן"],
            correct: 3
        },
        {
            text: "מהי הטמפרטורה הנמוכה ביותר האפשרית?",
            answers: ["0°C", "-273.15°C", "-100°C", "-500°C"],
            correct: 1
        },
        {
            text: "איזה כוח מחזיק את כדור הארץ במסלולו סביב השמש?",
            answers: ["כוח המשיכה", "כוח מגנטי", "כוח צנטריפוגלי", "כוח חשמלי"],
            correct: 0
        },
        {
            text: "מהו החוק הראשון של ניוטון?",
            answers: ["חוק התנועה", "חוק ההתמדה", "חוק הכבידה", "חוק התאוצה"],
            correct: 1
        },
        {
            text: "איזה גז הכרחי לפוטוסינתזה?",
            answers: ["חמצן", "חנקן", "פחמן דו-חמצני", "מימן"],
            correct: 2
        },
        {
            text: "כמה כרומוזומים יש בתא אנושי רגיל?",
            answers: ["23", "42", "46", "48"],
            correct: 2
        },
        {
            text: "מהו החומר הבסיסי ביותר בכל החומרים?",
            answers: ["מולקולה", "אטום", "פרוטון", "אלקטרון"],
            correct: 1
        },
        {
            text: "איזה איבר אחראי על שיווי המשקל בגוף?",
            answers: ["מוח", "אוזן פנימית", "עמוד השדרה", "צרבלום"],
            correct: 1
        },
        {
            text: "מהי יחידת המדידה של כוח חשמלי?",
            answers: ["וולט", "אמפר", "ואט", "אוהם"],
            correct: 2
        },
        {
            text: "איזה סוג תא אחראי על העברת חמצן בדם?",
            answers: ["תאי דם אדומים", "תאי דם לבנים", "טסיות דם", "פלזמה"],
            correct: 0
        },
        {
            text: "מהו התהליך של הפיכת מים לאדים?",
            answers: ["עיבוי", "המראה", "התכה", "קיפאון"],
            correct: 1
        },
        {
            text: "איזה כוכב לכת הוא הגדול ביותר במערכת השמש?",
            answers: ["שבתאי", "צדק", "אורנוס", "נפטון"],
            correct: 1
        },
        {
            text: "מהו החוק השני של התרמודינמיקה?",
            answers: ["חוק שימור האנרגיה", "חוק האנטרופיה", "חוק הלחץ", "חוק הטמפרטורה"],
            correct: 1
        },
        {
            text: "איזה חומר גורם לצבע הירוק בצמחים?",
            answers: ["קרוטן", "כלורופיל", "מלנין", "המוגלובין"],
            correct: 1
        }
    ],
    history: [
        {
            text: "באיזו שנה הוקמה מדינת ישראל?",
            answers: ["1947", "1948", "1949", "1950"],
            correct: 1
        },
        {
            text: "מי כתב את מגילת העצמאות?",
            answers: ["משה שרת", "זאב ז'בוטינסקי", "דוד בן גוריון", "חיים ויצמן"],
            correct: 0
        },
        {
            text: "באיזו שנה הסתיימה מלחמת העולם השנייה?",
            answers: ["1944", "1945", "1946", "1947"],
            correct: 1
        },
        {
            text: "מי היה המלך הראשון של ישראל?",
            answers: ["שאול", "דוד", "שלמה", "רחבעם"],
            correct: 0
        },
        {
            text: "באיזו שנה נחתם הסכם השלום עם מצרים?",
            answers: ["1977", "1978", "1979", "1980"],
            correct: 2
        },
        {
            text: "מי היה מנהיג המהפכה הצרפתית?",
            answers: ["נפוליאון בונפרטה", "רובספייר", "לואי ה-16", "וולטר"],
            correct: 1
        },
        {
            text: "באיזו שנה התרחשה המהפכה התעשייתית?",
            answers: ["1650", "1700", "1750", "1800"],
            correct: 2
        },
        {
            text: "מי היה אלכסנדר הגדול?",
            answers: ["מלך רומא", "מלך מצרים", "מלך מקדוניה", "מלך פרס"],
            correct: 2
        },
        {
            text: "באיזו שנה התגלתה אמריקה?",
            answers: ["1492", "1496", "1500", "1504"],
            correct: 0
        },
        {
            text: "מי היה הקיסר הראשון של רומא?",
            answers: ["יוליוס קיסר", "אוגוסטוס", "נירון", "קלאודיוס"],
            correct: 1
        },
        {
            text: "באיזו שנה נפלה חומת ברלין?",
            answers: ["1987", "1988", "1989", "1990"],
            correct: 2
        },
        {
            text: "מי היה מנהיג דרום אפריקה שנאבק באפרטהייד?",
            answers: ["מרטין לותר קינג", "נלסון מנדלה", "מהטמה גנדי", "דזמונד טוטו"],
            correct: 1
        },
        {
            text: "באיזו שנה הוקם האו\"ם?",
            answers: ["1943", "1944", "1945", "1946"],
            correct: 2
        },
        {
            text: "מי המציא את הדפוס?",
            answers: ["יוהאן גוטנברג", "לאונרדו דה וינצ'י", "גלילאו גליליי", "ניקולס קופרניקוס"],
            correct: 0
        },
        {
            text: "באיזו שנה החלה המהפכה הצרפתית?",
            answers: ["1776", "1789", "1793", "1799"],
            correct: 1
        }
    ],
    geography: [
        {
            text: "מהי העיר הגדולה ביותר בישראל?",
            answers: ["תל אביב", "ירושלים", "חיפה", "באר שבע"],
            correct: 1
        },
        {
            text: "איזה ים הוא הנמוך ביותר בעולם?",
            answers: ["הים התיכון", "ים סוף", "ים המלח", "הכנרת"],
            correct: 2
        },
        {
            text: "מהי העיר הגדולה ביותר בעולם?",
            answers: ["ניו יורק", "טוקיו", "שנגחאי", "דלהי"],
            correct: 1
        },
        {
            text: "איזו מדינה היא הגדולה ביותר בעולם?",
            answers: ["סין", "קנדה", "ארה\"ב", "רוסיה"],
            correct: 3
        },
        {
            text: "באיזו יבשת נמצאת מצרים?",
            answers: ["אפריקה", "אסיה", "אירופה", "המזרח התיכון"],
            correct: 0
        },
        {
            text: "מהו ההר הגבוה בעולם?",
            answers: ["קילימנג'רו", "מון בלאן", "אוורסט", "מקינלי"],
            correct: 2
        },
        {
            text: "איזה נהר הוא הארוך ביותר בעולם?",
            answers: ["הנילוס", "האמזונס", "המיסיסיפי", "היאנגצה"],
            correct: 0
        },
        {
            text: "מהו המפרץ הגדול ביותר בעולם?",
            answers: ["מפרץ מקסיקו", "מפרץ בנגל", "מפרץ הדסון", "מפרץ עדן"],
            correct: 1
        },
        {
            text: "באיזו מדינה נמצא הקולוסיאום?",
            answers: ["יוון", "איטליה", "ספרד", "צרפת"],
            correct: 1
        },
        {
            text: "מהו המדבר הגדול ביותר בעולם?",
            answers: ["סהרה", "גובי", "אטקמה", "נמיב"],
            correct: 0
        },
        {
            text: "באיזו מדינה נמצא הפיורד הארוך ביותר?",
            answers: ["נורבגיה", "שבדיה", "פינלנד", "דנמרק"],
            correct: 0
        },
        {
            text: "איזה אוקיינוס הוא הגדול ביותר?",
            answers: ["האטלנטי", "ההודי", "הארקטי", "השקט"],
            correct: 3
        },
        {
            text: "איזו מדינה היא הקטנה ביותר בעולם?",
            answers: ["מונקו", "נאורו", "וטיקן", "סן מרינו"],
            correct: 2
        },
        {
            text: "באיזו עיר נמצא מגדל אייפל?",
            answers: ["לונדון", "ברלין", "רומא", "פריז"],
            correct: 3
        },
        {
            text: "מהו האי הגדול ביותר בעולם?",
            answers: ["מדגסקר", "גרינלנד", "בורנאו", "סומטרה"],
            correct: 1
        }
    ],
    anime: [
        {
            text: "מי היוצר של 'דרגון בול'?",
            answers: ["אקירה טורימה", "מאסאשי קישימוטו", "אייצ'ירו אודה", "הירוהיקו אראקי"],
            correct: 0
        },
        {
            text: "באיזו שנה יצא האנימה 'נארוטו'?",
            answers: ["2000", "2002", "2004", "2006"],
            correct: 1
        },
        {
            text: "מהו שמו של הטיטאן של ארן יגר?",
            answers: ["טיטאן קרבי", "טיטאן משוריין", "טיטאן תוקף", "טיטאן ענק"],
            correct: 2
        },
        {
            text: "מי הדמות הראשית ב'Death Note'?",
            answers: ["L", "Light Yagami", "Misa Amane", "Near"],
            correct: 1
        },
        {
            text: "איזה אנימה מחזיק בשיא הסרטים המצליח ביותר ביפן?",
            answers: ["Your Name", "Demon Slayer", "Spirited Away", "Howl's Moving Castle"],
            correct: 1
        },
        {
            text: "מי הוא המורה של נארוטו?",
            answers: ["קאקאשי", "ג'ירייה", "אירוקה", "אורוצ'ימארו"],
            correct: 0
        },
        {
            text: "באיזה אנימה מופיע 'סייטמה'?",
            answers: ["My Hero Academia", "One Punch Man", "Black Clover", "Hunter x Hunter"],
            correct: 1
        },
        {
            text: "מהו שמו של הפוקימון הראשון בפוקדקס?",
            answers: ["פיקאצ'ו", "צ'רמנדר", "בלבזאור", "מיו"],
            correct: 1
        },
        {
            text: "מי היוצר של 'אוונגליון'?",
            answers: ["הידאקי אנו", "מאמורו הוסודה", "הייאו מיאזאקי", "הידאו אזומה"],
            correct: 0
        },
        {
            text: "באיזה אנימה מופיע ארגון 'אקאטסוקי'?",
            answers: ["Bleach", "One Piece", "Naruto", "Dragon Ball"],
            correct: 2
        },
        {
            text: "מהו שמו של האח הגדול ב'Fullmetal Alchemist'?",
            answers: ["אלפונס אלריק", "אדוארד אלריק", "רוי מוסטנג", "שאו טאקר"],
            correct: 1
        },
        {
            text: "איזה כוח יש ל'גוקו' מדרגון בול?",
            answers: ["צ'אקרה", "קי", "מאנה", "רייאטסו"],
            correct: 1
        },
        {
            text: "מי המפקד של חיל הסיירים ב'Attack on Titan'?",
            answers: ["לוי אקרמן", "ארווין סמית", "הנג'י זואי", "קית שאדיס"],
            correct: 1
        },
        {
            text: "באיזה אנימה מופיע 'איזוקו מידוריה'?",
            answers: ["Black Clover", "My Hero Academia", "Blue Exorcist", "Soul Eater"],
            correct: 1
        },
        {
            text: "מהו שמו של הפיראט המפורסם ב'One Piece'?",
            answers: ["לופי", "זורו", "סאנג'י", "נאמי"],
            correct: 0
        }
    ]
};