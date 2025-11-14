// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAUrNn924N0Bx5Ow9bH0fo4ECgYQNYjcFk",
  authDomain: "paletteverse-659bd.firebaseapp.com",
  databaseURL: "https://paletteverse-659bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "paletteverse-659bd",
  storageBucket: "paletteverse-659bd.firebasestorage.app",
  messagingSenderId: "415618228152",
  appId: "1:415618228152:web:356cd28b5f938a842df94d",
  measurementId: "G-C1X35LPMDF"
};


// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const database = firebase.database();

function getFirebaseErrorMessage(errorCode) {
  const errorMessages = {
    "auth/user-not-found": "User not found. Please sign up first.",
    "auth/wrong-password": "Password incorrect. Please try again.",
    "auth/invalid-email": "Invalid email format.",
    "auth/email-already-in-use": "This email is already registered. Please use a different email or log in.",
    "auth/weak-password": "Password is too weak. Use at least 6 characters.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/operation-not-allowed": "Operation not allowed. Please contact support.",
    "auth/too-many-requests": "Too many failed login attempts. Please try again later.",
    "auth/invalid-email": "Invalid email format.",
    "auth/network-request-failed": "Network error. Please check your connection and try again.",
  };
  
  return errorMessages[errorCode] || "An error occurred. Please try again.";
}

function showToast(message, duration = 3000) {
  const toast = document.getElementById("toast")
  if (toast) {
    toast.textContent = message
    toast.classList.add("show")

    setTimeout(() => {
      toast.classList.remove("show")
    }, duration)
  }
}

let currentRole = null

function selectRole(role) {
  console.log("[v0] selectRole called with:", role)
  currentRole = role
  const roleSelectionContent = document.getElementById("roleSelectionContent")
  const authContent = document.getElementById("authContent")

  console.log("[v0] roleSelectionContent exists:", !!roleSelectionContent)
  console.log("[v0] authContent exists:", !!authContent)

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

  roleSelectionContent.classList.add("hidden")
  authContent.classList.remove("hidden")
  
  console.log("[v0] Auth wrapper should now be visible")
}

function goBack() {
  const roleSelectionContent = document.getElementById("roleSelectionContent")
  const authContent = document.getElementById("authContent")

  document.getElementById("buyerLoginCard").classList.add("hidden")
  document.getElementById("artistLoginCard").classList.add("hidden")
  document.getElementById("buyerSignupCard").classList.add("hidden")
  document.getElementById("artistSignupCard").classList.add("hidden")

  document.getElementById("buyerLoginForm")?.reset()
  document.getElementById("artistLoginForm")?.reset()
  document.getElementById("buyerSignupForm")?.reset()
  document.getElementById("artistSignupForm")?.reset()

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

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

function validatePassword(password) {
  return password.length >= 6
}

function setButtonLoading(btn, isLoading, originalText = "Login") {
  if (isLoading) {
    btn.style.opacity = "0.7"
    btn.style.pointerEvents = "none"
    btn.textContent = originalText === "Login" ? "Signing In..." : "Creating Account..."
  } else {
    btn.style.opacity = "1"
    btn.style.pointerEvents = "auto"
    btn.textContent = originalText
  }
}

const buyerLoginForm = document.getElementById("buyerLoginForm")
if (buyerLoginForm) {
  buyerLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("buyer-login-username").value.trim()
    const password = document.getElementById("buyer-login-password").value.trim()
    const submitBtn = e.target.querySelector(".btn-login")

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

    setButtonLoading(submitBtn, true, "Login")

    try {
      console.log("[v0] Attempting buyer login with email:", email)
      const userCredential = await auth.signInWithEmailAndPassword(email, password)
      const user = userCredential.user
      console.log("[v0] Buyer login successful:", user.uid)
      
      const buyerRef = database.ref(`buyers/${user.uid}`)
      const snapshot = await buyerRef.once("value")
      const buyerData = snapshot.val()
      
      if (buyerData) {
        showToast(`Welcome back, ${buyerData.username}!`)
        document.getElementById("buyerLoginForm").reset()
        
        setTimeout(() => {
          window.location.href = "buyer_dashboard.html"
        }, 500)
      } else {
        console.log("[v0] User not found in buyers collection")
        await auth.signOut()
        showToast("This account is not registered as a buyer.")
        setButtonLoading(submitBtn, false, "Login")
      }
    } catch (error) {
      console.error("[v0] Buyer login error:", error.code, error.message)
      setButtonLoading(submitBtn, false, "Login")
      
      showToast(getFirebaseErrorMessage(error.code))
    }
  })
}

