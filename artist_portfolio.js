// artist_portfolio.js
// Upload chosen artwork -> Cloudinary -> write metadata to RTDB (/images).
// Uses your Cloudinary config from the dummy uploader (dukbsiihd / palette_unsigned).
// Falls back to Firebase Storage if Cloudinary is unavailable or upload fails.

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref as dbRef, push, set, serverTimestamp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

/* ---------- Cloudinary config (from dummy page you shared) ---------- */
const CLOUDINARY_CLOUD_NAME = "dukbsiihd";
const CLOUDINARY_UPLOAD_PRESET = "palette_unsigned";

/* ---------- Firebase config (same as your other pages) ---------- */
const firebaseConfig = {
  apiKey: "AIzaSyAUrNn924N0Bx5Ow9bH0fo4ECgYQNYjcFk",
  authDomain: "paletteverse-659bd.firebaseapp.com",
  projectId: "paletteverse-659bd",
  storageBucket: "paletteverse-659bd.firebasestorage.app",
  messagingSenderId: "415618228152",
  appId: "1:415618228152:web:356cd28b5f938a842df94d",
  measurementId: "G-C1X35LPMDF"
};
const RTDB_URL = "https://paletteverse-659bd-default-rtdb.asia-southeast1.firebasedatabase.app";

/* ---------- Initialize Firebase ---------- */
const app = initializeApp(firebaseConfig);
const db = getDatabase(app, RTDB_URL);
const auth = getAuth(app);
const storage = getStorage(app);

/* ---------- DOM references (adjust IDs if your HTML uses different ones) ---------- */
const form = document.getElementById("artworkForm");          // main form (if present)
const fileInput = document.getElementById("artworkImage");    // fallback file input
const titleInput = document.getElementById("artworkTitle");   // optional
const descInput = document.getElementById("artworkDescription");
const priceInput = document.getElementById("artworkPrice");
const submitBtn = document.getElementById("submitBtn");
const previewImg = document.getElementById("previewImg");     // optional preview element
// If any of these IDs differ in your HTML, either update the HTML or change the IDs here.

/* ---------- Helpers ---------- */
function safeText(s){ return String(s || "").trim(); }
function fmtPrice(n){ const v = Number(n||0); return isNaN(v) ? 0 : v; }

function ensureAuth(){
  return new Promise((resolve, reject) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if(user){ unsub(); resolve(user); }
      else {
        signInAnonymously(auth).then(()=>{/* will trigger onAuthStateChanged */}).catch(err => { unsub(); reject(err); });
      }
    }, (err) => { unsub(); reject(err); });
  });
}

/* ---------- Cloudinary upload (unsigned) ---------- */
async function uploadToCloudinary(file, onProgress) {
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
    throw new Error("Cloudinary not configured");
  }
  const endpoint = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  return await new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", endpoint);

    xhr.upload.onprogress = (ev) => {
      if (ev.lengthComputable && typeof onProgress === "function") {
        onProgress(Math.round((ev.loaded / ev.total) * 100));
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); }
        catch(e){ reject(e); }
      } else {
        reject(new Error("Cloudinary upload failed: " + xhr.status));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
    xhr.send(fd);
  });
}

/* ---------- Firebase Storage fallback ---------- */
function uploadToFirebaseStorage(file, ownerUid, onProgress) {
  return new Promise((resolve, reject) => {
    try {
      const ts = Date.now();
      const safeName = file.name.replace(/\s+/g, "_");
      const path = `artworks/${ownerUid || "anon"}/${ts}_${safeName}`;
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, file);

      task.on("state_changed", (snap) => {
        if (snap.totalBytes && typeof onProgress === "function") {
          onProgress(Math.round((snap.bytesTransferred / snap.totalBytes) * 100));
        }
      }, (err) => reject(err), async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({ secure_url: url, public_id: path, original_filename: file.name });
        } catch (e) { reject(e); }
      });
    } catch (err) { reject(err); }
  });
}

/* ---------- Write metadata to RTDB under /images ---------- */
async function saveImageRecordToRTDB(obj) {
  const imagesRef = dbRef(db, "images");
  const newRef = push(imagesRef);
  // set createdAt using serverTimestamp for parity with dummy uploader
  obj.createdAt = serverTimestamp();
  await set(newRef, obj);
  return newRef.key;
}

