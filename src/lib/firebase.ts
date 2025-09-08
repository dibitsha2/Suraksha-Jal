
import { initializeApp, getApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  projectId: "suraksha-jal",
  appId: "1:806914489596:web:e91264c1a0e7f832b96b79",
  storageBucket: "suraksha-jal.firebasestorage.app",
  apiKey: "AIzaSyAjIJ44QqgP69VDx1oM6IMquyrNbQPSS8I",
  authDomain: "suraksha-jal.firebaseapp.com",
  messagingSenderId: "806914489596",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);

export { app, auth };
