# Al-Estekama School Website

## What each file does

| File | Purpose |
|---|---|
| `firebase.js` | Firebase setup — **edit this first** |
| `helpers.js` | Shared functions (login guard, toast, etc.) |
| `style.css` | All styles for every page |
| `index.html` | Home page |
| `about.html` | About the school |
| `register.html` | Sign up |
| `login.html` | Sign in |
| `departments.html` | View departments (login required) |
| `teachers.html` | View teachers with filter (login required) |
| `contact.html` | Contact form (login required) |
| `admin/index.html` | Admin dashboard |
| `admin/departments.html` | Add / edit / delete departments |
| `admin/teachers.html` | Add / edit / delete teachers + photo upload |
| `admin/messages.html` | Read contact messages |
| `firestore.rules` | Database security rules |

---

## Firestore collections

| Collection | What's stored |
|---|---|
| `users` | name, email, role ("user" or "admin") |
| `departments` | name, description |
| `teachers` | name, subject, departmentId, bio, photoURL |
| `contact_messages` | userId, name, email, message, sentAt |