/* ---------- Utility to get selected File (wiring or file input) ---------- */
function getSelectedFile() {
  // prefer window helper if your page uses it
  if (typeof window.__artistSelectedArtworkFile === "function") {
    const f = window.__artistSelectedArtworkFile();
    if (f) return f;
  }
  // fallback to file input
  if (fileInput && fileInput.files && fileInput.files[0]) return fileInput.files[0];
  return null;
}

/* ---------- UI progress helper (if you want to show progress) ---------- */
function setProgress(pct) {
  // if your page has a progress element with id 'uploadProgress', update it
  const prog = document.getElementById("uploadProgress");
  if (prog) { prog.style.display = "block"; prog.value = pct; }
  // if preview area has a small status text id 'uploadStatus'
  const status = document.getElementById("uploadStatus");
  if (status) status.textContent = pct < 100 ? `Uploading — ${pct}%` : "Finalizing...";
}

/* ---------- Main submit handler ---------- */
async function handleSubmit(ev) {
  if (ev && ev.preventDefault) ev.preventDefault();
  if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = "Uploading..."; }

  try {
    await ensureAuth();
    const user = auth.currentUser;
    const ownerUid = user ? user.uid : null;

    const file = getSelectedFile();
    if (!file) throw new Error("Please select an image file to upload.");

    const title = safeText((titleInput && titleInput.value) || "");
    const caption = safeText((descInput && descInput.value) || title || "");
    const price = fmtPrice((priceInput && priceInput.value) || 0);
    if (!title && !caption) throw new Error("Please add a title or caption.");

    // Attempt Cloudinary upload first
    let cloudResp = null;
    try {
      cloudResp = await uploadToCloudinary(file, (pct) => setProgress(pct));
    } catch (cloudErr) {
      console.warn("Cloudinary upload failed, falling back to Firebase Storage:", cloudErr);
      // fallback: upload to firebase storage
      cloudResp = await uploadToFirebaseStorage(file, ownerUid, (pct) => setProgress(pct));
    }

    // prepare record shape matching your DB screenshot / dummy uploader
    const rec = {
      url: cloudResp.secure_url || cloudResp.secureUrl || cloudResp.url || cloudResp.secureUrl || "",
      caption: caption || title || "",
      price: price || 0,
      original_filename: cloudResp.original_filename || file.name || "",
      public_id: cloudResp.public_id || cloudResp.publicId || cloudResp.public_id || "",
      ownerUid: ownerUid || null
      // createdAt will be set server-side via serverTimestamp in save function
    };

    const newKey = await saveImageRecordToRTDB(rec);
    console.log("Saved image record id:", newKey);

    // Reset UI & helpers
    if (form) form.reset();
    if (fileInput) fileInput.value = "";
    if (typeof window.__artistSelectedArtworkFile === "function") window.__artistSelectedArtworkFile = () => null;
    if (previewImg) { previewImg.src = ""; previewImg.style.display = "none"; }
    setProgress(100);
    alert("Artwork uploaded successfully!");
  } catch (err) {
    console.error("Upload error:", err);
    alert("Upload failed: " + (err.message || err));
  } finally {
    if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = "Upload Artwork"; }
    // hide progress after small delay (if element exists)
    const prog = document.getElementById("uploadProgress");
    if (prog) setTimeout(()=> prog.style.display = "none", 700);
  }
}

/* ---------- Hook form or submit button ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // If page has an actual form (#artworkForm), listen to submit; otherwise wire submitBtn
  if (form) form.addEventListener("submit", handleSubmit);
  else if (submitBtn) submitBtn.addEventListener("click", handleSubmit);

  // preview if file input exists
  if (fileInput) {
    fileInput.addEventListener("change", (e) => {
      const f = e.target.files && e.target.files[0];
      if (!f) return;
      if (previewImg) { previewImg.src = URL.createObjectURL(f); previewImg.style.display = "block"; }
      // set wiring helper too so other code can use it
      window.__artistSelectedArtworkFile = () => f;
    });
  }

  // If your page has a custom file-picker that uses window.__artistSelectedArtworkFile,
  // you can still call handleSubmit via the submit button — the helper function will supply the file.
});
