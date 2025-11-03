// Portfolio data storage (using localStorage)
const STORAGE_KEY = "portfolio_artworks"

console.log("[v0] Portfolio script loaded")

// DOM Elements
const uploadArtworkBtn = document.getElementById("uploadArtworkBtn")
const emptyStateUploadBtn = document.getElementById("emptyStateUploadBtn")
const artworkModal = document.getElementById("artworkModal")
const modalOverlay = document.getElementById("modalOverlay")
const modalCloseBtn = document.getElementById("modalCloseBtn")
const modalCancelBtn = document.getElementById("modalCancelBtn")
const artworkForm = document.getElementById("artworkForm")
const submitBtn = document.getElementById("submitBtn")
const imageUpload = document.getElementById("imageUpload")
const artworkImage = document.getElementById("artworkImage")
const imagePreview = document.getElementById("imagePreview")
const previewImg = document.getElementById("previewImg")
const changeImageBtn = document.getElementById("changeImageBtn")
const portfolioGrid = document.getElementById("portfolioGrid")
const emptyState = document.getElementById("emptyState")
const modalTitle = document.getElementById("modalTitle")

let currentEditId = null
let selectedImageFile = null

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  console.log("[v0] DOM Content Loaded")
  loadArtworks()
  setupEventListeners()
  renderPortfolio()
})

// Setup Event Listeners
function setupEventListeners() {
  uploadArtworkBtn.addEventListener("click", openUploadModal)
  emptyStateUploadBtn.addEventListener("click", openUploadModal)
  modalCloseBtn.addEventListener("click", closeModal)
  modalCancelBtn.addEventListener("click", closeModal)
  modalOverlay.addEventListener("click", closeModal)
  artworkForm.addEventListener("submit", handleFormSubmit)
  changeImageBtn.addEventListener("click", () => artworkImage.click())
  artworkImage.addEventListener("change", handleImageSelect)
  imageUpload.addEventListener("click", () => artworkImage.click())
  imageUpload.addEventListener("dragover", handleDragOver)
  imageUpload.addEventListener("drop", handleDrop)
}

// Open Upload Modal
function openUploadModal() {
  currentEditId = null
  selectedImageFile = null
  resetForm()
  modalTitle.textContent = "Upload Artwork"
  submitBtn.textContent = "Upload Artwork"
  imagePreview.classList.add("hidden")
  artworkModal.classList.remove("hidden")
}

// Open Edit Modal
function openEditModal(id) {
  currentEditId = id
  const artwork = getArtworkById(id)

  if (!artwork) return

  // Populate form with existing data
  document.getElementById("artworkTitle").value = artwork.title
  document.getElementById("artworkDescription").value = artwork.description
  document.getElementById("artworkCategory").value = artwork.category
  document.getElementById("artworkPaperSize").value = artwork.paperSize
  document.getElementById("artworkPrice").value = artwork.price

  // Show image preview
  previewImg.src = artwork.image
  imagePreview.classList.remove("hidden")

  modalTitle.textContent = "Edit Artwork"
  submitBtn.textContent = "Update Artwork"
  artworkModal.classList.remove("hidden")
}

// Close Modal
function closeModal() {
  artworkModal.classList.add("hidden")
  currentEditId = null
  selectedImageFile = null
  artworkImage.value = ""
  resetForm()
}

// Reset Form
function resetForm() {
  artworkForm.reset()
  imagePreview.classList.add("hidden")
  selectedImageFile = null
}

// Handle Image Select
function handleImageSelect(e) {
  const file = e.target.files[0]
  if (file) {
    selectedImageFile = file
    const reader = new FileReader()
    reader.onload = (event) => {
      previewImg.src = event.target.result
      imagePreview.classList.remove("hidden")
    }
    reader.readAsDataURL(file)
  }
}

// Handle Drag Over
function handleDragOver(e) {
  e.preventDefault()
  e.stopPropagation()
  imageUpload.style.borderColor = "#1a1a1a"
  imageUpload.style.backgroundColor = "#f0f0f0"
}

// Handle Drop
function handleDrop(e) {
  e.preventDefault()
  e.stopPropagation()
  imageUpload.style.borderColor = "#e5e5e5"
  imageUpload.style.backgroundColor = "#f8f8f8"

  const files = e.dataTransfer.files
  if (files.length > 0) {
    artworkImage.files = files
    handleImageSelect({ target: { files } })
  }
}

