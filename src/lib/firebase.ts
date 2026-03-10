import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  projectId: "chat-ai-auth-app-9922",
  appId: "1:261097668711:web:4d7ba31494ba9e364754c2",
  storageBucket: "chat-ai-auth-app-9922.firebasestorage.app",
  apiKey: "AIzaSyA8gaflfsBWg87qWCrODiN8Lt0Q7Gc5CBM",
  authDomain: "chat-ai-auth-app-9922.firebaseapp.com",
  messagingSenderId: "261097668711"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
