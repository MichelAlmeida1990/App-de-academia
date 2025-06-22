# 🔥 CORREÇÃO FIREBASE - API KEY INVÁLIDA

## ❌ **PROBLEMA IDENTIFICADO:**
A API key `AIzaSyBDaIT-Es_7xYIgCxrUQgOYlT3mXlzEjNI` não é válida ou é um exemplo.

## ✅ **SOLUÇÃO - PASSO A PASSO:**

### **1. ACESSE O FIREBASE CONSOLE:**
```
https://console.firebase.google.com
```

### **2. SELECIONE SEU PROJETO:**
- Clique em **"app-academia-9aa30"**
- Se não existir, crie um novo projeto

### **3. CONFIGURAR WEB APP:**
1. Clique no ícone **engrenagem** ⚙️ → **"Configurações do projeto"**
2. Role até **"Seus apps"** 
3. Se não tem app web, clique **"Adicionar app"** → **Web** 🌐
4. Nome: **"App Academia Web"**
5. Clique **"Registrar app"**

### **4. COPIAR CONFIGURAÇÕES:**
Você verá algo assim:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC...", // ← SUA CHAVE REAL
  authDomain: "app-academia-9aa30.firebaseapp.com",
  projectId: "app-academia-9aa30",
  storageBucket: "app-academia-9aa30.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123",
  measurementId: "G-ABC123" // ← OPCIONAL
};
```

### **5. ATUALIZAR SEU ARQUIVO .env:**
```
REACT_APP_FIREBASE_API_KEY=AIzaSyC... (SUA CHAVE REAL)
REACT_APP_FIREBASE_AUTH_DOMAIN=app-academia-9aa30.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=app-academia-9aa30
REACT_APP_FIREBASE_STORAGE_BUCKET=app-academia-9aa30.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789 (SEU NÚMERO REAL)
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123 (SEU ID REAL)
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABC123 (OPCIONAL)
```

### **6. ATIVAR AUTHENTICATION:**
1. No Firebase Console → **"Authentication"**
2. Clique **"Começar"**
3. Aba **"Sign-in method"**
4. Clique **"Email/senha"** → **"Ativar"** → **"Salvar"**

### **7. REINICIAR SERVIDOR:**
```bash
# Pare o servidor (Ctrl+C)
npm start
```

---

## 🚀 **TESTE RÁPIDO:**
Após configurar, teste em: `http://localhost:3000/forgot-password`

---

## ⚡ **ALTERNATIVA RÁPIDA (TESTE):**
Se quiser testar rapidamente, posso criar uma configuração temporária com Firebase público de demonstração. 