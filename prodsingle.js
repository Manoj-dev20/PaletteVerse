// Quantity Selector Functionality
const qtyInput = document.querySelector(".qty-input")
const qtyMinus = document.querySelector(".qty-minus")
const qtyPlus = document.querySelector(".qty-plus")

qtyMinus.addEventListener("click", () => {
  const currentValue = Number.parseInt(qtyInput.value)
  if (currentValue > 1) {
    qtyInput.value = currentValue - 1
  }
})

qtyPlus.addEventListener("click", () => {
  const currentValue = Number.parseInt(qtyInput.value)
  qtyInput.value = currentValue + 1
})

qtyInput.addEventListener("change", () => {
  const value = Number.parseInt(qtyInput.value)
  if (isNaN(value) || value < 1) {
    qtyInput.value = 1
  }
})

// Add to Cart Button
const addToCartBtn = document.querySelector(".add-to-cart-btn")
addToCartBtn.addEventListener("click", () => {
  const quantity = Number.parseInt(qtyInput.value)
  console.log(`Added ${quantity} item(s) to cart`)
  // Add your cart logic here
})

// Wishlist Button
const wishlistBtn = document.querySelector(".wishlist-btn")
wishlistBtn.addEventListener("click", () => {
  wishlistBtn.classList.toggle("active")
  console.log("Wishlist toggled")
})

// Menu Toggle for Mobile
const menuToggle = document.querySelector(".menu-toggle")
const navMenu = document.querySelector(".nav-menu")

menuToggle.addEventListener("click", () => {
  navMenu.classList.toggle("active")
})

// Icon Button Interactions
const iconButtons = document.querySelectorAll(".icon-btn")
iconButtons.forEach((btn) => {
  btn.addEventListener("click", () => {
    console.log("Icon clicked")
  })
})
