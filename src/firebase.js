// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDe7q4XoVVuFunjN7OyGyO2Seb0-ClmvN4",
  authDomain: "app-de-academia-95568.firebaseapp.com",
  projectId: "app-de-academia-95568",
  storageBucket: "app-de-academia-95568.appspot.com", // Corrigi o formato
  messagingSenderId: "1050678744955",
  appId: "1:1050678744955:web:f2e8b2f3e6b2ec1c4f0c1e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

export default app;
