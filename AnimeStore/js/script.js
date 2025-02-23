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