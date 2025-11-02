// Cart functionality
class CartManager {
    constructor() {
        this.initializeEventListeners();
        this.updateOrderInfo();
    }

    initializeEventListeners() {
        // Quantity controls
        document.querySelectorAll('.plus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.increaseQuantity(e));
        });

        document.querySelectorAll('.minus-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.decreaseQuantity(e));
        });

        // Delete buttons
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteItem(e));
        });

        // Quantity input change
        document.querySelectorAll('.qty-input').forEach(input => {
            input.addEventListener('change', () => this.updateOrderInfo());
        });

        // Action buttons
        document.querySelector('.btn-checkout').addEventListener('click', () => this.checkout());
        document.querySelector('.btn-cancel').addEventListener('click', () => this.cancelOrder());

        // Header buttons
        document.getElementById('cart-btn').addEventListener('click', () => this.handleCartClick());
        document.getElementById('user-btn').addEventListener('click', () => this.handleUserClick());
        document.getElementById('menu-btn').addEventListener('click', () => this.handleMenuClick());
    }

    increaseQuantity(e) {
        const input = e.target.parentElement.querySelector('.qty-input');
        input.value = parseInt(input.value) + 1;
        this.updateOrderInfo();
    }

    decreaseQuantity(e) {
        const input = e.target.parentElement.querySelector('.qty-input');
        if (parseInt(input.value) > 1) {
            input.value = parseInt(input.value) - 1;
            this.updateOrderInfo();
        }
    }

    deleteItem(e) {
        const cartItem = e.target.closest('.cart-item');
        cartItem.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => {
            cartItem.remove();
            this.updateOrderInfo();
        }, 300);
    }

    updateOrderInfo() {
        const items = document.querySelectorAll('.cart-item');
        console.log(`Cart updated: ${items.length} items`);
        // Update order calculations here
    }

    checkout() {
        const address1 = document.getElementById('address1').value;
        const address2 = document.getElementById('address2').value;
        const city = document.getElementById('city').value;
        const country = document.getElementById('country').value;

        if (!address1 || !city || !country) {
            alert('Please fill in all required address fields');
            return;
        }

        alert('Proceeding to checkout...\n\nAddress: ' + address1 + '\nCity: ' + city + '\nCountry: ' + country);
    }

    cancelOrder() {
        if (confirm('Are you sure you want to cancel this order?')) {
            alert('Order cancelled');
        }
    }

    handleCartClick() {
        console.log('Cart clicked');
    }

    handleUserClick() {
        console.log('User profile clicked');
    }

    handleMenuClick() {
        console.log('Menu clicked');
    }
}

// Initialize cart manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new CartManager();
});

// Add fade out animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeOut {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(-20px);
        }
    }
`;
document.head.appendChild(style);