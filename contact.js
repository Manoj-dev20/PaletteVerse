/* ===========================
   FORM HANDLING
   =========================== */

const contactForm = document.getElementById('contactForm');
const successMessage = document.getElementById('successMessage');
const formInputs = document.querySelectorAll('.form-input');

// Handle form submission
contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value;
    
    // Validate form
    if (name && email && subject && message) {
        // Show success message with animation
        successMessage.classList.add('show');
        
        // Reset form
        contactForm.reset();
        
        // Remove focus from inputs
        formInputs.forEach(input => input.blur());
        
        // Hide success message after 5 seconds
        setTimeout(() => {
            successMessage.classList.remove('show');
        }, 5000);
        
        console.log('Form submitted:', { name, email, subject, message });
    }
});

/* ===========================
   FLOATING BUTTON INTERACTION
   =========================== */

const floatingBtn = document.querySelector('.floating-btn');

floatingBtn.addEventListener('click', function() {
    alert('Chat feature will be implemented here!');
});

/* ===========================
   SMOOTH SCROLL FOR NAVIGATION LINKS
   =========================== */

const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
        }
    });
});

/* ===========================
   ANIMATION ON SCROLL
   =========================== */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'none';
            entry.target.offsetHeight; // Trigger reflow
            entry.target.style.animation = '';
        }
    });
}, observerOptions);

document.querySelectorAll('.detail-item, .form-group').forEach(el => {
    observer.observe(el);
});

/* ===========================
   FORM INPUT FOCUS EFFECTS
   =========================== */

formInputs.forEach(input => {
    // Add placeholder to trigger floating label animation
    if (!input.hasAttribute('placeholder')) {
        input.setAttribute('placeholder', ' ');
    }
    
    // Clear placeholder on focus
    input.addEventListener('focus', function() {
        this.setAttribute('data-focused', 'true');
    });
    
    // Restore on blur if empty
    input.addEventListener('blur', function() {
        if (!this.value) {
            this.removeAttribute('data-focused');
        }
    });
});

/* ===========================
   KEYBOARD NAVIGATION
   =========================== */

document.addEventListener('keydown', function(e) {
    // Close success message with Escape key
    if (e.key === 'Escape' && successMessage.classList.contains('show')) {
        successMessage.classList.remove('show');
    }
});

/* ===========================
   ACCESSIBILITY ENHANCEMENTS
   =========================== */

// Add focus visible styles for better keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('click', function() {
    document.body.classList.remove('keyboard-nav');
});

// Add aria-current to active nav link
window.addEventListener('load', function() {
    const currentLink = document.querySelector('.nav-link.active');
    if (currentLink) {
        currentLink.setAttribute('aria-current', 'page');
    }
});

console.log('PaletteVerse Contact Page loaded successfully!');