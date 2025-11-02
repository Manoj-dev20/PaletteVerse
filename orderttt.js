document.addEventListener("DOMContentLoaded", () => {
  // Add interactive functionality

  // Help links - add click handlers
  const helpLinks = document.querySelectorAll(".help-link")
  helpLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()
      const text = this.textContent.trim().split("\n")[0]
      console.log("[v0] Help link clicked:", text)
      // Add your help functionality here
    })
  })

  // Invoice button - add click handler
  const invoiceBtn = document.querySelector(".invoice-btn")
  invoiceBtn.addEventListener("click", () => {
    console.log("[v0] Invoice button clicked")
    // Add invoice download or modal functionality here
  })

  // Icon buttons - add basic interactivity
  const iconBtns = document.querySelectorAll(".icon-btn")
  iconBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      console.log("[v0] Icon button clicked")
      // Add specific functionality for each icon
    })
  })

  console.log("[v0] Order page initialized")
})
