# Start the Website & Switch Firebase Account

## 1. Start the website

**Prerequisite:** Node.js installed (`node --version` to check).

1. Open **PowerShell** in the project folder:
   ```powershell
   cd "c:\Users\Shadha.albadi\Downloads\alestekama_school_v\alestekama_school_v\school2"
   ```
2. Start the server:
   ```powershell
   npm start
   ```
3. Open <http://localhost:8000> in your browser.
4. Stop the server with **Ctrl + C**.

> Always use the `http://localhost:8000` URL. Do not open `.html` files by double-clicking.

---

## 2. Switch to a different Firebase account / project

The site talks to Firebase through **one file**: `firebase.js`. You only edit that file.

### Step 1 — Create a new Firebase project
Sign in at <https://console.firebase.google.com> with the new Google account → **Add project** → give it a name → **Create**.

### Step 2 — Enable Email/Password sign-in
**Build → Authentication → Get started → Sign-in method → Email/Password → Enable → Save.**

### Step 3 — Create the Firestore database
**Build → Firestore Database → Create database** → pick a location → **Start in test mode** → **Enable**.

### Step 4 — Apply security rules
In Firestore → **Rules** tab → paste the contents of `firestore.rules` → **Publish**.

### Step 5 — Get the new web config
**Gear icon → Project settings → Your apps → `</>` (Web)** → register an app → copy the `firebaseConfig` object.

### Step 6 — Paste it into `firebase.js`
Open `firebase.js` and replace **only** the `firebaseConfig` object:

```js
const firebaseConfig = {
  apiKey:            "PASTE_NEW_VALUE",
  authDomain:        "PASTE_NEW_VALUE",
  projectId:         "PASTE_NEW_VALUE",
  storageBucket:     "PASTE_NEW_VALUE",
  messagingSenderId: "PASTE_NEW_VALUE",
  appId:             "PASTE_NEW_VALUE"
};
```

Do **not** touch the `import` or `export` lines.

### Step 7 — Restart and create the admin
1. Stop the server (**Ctrl + C**) and run `npm start` again.
2. Open the site and **Register** a new account (old accounts live in the old project).
3. In Firebase Console → **Firestore → `users`** → open your new user → change `role` from `"user"` to `"admin"`.
4. Log out and log in again → you'll land on the admin panel.

### Step 8 — Add your data
The new project starts empty. Sign in as admin and use the admin pages to add content:
- `http://localhost:8000/admin/departments.html`
- `http://localhost:8000/admin/teachers.html`
