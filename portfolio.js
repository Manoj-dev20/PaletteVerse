// Add interactivity here
document.addEventListener("DOMContentLoaded", () => {
  // Menu button functionality
  const menuBtn = document.querySelectorAll(".icon-btn")[2]

  menuBtn.addEventListener("click", () => {
    console.log("[v0] Menu button clicked")
  })

  // Order button functionality
  const orderBtn = document.querySelector(".order-btn")

  orderBtn.addEventListener("click", () => {
    console.log("[v0] Order A Sketch button clicked")
  })

  // Portfolio items hover effect
  const portfolioItems = document.querySelectorAll(".portfolio-item")

  portfolioItems.forEach((item) => {
    item.addEventListener("mouseenter", function () {
      this.style.transform = "scale(1.05)"
      this.style.transition = "transform 0.3s ease"
    })

    item.addEventListener("mouseleave", function () {
      this.style.transform = "scale(1)"
    })
  })
})
