// Add interactivity to the dashboard

document.addEventListener("DOMContentLoaded", () => {
  // Notification button
  const notificationBtn = document.querySelector(".notification-btn")
  if (notificationBtn) {
    notificationBtn.addEventListener("click", () => {
      console.log("[v0] Notification clicked")
      // Add notification logic here
    })
  }

  // Navigation links
  const navLinks = document.querySelectorAll(".nav-link")
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href")
      if (href === "#") {
        e.preventDefault()
      }
      navLinks.forEach((l) => l.classList.remove("active"))
      this.classList.add("active")
    })
  })

  // Manage Requests button
  const manageBtn = document.querySelector(".manage-btn")
  if (manageBtn) {
    manageBtn.addEventListener("click", () => {
      console.log("[v0] Manage requests clicked")
      // Add manage requests logic here
    })
  }

  // Add hover effects to cards
  const cards = document.querySelectorAll(".card")
  cards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-2px)"
    })
    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)"
    })
  })

  // Link interactions
  const links = document.querySelectorAll(".link-with-arrow, .view-all-link")
  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      console.log("[v0] Link clicked: " + this.textContent)
      // Add navigation logic here
    })
  })

  const suggestionPool = [
    {
      title: "Explore 'Ethereal Landscapes'",
      description: "Generate dreamy, atmospheric landscape artworks with soft lighting",
      color: "purple",
    },
    {
      title: "New Color Palette: 'Cyberpunk Sunset'",
      description: "Try vibrant neon colors mixed with warm sunset tones",
      color: "pink",
    },
    {
      title: "Tool Suggestion: 'Dynamic Brush Pack'",
      description: "Experiment with textured brushes for added depth and detail",
      color: "mint",
    },
    {
      title: "Create 'Minimalist Abstract'",
      description: "Design clean geometric forms with negative space",
      color: "purple",
    },
    {
      title: "New Palette: 'Ocean Depths'",
      description: "Explore cool blues and teals for calming compositions",
      color: "pink",
    },
    {
      title: "Technique: 'Gradient Mastery'",
      description: "Master smooth color transitions for stunning visuals",
      color: "mint",
    },
    {
      title: "Collection: 'Retro Digital'",
      description: "Dive into vintage pixel art and retro digital aesthetics",
      color: "purple",
    },
    {
      title: "New Style: 'Watercolor Dreams'",
      description: "Create soft, flowing watercolor-inspired artworks",
      color: "pink",
    },
    {
      title: "Advanced Technique: 'Light & Shadow'",
      description: "Master dramatic lighting effects for depth and mood",
      color: "mint",
    },
  ]

  function getRandomSuggestions(count = 3) {
    const shuffled = [...suggestionPool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  function renderSuggestions(suggestions) {
    const suggestionsList = document.querySelector(".suggestions-list")

    suggestionsList.innerHTML = suggestions
      .map(
        (suggestion) => `
      <div class="suggestion-item suggestion-item-${suggestion.color}">
        <div class="suggestion-icon icon-${suggestion.color}">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 5v14M5 12h14"></path>
          </svg>
        </div>
        <div>
          <h3>${suggestion.title}</h3>
          <p>${suggestion.description}</p>
        </div>
      </div>
    `,
      )
      .join("")
  }

  const newPromptsLink = document.querySelector(".link-with-arrow")
  if (newPromptsLink) {
    newPromptsLink.addEventListener("click", (e) => {
      e.preventDefault()
      const newSuggestions = getRandomSuggestions(3)
      renderSuggestions(newSuggestions)
    })
  }

  // Additional updates can be added here if necessary
})
