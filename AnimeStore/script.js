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
      { name: "פאנצ'י", price: 369 } // Chainsaw Man
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
      { name: "סיכת JJK", price: 59 } // Jujutsu Kaisen
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
     { name: "מעיל גוג'ו", price: 299 } // Jujutsu Kaisen
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
     { name: "ג'וג'וצו קאיסן 0", price: 89 } // Jujutsu Kaisen
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
     { name: "סט שריון זרו מלא", price: 799 } // Demon Slayer (כולל חליפה מלאה, קטנות וחרב האשוגורו)
    ]
  },
  posters: {
    name: "פוסטרים וקישוטים",
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
     { name: "פוסטר קרב הקסמים", price: 89 } // Jujutsu Kaisen
    ]
  }
};

// DOM Elements
const productForm = document.getElementById('productForm');
const categorySelect = document.getElementById('categorySelect');
const productNameInput = document.getElementById('productNameInput');
const suggestionsDiv = document.getElementById('suggestions');
const filterCategory = document.getElementById('filterCategory');
const toggleFavorites = document.getElementById('toggleFavorites');
const productsGrid = document.getElementById('productsGrid');
const totalPriceDiv = document.getElementById('totalPrice');

let products = JSON.parse(localStorage.getItem('animeCollectProducts')) || [];
let showOnlyFavorites = false;

// Initialize filter categories
function initializeFilterCategories() {
  Object.values(categories).forEach(category => {
    const option = document.createElement('option');
    option.value = category.name;
    option.textContent = category.name;
    filterCategory.appendChild(option);
  });
}

// Handle category selection
categorySelect.addEventListener('change', () => {
  productNameInput.value = '';
  updateSuggestions();
});

// Handle product name input
productNameInput.addEventListener('input', updateSuggestions);

function updateSuggestions() {
  const category = categorySelect.value;
  const searchText = productNameInput.value.trim();

  if (!category || !searchText) {
    suggestionsDiv.style.display = 'none';
    return;
  }

  const categoryItems = categories[category].items;
  const filtered = categoryItems.filter(item =>
    item.name.includes(searchText)
  );

  if (filtered.length > 0) {
    suggestionsDiv.innerHTML = '';
    suggestionsDiv.style.display = 'block';

    filtered.forEach(item => {
      const div = document.createElement('div');
      div.className = 'suggestion-item';
      div.textContent = `${item.name} - ₪${item.price}`;
      div.addEventListener('click', () => {
        productNameInput.value = item.name;
        suggestionsDiv.style.display = 'none';
      });
      suggestionsDiv.appendChild(div);
    });
  } else {
    suggestionsDiv.style.display = 'none';
  }
}

// Handle form submission
productForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const category = categorySelect.value;
  const productName = productNameInput.value.trim();

  if (!category || !productName) {
    alert('נא למלא את כל השדות');
    return;
  }

  const categoryData = categories[category];
  const productData = categoryData.items.find(item => item.name === productName);

  if (!productData) {
    alert('מוצר לא נמצא');
    return;
  }

  const newProduct = {
    id: Math.random().toString(36).substr(2, 9),
    name: productName,
    category: categoryData.name,
    price: productData.price,
    isFavorite: false
  };

  products.push(newProduct);
  localStorage.setItem('animeCollectProducts', JSON.stringify(products));
  
  productNameInput.value = '';
  suggestionsDiv.style.display = 'none';
  renderProducts();
});

// Toggle favorites
toggleFavorites.addEventListener('click', () => {
  showOnlyFavorites = !showOnlyFavorites;
  toggleFavorites.textContent = showOnlyFavorites ? 'הצג הכל' : 'הצג מועדפים';
  toggleFavorites.classList.toggle('active');
  renderProducts();
});

// Filter by category
filterCategory.addEventListener('change', renderProducts);

// Render products
function renderProducts() {
  const selectedCategory = filterCategory.value;
  let filteredProducts = products;

  if (selectedCategory) {
    filteredProducts = filteredProducts.filter(p => p.category === selectedCategory);
  }

  if (showOnlyFavorites) {
    filteredProducts = filteredProducts.filter(p => p.isFavorite);
  }

  productsGrid.innerHTML = '';

  filteredProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-header">
        <span class="category-tag">${product.category}</span>
        <button class="favorite-btn" onclick="toggleFavorite('${product.id}')">
          ${product.isFavorite ? '❤️' : '🤍'}
        </button>
      </div>
      <div class="product-name">${product.name}</div>
      <div class="product-footer">
        <span class="price">₪${product.price}</span>
        <button class="delete-btn" onclick="deleteProduct('${product.id}')">מחק</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  const total = filteredProducts.reduce((sum, product) => sum + product.price, 0);
  totalPriceDiv.textContent = `סה"כ: ₪${total}`;
}

// Toggle favorite status
function toggleFavorite(id) {
  products = products.map(product =>
    product.id === id
      ? { ...product, isFavorite: !product.isFavorite }
      : product
  );
  localStorage.setItem('animeCollectProducts', JSON.stringify(products));
  renderProducts();
}

// Delete product
function deleteProduct(id) {
  products = products.filter(product => product.id !== id);
  localStorage.setItem('animeCollectProducts', JSON.stringify(products));
  renderProducts();
}

// Initialize the app
initializeFilterCategories();
renderProducts();

// Close suggestions when clicking outside
document.addEventListener('click', (e) => {
  if (!productNameInput.contains(e.target) && !suggestionsDiv.contains(e.target)) {
    suggestionsDiv.style.display = 'none';
  }
});