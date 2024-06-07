// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDrokUdxWGXzaWj8iEGCcuz2ULEsEe0pw",
  authDomain: "authentication-3b8e2.firebaseapp.com",
  projectId: "authentication-3b8e2",
  storageBucket: "authentication-3b8e2.appspot.com",
  messagingSenderId: "241900102536",
  appId: "1:241900102536:web:6028eff94cb481282c503d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app)

export {auth}