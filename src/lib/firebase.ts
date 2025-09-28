
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

// This is a public configuration and is safe to be exposed in the client-side code.
// Your security is enforced by Firebase Security Rules, not by hiding these keys.
const firebaseConfig = {
  projectId: "suraksha-jal-2-0",
  appId: "1:389862731723:web:0b7f8c5b0c473133f30965",
  storageBucket: "suraksha-jal-2-0.appspot.com",
  // IMPORTANT: Replace this with your actual Firebase Web API Key
  apiKey: process.env.AIzaSyBpZyT72vkbRUCR4_WyKn30xx6DEsWFC6Y,
  authDomain: "suraksha-jal-2-0.firebaseapp.com",
  messagingSenderId: "389862731723",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
