
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "suraksha-jal-2-0",
  appId: "1:389862731723:web:0b7f8c5b0c473133f30965",
  storageBucket: "suraksha-jal-2-0.appspot.com",
  apiKey: "your_firebase_api_key_here",
  authDomain: "suraksha-jal-2-0.firebaseapp.com",
  messagingSenderId: "389862731723",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
