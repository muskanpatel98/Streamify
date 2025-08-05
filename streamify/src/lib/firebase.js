// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDousdZw1zLTT1BILTjmFBF93TURksLTzw",
  authDomain: "streamify-b42ab.firebaseapp.com",
  projectId: "streamify-b42ab",
  storageBucket: "streamify-b42ab.firebasestorage.app",
  messagingSenderId: "377278507281",
  appId: "1:377278507281:web:23af0289ed0bb5f0ecc4b0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export {auth,provider}