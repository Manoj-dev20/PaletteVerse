// ======= Reliable modal + file-picker wiring (DROP-IN) =======
// Paste this at the *end* of artist_portfolio.js
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const UPLOAD_BTN = document.getElementById('uploadArtworkBtn') || document.querySelector('[id*="upload"]');
    const MODAL_NODE = () => document.getElementById('artworkModal') || document.querySelector('.modal') || document.querySelector('.modal-content');
    const FILE_INPUT = () => document.getElementById('artworkImage') || document.querySelector('input[type="file"]');
    const PREVIEW_IMG = () => document.getElementById('previewImg') || document.querySelector('.preview img') || null;
    const SUBMIT_BTN = () => document.getElementById('submitBtn') || document.querySelector('button[type="submit"]');

    // ensure modal host at top-level (prevents parent overflow/clipping)
    function ensureTopHost() {
      let host = document.getElementById('__top_modal_host');
      if (!host) { host = document.createElement('div'); host.id = '__top_modal_host'; document.body.appendChild(host); }
      return host;
    }

    function moveModalToBody() {
      const node = MODAL_NODE();
      const host = ensureTopHost();
      if (!node) return null;
      if (node.parentElement !== host) {
        try { host.appendChild(node); } catch(e) { /* ignore */ }
      }
      return node;
    }

    function showModal(node) {
      if (!node) return;
      node.classList.remove('hidden');
      node.style.display = 'block';
      node.style.position = 'fixed';
      node.style.left = '50%';
      node.style.top = '50%';
      node.style.transform = 'translate(-50%,-50%)';
      node.style.zIndex = '2147483647';
      // ensure overlay exists
      let overlay = document.getElementById('modalOverlay') || document.querySelector('.modal-overlay');
      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'modalOverlay';
        overlay.className = 'modal-overlay';
        document.body.appendChild(overlay);
      }
      overlay.style.display = 'block';
      overlay.style.zIndex = '2147483646';
      overlay.style.position = 'fixed';
      overlay.style.left = '0';
      overlay.style.top = '0';
      overlay.style.right = '0';
      overlay.style.bottom = '0';
      overlay.style.background = 'rgba(0,0,0,0.35)';
      overlay.onclick = (e) => { if (e.target === overlay) hideModal(); };
      document.body.style.overflow = 'hidden';
    }

    function hideModal() {
      const node = MODAL_NODE();
      if (node) {
        node.classList.add('hidden');
        node.style.display = 'none';
      }
      const overlay = document.getElementById('modalOverlay') || document.querySelector('.modal-overlay');
      if (overlay) overlay.style.display = 'none';
      document.body.style.overflow = '';
      // reset file input visual and value
      const fi = FILE_INPUT();
      if (fi) {
        try { fi.value = ''; } catch(e) {}
      }
      // hide preview
      const p = PREVIEW_IMG();
      if (p) { p.src = ''; p.style.display = 'none'; }
      // disable submit
      const sb = SUBMIT_BTN();
      if (sb) { sb.disabled = true; }
      // reset global getter
      window.__artistSelectedArtworkFile = () => null;
    }

    // Make file input clickable but not display:none (browsers block clicks on display:none)
    function safeMakeInputClickable(fi){
      if (!fi) return;
      // if it is display:none, change to inline-block but keep invisible via opacity and tiny size
      try {
        const cs = getComputedStyle(fi);
        if (cs && cs.display === 'none') {
          fi.style.display = 'inline-block';
        }
        fi.style.opacity = '0';
        fi.style.position = 'absolute';
        // keep it offscreen but connected so click is allowed
        fi.style.left = '-9999px';
        fi.style.width = '1px';
        fi.style.height = '1px';
        fi.style.zIndex = '999999';
      } catch(e) { /* ignore styling failures */ }
    }

    // Robust change handler for the input (attach or re-attach)
    function attachChangeHandler(fi) {
      if (!fi) return;
      // ensure we don't attach duplicates
      if (fi.__artistChangeHandlerAttached) return;
      fi.addEventListener('change', (ev) => {
        const f = ev.target.files?.[0] ?? null;
        window.__artistSelectedArtworkFile = () => f;
        if (f) {
          // set preview if present
          const p = PREVIEW_IMG();
          if (p) {
            p.src = URL.createObjectURL(f);
            p.onload = () => URL.revokeObjectURL(p.src);
            p.style.display = 'block';
          }
          // enable submit if present
          const sb = SUBMIT_BTN();
          if (sb) sb.disabled = false;
        }
      });
      fi.__artistChangeHandlerAttached = true;
    }

    // When Upload button clicked: show modal and open picker in same user gesture
    if (UPLOAD_BTN) {
      // remove previous listeners if any and rebind once
      try {
        const clone = UPLOAD_BTN.cloneNode(true);
        UPLOAD_BTN.parentNode && UPLOAD_BTN.parentNode.replaceChild(clone, UPLOAD_BTN);
      } catch(e) {}
    }

    // Re-query upload button (we might have replaced it)
    const BTN = document.getElementById('uploadArtworkBtn') || document.querySelector('[id*="upload"]');
    if (!BTN) {
      console.warn('[artist_portfolio] upload button not found for picker wiring');
      return;
    }

    BTN.addEventListener('click', (e) => {
      e.preventDefault();
      const modal = moveModalToBody();
      showModal(modal);
      // find real file input
      const fi = FILE_INPUT();
      if (!fi) {
        // if real input not found, create a tiny temp one as fallback
        const temp = document.createElement('input');
        temp.type = 'file';
        temp.accept = 'image/*';
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        temp.addEventListener('change', (ev) => {
          window.__artistSelectedArtworkFile = () => ev.target.files?.[0] ?? null;
          const p = PREVIEW_IMG();
          if (p && ev.target.files?.[0]) {
            p.src = URL.createObjectURL(ev.target.files[0]);
            p.onload = () => URL.revokeObjectURL(p.src);
            p.style.display = 'block';
          }
          // remove temp after a moment
          setTimeout(()=> temp.remove(), 200);
        }, { once: true });
        try { temp.click(); } catch(err) { console.warn('temp picker failed', err); }
        return;
      }

      // ensure clickable and attach change handler
      safeMakeInputClickable(fi);
      attachChangeHandler(fi);

      // Important: call click() synchronously here (inside user gesture)
      try {
        fi.click();
        console.log('[artist_portfolio] fileInput.click() invoked (user gesture)');
      } catch (err) {
        console.warn('[artist_portfolio] fileInput.click() failed, using temp fallback', err);
        // fallback: create temp input and click it
        const temp = document.createElement('input');
        temp.type = 'file';
        temp.accept = 'image/*';
        temp.style.position = 'fixed';
        temp.style.left = '-9999px';
        document.body.appendChild(temp);
        temp.addEventListener('change', (ev) => {
          window.__artistSelectedArtworkFile = () => ev.target.files?.[0] ?? null;
          const p = PREVIEW_IMG();
          if (p && ev.target.files?.[0]) {
            p.src = URL.createObjectURL(ev.target.files[0]);
            p.onload = () => URL.revokeObjectURL(p.src);
            p.style.display = 'block';
          }
          setTimeout(()=> temp.remove(), 200);
        }, { once: true });
        try { temp.click(); } catch(e) { console.warn('temp click failed', e); }
      }
    }, { passive: false });

    // Wire modal close triggers so we can hide and reset
    document.addEventListener('click', (ev) => {
      // close buttons
      if (ev.target.matches('.modal-close') || ev.target.matches('#modalCloseBtn') || ev.target.closest('.modal-close') || ev.target.closest('.close-modal')) {
        ev.preventDefault(); hideModal();
      }
    });

    // Escape key closes modal
    document.addEventListener('keydown', (ev) => { if (ev.key === 'Escape') hideModal(); });

    // On load, attach handler if input already present
    const initialFI = FILE_INPUT();
    if (initialFI) { safeMakeInputClickable(initialFI); attachChangeHandler(initialFI); }

    console.log('[artist_portfolio] file-picker wiring ready (real input bound if present).');
  });
})();
