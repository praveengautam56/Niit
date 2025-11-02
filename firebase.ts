import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';

const firebaseConfig = {
  apiKey: "AIzaSyDZAkRsZ7tZ2ubI0jAv5FEeEiebD_zSmdw",
  authDomain: "quiz-blackbox.firebaseapp.com",
  projectId: "quiz-blackbox",
  storageBucket: "quiz-blackbox.firebasestorage.app",
  messagingSenderId: "92851976831",
  appId: "1:92851976831:web:89a06e67becbbb68fbdd4a",
  measurementId: "G-KX8QS774C9"
};

const app = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const db = firebase.database();
