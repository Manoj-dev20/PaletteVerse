// buyer_profile.js
const firebaseConfig = {
  apiKey: "AIzaSyAUrNn924N0Bx5Ow9bH0fo4ECgYQNYjcFk",
  authDomain: "paletteverse-659bd.firebaseapp.com",
  databaseURL: "https://paletteverse-659bd-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "paletteverse-659bd",
  storageBucket: "paletteverse-659bd.firebasestorage.app",
  messagingSenderId: "415618228152",
  appId: "1:415618228152:web:356cd28b5f938a842df94d",
  measurementId: "G-C1X35LPMDF"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", () => {
  // UI elements
  const profileNameEl = document.getElementById("profileName");
  const profileEmailEl = document.getElementById("profileEmail");
  const profileTaglineEl = document.getElementById("profileTagline");
  const profileImg = document.getElementById("profileImg");

  const editProfileBtn = document.getElementById("editProfileBtn");
  const editModal = document.getElementById("editModal");
  const closeModal = document.getElementById("closeModal");
  const cancelBtn = document.getElementById("cancelBtn");
  const editForm = document.getElementById("editForm");
  const nameInput = document.getElementById("name");
  const taglineInput = document.getElementById("tagline");
  const emailInput = document.getElementById("email");

  const editProfilePicBtn = document.getElementById("editProfilePicBtn");
  const profileFileInput = document.getElementById("profileFileInput");

  // Utility: show toast
  function showNotification(message) {
    const notification = document.createElement("div");
    notification.textContent = message;
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
      font-weight: 500;
    `;
    document.body.appendChild(notification);
    setTimeout(() => {
      notification.remove();
    }, 2500);
  }

  // Load saved photo from localStorage as quick fallback
  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto && profileImg) profileImg.src = savedPhoto;

  // When an auth state changes — populate profile from auth and DB
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      // Not logged in -- try to read from localStorage / existing saved profile
      const savedProfile = localStorage.getItem("userProfile");
      if (savedProfile) {
        const { name, tagline, email } = JSON.parse(savedProfile);
        if (profileNameEl) profileNameEl.textContent = name || "Buyer";
        if (profileTaglineEl) profileTaglineEl.textContent = tagline || "Art Collector";
        if (profileEmailEl) profileEmailEl.textContent = email || "Not available";
      } else {
        if (profileNameEl) profileNameEl.textContent = "Guest";
        if (profileEmailEl) profileEmailEl.textContent = "Please log in";
      }
      return;
    }

    // We have a logged in user
    try {
      const uid = user.uid;
      // Primary values from Auth object
      const displayName = user.displayName || null;
      const email = user.email || null;
      const photoURL = user.photoURL || null;

      // Put auth values in UI first
      if (profileNameEl) profileNameEl.textContent = displayName || "Buyer";
      if (profileEmailEl) profileEmailEl.textContent = email || "Not provided";
      if (profileImg && photoURL) profileImg.src = photoURL;

      // Then try to read additional profile fields from Realtime Database under users/buyers/{uid}
      const userRef = firebase.database().ref("users/buyers/" + uid);
      const snapshot = await userRef.once("value");
      if (snapshot.exists()) {
        const db = snapshot.val();
        // Use DB username if it exists (fallback to auth displayName)
        if (db.username && profileNameEl) profileNameEl.textContent = db.username;
        if (db.email && profileEmailEl) profileEmailEl.textContent = db.email;
        if (db.tagline && profileTaglineEl) profileTaglineEl.textContent = db.tagline;
        if (db.photoURL && profileImg && !photoURL) profileImg.src = db.photoURL;
      }

      // Save UID locally for other flows (optional)
      localStorage.setItem("buyerUID", uid);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      showNotification("Could not load profile.");
    }
  });

  // Open / close edit modal
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", async () => {
      // Pre-fill form with the latest displayed values
      nameInput.value = profileNameEl ? profileNameEl.textContent : "";
      taglineInput.value = profileTaglineEl ? profileTaglineEl.textContent : "";
      emailInput.value = profileEmailEl ? profileEmailEl.textContent : "";
      editModal.classList.add("active");
    });
  }

  if (closeModal) closeModal.addEventListener("click", () => editModal.classList.remove("active"));
  if (cancelBtn) cancelBtn.addEventListener("click", () => editModal.classList.remove("active"));
  if (editModal) {
    editModal.addEventListener("click", (e) => {
      if (e.target === editModal) editModal.classList.remove("active");
    });
  }

  // Profile picture upload (quick local preview + saving to DB as dataURL)
  if (editProfilePicBtn && profileFileInput) {
    editProfilePicBtn.addEventListener("click", () => profileFileInput.click());

    profileFileInput.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataURL = ev.target.result;
        profileImg.src = dataURL;
        localStorage.setItem("profilePhoto", dataURL);
        showNotification("Profile picture updated (local preview).");

        // Try to save to Realtime DB for logged in user (note: better to upload to Storage in production)
        const user = firebase.auth().currentUser;
        if (user) {
          try {
            await firebase.database().ref("users/buyers/" + user.uid).update({ photoURL: dataURL });
            // Also update firebase auth profile photoURL (not a real hosted URL, but keep consistent)
            await user.updateProfile({ photoURL: dataURL }).catch(() => {});
            showNotification("Profile picture saved to your account.");
          } catch (err) {
            console.warn("Could not save photo to DB:", err);
          }
        }
      };
      reader.readAsDataURL(file);
    });
  }

  // Submit edit form -> update DB and Auth profile where possible
  if (editForm) {
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const tagline = taglineInput.value.trim();
      const email = emailInput.value.trim();

      // Update UI immediately
      if (profileNameEl) profileNameEl.textContent = name || profileNameEl.textContent;
      if (profileTaglineEl) profileTaglineEl.textContent = tagline || profileTaglineEl.textContent;
      if (profileEmailEl) profileEmailEl.textContent = email || profileEmailEl.textContent;

      // Persist locally
      localStorage.setItem("userProfile", JSON.stringify({ name, tagline, email }));

      // If user is logged in, update Realtime DB and Firebase Auth
      const user = firebase.auth().currentUser;
      if (user) {
        const uid = user.uid;
        const updates = {
          username: name,
          tagline,
          email, // keep in DB too
        };

        try {
          // Update DB
          await firebase.database().ref("users/buyers/" + uid).update(updates);

          // Update Auth profile displayName
          try {
            await user.updateProfile({ displayName: name });
          } catch (err) {
            console.warn("Could not update auth displayName:", err);
          }

          // If email changed, attempt updateEmail (requires recent login in many cases)
          if (email && email !== user.email) {
            try {
              await user.updateEmail(email);
              showNotification("Email updated in Authentication.");
            } catch (err) {
              console.warn("updateEmail failed (may require re-auth):", err);
              showNotification("Email change requires re-login — saved to profile but not auth.");
            }
          }

          showNotification("Profile saved to your account.");
        } catch (err) {
          console.error("Error updating profile in DB:", err);
          showNotification("Couldn't save to server. Changes saved locally.");
        }
      } else {
        showNotification("Saved locally. Log in to persist to your account.");
      }

      editModal.classList.remove("active");
    });
  }

  // Example small interactive bits (order modal open/close) kept from previous logic:
  const orderModal = document.getElementById("orderModal");
  const closeOrderModal = document.getElementById("closeOrderModal");
  document.querySelectorAll(".summary-card").forEach((card) => {
    card.addEventListener("click", () => {
      if (orderModal) orderModal.classList.add("active");
    });
  });
  if (closeOrderModal) closeOrderModal.addEventListener("click", () => orderModal && orderModal.classList.remove("active"));
  if (orderModal) {
    orderModal.addEventListener("click", (e) => {
      if (e.target === orderModal) orderModal.classList.remove("active");
    });
  }

  // (Optional) quick boot: if a buyerUID was already present in local storage and user not logged in,
  // try to fetch DB profile to populate UI. This keeps your previous behaviour for offline/demo uses:
  (async function tryLoadFromLocalUID() {
    const localUID = localStorage.getItem("buyerUID");
    if (!firebase.auth().currentUser && localUID) {
      try {
        const snapshot = await firebase.database().ref("users/buyers/" + localUID).once("value");
        if (snapshot.exists()) {
          const data = snapshot.val();
          if (profileNameEl) profileNameEl.textContent = data.username || profileNameEl.textContent;
          if (profileEmailEl) profileEmailEl.textContent = data.email || profileEmailEl.textContent;
          if (data.tagline && profileTaglineEl) profileTaglineEl.textContent = data.tagline;
          if (data.photoURL && profileImg) profileImg.src = data.photoURL;
        }
      } catch (err) {
        console.warn("Could not load localUID profile:", err);
      }
    }
  })();
});
