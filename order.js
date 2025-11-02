// Handle Review Order Button Click
document.addEventListener('DOMContentLoaded', function() {
    const reviewBtn = document.getElementById('reviewBtn');
    
    reviewBtn.addEventListener('click', function() {
        // Replace 'your-next-page-url' with the actual URL of your next page
        // For example: 'order-confirmation.html', '/confirm', 'https://example.com/confirm'
        const nextPageUrl = 'your-next-page-url';
        
        if (nextPageUrl && nextPageUrl !== 'your-next-page-url') {
            window.location.href = nextPageUrl;
        } else {
            alert('Please specify the next page URL in the script.js file');
        }
    });

    // Handle Back Button
    const backBtn = document.querySelector('.back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }

    // Handle Card Selection
    const cardRadios = document.querySelectorAll('input[name="payment"]');
    cardRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove selected class from all card items
            document.querySelectorAll('.card-item').forEach(item => {
                item.classList.remove('selected');
            });
            // Add selected class to parent card-item
            this.closest('.card-item').classList.add('selected');
        });
    });

    // Format card number input (16 digits only, spaces every 4 digits)
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            if (value.length > 16) {
                value = value.slice(0, 16);
            }
            e.target.value = value;
        });
    }

    // Allow only numbers in expiry fields
    const expiryInputs = document.querySelectorAll('.expiry-input');
    expiryInputs.forEach(input => {
        input.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    });

    // Allow only numbers in CVV field
    const cvvInput = document.getElementById('cvv');
    if (cvvInput) {
        cvvInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/[^0-9]/g, '');
        });
    }

    // Form validation on input
    const formInputs = document.querySelectorAll('.card-form input');
    formInputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateInput(this);
        });
    });

    function validateInput(input) {
        if (input.value.trim() === '') {
            input.style.borderColor = '#e0e0e0';
        } else {
            input.style.borderColor = '#26a65b';
        }
    }
});

// Auto-focus next field when expiry month is filled
document.addEventListener('DOMContentLoaded', function() {
    const expiryMonth = document.getElementById('expiry');
    const expiryYear = document.getElementById('expiry-year');
    
    if (expiryMonth) {
        expiryMonth.addEventListener('input', function() {
            if (this.value.length === 2) {
                expiryYear.focus();
            }
        });
    }
});