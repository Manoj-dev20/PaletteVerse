// artist_portfolio.js (module)
// Cloudinary unsigned upload + Firebase RTDB. Edit & Delete supported (RTDB).
// IMPORTANT: Cloudinary deletion requires server-side API secret — this script only deletes RTDB nodes.

// ---------- CONFIG ----------
const CLOUDINARY_CLOUD_NAME = "dukbsiihd";
const CLOUDINARY_UPLOAD_PRESET = "palette_unsigned";

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

// ---------- IMPORTS ----------
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import { getDatabase, ref as dbRef, push, set, serverTimestamp, onValue, remove } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";
import { getAuth, onAuthStateChanged, signInAnonymously } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";
import { getStorage, ref as storageRef, uploadBytesResumable, getDownloadURL } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-storage.js";

// ---------- INIT ----------
const app = initializeApp(firebaseConfig);
const db = getDatabase(app, RTDB_URL);
const auth = getAuth(app);
const storage = getStorage(app);

// ---------- DOM ----------
const uploadArtworkBtn = document.getElementById("uploadArtworkBtn");
const emptyStateUploadBtn = document.getElementById("emptyStateUploadBtn");
const artworkModal = document.getElementById("artworkModal");
const modalOverlay = document.getElementById("modalOverlay");
const modalCloseBtn = document.getElementById("modalCloseBtn");
const modalCancelBtn = document.getElementById("modalCancelBtn");
const artworkForm = document.getElementById("artworkForm");
const submitBtn = document.getElementById("submitBtn");
const imageUpload = document.getElementById("imageUpload");
const fileInput = document.getElementById("artworkImage");
const changeImageBtn = document.getElementById("changeImageBtn");
const imagePreview = document.getElementById("imagePreview");
const previewImg = document.getElementById("previewImg");
const titleInput = document.getElementById("artworkTitle");
const descInput = document.getElementById("artworkDescription");
const priceInput = document.getElementById("artworkPrice");
const categoryInput = document.getElementById("artworkCategory");
const paperSizeInput = document.getElementById("artworkPaperSize");
const uploadProgress = document.getElementById("uploadProgress");
const uploadStatus = document.getElementById("uploadStatus");
const portfolioGrid = document.getElementById("portfolioGrid");
const emptyState = document.getElementById("emptyState");
const editingKeyInput = document.getElementById("editingKey");

// ---------- Helpers ----------
function show(el){ if(el) el.classList.remove("hidden"); }
function hide(el){ if(el) el.classList.add("hidden"); }
function safeText(s){ return String(s || "").trim(); }
function fmtPrice(n){ const v = Number(n||0); return isNaN(v) ? 0 : v; }

let selectedFile = null;
let currentEditingRecord = null; // store current record when editing

// ---------- Auth fallback ----------
function ensureAuth(){
  return new Promise((resolve,reject)=>{
    const unsub = onAuthStateChanged(auth, user => {
      if (user){ unsub(); resolve(user); }
      else { signInAnonymously(auth).then(()=>{/* triggers onAuthStateChanged */}).catch(err=>{ unsub(); reject(err); }); }
    }, err => { unsub(); reject(err); });
  });
}

// ---------- Modal open/close ----------
function openModal(){ artworkModal.classList.remove("hidden"); }
function closeModal(){
  artworkModal.classList.add("hidden");
  artworkForm.reset();
  editingKeyInput.value = "";
  selectedFile = null;
  currentEditingRecord = null;
  previewImg.src = ""; previewImg.style.display = "none";
  hide(imagePreview);
  uploadProgress.style.display = "none";
  uploadProgress.value = 0;
  uploadStatus.textContent = "";
  submitBtn.textContent = "Upload Artwork";
}

// ---------- UI wiring ----------
document.addEventListener("DOMContentLoaded", () => {
  if (uploadArtworkBtn) uploadArtworkBtn.addEventListener("click", () => openModal());
  if (emptyStateUploadBtn) emptyStateUploadBtn.addEventListener("click", () => openModal());
  if (modalOverlay) modalOverlay.addEventListener("click", closeModal);
  if (modalCloseBtn) modalCloseBtn.addEventListener("click", closeModal);
  if (modalCancelBtn) modalCancelBtn.addEventListener("click", closeModal);

  if (imageUpload && fileInput) {
    imageUpload.addEventListener("click", () => fileInput.click());
    imageUpload.addEventListener("keydown", ev => { if (ev.key === "Enter" || ev.key === " ") { ev.preventDefault(); fileInput.click(); }});
  }
  if (changeImageBtn) changeImageBtn.addEventListener("click", () => fileInput.click());
  if (fileInput) fileInput.addEventListener("change", handleFileSelect);
  if (artworkForm) artworkForm.addEventListener("submit", handleSubmit);

  startPortfolioListener();
});

