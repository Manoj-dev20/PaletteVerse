// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault()
    const target = document.querySelector(this.getAttribute("href"))
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      })
    }
  })
})

document.querySelector(".custom-sketch-btn")?.addEventListener("click", () => {
  console.log("[v0] Custom Sketch button clicked")
})

// Gallery See More button handler
document.querySelector(".gallery-see-more-btn")?.addEventListener("click", function () {
  console.log("[v0] Gallery See More button clicked:", this.textContent)
})

// Button click handlers
document.querySelectorAll(".see-more-btn, .explore-btn, .gallery-see-more-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    console.log("[v0] Button clicked:", this.textContent)
  })
})

// Icon button clicks
document.querySelectorAll(".icon-btn").forEach((btn) => {
  btn.addEventListener("click", function () {
    const title = this.getAttribute("title")
    console.log("[v0] Icon clicked:", title)
    // Add your action logic here
  })
})

// Artwork card interactions
document.querySelectorAll(".artwork-card").forEach((card) => {
  card.addEventListener("click", function () {
    const title = this.querySelector("h3").textContent
    console.log("[v0] Artwork selected:", title)
  })
})

// Category card interactions
document.querySelectorAll(".category-card").forEach((card) => {
  card.addEventListener("click", function () {
    const title = this.querySelector("h3").textContent
    console.log("[v0] Category selected:", title)
  })
})

// Add active state to navigation on scroll
window.addEventListener("scroll", () => {
  let current = ""

  document.querySelectorAll("section").forEach((section) => {
    const sectionTop = section.offsetTop
    if (pageYOffset >= sectionTop - 200) {
      current = section.getAttribute("id")
    }
  })

  document.querySelectorAll(".nav a").forEach((link) => {
    link.classList.remove("active")
    if (link.getAttribute("href").slice(1) === current) {
      link.classList.add("active")
    }
  })
})
