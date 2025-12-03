import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getDatabase,
  ref,
  onValue,
  runTransaction,
  remove
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import {
  getAuth,
  onAuthStateChanged,
  signInAnonymously
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

// Use the same firebaseConfig as your other pages
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

// DOM refs
const productsList = document.getElementById("productsList");
const subtotalEl = document.getElementById("subtotal");
const taxEl = document.getElementById("tax");
const totalEl = document.getElementById("total");
const checkoutBtn = document.getElementById("checkoutBtn");
const continueBtn = document.getElementById("continueBtn");

// Tax rate used across the page
const TAX_RATE = 0.08;

// Current cart snapshot in memory
let currentCart = {}; // { productId: { ...item } }

// Ensure user signed in (anonymous fallback)
function ensureAuth() {
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (user) {
        unsub();
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then(() => { /* onAuthStateChanged will fire */ })
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

// Listen to buyer cart node
async function startCartListener() {
  const user = await ensureAuth();
  const uid = user.uid;
  const cartRef = ref(db, `buyers/${uid}/cart`);

  onValue(cartRef, (snap) => {
    const val = snap.val() || {};
    currentCart = val;
    renderCartFromRTDB(val);
    updateTotals(val);
  }, (err) => {
    console.error("Cart listener error:", err);
  });
}

// Render cart items into DOM
function renderCartFromRTDB(cartObj) {
  const keys = Object.keys(cartObj || {});
  if (!keys.length) {
    productsList.innerHTML = `
      <div class="empty-cart">
        <p>Your cart is empty</p>
        <p style="font-size:.9rem;color:#999;">Start adding items to get started</p>
      </div>
    `;
    return;
  }

  productsList.innerHTML = keys.map(key => {
    const item = cartObj[key] || {};
    const title = escapeHtml(item.title || item.name || "Artwork");
    const desc = escapeHtml(item.description || item.caption || "");
    const price = Number(item.priceSnapshot || item.price || 0);
    const imageUrl = item.imageUrl || item.url || "";
    const qty = Number(item.qty || 1);

    return `
      <div class="product-card" data-id="${key}">
        <div class="product-image">
          ${imageUrl ? `<img src="${imageUrl}" alt="${title}" />` : '<span style="font-size:48px;color:#bbb">🖼️</span>'}
        </div>

        <div class="product-details">
          <div class="product-info">
            <h3 class="product-name">${title}</h3>
            <p class="product-description">${desc}</p>
            <p class="product-sku">Product ID: ${key}</p>
          </div>

          <div class="product-footer">
            <div style="display:flex; align-items:center; gap:12px;">
              <div class="product-price">$${(price).toFixed(2)}</div>

              <div class="qty-controls" style="margin-left:8px;">
                <button class="dec-btn" data-action="dec" aria-label="decrease">-</button>
                <div class="qty-display">${qty}</div>
                <button class="inc-btn" data-action="inc" aria-label="increase">+</button>
              </div>
            </div>

            <div>
              <button class="remove-btn" data-action="remove">Remove</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Attach handlers after injection
  attachDomHandlers();
}

// Escaping helper to avoid HTML injection (safe-ish)
function escapeHtml(str) {
  return String(str || "").replace(/[&<>"']/g, (s) => {
    const map = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' };
    return map[s];
  });
}

// Attach click handlers for inc/dec/remove
function attachDomHandlers() {
  const cards = productsList.querySelectorAll(".product-card");
  cards.forEach(card => {
    const productId = card.dataset.id;
    const incBtn = card.querySelector(".inc-btn");
    const decBtn = card.querySelector(".dec-btn");
    const remBtn = card.querySelector(".remove-btn");

    if (incBtn) incBtn.onclick = () => changeQty(productId, 1);
    if (decBtn) decBtn.onclick = () => changeQty(productId, -1);
    if (remBtn) remBtn.onclick = () => removeItem(productId);
  });
}

// Change qty using transaction (atomic)
async function changeQty(productId, delta) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated.");
    const uid = user.uid;
    const itemRef = ref(db, `buyers/${uid}/cart/${productId}`);

    await runTransaction(itemRef, (current) => {
      if (current === null) return null;
      const newQty = (current.qty || 1) + delta;
      if (newQty <= 0) {
        // returning null deletes the node
        return null;
      }
      current.qty = newQty;
      current.updatedAt = Date.now();
      return current;
    });
  } catch (err) {
    console.error("changeQty error:", err);
    alert("Could not update quantity. Check console for details.");
  }
}

// Remove an item
async function removeItem(productId) {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated.");
    const uid = user.uid;
    const itemRef = ref(db, `buyers/${uid}/cart/${productId}`);
    await remove(itemRef);
  } catch (err) {
    console.error("removeItem error:", err);
    alert("Could not remove item. Check console for details.");
  }
}

// Compute totals from current cart object
function updateTotals(cartObj) {
  const items = Object.values(cartObj || {});
  const subtotal = items.reduce((sum, it) => {
    const price = Number(it.priceSnapshot || it.price || 0);
    const qty = Number(it.qty || 1);
    return sum + (price * qty);
  }, 0);

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  subtotalEl.textContent = `$${subtotal.toFixed(2)}`;
  taxEl.textContent = `$${tax.toFixed(2)}`;
  totalEl.textContent = `$${total.toFixed(2)}`;
}

// Checkout button behavior: persist latest cart snapshot and continue
checkoutBtn.addEventListener("click", async () => {
  // simply store cart snapshot to localStorage for checkout page to consume
  const items = currentCart || {};
  const snapshot = Object.keys(items).map(k => ({ id: k, ...items[k] }));
  if (!snapshot.length) {
    alert("Your cart is empty.");
    return;
  }

  // Save snapshot for checkout step (or implement server side order creation here)
  localStorage.setItem("cartSnapshot", JSON.stringify(snapshot));
  // Save totals (optional)
  localStorage.setItem("cartSubtotal", subtotalEl.textContent);
  localStorage.setItem("cartTotal", totalEl.textContent);

  // Navigate — change to your checkout page if different
  window.location.href = "checkout.html";
});

continueBtn.addEventListener("click", () => {
  window.location.href = "gallery.html";
});

// Start listening for cart data once DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  startCartListener().catch(err => {
    console.error("Could not start cart listener:", err);
    productsList.innerHTML = `<div class="empty-cart"><p>Unable to load cart. Please check console or sign in.</p></div>`;
  });
});
