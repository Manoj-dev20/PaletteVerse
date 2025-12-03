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

firebase.initializeApp(firebaseConfig);

document.addEventListener("DOMContentLoaded", () => {
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
    setTimeout(() => notification.remove(), 2500);
  }

  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto && profileImg) profileImg.src = savedPhoto;

  // New robust loader for preferred name:
  // Tries direct paths, then queries by child 'uid' (handles push-key structures)
  async function loadPreferredName(uid, authDisplayName) {
    try {
      // 1) direct buyer/{uid}/username
      const directBuyerRef = firebase.database().ref(`buyer/${uid}/username`);
      const snapDirectBuyer = await directBuyerRef.once("value");
      if (snapDirectBuyer.exists() && snapDirectBuyer.val()) return snapDirectBuyer.val();

      // 2) direct users/buyers/{uid}/username
      const directUsersBuyerRef = firebase.database().ref(`users/buyers/${uid}/username`);
      const snapDirectUsersBuyer = await directUsersBuyerRef.once("value");
      if (snapDirectUsersBuyer.exists() && snapDirectUsersBuyer.val()) return snapDirectUsersBuyer.val();

      // 3) query buyer where child 'uid' == uid (handles buyer -> pushId -> { uid, username })
      const buyerListRef = firebase.database().ref("buyer");
      const buyerQuery = await buyerListRef.orderByChild("uid").equalTo(uid).once("value");
      if (buyerQuery.exists()) {
        const val = buyerQuery.val();
        // take first matching child
        const firstKey = Object.keys(val)[0];
        const entry = val[firstKey];
        if (entry && entry.username) return entry.username;
      }

      // 4) query users/buyers where child 'uid' == uid (handles push-keyed users)
      const usersBuyersRef = firebase.database().ref("users/buyers");
      const usersBuyersQuery = await usersBuyersRef.orderByChild("uid").equalTo(uid).once("value");
      if (usersBuyersQuery.exists()) {
        const val = usersBuyersQuery.val();
        const firstKey = Object.keys(val)[0];
        const entry = val[firstKey];
        if (entry && entry.username) return entry.username;
      }

      // 5) fallback to auth displayName
      return authDisplayName || null;
    } catch (err) {
      console.warn("Error while loading preferred name:", err);
      return authDisplayName || null;
    }
  }

  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
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

    try {
      const uid = user.uid;
      const authDisplayName = user.displayName || null;
      const email = user.email || null;
      const photoURL = user.photoURL || null;

      // This will cover direct path and push-key list structures
      const preferredName = await loadPreferredName(uid, authDisplayName);

      if (profileNameEl) profileNameEl.textContent = preferredName || "Buyer";
      if (profileEmailEl) profileEmailEl.textContent = email || "Not provided";
      if (profileImg && photoURL) profileImg.src = photoURL;

      // Read canonical other fields (tagline, photoURL) from users/buyers/{uid} if present
      const snapshot = await firebase.database().ref("users/buyers/" + uid).once("value");
      if (snapshot.exists()) {
        const db = snapshot.val();
        if (db.tagline && profileTaglineEl) profileTaglineEl.textContent = db.tagline;
        if (db.email && profileEmailEl) profileEmailEl.textContent = db.email;
        if (db.photoURL && profileImg && !photoURL) profileImg.src = db.photoURL;
      } else {
        // try to find tagline/photo in push-keyed buyers (if any)
        const buyerListRef = firebase.database().ref("buyer");
        const buyerQuery = await buyerListRef.orderByChild("uid").equalTo(uid).once("value");
        if (buyerQuery.exists()) {
          const val = buyerQuery.val();
          const firstKey = Object.keys(val)[0];
          const entry = val[firstKey];
          if (entry) {
            if (entry.tagline && profileTaglineEl) profileTaglineEl.textContent = entry.tagline;
            if (entry.photoURL && profileImg && !photoURL) profileImg.src = entry.photoURL;
            if (entry.email && profileEmailEl) profileEmailEl.textContent = entry.email;
          }
        }
      }

      localStorage.setItem("buyerUID", uid);
    } catch (err) {
      console.error("Failed to load user profile:", err);
      showNotification("Could not load profile.");
    }
  });

  // open/close edit modal
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", async () => {
      // Prefill inputs from visible UI
      nameInput.value = profileNameEl ? profileNameEl.textContent : "";
      taglineInput.value = profileTaglineEl ? profileTaglineEl.textContent : "";
      emailInput.value = profileEmailEl ? profileEmailEl.textContent : "";
      editModal.classList.add("active");
    });
  }
  if (closeModal) closeModal.addEventListener("click", () => editModal.classList.remove("active"));
  if (cancelBtn) cancelBtn.addEventListener("click", () => editModal.classList.remove("active"));
  if (editModal) editModal.addEventListener("click", (e) => { if (e.target === editModal) editModal.classList.remove("active"); });

  // Profile picture upload (preview + save)
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

        const user = firebase.auth().currentUser;
        if (user) {
          try {
            // Save to canonical locations
            await firebase.database().ref("users/buyers/" + user.uid).update({ photoURL: dataURL });
            await firebase.database().ref("buyer/" + user.uid).update({ photoURL: dataURL });
            // Also try to update auth profile
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

  // When user saves profile, write to canonical paths and keep in sync
  if (editForm) {
    editForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim();
      const tagline = taglineInput.value.trim();
      const email = emailInput.value.trim();

      if (profileNameEl) profileNameEl.textContent = name || profileNameEl.textContent;
      if (profileTaglineEl) profileTaglineEl.textContent = tagline || profileTaglineEl.textContent;
      if (profileEmailEl) profileEmailEl.textContent = email || profileEmailEl.textContent;

      localStorage.setItem("userProfile", JSON.stringify({ name, tagline, email }));

      const user = firebase.auth().currentUser;
      if (user) {
        const uid = user.uid;
        const updates = { username: name, tagline, email };

        try {
          // Write in places we check on load for future fast reads
          await firebase.database().ref("users/buyers/" + uid).update(updates);
          await firebase.database().ref("buyer/" + uid).update({ username: name, tagline, email });

          // Also keep older push-keyed records in sync if they exist:
          const buyerListRef = firebase.database().ref("buyer");
          const buyerQuery = await buyerListRef.orderByChild("uid").equalTo(uid).once("value");
          if (buyerQuery.exists()) {
            const val = buyerQuery.val();
            const firstKey = Object.keys(val)[0];
            await firebase.database().ref(`buyer/${firstKey}`).update({ username: name, tagline, email });
          }

          try { await user.updateProfile({ displayName: name }); } catch (err) { console.warn("Could not update auth displayName:", err); }

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

  // try load from localUID if offline
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
        } else {
          // try push-keyed buyer list
          const buyerListRef = firebase.database().ref("buyer");
          const buyerQuery = await buyerListRef.orderByChild("uid").equalTo(localUID).once("value");
          if (buyerQuery.exists()) {
            const val = buyerQuery.val();
            const firstKey = Object.keys(val)[0];
            const entry = val[firstKey];
            if (entry) {
              if (profileNameEl) profileNameEl.textContent = entry.username || profileNameEl.textContent;
              if (profileEmailEl) profileEmailEl.textContent = entry.email || profileEmailEl.textContent;
              if (entry.tagline && profileTaglineEl) profileTaglineEl.textContent = entry.tagline;
              if (entry.photoURL && profileImg) profileImg.src = entry.photoURL;
            }
          }
        }
      } catch (err) {
        console.warn("Could not load localUID profile:", err);
      }
    }
  })();
});
