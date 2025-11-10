document.addEventListener("DOMContentLoaded", () => {
  // Intersection Observer for scroll animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe all sections for fade-in animations
  document.querySelectorAll("section").forEach((section) => {
    observer.observe(section)
  })

  // Header scroll effect
  let lastScrollTop = 0
  window.addEventListener("scroll", () => {
    const header = document.querySelector(".header")
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > 100) {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.98)"
    } else {
      header.style.backgroundColor = "rgba(255, 255, 255, 0.95)"
    }

    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
  })

  // Animate stat values on scroll
  const animateStats = () => {
    const statValues = document.querySelectorAll(".stat-value")
    const performanceValues = document.querySelectorAll(".performance-value")

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.classList.contains("animated")) {
          const target = entry.target
          const finalValue = Number.parseInt(target.textContent)

          if (!isNaN(finalValue)) {
            animateNumber(target, finalValue, 1000)
          }

          entry.target.classList.add("animated")
        }
      })
    }, observerOptions)

    statValues.forEach((stat) => observer.observe(stat))
    performanceValues.forEach((value) => observer.observe(value))
  }

  const animateNumber = (element, finalValue, duration) => {
    const startValue = 0
    const increment = finalValue / (duration / 16)
    let currentValue = startValue

    const interval = setInterval(() => {
      currentValue += increment
      if (currentValue >= finalValue) {
        element.textContent = finalValue
        clearInterval(interval)
      } else {
        element.textContent = Math.floor(currentValue)
      }
    }, 16)
  }

  animateStats()

  // Button ripple effect
  const buttons = document.querySelectorAll(".back-button, .view-profile-btn")
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      const ripple = document.createElement("span")
      const rect = this.getBoundingClientRect()
      const size = Math.max(rect.width, rect.height)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      ripple.style.width = ripple.style.height = size + "px"
      ripple.style.left = x + "px"
      ripple.style.top = y + "px"
      ripple.classList.add("ripple")

      this.appendChild(ripple)

      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  })

  // Smooth scroll for gallery cards
  const galleryCards = document.querySelectorAll(".gallery-card")
  galleryCards.forEach((card, index) => {
    card.style.animationDelay = `${index * 0.1}s`
  })

  // Scroll to section functionality
  const backButton = document.querySelector(".back-button")
  if (backButton) {
    backButton.addEventListener("click", () => {
      alert("Redirecting to Leaderboard...")
    })
  }
})

// Added ripple effect styles dynamically
const style = document.createElement("style")
style.textContent = `
    .back-button, .view-profile-btn {
        position: relative;
        overflow: hidden;
    }

    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.1);
        transform: scale(0);
        animation: rippleEffect 0.6s ease-out;
        pointer-events: none;
    }

    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }

    section {
        transition: all 0.6s ease-out;
    }
`
document.head.appendChild(style)
