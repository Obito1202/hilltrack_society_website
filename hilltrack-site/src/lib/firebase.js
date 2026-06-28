import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Replace these values with your Firebase project config.
// Steps:
//   1. Go to https://console.firebase.google.com/ → create a project
//   2. Add a Web app → copy the config snippet below
//   3. Authentication → Sign-in method → enable Google
//   4. Firestore Database → Create database (start in test mode)
//   5. Firestore → Rules → paste the rules from the comment at the bottom of this file
//
// For the admin panel, paste the same JSON config when prompted on the Books tab.
const firebaseConfig = {
  apiKey:            "AIzaSyA9YRFc0HsAoFF3I0WUfScD5l77t48RVrA",
  authDomain:        "books-eeb01.firebaseapp.com",
  projectId:         "books-eeb01",
  storageBucket:     "books-eeb01.firebasestorage.app",
  messagingSenderId: "251443035270",
  appId:             "1:251443035270:web:00fa26cedf43f9ccf12507",
};

export const FIREBASE_CONFIGURED = firebaseConfig.apiKey !== "REPLACE_WITH_YOUR_API_KEY";

let _auth, _db;
if (FIREBASE_CONFIGURED) {
  const app = initializeApp(firebaseConfig);
  _auth = getAuth(app);
  _db   = getFirestore(app);
}

export const auth = _auth;
export const db   = _db;

export const signInWithGoogle = () => signInWithPopup(_auth, new GoogleAuthProvider());
export const signOutUser      = () => signOut(_auth);

// ─── Recommended Firestore security rules ───────────────────────────────────
//
// rules_version = '2';
// service cloud.firestore {
//   match /databases/{database}/documents {
//     match /books/{classId} {
//       allow read: if true;
//       allow write: if request.auth != null;
//     }
//     match /bookRequests/{reqId} {
//       allow read:   if request.auth != null;
//       allow create: if request.auth != null;
//       allow update, delete: if request.auth != null;
//     }
//   }
// }
