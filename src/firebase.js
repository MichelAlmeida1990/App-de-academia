// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDe7q4XoVVuFunjN7OyGyO2Seb0-ClmvN4",
  authDomain: "app-de-academia-95568.firebaseapp.com",
  projectId: "app-de-academia-95568",
  storageBucket: "app-de-academia-95568.appspot.com",
  messagingSenderId: "1013957865850",
  appId: "1:1013957865850:web:d219b4eeba422bcf6a26c3",
  measurementId: "G-8FWQMCFK8R"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Initialize Google Analytics 
const analytics = getAnalytics(app);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Exportar serviços
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export { auth, analytics };

export default app;
