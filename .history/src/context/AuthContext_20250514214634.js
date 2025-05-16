// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDe7q4XoVVuFunjN7OyGyO2Seb0-ClmvN4",
  authDomain: "app-de-academia-95568.firebaseapp.com",
  projectId: "app-de-academia-95568",
  storageBucket: "app-de-academia-95568.appspot.com",
  messagingSenderId: "1050678744955",
  appId: "1:1050678744955:web:f2e8b2f3e6b2ec1c4f0c1e"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar serviços
export const auth = getAuth(app);
export const firestore = getFirestore(app);
export const storage = getStorage(app);

// Habilitar persistência offline para o Firestore
enableIndexedDbPersistence(firestore)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Persistência offline não pode ser habilitada porque múltiplas abas estão abertas');
    } else if (err.code === 'unimplemented') {
      console.warn('O navegador não suporta persistência offline');
    }
  });

export default app;