const artistLoginForm = document.getElementById("artistLoginForm")
if (artistLoginForm) {
  artistLoginForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("artist-login-username").value.trim()
    const password = document.getElementById("artist-login-password").value.trim()
    const submitBtn = e.target.querySelector(".btn-login")

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

    setButtonLoading(submitBtn, true, "Login")

    try {
      console.log("[v0] Attempting artist login with email:", email)
      const userCredential = await auth.signInWithEmailAndPassword(email, password)
      const user = userCredential.user
      console.log("[v0] Artist login successful:", user.uid)
      
      const artistRef = database.ref(`artists/${user.uid}`)
      const snapshot = await artistRef.once("value")
      const artistData = snapshot.val()
      
      if (artistData) {
        showToast(`Welcome back, ${artistData.username}!`)
        document.getElementById("artistLoginForm").reset()
        
        setTimeout(() => {
          window.location.href = "artist_dashboard.html"
        }, 500)
      } else {
        console.log("[v0] User not found in artists collection")
        await auth.signOut()
        showToast("This account is not registered as an artist.")
        setButtonLoading(submitBtn, false, "Login")
      }
    } catch (error) {
      console.error("[v0] Artist login error:", error.code, error.message)
      setButtonLoading(submitBtn, false, "Login")
      
      showToast(getFirebaseErrorMessage(error.code))
    }
  })
}

const buyerSignupForm = document.getElementById("buyerSignupForm")
if (buyerSignupForm) {
  buyerSignupForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("buyer-signup-username").value.trim()
    const email = document.getElementById("buyer-signup-email").value.trim()
    const password = document.getElementById("buyer-signup-password").value.trim()
    const submitBtn = e.target.querySelector(".btn-login")

    // Validation checks
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

    if (username.length < 3) {
      showToast("Username must be at least 3 characters")
      return
    }

    setButtonLoading(submitBtn, true, "Register")

    try {
      console.log("[v0] Attempting buyer signup with email:", email)
      
      // Create Firebase auth user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password)
      const user = userCredential.user
      console.log("[v0] Firebase user created:", user.uid)
      
      const buyerData = {
        username: username,
        email: email,
        createdAt: new Date().toISOString()
      }
      
      await database.ref(`buyers/${user.uid}`).set(buyerData)
      console.log("[v0] Buyer data saved to database")
      
      showToast(`Account created successfully! Welcome, ${username}!`)
      document.getElementById("buyerSignupForm").reset()

      setTimeout(() => {
        switchToLogin()
        showToast("You can now sign in with your credentials")
      }, 500)
    } catch (error) {
      console.error("[v0] Buyer signup error:", error.code, error.message)
      setButtonLoading(submitBtn, false, "Register")
      
      showToast(getFirebaseErrorMessage(error.code))
    }
  })
}

const artistSignupForm = document.getElementById("artistSignupForm")
if (artistSignupForm) {
  artistSignupForm.addEventListener("submit", async (e) => {
    e.preventDefault()

    const username = document.getElementById("artist-signup-username").value.trim()
    const email = document.getElementById("artist-signup-email").value.trim()
    const password = document.getElementById("artist-signup-password").value.trim()
    const submitBtn = e.target.querySelector(".btn-login")

    // Validation checks
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

    if (username.length < 3) {
      showToast("Username must be at least 3 characters")
      return
    }

    setButtonLoading(submitBtn, true, "Register")

    try {
      console.log("[v0] Attempting artist signup with email:", email)
      
      // Create Firebase auth user
      const userCredential = await auth.createUserWithEmailAndPassword(email, password)
      const user = userCredential.user
      console.log("[v0] Firebase user created:", user.uid)
      
      const artistData = {
        username: username,
        email: email,
        createdAt: new Date().toISOString()
      }
      
      await database.ref(`artists/${user.uid}`).set(artistData)
      console.log("[v0] Artist data saved to database")
      
      showToast(`Account created successfully! Welcome, ${username}!`)
      document.getElementById("artistSignupForm").reset()

      setTimeout(() => {
        switchToLogin()
        showToast("You can now sign in with your credentials")
      }, 500)
    } catch (error) {
      console.error("[v0] Artist signup error:", error.code, error.message)
      setButtonLoading(submitBtn, false, "Register")
      
      showToast(getFirebaseErrorMessage(error.code))
    }
  })
}
