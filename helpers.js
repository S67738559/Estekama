import { auth, db } from "./firebase.js";
import { onAuthStateChanged, signOut }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { doc, getDoc }
  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// ── Show a toast message ─────────────────────────────────────
// this will show a small popup message at the top of the screen
export function toast(msg, type = "") {
  let box = document.getElementById("toast-box");
  if (!box) {
    box = document.createElement("div");
    box.id = "toast-box";
    box.className = "toast-box";
    document.body.appendChild(box);
  }
  const t = document.createElement("div");
  t.className = "toast " + type;
  t.textContent = msg;
  box.appendChild(t);
  setTimeout(() => {
    t.style.opacity = "0";
    t.style.transition = "opacity 0.3s";
    setTimeout(() => t.remove(), 300);
  }, 3000);
}

// ── Get user role from Firestore ─────────────────────────────
// this will read the user's role (admin or user) from the database
export async function getRole(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data().role : null;
}

// ── Wait for login; redirect to login.html if not logged in ──
// this will check if you are logged in; if not it sends you to the login page
export function requireLogin(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/login.html";
      return;
    }
    // Reveal the page only after we've confirmed the user is signed in.
    if (document.body) document.body.style.visibility = "visible";
    callback(user);
  });
}

// ── Wait for login and check admin role ──────────────────────
// this will check that you are logged in AND an admin, otherwise it kicks you out
export function requireAdmin(callback) {
  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      window.location.href = "/login.html";
      return;
    }
    const role = await getRole(user.uid);
    if (role !== "admin") {
      window.location.href = "/index.html";
      return;
    }
    if (document.body) document.body.style.visibility = "visible";
    callback(user);
  });
}

// ── Render the shared top navbar into <nav id="navbar"> ───────
//  variant: "public" (default) | "landing" | "auth" | "admin"
//  active:  which public link to highlight ("departments" | "teachers" | "contact" | "about")
// this will draw the top navigation bar onto the page
export function renderNavbar({ variant = "public", active = "" } = {}) {
  const mount = document.getElementById("navbar");
  if (!mount) return;

  const base    = variant === "admin" ? "../" : "";
  const logoImg = `<img src="${base}logo.png" class="logo-img" alt="School logo">`;

  let inner;
  if (variant === "auth") {
    inner = `<span class="logo">${logoImg}Al-Estekama School</span>`;
  } else if (variant === "landing") {
    // Visitors-only landing page: just Login + Register, no site sections.
    inner =
      `<span class="logo">${logoImg}Al-Estekama School</span>` +
      `<a href="login.html"    class="hide-mobile">Login</a>` +
      `<a href="register.html" class="btn btn-orange">Register</a>`;
  } else if (variant === "admin") {
    inner =
      `<span class="logo">${logoImg}Al-Estekama School</span>` +
      `<span style="color:rgba(255,255,255,0.5);font-size:13px">Admin Panel</span>` +
      `<span id="nav-user"></span>` +
      `<button id="btn-logout">Sign out</button>`;
  } else {
    const link = (href, key, label) =>
      `<a href="${href}" class="hide-mobile${active === key ? " active" : ""}">${label}</a>`;
    inner =
      `<span class="logo">${logoImg}Al-Estekama School</span>` +
      link("departments.html", "departments", "Departments") +
      link("teachers.html",    "teachers",    "Teachers")    +
      link("contact.html",     "contact",     "Contact")     +
      link("about.html",       "about",       "About")       +
      `<span id="nav-user"></span>` +
      `<button id="btn-logout">Sign out</button>`;
  }

  mount.className = "navbar";
  mount.innerHTML = inner;
}

// ── Set up navbar: show user name + logout button ────────────
// this will fill in your name in the navbar and wire up the sign-out button
export function setupNav() {
  const logoutBtn  = document.getElementById("btn-logout");
  const navUserEl  = document.getElementById("nav-user");

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    // Show logout button
    if (logoutBtn) {
      logoutBtn.style.display = "inline-block";
      logoutBtn.onclick = async () => {
        await signOut(auth);
        window.location.href = "/login.html";
      };
    }

    // Show user name
    if (navUserEl) {
      const snap = await getDoc(doc(db, "users", user.uid));
      if (snap.exists()) {
        navUserEl.textContent = "Hi, " + snap.data().name;
      }
    }
  });
}

