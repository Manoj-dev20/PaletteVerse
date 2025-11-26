// ------------------ Firebase Gallery Loader (Clean Version) ------------------

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAUrNn924N0Bx5Ow9bH0fo4ECgYQNYjcFk",
  authDomain: "paletteverse-659bd.firebaseapp.com",
  projectId: "paletteverse-659bd",
  storageBucket: "paletteverse-659bd.firebasestorage.app",
  messagingSenderId: "415618228152",
  appId: "1:415618228152:web:356cd28b5f938a842df94d",
  measurementId: "G-C1X35LPMDF"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app, "https://paletteverse-659bd-default-rtdb.asia-southeast1.firebasedatabase.app");

const productsGrid = document.getElementById("products-grid");

// create product card WITHOUT touching CSS
function createProductCard(item) {

    const card = document.createElement("div");
    card.className = "product-card";

    // -------- Image container --------
    const imgBox = document.createElement("div");
    imgBox.className = "product-image-container";

    const img = document.createElement("img");
    img.className = "product-image";
    img.loading = "lazy";
    img.src = item.url;
    img.alt = item.caption || item.original_filename || "Artwork";

    // ❤️ Wishlist button (restored)
    const wishBtn = document.createElement("button");
    wishBtn.className = "wishlist-btn";  // Your old CSS uses this class
    wishBtn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z"></path>
        </svg>
    `;

    // toggle heart active state
    wishBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        wishBtn.classList.toggle("active");
    });

    // Add to image box
    imgBox.appendChild(img);
    imgBox.appendChild(wishBtn);   // ❤️ added here

    // Assign container
    card.appendChild(imgBox);

    // -------- Title --------
    const title = document.createElement("h3");
    title.className = "product-name";
    title.textContent = item.caption && item.caption.trim() !== ""
        ? item.caption.trim()
        : (item.original_filename || "Artwork");

    card.appendChild(title);

    // -------- Rating --------
    const rating = document.createElement("div");
    rating.className = "product-rating";
    rating.innerHTML = `
        <span class="stars">★★★★★</span>
        <span class="review-count">(230 reviews)</span>
    `;
    card.appendChild(rating);

    // -------- Footer --------
    const footer = document.createElement("div");
    footer.className = "product-footer";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = item.price ? "₹" + item.price : "₹40";

    const addBtn = document.createElement("button");
    addBtn.className = "add-to-cart-btn";
    addBtn.textContent = "Add to Cart";

    addBtn.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        const oldText = addBtn.textContent;
        addBtn.textContent = "Added!";
        addBtn.style.backgroundColor = "#4CAF50";

        setTimeout(() => {
            addBtn.textContent = oldText;
            addBtn.style.backgroundColor = "";
        }, 1500);
    });

    footer.appendChild(price);
    footer.appendChild(addBtn);
    card.appendChild(footer);

    return card;
}

// live listener
const imagesRef = ref(db, "images");

onValue(imagesRef, (snapshot) => {
    const data = snapshot.val();
    productsGrid.innerHTML = "";

    if (!data) {
        productsGrid.innerHTML = `<p>No artworks found.</p>`;
        return;
    }

    const arr = Object.keys(data).map(key => ({ key, ...data[key] }));
    arr.sort((a,b) => (b.createdAt || 0) - (a.createdAt || 0));

    arr.forEach(item => {
        const card = createProductCard(item);
        productsGrid.appendChild(card);
    });
});
