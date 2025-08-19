document.addEventListener("DOMContentLoaded", () => {
  const logoBtn = document.getElementById("logoBtn")
  const logoImage = document.getElementById("logoImage")
  const roleText = document.getElementById("roleText")
  const loginBox = document.getElementById("loginBox")
  const loginForm = document.getElementById("loginForm")

  let currentRole = "buyer" // 'buyer' or 'artist'
  let isRotating = false

  // Role toggle functionality (only works on mobile)
  if (logoBtn) {
    logoBtn.addEventListener("click", () => {
      if (isRotating) return // Prevent multiple clicks during rotation

      isRotating = true
      loginBox.classList.add("rotating")

      // Change role after half rotation (300ms)
      setTimeout(() => {
        if (currentRole === "buyer") {
          currentRole = "artist"
          logoImage.src = "OIP.jpg"
          logoImage.alt = "Artist Logo"
          roleText.textContent = "Artist Login"
        } else {
          currentRole = "buyer"
          logoImage.src = "grocery-shopping-cart-vector-your-website-mobile-app-grocery-shopping-cart-icon-logo-isolated-white-background-174809962.webp"
          logoImage.alt = "Buyer Logo"
          roleText.textContent = "Buyer Login"
        }
      }, 300)

      // Remove rotation class and reset flag after animation
      setTimeout(() => {
        loginBox.classList.remove("rotating")
        isRotating = false
      }, 600)
    })
  }

  // Handle mobile form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = document.getElementById("email").value
      const password = document.getElementById("password").value

      if (email && password) {
        if (currentRole === "buyer") {
          // Navigate to buyer dashboard
          window.location.href = "homeb.html"
        } else {
          // Navigate to artist dashboard
          window.location.href = "artist-dashboard.html"
        }
      }
    })
  }

  // Handle desktop form submissions
  const desktopForms = document.querySelectorAll(".desktop-login-container form")
  desktopForms.forEach((form, index) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault()

      const email = form.querySelector('input[type="email"]').value
      const password = form.querySelector('input[type="password"]').value
      const role = index === 0 ? "Artist" : "Buyer"

      if (email && password) {
        if (role === "Artist") {
          // Navigate to artist dashboard
          window.location.href = "artist-dashboard.html"
        } else {
          // Navigate to buyer dashboard
          window.location.href = "homeb.html"
        }
      }
    })
  })

  // Add some visual feedback for form inputs
  const inputs = document.querySelectorAll("input")
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.style.transform = "translateY(-2px)"
    })

    input.addEventListener("blur", function () {
      this.parentElement.style.transform = "translateY(0)"
    })
  })
})
