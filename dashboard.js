// Dashboard Interactions
document.addEventListener("DOMContentLoaded", () => {
  initializeNavigation()
  initializeButtons()
  initializeHoverEffects()
  initializeSuggestions()
})

function initializeNavigation() {
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      navLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    })
  })
}

function initializeButtons() {
  const manageBtn = document.querySelector(".manage-btn")
  if (manageBtn) {
    manageBtn.addEventListener("click", () => {
      alert("Opening Custom Sketch Requests Management Panel")
    })
  }

  const viewAllLink = document.querySelector(".view-all-link")
  if (viewAllLink) {
    viewAllLink.addEventListener("click", (e) => {
      e.preventDefault()
      alert("Viewing all top performing artworks")
    })
  }

  const tryLink = document.querySelector(".try-link")
  if (tryLink) {
    tryLink.addEventListener("click", (e) => {
      e.preventDefault()
      alert("Loading new AI prompts...")
    })
  }
}

function initializeHoverEffects() {
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)"
      this.style.transition = "box-shadow 0.3s ease"
    })

    card.addEventListener("mouseleave", function () {
      this.style.boxShadow = "none"
    })
  })

  const statCards = document.querySelectorAll(".stat-card")
  statCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
      this.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)"
      this.style.transition = "all 0.3s ease"
    })

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
      this.style.boxShadow = "none"
    })
  })
}

// Mobile Menu Toggle (for future enhancement)
function toggleMobileMenu() {
  const navMenu = document.querySelector(".nav-menu")
  navMenu.style.display = navMenu.style.display === "none" ? "flex" : "none"
}

// Notification handler
document.querySelector(".notification-btn")?.addEventListener("click", () => {
  alert("You have 3 new notifications")
})

// Profile avatar click handler
document.querySelector(".profile-avatar")?.addEventListener("click", () => {
  alert("Opening profile settings...")
})

const suggestionsDatabase = [
  {
    type: "pink",
    icon: "star",
    title: "Explore 'Ethereal Landscapes'",
    description: "Generate dreamy, atmospheric landscape artworks with soft lighting",
  },
  {
    type: "pink",
    icon: "star",
    title: "New Color Palette: 'Cyberpunk Sunset'",
    description: "Try vibrant neon colors mixed with warm sunset tones",
  },
  {
    type: "green",
    icon: "tool",
    title: "Tool Suggestion: 'Dynamic Brush Pack'",
    description: "Experiment with textured brushes for added depth and detail",
  },
  {
    type: "pink",
    icon: "star",
    title: "Explore 'Neon Abstract Realms'",
    description: "Create bold, electric abstract compositions with vibrant color contrasts",
  },
  {
    type: "green",
    icon: "tool",
    title: "Tool Suggestion: 'Gradient Master Kit'",
    description: "Blend smooth color transitions for professional-looking gradients",
  },
  {
    type: "pink",
    icon: "star",
    title: "Explore 'Minimalist Geometric Art'",
    description: "Design clean, structured compositions with geometric shapes and patterns",
  },
  {
    type: "green",
    icon: "tool",
    title: "Tool Suggestion: 'Texture Layering Set'",
    description: "Combine multiple textures to create rich, dimensional artwork",
  },
  {
    type: "pink",
    icon: "star",
    title: "Explore 'Organic Fluid Designs'",
    description: "Experiment with flowing, liquid-like shapes and organic forms",
  },
  {
    type: "pink",
    icon: "star",
    title: "New Style: 'Retro Wave Aesthetic'",
    description: "Recreate the vibrant 80s synthwave style with nostalgic elements",
  },
  {
    type: "green",
    icon: "tool",
    title: "Tool Suggestion: 'Advanced Blending Modes'",
    description: "Master complex blending techniques for professional effects",
  },
]

function initializeSuggestions() {
  const tryLink = document.querySelector(".try-link")
  if (tryLink) {
    tryLink.addEventListener("click", (e) => {
      e.preventDefault()
      loadRandomSuggestions()
    })
  }
}

function loadRandomSuggestions() {
  const suggestionsList = document.querySelector(".suggestions-list")
  if (!suggestionsList) return

  // Get 3 random suggestions
  const randomSuggestions = getRandomSuggestions(3)

  // Clear existing suggestions with fade out effect
  suggestionsList.style.opacity = "0"
  suggestionsList.style.transition = "opacity 0.3s ease"

  setTimeout(() => {
    suggestionsList.innerHTML = ""

    randomSuggestions.forEach((suggestion) => {
      const suggestionItem = createSuggestionElement(suggestion)
      suggestionsList.appendChild(suggestionItem)
    })

    // Fade in new suggestions
    suggestionsList.style.opacity = "1"
  }, 300)
}

function getRandomSuggestions(count) {
  const shuffled = [...suggestionsDatabase].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

function createSuggestionElement(suggestion) {
  const div = document.createElement("div")
  div.className = `suggestion-item suggestion-${suggestion.type}`

  const iconSVG =
    suggestion.icon === "star"
      ? '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M10 2L13 8H19L14 12L16 18L10 14L4 18L6 12L1 8H7L10 2Z" fill="currentColor"/></svg>'
      : '<svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M9.5 3C9.5 2.58579 9.83579 2.25 10.25 2.25C10.6642 2.25 11 2.58579 11 3V5H9.5V3ZM5.5 10C5.5 7.51472 7.51472 5.5 10 5.5C12.4853 5.5 14.5 7.51472 14.5 10C14.5 12.4853 12.4853 14.5 10 14.5C7.51472 14.5 5.5 12.4853 5.5 10Z" fill="currentColor"/></svg>'

  div.innerHTML = `
    <div class="suggestion-icon">
      ${iconSVG}
    </div>
    <div class="suggestion-content">
      <h4 class="suggestion-title">${suggestion.title}</h4>
      <p class="suggestion-description">${suggestion.description}</p>
    </div>
  `

  return div
}
