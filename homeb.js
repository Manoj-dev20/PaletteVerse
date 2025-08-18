// Hero Slider Functionality
class HeroSlider {
    constructor() {
      this.cards = document.querySelectorAll(".hero-card")
      this.prevBtn = document.getElementById("prevBtn")
      this.nextBtn = document.getElementById("nextBtn")
      this.currentCenterIndex = 1 // Start with middle card as center
      this.totalCards = this.cards.length
      this.isAnimating = false
      this.autoRotateInterval = null
  
      this.init()
    }
  
    init() {
      // Add event listeners for navigation buttons
      this.prevBtn.addEventListener("click", () => this.rotateCards("prev"))
      this.nextBtn.addEventListener("click", () => this.rotateCards("next"))
  
      // Start auto-rotation
      this.startAutoRotation()
  
      // Pause auto-rotation on hover and resume on leave
      const heroSection = document.querySelector(".hero")
      heroSection.addEventListener("mouseenter", () => this.pauseAutoRotation())
      heroSection.addEventListener("mouseleave", () => this.startAutoRotation())
    }
  
    rotateCards(direction) {
      if (this.isAnimating) return
  
      this.isAnimating = true
  
      // Update center index
      if (direction === "next") {
        this.currentCenterIndex = (this.currentCenterIndex + 1) % this.totalCards
      } else {
        this.currentCenterIndex = (this.currentCenterIndex - 1 + this.totalCards) % this.totalCards
      }
  
      // Update card positions
      this.updateCardPositions()
  
      // Reset animation flag after transition
      setTimeout(() => {
        this.isAnimating = false
      }, 800)
    }
  
    updateCardPositions() {
      this.cards.forEach((card, index) => {
        // Remove all position classes
        card.classList.remove("left-position", "center-position", "right-position")
  
        // Calculate position relative to center
        const relativePosition = (index - this.currentCenterIndex + this.totalCards) % this.totalCards
  
        if (relativePosition === 0) {
          card.classList.add("center-position")
        } else if (relativePosition === 1 || relativePosition === this.totalCards - 2) {
          card.classList.add("right-position")
        } else {
          card.classList.add("left-position")
        }
      })
    }
  
    startAutoRotation() {
      this.pauseAutoRotation() // Clear any existing interval
      this.autoRotateInterval = setInterval(() => {
        this.rotateCards("next")
      }, 4000) // Rotate every 4 seconds
    }
  
    pauseAutoRotation() {
      if (this.autoRotateInterval) {
        clearInterval(this.autoRotateInterval)
        this.autoRotateInterval = null
      }
    }
  }
  
  // Product Cards Hover Effects
  class ProductCards {
    constructor() {
      this.cards = document.querySelectorAll(".product-card")
      this.init()
    }
  
    init() {
      this.cards.forEach((card) => {
        card.addEventListener("mouseenter", (e) => this.handleCardHover(e))
        card.addEventListener("mouseleave", (e) => this.handleCardLeave(e))
      })
    }
  
    handleCardHover(e) {
      const card = e.currentTarget
  
      // Add enhanced hover effect
      card.style.zIndex = "20"
  
      // Slightly reduce other cards' opacity
      this.cards.forEach((otherCard) => {
        if (otherCard !== card) {
          otherCard.style.opacity = "0.7"
          otherCard.style.transform = "scale(0.95)"
        }
      })
    }
  
    handleCardLeave(e) {
      const card = e.currentTarget
  
      // Reset z-index
      setTimeout(() => {
        card.style.zIndex = ""
      }, 400)
  
      // Reset all cards
      this.cards.forEach((otherCard) => {
        otherCard.style.opacity = ""
        otherCard.style.transform = ""
      })
    }
  }
  
  // Mobile Menu Functionality
  class MobileMenu {
    constructor() {
      this.menuBtn = document.querySelector(".mobile-menu-btn")
      this.nav = document.querySelector(".nav")
      this.isOpen = false
  
      this.init()
    }
  
    init() {
      if (this.menuBtn) {
        this.menuBtn.addEventListener("click", () => this.toggleMenu())
      }
    }
  
    toggleMenu() {
      this.isOpen = !this.isOpen
  
      if (this.isOpen) {
        this.nav.style.display = "flex"
        this.nav.style.position = "absolute"
        this.nav.style.top = "100%"
        this.nav.style.left = "0"
        this.nav.style.right = "0"
        this.nav.style.flexDirection = "column"
        this.nav.style.background = "#fff"
        this.nav.style.boxShadow = "0 5px 20px rgba(0,0,0,0.1)"
        this.nav.style.borderRadius = "0 0 20px 20px"
        this.nav.style.padding = "1rem"
        this.nav.style.gap = "0.5rem"
      } else {
        this.nav.style.display = "none"
      }
  
      // Animate menu button
      const spans = this.menuBtn.querySelectorAll("span")
      spans.forEach((span, index) => {
        if (this.isOpen) {
          if (index === 0) span.style.transform = "rotate(45deg) translate(5px, 5px)"
          if (index === 1) span.style.opacity = "0"
          if (index === 2) span.style.transform = "rotate(-45deg) translate(7px, -6px)"
        } else {
          span.style.transform = ""
          span.style.opacity = ""
        }
      })
    }
  }
  
  // Smooth Scrolling for Navigation Links
  class SmoothScroll {
    constructor() {
      this.init()
    }
  
    init() {
      document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener("click", (e) => {
          e.preventDefault()
          const target = document.querySelector(anchor.getAttribute("href"))
          if (target) {
            target.scrollIntoView({
              behavior: "smooth",
              block: "start",
            })
          }
        })
      })
    }
  }
  
  // Header Scroll Effect
  class HeaderScroll {
    constructor() {
      this.header = document.querySelector(".header")
      this.init()
    }
  
    init() {
      window.addEventListener("scroll", () => {
        if (window.scrollY > 100) {
          this.header.style.background = "rgba(255, 255, 255, 0.98)"
          this.header.style.boxShadow = "0 2px 20px rgba(0, 0, 0, 0.1)"
        } else {
          this.header.style.background = "rgba(255, 255, 255, 0.95)"
          this.header.style.boxShadow = "none"
        }
      })
    }
  }
  
  // Initialize all components when DOM is loaded
  document.addEventListener("DOMContentLoaded", () => {
    new HeroSlider()
    new ProductCards()
    new MobileMenu()
    new SmoothScroll()
    new HeaderScroll()
  
    // Add loading animation
    document.body.style.opacity = "0"
    setTimeout(() => {
      document.body.style.transition = "opacity 0.5s ease"
      document.body.style.opacity = "1"
    }, 100)
  })
  
  // Performance optimization: Debounce resize events
  function debounce(func, wait) {
    let timeout
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout)
        func(...args)
      }
      clearTimeout(timeout)
      timeout = setTimeout(later, wait)
    }
  }
  
  // Handle window resize
  window.addEventListener(
    "resize",
    debounce(() => {
      // Reinitialize components that need resize handling
      const mobileMenu = new MobileMenu()
    }, 250),
  )
  