// ---------- file selection & preview ----------
function handleFileSelect(e){
  const f = e.target.files && e.target.files[0];
  if (!f) { selectedFile = null; hide(imagePreview); return; }
  selectedFile = f;
  previewImg.src = URL.createObjectURL(f);
  previewImg.style.display = "block";
  show(imagePreview);
}

// ---------- Cloudinary upload (unsigned) ----------
function uploadToCloudinary(file, onProgress){
  if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) return Promise.reject(new Error("Cloudinary not configured"));
  const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;
  const fd = new FormData();
  fd.append("file", file);
  fd.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  return new Promise((resolve,reject)=>{
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url);

    xhr.upload.onprogress = ev => {
      if (ev.lengthComputable && typeof onProgress === "function") onProgress(Math.round((ev.loaded/ev.total)*100));
    };

    xhr.onload = () => {
      if (xhr.status >=200 && xhr.status < 300) {
        try { resolve(JSON.parse(xhr.responseText)); } catch(e){ reject(e); }
      } else {
        reject(new Error("Cloudinary upload failed: " + xhr.status));
      }
    };

    xhr.onerror = () => reject(new Error("Network error during Cloudinary upload"));
    xhr.send(fd);
  });
}

// ---------- Firebase Storage fallback ----------
function uploadToFirebaseStorage(file, ownerUid, onProgress){
  return new Promise((resolve,reject)=>{
    try {
      const ts = Date.now();
      const safeName = file.name.replace(/\s+/g,"_");
      const path = `artworks/${ownerUid||"anon"}/${ts}_${safeName}`;
      const sRef = storageRef(storage, path);
      const task = uploadBytesResumable(sRef, file);

      task.on("state_changed", snap => {
        if (snap.totalBytes && typeof onProgress === "function") onProgress(Math.round((snap.bytesTransferred/snap.totalBytes)*100));
      }, err => reject(err), async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve({ secure_url: url, public_id: path, original_filename: file.name });
        } catch(e){ reject(e); }
      });
    } catch (err) { reject(err); }
  });
}

// ---------- write metadata to RTDB (/images) ----------
async function writeRecord(record, key = null){
  if (key) {
    const nodeRef = dbRef(db, `images/${key}`);
    record.createdAt = record.createdAt || serverTimestamp();
    await set(nodeRef, record);
    return key;
  } else {
    const imagesRef = dbRef(db, "images");
    const newRef = push(imagesRef);
    record.createdAt = serverTimestamp();
    await set(newRef, record);
    return newRef.key;
  }
}

// ---------- remove record ----------
async function deleteRecord(key){
  const nodeRef = dbRef(db, `images/${key}`);
  await remove(nodeRef);
}

// ---------- submit handler (upload or update) ----------
async function handleSubmit(ev){
  if (ev && ev.preventDefault) ev.preventDefault();
  submitBtn.disabled = true;
  submitBtn.textContent = "Uploading...";

  try {
    await ensureAuth();
    const user = auth.currentUser;
    const ownerUid = user ? user.uid : null;

    const title = safeText(titleInput.value);
    const caption = safeText(descInput.value) || title;
    const price = fmtPrice(priceInput.value);
    const category = safeText(categoryInput.value);
    const paperSize = safeText(paperSizeInput.value);

    if (!title || !category || !paperSize) {
      alert("Please fill required fields (title, category, paper size).");
      return;
    }

    // editingKey present => update; otherwise create
    const editingKey = safeText(editingKeyInput.value) || null;

    // Determine whether to upload a new file:
    // - If user selected a new file (selectedFile) -> upload to Cloudinary (or storage fallback)
    // - If editing and selectedFile is null -> reuse currentEditingRecord.url and public_id
    let cloudResp = null;
    if (selectedFile) {
      uploadProgress.style.display = "inline-block";
      uploadProgress.value = 0;
      uploadStatus.textContent = "Uploading image...";

      try {
        cloudResp = await uploadToCloudinary(selectedFile, pct => {
          uploadProgress.value = pct;
          uploadStatus.textContent = `Uploading — ${pct}%`;
        });
      } catch (cloudErr) {
        console.warn("Cloudinary failed, falling back to Firebase Storage", cloudErr);
        cloudResp = await uploadToFirebaseStorage(selectedFile, ownerUid, pct => {
          uploadProgress.value = pct;
          uploadStatus.textContent = `Uploading (storage fallback) — ${pct}%`;
        });
      }
    } else if (editingKey && currentEditingRecord) {
      // no new file selected while editing -> keep existing URL and public_id
      cloudResp = {
        secure_url: currentEditingRecord.url || "",
        public_id: currentEditingRecord.public_id || "",
        original_filename: currentEditingRecord.original_filename || ""
      };
    } else {
      alert("Please select an image to upload.");
      return;
    }

    const record = {
      url: cloudResp.secure_url || cloudResp.secureUrl || cloudResp.url || "",
      caption: caption || title,
      price: Number(price) || 0,
      original_filename: cloudResp.original_filename || (selectedFile ? selectedFile.name : ""),
      public_id: cloudResp.public_id || cloudResp.publicId || cloudResp.public_id || "",
      category,
      paperSize,
      ownerUid: ownerUid || null
      // createdAt will be set in writeRecord
    };

    // write or update
    const savedKey = await writeRecord(record, editingKey);
    if (editingKey) {
      alert("Artwork updated successfully!");
    } else {
      alert("Artwork uploaded successfully!");
    }

    // reset and close
    closeModal();
  } catch (err) {
    console.error("Submit failed:", err);
    alert("Upload failed: " + (err.message || err));
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = editingKeyInput.value ? "Save changes" : "Upload Artwork";
    setTimeout(()=> { uploadProgress.style.display = "none"; uploadProgress.value = 0; uploadStatus.textContent = ""; }, 700);
    selectedFile = null;
  }
}

