// Tab Filter Functionality
const tabButtons = document.querySelectorAll('.tab-btn');

tabButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        tabButtons.forEach(btn => btn.classList.remove('active'));
        // Add active class to clicked button
        this.classList.add('active');
    });
});

// Wishlist Button Functionality
const wishlistButtons = document.querySelectorAll('.wishlist-btn');

wishlistButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        this.classList.toggle('active');
    });
});

// Add to Cart Button Functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        // Get product name
        const productName = this.closest('.product-card').querySelector('.product-name').textContent;
        // Show feedback
        const originalText = this.textContent;
        this.textContent = 'Added!';
        this.style.backgroundColor = '#4CAF50';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.backgroundColor = '';
        }, 2000);
    });
});

// Search Functionality
const searchInput = document.querySelector('.search-input');
const searchBtn = document.querySelector('.search-btn');

searchBtn.addEventListener('click', function() {
    const searchTerm = searchInput.value.toLowerCase();
    const productCards = document.querySelectorAll('.product-card');
    
    productCards.forEach(card => {
        const productName = card.querySelector('.product-name').textContent.toLowerCase();
        if (productName.includes(searchTerm) || searchTerm === '') {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
});

// Allow search on Enter key
searchInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        searchBtn.click();
    }
});

// Category Select Functionality
const categorySelects = document.querySelectorAll('.category-select');

categorySelects.forEach(select => {
    select.addEventListener('change', function() {
        console.log('Category selected:', this.value);
    });
});