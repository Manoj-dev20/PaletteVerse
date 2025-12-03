// buyer_profile.js (debuggable verbose version)
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
  const toastEl = document.getElementById("toast");

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

  // Better toast: shows message and optionally error
  function showNotification(message, isError=false) {
    console.info("TOAST:", message);
    if (toastEl) {
      toastEl.textContent = message;
      toastEl.classList.add(isError ? "toast-error" : "toast-ok");
      setTimeout(() => {
        toastEl.textContent = "";
        toastEl.classList.remove("toast-error","toast-ok");
      }, 4000);
    } else {
      // fallback
      const n = document.createElement("div");
      n.textContent = message;
      n.style.cssText = "position:fixed;bottom:16px;right:16px;padding:10px;background:#fff;border-radius:6px;box-shadow:0 4px 12px rgba(0,0,0,.15)";
      document.body.appendChild(n);
      setTimeout(()=>n.remove(),4000);
    }
  }

  // quick console-prefill
  window.__profileDebug = {
    lastSteps: []
  };

  function logStep(msg, obj) {
    console.log("[PROFILE DEBUG]", msg, obj === undefined ? "" : obj);
    window.__profileDebug.lastSteps.push({time: new Date().toISOString(), msg, obj});
    if (window.__profileDebug.lastSteps.length > 40) window.__profileDebug.lastSteps.shift();
  }

  const savedPhoto = localStorage.getItem("profilePhoto");
  if (savedPhoto && profileImg) profileImg.src = savedPhoto;

  // Robust name loader with detailed console logs and no silent failures
  async function loadPreferredName(uid, authDisplayName) {
    logStep("loadPreferredName START", {uid, authDisplayName});
    try {
      // attempt 1: direct buyer/{uid}/username
      logStep("attempt: buyer/{uid}/username");
      const directBuyerSnap = await firebase.database().ref(`buyer/${uid}/username`).once("value");
      logStep("buyer/{uid}/username snapshot", directBuyerSnap.exists() ? directBuyerSnap.val() : null);
      if (directBuyerSnap.exists() && directBuyerSnap.val()) {
        return directBuyerSnap.val();
      }

      // attempt 2: direct users/buyers/{uid}/username
      logStep("attempt: users/buyers/{uid}/username");
      const directUsersSnap = await firebase.database().ref(`users/buyers/${uid}/username`).once("value");
      logStep("users/buyers/{uid}/username snapshot", directUsersSnap.exists() ? directUsersSnap.val() : null);
      if (directUsersSnap.exists() && directUsersSnap.val()) {
        return directUsersSnap.val();
      }

      // attempt 3: query buyer list for child 'uid' === uid (push-keyed entries)
      logStep("attempt: query buyer where uid==uid (push-key)");
      const buyerListSnap = await firebase.database().ref("buyer").orderByChild("uid").equalTo(uid).once("value");
      logStep("buyer list query snapshot exists", buyerListSnap.exists());
      if (buyerListSnap.exists()) {
        const val = buyerListSnap.val();
        logStep("buyer list returned", val);
        const firstKey = Object.keys(val)[0];
        const entry = val[firstKey];
        logStep("first matched push entry", entry);
        if (entry && entry.username) return entry.username;
      }

      // attempt 4: users/buyers list query (push-keyed)
      logStep("attempt: query users/buyers where uid==uid");
      const usersBuyersSnap = await firebase.database().ref("users/buyers").orderByChild("uid").equalTo(uid).once("value");
      logStep("users/buyers query exists", usersBuyersSnap.exists());
      if (usersBuyersSnap.exists()) {
        const val = usersBuyersSnap.val();
        logStep("users/buyers returned", val);
        const firstKey = Object.keys(val)[0];
        const entry = val[firstKey];
        logStep("first matched users/buyers entry", entry);
        if (entry && entry.username) return entry.username;
      }

      // final fallback to auth displayName
      logStep("fallback to auth displayName", authDisplayName);
      return authDisplayName || null;
    } catch (err) {
      logStep("ERROR in loadPreferredName", err && err.message ? err.message : err);
      throw err; // rethrow so caller can display error
    }
  }

  // Expose a debug helper on window you can call from the console:
  window.debugQueries = async function() {
    try {
      const user = firebase.auth().currentUser;
      if (!user) { console.warn("no currentUser"); return "no-user"; }
      const uid = user.uid;
      console.log("debugQueries running for uid:", uid);

      const result = {};
      result.directBuyer = (await firebase.database().ref(`buyer/${uid}`).once("value")).val();
      result.directUsersBuyer = (await firebase.database().ref(`users/buyers/${uid}`).once("value")).val();
      result.buyerQuery = (await firebase.database().ref("buyer").orderByChild("uid").equalTo(uid).once("value")).val();
      result.usersBuyersQuery = (await firebase.database().ref("users/buyers").orderByChild("uid").equalTo(uid).once("value")).val();

      console.log("debugQueries result:", result);
      return result;
    } catch (e) {
      console.error("debugQueries error:", e);
      return { error: e && e.message ? e.message : String(e) };
    }
  };

  // main auth listener
  firebase.auth().onAuthStateChanged(async (user) => {
    if (!user) {
      logStep("onAuthStateChanged: no user found");
      showNotification("Not logged in", true);
      // try localStorage fallback
      const saved = localStorage.getItem("userProfile");
      if (saved) {
        try {
          const p = JSON.parse(saved);
          profileNameEl && (profileNameEl.textContent = p.name || "Buyer");
          profileTaglineEl && (profileTaglineEl.textContent = p.tagline || "Art Collector");
          profileEmailEl && (profileEmailEl.textContent = p.email || "Not available");
          logStep("populated from localStorage", p);
        } catch (e) {
          logStep("error parsing localStorage profile", e);
        }
      } else {
        profileNameEl && (profileNameEl.textContent = "Guest");
        profileEmailEl && (profileEmailEl.textContent = "Please log in");
      }
      return;
    }

    // we have user
    logStep("onAuthStateChanged: user present", {uid: user.uid, email: user.email, displayName: user.displayName});
    showNotification("Loading profile...");
    try {
      const uid = user.uid;
      const prefName = await loadPreferredName(uid, user.displayName);
      logStep("preferred name resolved", prefName);
      profileNameEl && (profileNameEl.textContent = prefName || "Buyer");
      profileEmailEl && (profileEmailEl.textContent = user.email || "Not provided");
      if (user.photoURL && profileImg) profileImg.src = user.photoURL;

      // read canonical path users/buyers/{uid}
      const snap = await firebase.database().ref(`users/buyers/${uid}`).once("value");
      logStep("users/buyers/{uid} snapshot exists", snap.exists());
      if (snap.exists()) {
        const db = snap.val();
        logStep("users/buyers/{uid} value", db);
        db.tagline && profileTaglineEl && (profileTaglineEl.textContent = db.tagline);
        db.email && profileEmailEl && (profileEmailEl.textContent = db.email);
        if (db.photoURL && profileImg && !user.photoURL) profileImg.src = db.photoURL;
      } else {
        // also attempt to find tagline/photo in push-keyed buyer
        const pushSnap = await firebase.database().ref("buyer").orderByChild("uid").equalTo(uid).once("value");
        if (pushSnap.exists()) {
          logStep("found push-keyed buyer record", pushSnap.val());
          const v = pushSnap.val();
          const firstKey = Object.keys(v)[0];
          const entry = v[firstKey];
          entry.tagline && profileTaglineEl && (profileTaglineEl.textContent = entry.tagline);
          entry.photoURL && profileImg && (profileImg.src = entry.photoURL);
          entry.email && profileEmailEl && (profileEmailEl.textContent = entry.email);
        }
      }

      localStorage.setItem("buyerUID", uid);
      showNotification("Profile loaded");
    } catch (err) {
      // show the real error message so you can debug it
      console.error("Failed to load user profile:", err);
      const msg = err && err.message ? err.message : String(err);
      showNotification("Could not load profile: " + msg, true);
    }
  });

  // minimal modal code kept for convenience (unchanged)
  if (editProfileBtn) {
    editProfileBtn.addEventListener("click", () => {
      nameInput.value = profileNameEl ? profileNameEl.textContent : "";
      taglineInput.value = profileTaglineEl ? profileTaglineEl.textContent : "";
      emailInput.value = profileEmailEl ? profileEmailEl.textContent : "";
      editModal.classList.add("active");
    });
  }
  if (closeModal) closeModal.addEventListener("click", () => editModal.classList.remove("active"));
  if (cancelBtn) cancelBtn.addEventListener("click", () => editModal.classList.remove("active"));
  if (editModal) editModal.addEventListener("click", (e) => { if (e.target === editModal) editModal.classList.remove("active"); });

  // keep other flows unchanged (profile pic, submit handler, etc.) --
  // you can copy the versions from previous file if needed for saving changes
});
