// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

// Configuração do Firebase usando variáveis de ambiente
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

// Validação das variáveis de ambiente em desenvolvimento
if (process.env.NODE_ENV === 'development') {
  const requiredEnvVars = [
    'REACT_APP_FIREBASE_API_KEY',
    'REACT_APP_FIREBASE_AUTH_DOMAIN',
    'REACT_APP_FIREBASE_PROJECT_ID',
    'REACT_APP_FIREBASE_STORAGE_BUCKET',
    'REACT_APP_FIREBASE_MESSAGING_SENDER_ID',
    'REACT_APP_FIREBASE_APP_ID'
  ];

  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('🔥 Firebase Config Error: Missing environment variables:', missingVars);
    console.error('📋 Please check your .env file and ensure all Firebase variables are set.');
    console.error('📖 See .env.example for reference.');
  }
}

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Initialize Google Analytics (opcional)
let analytics;
try {
  analytics = getAnalytics(app);
} catch (error) {
  if (process.env.NODE_ENV === 'development') {
    console.warn('⚠️ Analytics não pôde ser inicializado:', error.message);
  }
}

// Initialize Firebase Authentication
const auth = getAuth(app);

// Exportar serviços
export const firestore = getFirestore(app);
export const storage = getStorage(app);
export { auth, analytics };

export default app;