// Handle Form Submit
function handleFormSubmit(e) {
  e.preventDefault()

  const title = document.getElementById("artworkTitle").value
  const description = document.getElementById("artworkDescription").value
  const category = document.getElementById("artworkCategory").value
  const paperSize = document.getElementById("artworkPaperSize").value
  const price = Number.parseFloat(document.getElementById("artworkPrice").value)

  console.log(
    "[v0] Form submitted - currentEditId:",
    currentEditId,
    "selectedImageFile:",
    selectedImageFile ? "YES" : "NO",
  )

  if (!title || !category || !paperSize || price === "") {
    alert("Please fill in all required fields")
    return
  }

  if (!currentEditId && !selectedImageFile) {
    alert("Please upload an image")
    return
  }

  if (currentEditId) {
    console.log("[v0] EDIT MODE - Updating artwork ID:", currentEditId)
    const artworks = loadArtworks()
    const artworkIndex = artworks.findIndex((art) => art.id === currentEditId)

    console.log("[v0] Found artwork at index:", artworkIndex)

    if (artworkIndex !== -1) {
      artworks[artworkIndex].title = title
      artworks[artworkIndex].description = description
      artworks[artworkIndex].category = category
      artworks[artworkIndex].paperSize = paperSize
      artworks[artworkIndex].price = price

      console.log("[v0] Fields updated - title:", title, "price:", price)

      // If a new image was selected, read and update it
      if (selectedImageFile) {
        console.log("[v0] Processing new image...")
        const reader = new FileReader()
        reader.onload = (event) => {
          artworks[artworkIndex].image = event.target.result
          localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks))
          console.log("[v0] Artwork updated with new image")
          selectedImageFile = null
          renderPortfolio()
          closeModal()
        }
        reader.readAsDataURL(selectedImageFile)
      } else {
        console.log("[v0] No new image - saving changes immediately")
        localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks))
        console.log("[v0] Artwork updated without image change")
        selectedImageFile = null
        renderPortfolio()
        closeModal()
      }
    }
  } else {
    if (!selectedImageFile) {
      alert("Please upload an image")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const newArtwork = {
        id: Date.now(),
        title,
        description,
        category,
        paperSize,
        price,
        image: event.target.result,
        createdAt: new Date().toISOString(),
      }

      const artworks = loadArtworks()
      artworks.push(newArtwork)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks))
      console.log("[v0] Artwork uploaded. Total artworks:", artworks.length)
      renderPortfolio()
      closeModal()
    }
    reader.readAsDataURL(selectedImageFile)
  }
}

// Delete Artwork
function deleteArtwork(id) {
  if (confirm("Are you sure you want to delete this artwork?")) {
    let artworks = loadArtworks()
    artworks = artworks.filter((art) => art.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(artworks))
    console.log("[v0] Artwork deleted. Total artworks remaining:", artworks.length)
    renderPortfolio()
  }
}

// Get Artwork by ID
function getArtworkById(id) {
  const artworks = loadArtworks()
  return artworks.find((art) => art.id === id)
}

// Load Artworks from Storage
function loadArtworks() {
  const stored = localStorage.getItem(STORAGE_KEY)
  return stored ? JSON.parse(stored) : []
}

// Render Portfolio
function renderPortfolio() {
  const artworks = loadArtworks()
  console.log("[v0] Rendering portfolio with", artworks.length, "artworks")

  if (artworks.length === 0) {
    portfolioGrid.classList.add("hidden")
    emptyState.classList.remove("hidden")
  } else {
    emptyState.classList.add("hidden")
    portfolioGrid.classList.remove("hidden")

    portfolioGrid.innerHTML = artworks
      .map(
        (artwork) => `
            <div class="artwork-card">
                <div class="artwork-image-wrapper">
                    <img src="${artwork.image}" alt="${artwork.title}" class="artwork-image">
                    <div class="artwork-overlay">
                        <button type="button" class="artwork-edit-btn" onclick="openEditModal(${artwork.id})" title="Edit">✏️</button>
                        <button type="button" class="artwork-delete-btn" onclick="deleteArtwork(${artwork.id})" title="Delete">🗑️</button>
                    </div>
                </div>
                <div class="artwork-info">
                    <div class="artwork-title">${artwork.title}</div>
                    <div class="artwork-price">$${artwork.price.toFixed(2)}</div>
                </div>
            </div>
        `,
      )
      .join("")
  }
}
