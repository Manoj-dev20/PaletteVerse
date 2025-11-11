document.addEventListener("DOMContentLoaded", () => {
  // Profile Dropdown
  const profileBtn = document.getElementById("profileBtn")
  const profileDropdown = document.getElementById("profileDropdown")

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      profileDropdown.classList.toggle("active")
    })
  }

  // Close dropdown when clicking outside
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".profile-icon-wrapper")) {
      profileDropdown.classList.remove("active")
    }
  })

  // Edit Profile Modal
  const editModal = document.getElementById("editModal")
  const editProfileBtn = document.getElementById("editProfileBtn")
  const editSettingsBtn = document.getElementById("editSettingsBtn")
  const closeModal = document.getElementById("closeModal")
  const cancelBtn = document.getElementById("cancelBtn")
  const editForm = document.getElementById("editForm")

  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      editModal.classList.add("active")
    })
  }

  if (editSettingsBtn) {
    editSettingsBtn.addEventListener("click", () => {
      editModal.classList.add("active")
    })
  }

  if (closeModal) {
    closeModal.addEventListener("click", () => {
      editModal.classList.remove("active")
    })
  }

  if (cancelBtn) {
    cancelBtn.addEventListener("click", () => {
      editModal.classList.remove("active")
    })
  }

  if (editModal) {
    editModal.addEventListener("click", (e) => {
      if (e.target === editModal) {
        editModal.classList.remove("active")
      }
    })
  }

  if (editForm) {
    editForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const name = document.getElementById("name").value
      const tagline = document.getElementById("tagline").value
      const email = document.getElementById("email").value

      const profileHeader = document.querySelector(".profile-info h1")
      const profileTagline = document.querySelector(".tagline")
      const profileEmail = document.querySelector(".email")

      if (profileHeader) profileHeader.textContent = name
      if (profileTagline) profileTagline.textContent = tagline
      if (profileEmail) profileEmail.textContent = email

      // Store in localStorage to persist changes
      localStorage.setItem("userProfile", JSON.stringify({ name, tagline, email }))

      editModal.classList.remove("active")
      showNotification("Profile updated successfully!")
    })

    // Load saved profile data from localStorage
    const savedProfile = localStorage.getItem("userProfile")
    if (savedProfile) {
      const { name, tagline, email } = JSON.parse(savedProfile)
      const nameInput = document.getElementById("name")
      const taglineInput = document.getElementById("tagline")
      const emailInput = document.getElementById("email")

      if (nameInput) nameInput.value = name
      if (taglineInput) taglineInput.value = tagline
      if (emailInput) emailInput.value = email

      // Update profile display
      const profileHeader = document.querySelector(".profile-info h1")
      const profileTaglineEl = document.querySelector(".tagline")
      const profileEmailEl = document.querySelector(".email")

      if (profileHeader) profileHeader.textContent = name
      if (profileTaglineEl) profileTaglineEl.textContent = tagline
      if (profileEmailEl) profileEmailEl.textContent = email
    }
  }

  // Order Modal
  const orderModal = document.getElementById("orderModal")
  const closeOrderModal = document.getElementById("closeOrderModal")
  const summaryCards = document.querySelectorAll(".summary-card")

  summaryCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (orderModal) {
        orderModal.classList.add("active")
      }
    })
  })

  if (closeOrderModal) {
    closeOrderModal.addEventListener("click", () => {
      if (orderModal) {
        orderModal.classList.remove("active")
      }
    })
  }

  if (orderModal) {
    orderModal.addEventListener("click", (e) => {
      if (e.target === orderModal) {
        orderModal.classList.remove("active")
      }
    })
  }

  const editProfilePicBtn = document.getElementById("editProfilePicBtn")
  const profileFileInput = document.getElementById("profileFileInput")
  const profileImg = document.getElementById("profileImg")

  if (editProfilePicBtn && profileFileInput) {
    editProfilePicBtn.addEventListener("click", () => {
      profileFileInput.click()
    })

    profileFileInput.addEventListener("change", (e) => {
      const file = e.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (event) => {
          profileImg.src = event.target.result
          // Save profile photo to localStorage
          localStorage.setItem("profilePhoto", event.target.result)
          showNotification("Profile picture updated!")
        }
        reader.readAsDataURL(file)
      }
    })

    // Load saved profile photo from localStorage
    const savedPhoto = localStorage.getItem("profilePhoto")
    if (savedPhoto) {
      profileImg.src = savedPhoto
    }
  }

  const chatBtn = document.getElementById("chatBtn")
  const chatModal = document.getElementById("chatModal")
  const closeChatModal = document.getElementById("closeChatModal")

  if (chatBtn && chatModal) {
    chatBtn.addEventListener("click", () => {
      chatModal.classList.add("active")
    })
  }

  if (closeChatModal && chatModal) {
    closeChatModal.addEventListener("click", () => {
      chatModal.classList.remove("active")
    })
  }

  if (chatModal) {
    chatModal.addEventListener("click", (e) => {
      if (e.target === chatModal) {
        chatModal.classList.remove("active")
      }
    })
  }

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
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
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
})
