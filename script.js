// ============================================
// TOAST NOTIFICATION HANDLER
// ============================================

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast")
  toast.textContent = message
  toast.classList.add("show")

  setTimeout(() => {
    toast.classList.remove("show")
  }, duration)
}

// ============================================
// MODAL HANDLER
// ============================================

const signupModal = document.getElementById("signupModal")
const modalClose = document.querySelector(".modal-close")
const signupLinks = document.querySelectorAll(".signup-link")

signupLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault()
    signupModal.classList.remove("hidden")
  })
})

modalClose.addEventListener("click", () => {
  signupModal.classList.add("hidden")
})

signupModal.addEventListener("click", (e) => {
  if (e.target === signupModal) {
    signupModal.classList.add("hidden")
  }
})

// ============================================
// FORM VALIDATION & SUBMISSION
// ============================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  return password.length >= 6
}

const buyerForm = document.getElementById("buyerForm")
const artistForm = document.getElementById("artistForm")
const signupForm = document.getElementById("signupForm")

buyerForm.addEventListener("submit", (e) => {
  e.preventDefault()
  handleLogin("Buyer", buyerForm)
})

artistForm.addEventListener("submit", (e) => {
  e.preventDefault()
  handleLogin("Artist", artistForm)
})

function handleLogin(userType, form) {
  const emailInput = form.querySelector('input[type="email"]')
  const passwordInput = form.querySelector('input[type="password"]')
  const submitBtn = form.querySelector(".btn-login")

  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()

  if (!email || !password) {
    showToast("Please fill in all fields")
    return
  }

  if (!validateEmail(email)) {
    showToast("Please enter a valid email address")
    return
  }

  if (!validatePassword(password)) {
    showToast("Password must be at least 6 characters")
    return
  }

  submitBtn.classList.add("loading")
  submitBtn.textContent = "Signing In..."

  setTimeout(() => {
    submitBtn.classList.remove("loading")
    submitBtn.textContent = "Sign In"
    showToast(`Welcome back, ${userType}!`)
    form.reset()

    setTimeout(() => {
      window.location.href = "home.html"
      // Replace "home.html" with your actual homepage path
    }, 500)
  }, 1500)
}

signupForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const nameInput = document.getElementById("signup-name")
  const emailInput = document.getElementById("signup-email")
  const passwordInput = document.getElementById("signup-password")
  const confirmInput = document.getElementById("signup-confirm")
  const submitBtn = signupForm.querySelector(".btn-login")

  const name = nameInput.value.trim()
  const email = emailInput.value.trim()
  const password = passwordInput.value.trim()
  const confirm = confirmInput.value.trim()

  if (!name || !email || !password || !confirm) {
    showToast("Please fill in all fields")
    return
  }

  if (!validateEmail(email)) {
    showToast("Please enter a valid email address")
    return
  }

  if (!validatePassword(password)) {
    showToast("Password must be at least 6 characters")
    return
  }

  if (password !== confirm) {
    showToast("Passwords do not match")
    return
  }

  submitBtn.classList.add("loading")
  submitBtn.textContent = "Creating Account..."

  setTimeout(() => {
    submitBtn.classList.remove("loading")
    submitBtn.textContent = "Create Account"
    showToast(`Account created successfully! Welcome, ${name}!`)
    signupForm.reset()
    signupModal.classList.add("hidden")
  }, 1500)
})
