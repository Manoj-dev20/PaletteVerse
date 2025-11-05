// Mobile Menu Toggle
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.querySelector(".nav-menu")

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("mobile-active")
})

// Close menu when link is clicked
document.querySelectorAll(".nav-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("mobile-active")
  })
})

// Modal Functions
function openModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.add("active")
    document.body.style.overflow = "hidden"
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  }
}

// Open Modal on Button Click
document.querySelectorAll("[data-modal]").forEach((button) => {
  button.addEventListener("click", function () {
    const modalId = this.getAttribute("data-modal")
    openModal(modalId)
  })
})

// Close Modal on X Button
document.querySelectorAll(".modal-close").forEach((btn) => {
  btn.addEventListener("click", function () {
    const modal = this.closest(".modal")
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  })
})

// Close Modal on Cancel Button
document.querySelectorAll(".btn-cancel").forEach((btn) => {
  btn.addEventListener("click", function () {
    const modal = this.closest(".modal")
    modal.classList.remove("active")
    document.body.style.overflow = "auto"
  })
})

// Close Modal on Overlay Click
document.querySelectorAll(".modal").forEach((modal) => {
  modal.addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("active")
      document.body.style.overflow = "auto"
    }
  })
})

// Close Modal on Escape Key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    document.querySelectorAll(".modal.active").forEach((modal) => {
      modal.classList.remove("active")
      document.body.style.overflow = "auto"
    })
  }
})

// File Upload Handler
document.querySelectorAll(".upload-area").forEach((uploadArea) => {
  const fileInput = uploadArea.querySelector(".file-input")
  const uploadId = uploadArea.getAttribute("data-upload")

  // Click to Upload
  uploadArea.addEventListener("click", () => {
    fileInput.click()
  })

  // Drag and Drop
  uploadArea.addEventListener("dragover", (e) => {
    e.preventDefault()
    uploadArea.classList.add("dragover")
  })

  uploadArea.addEventListener("dragleave", () => {
    uploadArea.classList.remove("dragover")
  })

  uploadArea.addEventListener("drop", (e) => {
    e.preventDefault()
    uploadArea.classList.remove("dragover")
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFileUpload(files[0], uploadId)
    }
  })

  // File Input Change
  fileInput.addEventListener("change", function (e) {
    if (this.files.length > 0) {
      handleFileUpload(this.files[0], uploadId)
    }
  })
})

// Handle File Upload
function handleFileUpload(file, uploadId) {
  const validTypes = ["image/png", "image/jpeg", "video/mp4"]
  const maxSize = 10 * 1024 * 1024 // 10MB

  if (!validTypes.includes(file.type)) {
    alert("Please upload a PNG, JPG, or MP4 file")
    return
  }

  if (file.size > maxSize) {
    alert("File size must be less than 10MB")
    return
  }

  // Read file and display preview
  const reader = new FileReader()
  reader.onload = (e) => {
    const uploadedContent = document.querySelector(`[data-content="${uploadId}"]`)
    uploadedContent.innerHTML = ""

    if (file.type.startsWith("image/")) {
      const img = document.createElement("img")
      img.src = e.target.result
      img.className = "uploaded-image"
      uploadedContent.appendChild(img)
    } else if (file.type === "video/mp4") {
      const video = document.createElement("video")
      video.src = e.target.result
      video.className = "uploaded-image"
      video.controls = true
      uploadedContent.appendChild(video)
    }

    const removeBtn = document.createElement("button")
    removeBtn.textContent = "Remove Image"
    removeBtn.className = "remove-image-btn"
    removeBtn.addEventListener("click", () => {
      uploadedContent.innerHTML = ""
      const fileInput = document.querySelector(`[data-upload="${uploadId}"] .file-input`)
      fileInput.value = ""
    })
    uploadedContent.appendChild(removeBtn)
  }
  reader.readAsDataURL(file)
}

// Submit Button Handler
document.querySelectorAll(".btn-submit").forEach((btn) => {
  btn.addEventListener("click", function () {
    const modal = this.closest(".modal")
    const uploadedContent = modal.querySelector(".uploaded-content")

    if (uploadedContent && uploadedContent.innerHTML.trim() === "") {
      alert("Please upload an image or video before submitting")
      return
    }

    // Check if textarea exists and has content (for challenges)
    const textarea = modal.querySelector(".form-textarea")
    if (textarea && textarea.value.trim() === "") {
      alert("Please add a caption or concept note")
      return
    }

    alert("Thank you for your submission! Your entry is now under review.")
    modal.classList.remove("active")
    document.body.style.overflow = "auto"

    // Clear form
    if (uploadedContent) uploadedContent.innerHTML = ""
    if (textarea) textarea.value = ""
  })
})
