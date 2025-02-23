const categories = {
    figures: {
    name: "פיגרים",
    items: [
      { name: "נארוטו אוזומאקי", price: 299 }, // Naruto
      { name: "לופי מגיר 5", price: 349 }, // One Piece 
      { name: "גוקו אולטרה אינסטינקט", price: 399 }, // Dragon Ball Super
      { name: "מיקאסה אקרמן", price: 289 }, // Attack on Titan
      { name: "סונג ג'ין-וו", price: 449 }, // Solo Leveling
      { name: "טאנג'ירו קמאדו", price: 379 }, // Demon Slayer
      { name: "זורו רוצח שדים", price: 329 }, // One Piece
      { name: "איטאדורי יוג'י", price: 359 }, // Jujutsu Kaisen
      { name: "צ'ה האה-אין", price: 399 }, // Solo Leveling
      { name: "איטאצ'י אוצ'יהא", price: 419 }, // Naruto
      { name: "ארן טיטאן", price: 469 }, // Attack on Titan
      { name: "איינה חרב הפיות", price: 389 }, // Frieren
      { name: "דג'י צ'יינסו מן", price: 399 }, // Chainsaw Man
      { name: "מאקי זנין", price: 379 }, // Jujutsu Kaisen
      { name: "בוג'י", price: 359 }, // Hell's Paradise
      { name: "תור החושך", price: 429 }, // Blue Lock
      { name: "קג'י איטדורי", price: 399 }, // Jujutsu Kaisen
      { name: "פאנצ'י", price: 369 }, // Chainsaw Man
      { name: "Sukuna Special Edition", price: 449 }, // Jujutsu Kaisen
      { name: "Anya Forger Limited", price: 399 } // Spy x Family
    ]
    },
    accessories: {
    name: "אקססוריז",
    items: [
      { name: "שרשרת האנטר", price: 79 }, // Hunter x Hunter
      { name: "טבעת אקאצקי", price: 89 }, // Naruto
      { name: "תג צבא הסיור", price: 69 }, // Attack on Titan
      { name: "צמיד דרגון בול", price: 59 }, // Dragon Ball
      { name: "טבעת S-Rank", price: 99 }, // Solo Leveling
      { name: "שרשרת קריסטל כחול", price: 129 }, // Solo Leveling
      { name: "סיכת הקורפס", price: 49 }, // Attack on Titan
      { name: "צמיד השד השמיימי", price: 89 }, // Black Clover
      { name: "טבעת הכישוף השחור", price: 79 }, // Jujutsu Kaisen
      { name: "תליון הניצוץ", price: 69 }, // Fire Force
      { name: "סט טבעות אקאצקי", price: 199 }, // Naruto
      { name: "טבעת פריירן", price: 89 }, // Frieren
      { name: "שרשרת מסור השדים", price: 99 }, // Chainsaw Man
      { name: "צמיד כדורגל קסום", price: 79 }, // Blue Lock
      { name: "תליון גאבימארו", price: 69 }, // Hell's Paradise
      { name: "סיכת JJK", price: 59 }, // Jujutsu Kaisen
      { name: "Power Chainsaw Necklace", price: 129 }, // Chainsaw Man
      { name: "Toji Fushiguro Ring", price: 99 } // Jujutsu Kaisen
    ]
    },
    clothing: {
    name: "בגדים",
    items: [
     { name: "חולצת אטאק און טיטאן", price: 129 }, // Attack on Titan
     { name: "קפוצ'ון דמון סלייר", price: 249 }, // Demon Slayer
     { name: "חולצת מאי הירו אקדמיה", price: 119 }, // My Hero Academia
     { name: "מכנסי נארוטו", price: 159 }, // Naruto
     { name: "מעיל הצייד", price: 299 }, // Solo Leveling
     { name: "חולצת הצללים", price: 149 }, // Solo Leveling
     { name: "גופיית אנטי מאג'י", price: 89 }, // Black Clover
     { name: "מעיל ארגון הקוסמים", price: 279 }, // Jujutsu Kaisen
     { name: "חולצת ג'וג'וצו קאיסן", price: 139 }, // Jujutsu Kaisen
     { name: "סווטשירט צ'יינסו מן", price: 229 }, // Chainsaw Man
     { name: "חליפת האקדמיה", price: 349 }, // My Hero Academia
     { name: "חולצת פריירן", price: 139 }, // Frieren
     { name: "קפוצ'ון צ'יינסו מן", price: 259 }, // Chainsaw Man
     { name: "חולצת בלו לוק", price: 129 }, // Blue Lock
     { name: "סווטשירט גאבימארו", price: 239 }, // Hell's Paradise
     { name: "מעיל גוג'ו", price: 299 }, // Jujutsu Kaisen
     { name: "Spy x Family Hoodie", price: 249 }, // Spy x Family
     { name: "Hell's Paradise T-Shirt", price: 139 } // Hell's Paradise
    ]
    },
    manga: {
    name: "מנגות",
    items: [
     { name: "ג'וג'ו הרפתקה מוזרה", price: 89 }, // JoJo's Bizarre Adventure
     { name: "וואן פיס", price: 79 }, // One Piece
     { name: "דת' נוט", price: 99 }, // Death Note
     { name: "בלאק קלובר", price: 69 }, // Black Clover
     { name: "סולו לבלינג", price: 89 }, // Solo Leveling
     { name: "ספר אמנות סולו לבלינג", price: 199 }, // Solo Leveling
     { name: "דמון סלייר", price: 79 }, // Demon Slayer
     { name: "ג'וג'וצו קאיסן", price: 85 }, // Jujutsu Kaisen
     { name: "בלו לוק", price: 75 }, // Blue Lock
     { name: "צ'יינסו מן", price: 89 }, // Chainsaw Man
     { name: "ספיי x פמילי", price: 79 }, // Spy x Family
     { name: "פריירן מעבר לסוף המסע", price: 85 }, // Frieren
     { name: "גן עדן של השדים", price: 79 }, // Hell's Paradise
     { name: "בלו לוק", price: 89 }, // Blue Lock
     { name: "צ'יינסו מן כרך 12", price: 79 }, // Chainsaw Man
     { name: "ג'וג'וצו קאיסן 0", price: 89 }, // Jujutsu Kaisen
     { name: "Oshi no Ko Vol.1", price: 89 }, // Oshi no Ko
     { name: "Dandadan Vol.1", price: 85 } // Dandadan
    ]
    },
    cosplay: {
    name: "ציוד קוספליי",
    items: [
     { name: "תחפושת איטאצ'י", price: 499 }, // Naruto
     { name: "פאה זירו טו", price: 199 }, // Darling in the Franxx
     { name: "חרב קימטסו", price: 299 }, // Demon Slayer
     { name: "תחפושת רם", price: 449 }, // Re:Zero
     { name: "שריון הצייד", price: 599 }, // Solo Leveling
     { name: "סט דאגרים שחורים", price: 349 }, // Solo Leveling
     { name: "תחפושת גוג'ו", price: 469 }, // Jujutsu Kaisen
     { name: "נשק טאנג'ירו", price: 279 }, // Demon Slayer
     { name: "תחפושת לוי", price: 529 }, // Attack on Titan
     { name: "סט שריון טיטאן", price: 649 }, // Attack on Titan
     { name: "תחפושת צוות 7", price: 479 }, // Naruto
     { name: "גלימת פריירן", price: 489 }, // Frieren
     { name: "תחפושת דג'י", price: 519 }, // Chainsaw Man
     { name: "תלבושת בלו לוק", price: 469 }, // Blue Lock
     { name: "תחפושת גאבימארו", price: 499 }, // Hell's Paradise
     { name: "שריון סוקונה", price: 599 }, // Jujutsu Kaisen
     { name: "ערכת אוניפורמה מלאה לוי אקרמן", price: 899 }, // Attack on Titan (כולל מעיל, מכנסיים, רתמות ולהבים)
     { name: "סט שריון זרו מלא", price: 799 }, // Demon Slayer (כולל חליפה מלאה, קטנות וחרב האשוגורו)
     { name: "Power Chainsaw Man Costume", price: 549 }, // Chainsaw Man
     { name: "Yor Forger Assassin Dress", price: 599 } // Spy x Family
    ]
    },
    posters: {
    name: "פוסטרים",
    items: [
     { name: "פוסטר אווה", price: 79 }, // Neon Genesis Evangelion
     { name: "מדבקות דמון סלייר", price: 39 }, // Demon Slayer
     { name: "קישוט קיר נארוטו", price: 149 }, // Naruto
     { name: "פוסטר ג'וג'ו", price: 69 }, // JoJo's Bizarre Adventure
     { name: "פוסטר צבא הצללים", price: 89 }, // Solo Leveling
     { name: "באנר מלך הצללים", price: 129 }, // Solo Leveling
     { name: "סט מדבקות דרקונים", price: 49 }, // Dragon Ball
     { name: "שלט מואר טוקיו גול", price: 199 }, // Tokyo Ghoul
     { name: "פוסטר האנטר x האנטר", price: 79 }, // Hunter x Hunter
     { name: "קישוט LED אקדמיה", price: 169 }, // My Hero Academia
     { name: "סט פוסטרים בליץ'", price: 159 }, // Bleach
     { name: "פוסטר פריירן", price: 79 }, // Frieren
     { name: "באנר צ'יינסו מן", price: 89 }, // Chainsaw Man
     { name: "פוסטר בלו לוק", price: 79 }, // Blue Lock
     { name: "קישוט קיר גן עדן", price: 149 }, // Hell's Paradise
     { name: "פוסטר קרב הקסמים", price: 89 }, // Jujutsu Kaisen
     { name: "Oshi no Ko LED Poster", price: 189 }, // Oshi no Ko
     { name: "Hell's Paradise Wall Scroll", price: 129 } // Hell's Paradise
    ]
    },
    rare_items: {
    name: "פריטי אספנות נדירים",
    items: [
     { name: "פיגר גוקו אולטרה אינסטינקט מהדורה מוגבלת 500 יחידות", price: 1899 }, // Limited Edition Ultra Instinct Goku Figure (500 pieces)
     { name: "Dragon Ball Ultimate Collection Box Set", price: 2499 }, // Full manga series + artbook + figurine
     { name: "חרב זנוצו חתומה - מהדורת אספנים", price: 1599 }, // Signed Zenitsu Sword - Collector's Edition
     { name: "Jujutsu Kaisen Complete Art Collection", price: 1299 }, // Limited artbook with original sketches
     { name: "סט קלפי נארוטו מהדורה ראשונה חתום", price: 2999 }, // First Edition Signed Naruto Card Set
     { name: "Attack on Titan Final Season Premium Box", price: 1799 }, // With exclusive items and artwork
     { name: "פיגר לופי גיר 5 מצויר ידנית", price: 1499 }, // Hand-Painted Gear 5 Luffy Figure
     { name: "One Piece Treasure Collection", price: 2199 }, // Complete collection with rare items
     { name: "מנגה דמון סלייר סט אספנים מלא + חרב", price: 1899 }, // Demon Slayer Full Collector's Set + Sword
     { name: "Premium Hunter x Hunter Collection", price: 1699 }, // With original author sketches
     { name: "Bleach Final Arc Collector's Box", price: 2299 }, // Complete set with exclusive art and figures
     { name: "תיק אקאצקי עור אמיתי מהדורה מוגבלת", price: 1699 }, // Limited Akatsuki Leather Bag
     { name: "Chainsaw Man Exclusive Collector's Edition", price: 1899 }, // With manga, figure and signed art
     { name: "פיגור איטאצ'י וסאסקה דואט מהדורת פלטינה", price: 2499 }, // Platinum Edition Itachi & Sasuke Duo
     { name: "Tokyo Ghoul Complete Collection Box", price: 1999 }, // Full manga + anime + exclusive items
     { name: "סט חרבות דמון סלייר האשירה מוגבל", price: 2799 }, // Limited Hashira Swords Set
     { name: "JoJo's Bizarre Adventure Golden Collection", price: 2599 }, // 25th Anniversary Special Edition
     { name: "פיגור אסטה שחור מצופה זהב מוגבל", price: 1899 }, // Black Clover Gold-Plated Limited Figure
     { name: "Death Note Supreme Collection", price: 2199 }, // With replica Death Note and exclusive items
     { name: "קופסת אוצר My Hero Academia", price: 1999 }, // Treasure box with rare collectibles
     { name: "Solo Leveling Deluxe Box", price: 2399 }, // Complete set with exclusive illustrations
     { name: "פיגור גוג'ו וסוקונה דואל מהדורה חתומה", price: 2899 }, // Signed Gojo & Sukuna Dual Figure
     { name: "Spy x Family Premium Collection", price: 1799 }, // Limited family set with extras
     { name: "מארז אספנים אטאק און טיטאן פיינל", price: 2699 }, // Attack on Titan Final Collection
     { name: "GOJO VS SUKUNA - Exclusive Battle Diorama", price: 4999 }, // Limited to 100 pieces
     { name: "Okarun & Momo Premium Figure Set", price: 2999 }, // Limited Edition Diorama
     { name: "Turbo Granny Ultimate Figure", price: 1599 }, // Special Edition with effects
     { name: "Tower of God - Black March Crystal Edition", price: 2999 } // Limited to 250 pieces
    ]
    }
};