// ════════════════════════════════════════════════
//  STEP 1: Paste your Firebase config here
//  Get it from: Firebase Console → Project Settings → Your Apps → Web
// ════════════════════════════════════════════════
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getAuth }       from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyAq-RJ6rS2EJPr_qrIUMFggeaGPxmVejp0",
    authDomain: "estekama-school.firebaseapp.com",
    projectId: "estekama-school",
    storageBucket: "estekama-school.firebasestorage.app",
    messagingSenderId: "633652293771",
    appId: "1:633652293771:web:fb1fd4f0e84d66cbfea48e",
    measurementId: "G-G1GSLKWEXE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db   = getFirestore(app);