// ── Open / close modal ────────────────────────────────────────
// this will open a popup window by its id
export function openModal(id)  { document.getElementById(id).classList.add("open"); }
// this will close a popup window by its id
export function closeModal(id) { document.getElementById(id).classList.remove("open"); }

// ── Show loading spinner inside an element ────────────────────
// this will replace an element's content with a loading spinner
export function showLoading(el) {
  el.innerHTML = '<div class="spinner"></div>';
}

// ── Show empty state ──────────────────────────────────────────
// this will show an "empty" message when there is nothing to display
export function showEmpty(el, msg) {
  el.innerHTML = `<div class="empty"><span class="ico">📭</span>${msg}</div>`;
}

// ═══════════════════════════════════════════════════════════════
//  FORM VALIDATION HELPERS
// ═══════════════════════════════════════════════════════════════

// Is this a sensibly-formatted email address?
// this will check if a string looks like a real email address
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
}

// Show a red message + red border under/around a field.
// Returns false so callers can do:  if (!val) return fieldError(el, "…");
// this will show a red error message under an input field
export function fieldError(inputEl, msg) {
  if (!inputEl) return false;
  inputEl.classList.add("input-invalid");
  let hint = inputEl.parentElement.querySelector(".field-err");
  if (!hint) {
    hint = document.createElement("div");
    hint.className = "field-err";
    inputEl.parentElement.appendChild(hint);
  }
  hint.textContent = msg;
  hint.style.display = "block";
  return false;
}

// Clear the error state on a single field.
// this will remove the red error from one input field
export function clearFieldError(inputEl) {
  if (!inputEl) return;
  inputEl.classList.remove("input-invalid");
  const hint = inputEl.parentElement.querySelector(".field-err");
  if (hint) hint.style.display = "none";
}

// Clear every field error inside a container (or the whole document).
// this will remove every red error message inside an area
export function clearAllErrors(root = document) {
  root.querySelectorAll(".input-invalid").forEach(el => el.classList.remove("input-invalid"));
  root.querySelectorAll(".field-err").forEach(el => (el.style.display = "none"));
}

// Wire up live clearing: as soon as the user edits a field, drop its error.
// Pass the input elements you want to auto-clear.
// this will automatically remove an input's error the moment the user starts typing
export function autoClear(...inputs) {
  inputs.forEach(el => {
    if (!el) return;
    const ev = el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(ev, () => clearFieldError(el));
  });
}

// ═══════════════════════════════════════════════════════════════
//  PAGINATION HELPERS  (10 items per page across all lists)
// ═══════════════════════════════════════════════════════════════
export const PER_PAGE = 10;

// Return just the slice of `arr` for the given 1-based page.
// this will pick just the items belonging to one page of a paged list
export function pageSlice(arr, page, perPage = PER_PAGE) {
  const start = (page - 1) * perPage;
  return arr.slice(start, start + perPage);
}

// Draw Prev / numbered / Next buttons into `container`. Calls onChange(newPage)
// when a different page is clicked. Hides itself when there's only one page.
// this will draw the Prev / 1 2 3 / Next page buttons
export function renderPager(container, total, page, onChange, perPage = PER_PAGE) {
  if (!container) return;
  const pages = Math.ceil(total / perPage);
  if (pages <= 1) { container.innerHTML = ""; return; }

  // Window of page numbers around the current page (keeps the bar compact)
  const nums = [];
  const from = Math.max(1, page - 2);
  const to   = Math.min(pages, page + 2);
  if (from > 1)      nums.push(1, from > 2 ? "…" : null);
  for (let i = from; i <= to; i++) nums.push(i);
  if (to < pages)    nums.push(to < pages - 1 ? "…" : null, pages);

  let html = `<button class="pg-btn" data-pg="${page - 1}" ${page <= 1 ? "disabled" : ""}>‹ Prev</button>`;
  nums.filter(n => n !== null).forEach(n => {
    html += n === "…"
      ? `<span class="pg-gap">…</span>`
      : `<button class="pg-btn ${n === page ? "active" : ""}" data-pg="${n}">${n}</button>`;
  });
  html += `<button class="pg-btn" data-pg="${page + 1}" ${page >= pages ? "disabled" : ""}>Next ›</button>`;
  container.innerHTML = html;

  container.querySelectorAll(".pg-btn").forEach(b => {
    b.onclick = () => {
      const p = parseInt(b.dataset.pg, 10);
      if (p >= 1 && p <= pages && p !== page) onChange(p);
    };
  });
}
