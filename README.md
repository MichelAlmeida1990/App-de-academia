# 💪 App de Academia

Um aplicativo web moderno para gerenciamento de treinos e perfil de usuário, desenvolvido com React e Firebase.

![Status](https://img.shields.io/badge/status-ativo-brightgreen)
![Version](https://img.shields.io/badge/version-1.0.0-blue)
![React](https://img.shields.io/badge/React-18.2.0-61dafb)
![Firebase](https://img.shields.io/badge/Firebase-11.8.1-ffca28)

## 🌟 Funcionalidades

### 🔐 Autenticação
- **Login/Registro** com Firebase Authentication
- **Recuperação de senha** via email
- **Perfil persistente** entre sessões
- **Logout seguro** com limpeza de dados sensíveis

### 👤 Gerenciamento de Perfil
- **Edição completa** de informações pessoais
- **Upload de foto** com compressão automática (400x400px)
- **Persistência de dados** no localStorage
- **Validação de campos** em tempo real
- **Interface unificada** na página de estatísticas

### 📊 Estatísticas e Métricas
- **Página centralizada** com abas navegáveis
- **Gráficos interativos** com Chart.js e Recharts
- **Dados de progresso** do usuário
- **Interface responsiva** e moderna

### 🏋️ Sistema de Exercícios
- **Catálogo completo** de exercícios
- **Categorização por grupos** musculares
- **Instruções detalhadas** para cada exercício
- **Interface intuitiva** e responsiva

### 🎨 Interface Moderna
- **Design glassmorphism** com Material-UI
- **Animações suaves** com Framer Motion
- **Estados de loading** e feedback visual
- **Tema escuro/claro** responsivo
- **Mobile-first** design

## 🛠️ Tecnologias Utilizadas

### **Frontend Core**
- **React 18.2.0** - Biblioteca principal
- **React DOM 18.2.0** - Renderização
- **React Router DOM 7.6.0** - Roteamento SPA
- **React Scripts 5.0.1** - Build e desenvolvimento

### **Interface & Estilo**
- **Material-UI 7.1.0** - Componentes de interface
  - @mui/material - Componentes base
  - @mui/icons-material - Ícones
  - @mui/lab - Componentes experimentais
- **React Icons 5.5.0** - Biblioteca de ícones adicional
- **Framer Motion 12.12.2** - Animações avançadas

### **Formulários & Validação**
- **React Hook Form 7.56.4** - Gerenciamento de formulários
- **Yup 1.6.1** - Validação de schemas
- **@hookform/resolvers 5.0.1** - Integração Yup + RHF

### **Backend & Dados**
- **Firebase 11.8.1** - Backend como serviço
  - Authentication - Autenticação de usuários
  - Firestore - Banco de dados NoSQL
  - Storage - Armazenamento de arquivos
- **Axios 1.9.0** - Cliente HTTP

### **Gráficos & Visualização**
- **Chart.js 4.4.9** - Biblioteca de gráficos
- **React ChartJS 2 5.3.0** - Wrapper React para Chart.js
- **Recharts 2.15.3** - Gráficos responsivos

### **Utilitários**
- **Date-fns 4.1.0** - Manipulação de datas
- **UUID 11.1.0** - Geração de IDs únicos
- **@emailjs/browser 4.4.1** - Envio de emails
- **@giphy/js-fetch-api 5.6.0** - Integração com Giphy API

## 🚀 Instalação e Configuração

### **Pré-requisitos**
- Node.js 16+ instalado
- npm ou yarn
- Conta no Firebase

### **1. Clone o Repositório**
```bash
git clone https://github.com/seu-usuario/app-de-academia.git
cd app-de-academia
```

### **2. Instale as Dependências**
```bash
npm install
# ou
yarn install
```

### **3. Configuração do Firebase**

1. **Acesse o Firebase Console:**
   ```
   https://console.firebase.google.com
   ```

2. **Crie um novo projeto** ou selecione o existente

3. **Adicione um Web App:**
   - Clique na engrenagem ⚙️ → "Configurações do projeto"
   - Role até "Seus apps" → "Adicionar app" → Web 🌐
   - Nome: "App Academia Web"

4. **Ative os serviços necessários:**
   - **Authentication:** Email/senha
   - **Firestore:** Base de dados
   - **Storage:** Upload de arquivos

### **4. Variáveis de Ambiente**

Crie um arquivo `.env` na raiz do projeto:
```env
REACT_APP_FIREBASE_API_KEY=sua_api_key_aqui
REACT_APP_FIREBASE_AUTH_DOMAIN=seu_projeto.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=seu_projeto_id
REACT_APP_FIREBASE_STORAGE_BUCKET=seu_projeto.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abcdef123456
REACT_APP_FIREBASE_MEASUREMENT_ID=G-ABCDEF123
```

### **5. Execute o Projeto**
```bash
npm start
# ou
yarn start
```

Acesse: [http://localhost:3000](http://localhost:3000)

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── layout/         # Header, Footer, Sidebar
│   ├── common/         # Componentes genéricos
│   └── forms/          # Formulários específicos
├── pages/              # Páginas da aplicação
│   ├── auth/          # Login, Register, ForgotPassword
│   ├── dashboard/     # Dashboard principal
│   ├── profile/       # Gerenciamento de perfil
│   ├── exercises/     # Catálogo de exercícios
│   └── stats/         # Estatísticas e métricas
├── context/           # Contextos React (AuthContext)
├── services/          # Serviços de API e Firebase
│   ├── firebase.js   # Configuração Firebase
│   ├── UserDataService.js  # Gerenciamento de dados
│   └── ExerciseService.js  # Serviços de exercícios
├── utils/             # Utilitários e helpers
├── styles/            # Estilos globais e temas
└── App.js            # Componente principal
```

## 🎯 Scripts Disponíveis

```bash
# Desenvolvimento
npm start              # Inicia servidor de desenvolvimento

# Build
npm run build         # Cria build de produção

# Testes
npm test              # Executa testes

# Ejetar configuração (cuidado!)
npm run eject         # Ejeta configuração do React Scripts
```

## 🔒 Segurança

- **Variáveis de ambiente** protegidas
- **Credenciais Firebase** não expostas
- **Validação de formulários** client-side e server-side
- **Autenticação segura** com Firebase Auth
- **Sanitização de dados** de entrada

## 📱 Responsividade

O projeto foi desenvolvido com abordagem **mobile-first**:
- ✅ **Smartphones** (320px+)
- ✅ **Tablets** (768px+)
- ✅ **Desktop** (1024px+)
- ✅ **Ultra-wide** (1440px+)

## 🎨 Design System

### **Cores Principais**
- **Primary:** #2196F3 (Azul Material)
- **Secondary:** #FF5722 (Laranja)
- **Success:** #4CAF50 (Verde)
- **Warning:** #FF9800 (Âmbar)
- **Error:** #F44336 (Vermelho)

### **Tipografia**
- **Fonte:** Roboto (Google Fonts)
- **Tamanhos:** 12px, 14px, 16px, 18px, 24px, 32px

### **Espaçamento**
- **Base:** 8px
- **Padrão:** 8px, 16px, 24px, 32px, 48px

## 🚀 Deploy

### **Vercel (Recomendado)**
```bash
npm install -g vercel
vercel --prod
```

### **Netlify**
```bash
npm run build
# Upload da pasta build/ para Netlify
```

### **Firebase Hosting**
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

## 🤝 Contribuição

1. **Fork** o projeto
2. **Crie** uma branch para sua feature (`git checkout -b feature/MinhaFeature`)
3. **Commit** suas mudanças (`git commit -m 'Add: MinhaFeature'`)
4. **Push** para a branch (`git push origin feature/MinhaFeature`)
5. **Abra** um Pull Request

### **Padrões de Commit**
- `feat:` Nova funcionalidade
- `fix:` Correção de bug
- `docs:` Documentação
- `style:` Formatação
- `refactor:` Refatoração
- `test:` Testes
- `chore:` Tarefas de build

## 📄 Licença

Este projeto está sob a licença **MIT**. Veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👨‍💻 Autor

**Seu Nome**
- GitHub: [@seu-usuario](https://github.com/seu-usuario)
- LinkedIn: [Seu Nome](https://linkedin.com/in/seu-nome)
- Email: seu.email@exemplo.com

## 🙏 Agradecimentos

- **Material-UI** pela excelente biblioteca de componentes
- **Firebase** pela infraestrutura robusta
- **React Community** pelo ecossistema incrível
- **Framer Motion** pelas animações fluidas

---

**Desenvolvido com ❤️ para a comunidade fitness** 🏋️‍♀️

⭐ **Se este projeto te ajudou, deixe uma estrela!**
