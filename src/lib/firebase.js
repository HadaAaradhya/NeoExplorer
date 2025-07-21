import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA38SRlGMsCQ20_7XhmDYea1j5ZF_h2Ysc",
  authDomain: "neoexplore10.firebaseapp.com",
  projectId: "neoexplore10",
  storageBucket: "neoexplore10.firebasestorage.app",
  messagingSenderId: "448879745786",
  appId: "1:448879745786:web:ff3329480763c4e8690743",
  measurementId: "G-RSLWH3JRW3"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app); 