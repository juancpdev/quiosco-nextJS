// Importar solo lo necesario
import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAimy6K-AGRCnzbYJRq9TdAgEEagsrr46k",
  authDomain: "quisco-next.firebaseapp.com",
  projectId: "quisco-next",
  storageBucket: "quisco-next.firebasestorage.app",
  messagingSenderId: "606658449487",
  appId: "1:606658449487:web:6e648f63dc9cb7c6c65a3a",
  measurementId: "G-HMM5E678L3",
};

// Inicializamos la app de Firebase
const app = initializeApp(firebaseConfig);

// Inicializamos Authentication
const auth = getAuth(app);

// Exportamos lo necesario para el componente
export { auth, RecaptchaVerifier, signInWithPhoneNumber };