// ---------- RTDB listener to populate gallery with overlay buttons ----------
function startPortfolioListener(){
  try {
    const imagesRef = dbRef(db, "images");
    onValue(imagesRef, (snap) => {
      const val = snap.val() || {};
      const keys = Object.keys(val || {});
      if (!keys.length) {
        hide(portfolioGrid);
        show(emptyState);
        return;
      }
      show(portfolioGrid);
      hide(emptyState);
      portfolioGrid.innerHTML = "";
      const entries = keys.map(k => ({ id: k, data: val[k] }));
      entries.sort((a,b) => (b.data.createdAt || 0) - (a.data.createdAt || 0));
      for (const e of entries) {
        const card = document.createElement("div");
        card.className = "artwork-card";
        card.dataset.key = e.id;

        // overlay with edit & delete icons
        const overlay = document.createElement("div");
        overlay.className = "artwork-overlay";
        overlay.innerHTML = `
          <div class="icon-circle edit-btn" title="Edit" data-key="${e.id}" aria-label="Edit">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 21v-3l11-11 3 3L6 21H3z"/><path d="M14 7l3 3"/></svg>
          </div>
          <div class="icon-circle delete-btn" title="Delete" data-key="${e.id}" aria-label="Delete">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
          </div>
        `;

        const html = `
          <div class="artwork-image-wrapper">
            <img class="artwork-image" src="${e.data.url || ''}" alt="${(e.data.caption || 'Artwork').replace(/"/g,'')}" />
          </div>
          <div class="artwork-info">
            <div class="artwork-title">${(e.data.caption || 'Untitled')}</div>
            <div class="artwork-price">₹${Number(e.data.price || 0).toFixed(0)}</div>
          </div>
        `;

        card.innerHTML = html;
        card.appendChild(overlay);

        // attach to grid
        portfolioGrid.appendChild(card);

        // wire edit & delete events
        const editBtn = overlay.querySelector(".edit-btn");
        const deleteBtn = overlay.querySelector(".delete-btn");

        editBtn && editBtn.addEventListener("click", (ev) => {
          ev.stopPropagation();
          openEditModal(e.id, e.data);
        });

        deleteBtn && deleteBtn.addEventListener("click", async (ev) => {
          ev.stopPropagation();
          const confirmDel = confirm("Delete this artwork? This will remove it from the gallery (Firebase Realtime Database).");
          if (!confirmDel) return;
          try {
            await deleteRecord(e.id);
            alert("Artwork deleted from database.");
          } catch (delErr) {
            console.error("Delete failed:", delErr);
            alert("Delete failed: " + (delErr.message || delErr));
          }
        });
      }
    });
  } catch (err) {
    console.warn("Portfolio listener error:", err);
  }
}

// ---------- open edit modal ----------
function openEditModal(key, data){
  editingKeyInput.value = key;
  currentEditingRecord = data || null;

  // populate fields
  titleInput.value = data.caption || "";
  descInput.value = data.description || data.caption || "";
  priceInput.value = data.price || 0;
  categoryInput.value = data.category || "";
  paperSizeInput.value = data.paperSize || "";

  if (data.url) {
    previewImg.src = data.url;
    previewImg.style.display = "block";
    show(imagePreview);
  } else {
    previewImg.src = "";
    previewImg.style.display = "none";
    hide(imagePreview);
  }

  // show modal and update submit button text
  submitBtn.textContent = "Save changes";
  openModal();
}
