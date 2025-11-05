// Profile Dropdown
const profileBtn = document.getElementById("profileBtn")
const profileDropdown = document.getElementById("profileDropdown")

profileBtn?.addEventListener("click", () => {
  profileDropdown.classList.toggle("active")
})

// Close dropdown when clicking outside
document.addEventListener("click", (e) => {
  if (!e.target.closest(".profile-icon-wrapper")) {
    profileDropdown?.classList.remove("active")
  }
})

// Edit Profile Modal
const editModal = document.getElementById("editModal")
const editProfileBtn = document.getElementById("editProfileBtn")
const editSettingsBtn = document.getElementById("editSettingsBtn")
const closeModal = document.getElementById("closeModal")
const cancelBtn = document.getElementById("cancelBtn")
const editForm = document.getElementById("editForm")

editProfileBtn.addEventListener("click", () => {
  editModal.classList.add("active")
})

editSettingsBtn.addEventListener("click", () => {
  editModal.classList.add("active")
})

closeModal.addEventListener("click", () => {
  editModal.classList.remove("active")
})

cancelBtn.addEventListener("click", () => {
  editModal.classList.remove("active")
})

// Close modal when clicking outside
editModal.addEventListener("click", (e) => {
  if (e.target === editModal) {
    editModal.classList.remove("active")
  }
})

// Handle form submission
editForm.addEventListener("submit", (e) => {
  e.preventDefault()

  const name = document.getElementById("name").value
  const tagline = document.getElementById("tagline").value
  const email = document.getElementById("email").value

  // Update profile display
  document.querySelector(".profile-info h1").textContent = name
  document.querySelector(".tagline").textContent = tagline
  document.querySelector(".email").textContent = email

  // Close modal with feedback
  editModal.classList.remove("active")
  showNotification("Profile updated successfully!")
})

// Order Modal
const orderModal = document.getElementById("orderModal")
const closeOrderModal = document.getElementById("closeOrderModal")
const summaryCards = document.querySelectorAll(".summary-card")

summaryCards.forEach((card) => {
  card.addEventListener("click", () => {
    orderModal.classList.add("active")
  })
})

closeOrderModal.addEventListener("click", () => {
  orderModal.classList.remove("active")
})

orderModal.addEventListener("click", (e) => {
  if (e.target === orderModal) {
    orderModal.classList.remove("active")
  }
})

const chatModal = document.getElementById("chatModal")
const chatBtn = document.getElementById("chatBtn")
const closeChatModal = document.getElementById("closeChatModal")

chatBtn.addEventListener("click", () => {
  chatModal.classList.add("active")
})

closeChatModal.addEventListener("click", () => {
  chatModal.classList.remove("active")
})

// Close chat modal when clicking outside
chatModal.addEventListener("click", (e) => {
  if (e.target === chatModal) {
    chatModal.classList.remove("active")
  }
})

// Request Card Details
const requestDetails = [
  {
    title: "Commissioned Portrait",
    details: "A custom portrait commission featuring personalized artwork",
  },
  {
    title: "Abstract Series Set",
    details: "A collection of 3 abstract pieces in coordinating styles",
  },
  {
    title: "Landscape Commission",
    details: "Custom landscape artwork with specific location reference",
  },
]

document.querySelectorAll(".request-card .btn-text").forEach((btn, index) => {
  btn.addEventListener("click", () => {
    showNotification(`Viewing: ${requestDetails[index].title}`)
  })
})

// Wishlist Buttons
document.querySelectorAll(".item-overlay .btn-text").forEach((btn) => {
  btn.addEventListener("click", () => {
    showNotification("Navigating to artwork details...")
  })
})

// Communication Cards
document.querySelector(".comm-card:first-child .btn-outline").addEventListener("click", () => {
  showNotification("Opening messages...")
})

document.querySelector(".comm-card:last-child .btn-outline").addEventListener("click", () => {
  showNotification("Connecting to support team...")
})

// Settings Buttons
document.querySelectorAll(".settings-group .btn-outline").forEach((btn, index) => {
  const labels = ["Edit Details", "Manage Payment Methods", "Notification Preferences"]
  btn.addEventListener("click", () => {
    if (index === 2) {
      showNotification("Opening notification settings...")
    } else {
      showNotification(`Opening ${labels[index]}...`)
    }
  })
})

// Delete Account Button
document.querySelector(".btn-delete").addEventListener("click", () => {
  if (confirm("Are you sure? This action cannot be undone.")) {
    showNotification("Account deletion initiated...")
  }
})

// Notification Function
function showNotification(message) {
  const notification = document.createElement("div")
  notification.textContent = message
  notification.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        background-color: #fff;
        color: #000;
        padding: 1rem 1.5rem;
        border-radius: 6px;
        box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
        z-index: 3000;
        animation: slideInRight 0.3s ease;
        font-weight: 500;
    `

  document.body.appendChild(notification)

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.3s ease"
    setTimeout(() => {
      notification.remove()
    }, 300)
  }, 2500)
}

// Add animation styles
const style = document.createElement("style")
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100px);
            opacity: 0;
        }
    }
`
document.head.appendChild(style)

// Add scroll animations
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

document.querySelectorAll(".summary-card, .request-card, .wishlist-item, .comm-card").forEach((el) => {
  el.style.opacity = "0"
  el.style.transform = "translateY(20px)"
  el.style.transition = "all 0.6s ease"
  observer.observe(el)
})

const messageInput = document.getElementById("messageInput")
const messageSendBtn = document.getElementById("messageSendBtn")
const chatMessages = document.getElementById("chatMessages")

messageSendBtn.addEventListener("click", () => {
  const messageText = messageInput.value.trim()
  if (messageText) {
    // Create new user message element
    const messageDiv = document.createElement("div")
    messageDiv.className = "message user-message"
    messageDiv.innerHTML = `
            <div class="message-avatar">EC</div>
            <div class="message-content">
                <p class="message-sender">Emily Chen</p>
                <p class="message-text">${messageText}</p>
                <span class="message-time">Just now</span>
            </div>
        `

    chatMessages.appendChild(messageDiv)
    messageInput.value = ""

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight
  }
})

// Allow sending message with Enter key
messageInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    messageSendBtn.click()
  }
})
