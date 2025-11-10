// Chat Button Functionality
const chatButton = document.getElementById('chatButton');

chatButton.addEventListener('click', function() {
    console.log('Chat button clicked');
    // Add your chat functionality here
    alert('Chat widget will open here');
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });

            // Update active nav link
            document.querySelectorAll('.nav-menu a').forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    });
});

// Gallery Image Hover Effect
const galleryItems = document.querySelectorAll('.gallery-item');

galleryItems.forEach(item => {
    item.addEventListener('mouseenter', function() {
        this.style.opacity = '0.95';
    });

    item.addEventListener('mouseleave', function() {
        this.style.opacity = '1';
    });
});

// Update Active Navigation on Scroll
window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-menu a');

    let currentSection = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= sectionTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });
});

// Add some interactivity to feature cards
const featureCards = document.querySelectorAll('.feature-card');

featureCards.forEach((card, index) => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
        this.style.transition = 'transform 0.3s ease';
    });

    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Testimonial Cards Animation
const testimonialCards = document.querySelectorAll('.testimonial-card');

testimonialCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
    });

    card.addEventListener('mouseleave', function() {
        this.style.boxShadow = 'none';
    });
});

console.log('Portfolio website loaded successfully');