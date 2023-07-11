// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDgKhaIwjPMMN_Pxv9rVSLNfhfrwRaNlkM",
  authDomain: "attendance-14669.firebaseapp.com",
  projectId: "attendance-14669",
  storageBucket: "attendance-14669.appspot.com",
  messagingSenderId: "332574020347",
  appId: "1:332574020347:web:164aa235c7790b28cb565e",
  measurementId: "G-MF7Z7VLPRS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const  storage = getStorage(app);

export default app;