// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDe7q4XoVVuFunjN7OyGyO2Seb0-ClmvN4",
  authDomain: "app-de-academia-95568.firebaseapp.com",
  projectId: "app-de-academia-95568",
  storageBucket: "app-de-academia-95568.firebasestorage.app",
  messagingSenderId: "1013957865850",
  appId: "1:1013957865850:web:d219b4eeba422bcf6a26c3",
  measurementId: "G-8FWQMCFK8R"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa serviços
const analytics = getAnalytics(app);
const auth = getAuth(app);
const firestore = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, firestore, storage };
