import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "mock-key",
  authDomain: "beauty-admin.firebaseapp.com",
  projectId: "beauty-admin",
  storageBucket: "beauty-admin.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123:web:123",
};

// Initialize Firebase. This is a stub for future actual auth.
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
