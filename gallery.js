// gallery.js (drop-in replacement)
// Loads gallery images and writes cart items into RTDB under buyers/{uid}/cart/{imageId}

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
  set as dbSet
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

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
const auth = getAuth(app);

const productsGrid = document.getElementById("products-grid");

/* ------------------ Auth helpers ------------------ */
// Ensure there is a signed-in user; if no user, sign in anonymously.
// Returns a Promise that resolves with the current user object.
function ensureAuth() {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsub();
        resolve(user);
      } else {
        // sign in anonymously and wait for the state change
        signInAnonymously(auth)
          .then(() => {
            // onAuthStateChanged will fire again and resolve
          })
          .catch(err => {
            unsub();
            reject(err);
          });
      }
    }, (err) => {
      unsub();
      reject(err);
    });
  });
}

/* ------------------ Cart write logic ------------------ */
/*
  Writes a cart item under buyers/{uid}/cart/{imageId}.

  Uses a transaction so if the same product already exists we increment qty safely.
  Also writes a small lastCartMessage under buyers/{uid}/lastCartMessage for quick console visibility.
*/
async function addItemToUserCart(userUid, item) {
  try {
    const productKey = item.key || item.imageId || item.id || (item.url && btoa(item.url).slice(0,20));
    const cartItemRef = ref(db, `buyers/${userUid}/cart/${productKey}`);

    // Transaction: create item if missing or increment qty
    await runTransaction(cartItemRef, (current) => {
      if (current === null) {
        return {
          imageId: productKey,
          title: item.caption || item.original_filename || "Artwork",
          priceSnapshot: item.price ? Number(item.price) : (item.priceSnapshot ? Number(item.priceSnapshot) : 40),
          imageUrl: item.url || "",
          qty: 1,
          addedAt: Date.now()
        };
      } else {
        // increment qty
        current.qty = (current.qty || 0) + 1;
        current.updatedAt = Date.now();
        return current;
      }
    });

    // Write a simple human-readable message (so you see "image updated" immediately in console)
    const msgRef = ref(db, `buyers/${userUid}/lastCartMessage`);
    await dbSet(msgRef, {
      message: `Added ${item.caption || item.original_filename || 'an item'} to cart`,
      imageId: productKey,
      ts: Date.now()
    });

    return { success: true };
  } catch (err) {
    console.error("Failed to add to cart:", err);
    return { success: false, error: err };
  }
}

/* ------------------ UI helpers (unchanged visual behaviour) ------------------ */
function flashAddedState(btn, text = "Added!") {
  const oldText = btn.textContent;
  btn.textContent = text;
  btn.disabled = true;
  btn.style.backgroundColor = "#4CAF50";
  setTimeout(() => {
    btn.textContent = oldText;
    btn.disabled = false;
    btn.style.backgroundColor = "";
  }, 1400);
}

/* ------------------ Product card builder (adds add-to-cart behaviour) ------------------ */
function createProductCard(item) {
    const card = document.createElement("div");
    card.className = "product-card";

    // Image container
    const imgBox = document.createElement("div");
    imgBox.className = "product-image-container";

    const img = document.createElement("img");
    img.className = "product-image";
    img.loading = "lazy";
    img.src = item.url;
    img.alt = item.caption || item.original_filename || "Artwork";

    // Wishlist button
    const wishBtn = document.createElement("button");
    wishBtn.className = "wishlist-btn";
    wishBtn.innerHTML = `
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21.2l7.8-7.8 1-1.1a5.5 5.5 0 0 0 0-7.8z"></path>
        </svg>
    `;
    wishBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        wishBtn.classList.toggle("active");
    });

    imgBox.appendChild(img);
    imgBox.appendChild(wishBtn);
    card.appendChild(imgBox);

    // Title
    const title = document.createElement("h3");
    title.className = "product-name";
    title.textContent = item.caption && item.caption.trim() !== ""
        ? item.caption.trim()
        : (item.original_filename || "Artwork");
    card.appendChild(title);

    // Rating
    const rating = document.createElement("div");
    rating.className = "product-rating";
    rating.innerHTML = `<span class="stars">★★★★★</span><span class="review-count">(230 reviews)</span>`;
    card.appendChild(rating);

    // Footer
    const footer = document.createElement("div");
    footer.className = "product-footer";

    const price = document.createElement("span");
    price.className = "product-price";
    price.textContent = item.price ? "₹" + item.price : "₹40";

    const addBtn = document.createElement("button");
    addBtn.className = "add-to-cart-btn";
    addBtn.textContent = "Add to Cart";

    addBtn.addEventListener("click", async (e) => {
        e.preventDefault();
        e.stopPropagation();
        flashAddedState(addBtn, "Adding...");

        try {
          // Ensure auth (anonymous sign-in if necessary)
          const user = await ensureAuth();
          const uid = user.uid;

          // Build a minimal product payload
          const productPayload = {
            key: item.key,
            imageId: item.key,
            caption: item.caption,
            original_filename: item.original_filename,
            price: item.price,
            url: item.url
          };

          const result = await addItemToUserCart(uid, productPayload);
          if (result.success) {
            flashAddedState(addBtn, "Added!");
          } else {
            console.error("Add to cart failed:", result.error);
            addBtn.textContent = "Add to Cart";
            alert("Could not add to cart. Check console for details.");
          }
        } catch (err) {
          console.error("Auth / Add to cart error:", err);
          addBtn.textContent = "Add to Cart";
          alert("Sign in failed or permissions missing. Make sure Anonymous Auth is enabled.");
        }
    });

    footer.appendChild(price);
    footer.appendChild(addBtn);
    card.appendChild(footer);

    return card;
}

/* ------------------ Firebase listener for images (unchanged) ------------------ */
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
