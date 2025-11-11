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
// ROLE SELECTION & NAVIGATION
// ============================================

let currentRole = null

function selectRole(role) {
  currentRole = role
  const roleSelectionContent = document.getElementById("roleSelectionContent")
  const authContent = document.getElementById("authContent")

  if (role === "buyer") {
    document.getElementById("buyerLoginCard").classList.remove("hidden")
    document.getElementById("artistLoginCard").classList.add("hidden")
    document.getElementById("buyerSignupCard").classList.add("hidden")
    document.getElementById("artistSignupCard").classList.add("hidden")
  } else if (role === "artist") {
    document.getElementById("artistLoginCard").classList.remove("hidden")
    document.getElementById("buyerLoginCard").classList.add("hidden")
    document.getElementById("buyerSignupCard").classList.add("hidden")
    document.getElementById("artistSignupCard").classList.add("hidden")
  }

  // Show auth content, hide role selection
  roleSelectionContent.classList.add("hidden")
  authContent.classList.remove("hidden")
}

function goBack() {
  const roleSelectionContent = document.getElementById("roleSelectionContent")
  const authContent = document.getElementById("authContent")

  // Hide all auth cards
  document.getElementById("buyerLoginCard").classList.add("hidden")
  document.getElementById("artistLoginCard").classList.add("hidden")
  document.getElementById("buyerSignupCard").classList.add("hidden")
  document.getElementById("artistSignupCard").classList.add("hidden")

  // Reset forms
  document.getElementById("buyerLoginForm")?.reset()
  document.getElementById("artistLoginForm")?.reset()
  document.getElementById("buyerSignupForm")?.reset()
  document.getElementById("artistSignupForm")?.reset()

  // Show role selection
  authContent.classList.add("hidden")
  roleSelectionContent.classList.remove("hidden")

  currentRole = null
}

function switchToSignup(event) {
  if (event) {
    event.preventDefault()
  }

  if (currentRole === "buyer") {
    document.getElementById("buyerLoginCard").classList.add("hidden")
    document.getElementById("buyerSignupCard").classList.remove("hidden")
  } else if (currentRole === "artist") {
    document.getElementById("artistLoginCard").classList.add("hidden")
    document.getElementById("artistSignupCard").classList.remove("hidden")
  }
}

function switchToLogin() {
  if (currentRole === "buyer") {
    document.getElementById("buyerSignupCard").classList.add("hidden")
    document.getElementById("buyerLoginCard").classList.remove("hidden")
  } else if (currentRole === "artist") {
    document.getElementById("artistSignupCard").classList.add("hidden")
    document.getElementById("artistLoginCard").classList.remove("hidden")
  }
}

// ============================================
// FORM VALIDATION
// ============================================

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  return password.length >= 6
}

// ============================================
// BUYER LOGIN FORM SUBMISSION
// ============================================

const buyerLoginForm = document.getElementById("buyerLoginForm")
if (buyerLoginForm) {
  buyerLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("buyer-login-username").value.trim()
    const password = document.getElementById("buyer-login-password").value.trim()
    const submitBtn = e.target.querySelector(".btn-login")

    if (!username || !password) {
      showToast("Please fill in all fields")
      return
    }

    if (!validatePassword(password)) {
      showToast("Password must be at least 6 characters")
      return
    }

    submitBtn.style.opacity = "0.7"
    submitBtn.style.pointerEvents = "none"
    submitBtn.textContent = "Signing In..."

    setTimeout(() => {
      submitBtn.style.opacity = "1"
      submitBtn.style.pointerEvents = "auto"
      submitBtn.textContent = "Login"
      showToast(`Welcome back, ${username}!`)
      document.getElementById("buyerLoginForm").reset()

      // Redirect to buyer dashboard
      setTimeout(() => {
        window.location.href = "buyer_dashboard.html"
      }, 500)
    }, 1500)
  })
}

// ============================================
// ARTIST LOGIN FORM SUBMISSION
// ============================================

const artistLoginForm = document.getElementById("artistLoginForm")
if (artistLoginForm) {
  artistLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("artist-login-username").value.trim()
    const password = document.getElementById("artist-login-password").value.trim()
    const submitBtn = e.target.querySelector(".btn-login")

    if (!username || !password) {
      showToast("Please fill in all fields")
      return
    }

    if (!validatePassword(password)) {
      showToast("Password must be at least 6 characters")
      return
    }

    submitBtn.style.opacity = "0.7"
    submitBtn.style.pointerEvents = "none"
    submitBtn.textContent = "Signing In..."

    setTimeout(() => {
      submitBtn.style.opacity = "1"
      submitBtn.style.pointerEvents = "auto"
      submitBtn.textContent = "Login"
      showToast(`Welcome back, ${username}!`)
      document.getElementById("artistLoginForm").reset()

      // Redirect to artist dashboard
      setTimeout(() => {
        window.location.href = "artist_dashboard.html"
      }, 500)
    }, 1500)
  })
}

// ============================================
// BUYER SIGNUP FORM SUBMISSION
// ============================================

const buyerSignupForm = document.getElementById("buyerSignupForm")
if (buyerSignupForm) {
  buyerSignupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("buyer-signup-username").value.trim()
    const email = document.getElementById("buyer-signup-email").value.trim()
    const password = document.getElementById("buyer-signup-password").value.trim()
    const submitBtn = e.target.querySelector(".btn-login")

    if (!username || !email || !password) {
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

    submitBtn.style.opacity = "0.7"
    submitBtn.style.pointerEvents = "none"
    submitBtn.textContent = "Creating Account..."

    // Simulate API call
    setTimeout(() => {
      submitBtn.style.opacity = "1"
      submitBtn.style.pointerEvents = "auto"
      submitBtn.textContent = "Register"
      showToast(`Account created successfully! Welcome, ${username}!`)
      document.getElementById("buyerSignupForm").reset()

      // Switch back to login
      setTimeout(() => {
        switchToLogin()
        showToast("You can now sign in with your credentials")
      }, 500)
    }, 1500)
  })
}

// ============================================
// ARTIST SIGNUP FORM SUBMISSION
// ============================================

const artistSignupForm = document.getElementById("artistSignupForm")
if (artistSignupForm) {
  artistSignupForm.addEventListener("submit", (e) => {
    e.preventDefault()

    const username = document.getElementById("artist-signup-username").value.trim()
    const email = document.getElementById("artist-signup-email").value.trim()
    const password = document.getElementById("artist-signup-password").value.trim()
    const submitBtn = e.target.querySelector(".btn-login")

    if (!username || !email || !password) {
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

    submitBtn.style.opacity = "0.7"
    submitBtn.style.pointerEvents = "none"
    submitBtn.textContent = "Creating Account..."

    // Simulate API call
    setTimeout(() => {
      submitBtn.style.opacity = "1"
      submitBtn.style.pointerEvents = "auto"
      submitBtn.textContent = "Register"
      showToast(`Account created successfully! Welcome, ${username}!`)
      document.getElementById("artistSignupForm").reset()

      // Switch back to login
      setTimeout(() => {
        switchToLogin()
        showToast("You can now sign in with your credentials")
      }, 500)
    }, 1500)
  })
}
