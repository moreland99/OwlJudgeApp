// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCuRvtdXjWtZX0d4W_yQXnLcdVUyMV0nto",
  authDomain: "owljudge-7dafa.firebaseapp.com",
  databaseURL: "https://owljudge-7dafa-default-rtdb.firebaseio.com",
  projectId: "owljudge-7dafa",
  storageBucket: "owljudge-7dafa.appspot.com",
  messagingSenderId: "1095241567423",
  appId: "1:1095241567423:web:6d9080fae662437aad4a0a",
  measurementId: "G-FT7NEVYRBG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;