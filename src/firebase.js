// Import the functions you need from the SDKs you need


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getMessaging } from "firebase/messaging";
import { getMessaging, getToken,onMessage } from "firebase/messaging";
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
export const storage = getStorage(app);
export const messaging = getMessaging(app);
// getToken(messaging, { vapidKey: "BMfyLyEdq0zmorHvgcfhrsT4iZCPjxLD0g2yUoS3smY2kXdxmeA2vR1rHqb86SxvDya7W8MGRRKJ3EdMpk6jED85" });

export const getFirebaseToken = (setTokenFound) => {
  return getToken(messaging, {vapidKey: 'BMfyLyEdq0zmorHvgcfhrsT4iZCPjxLD0g2yUoS3smY2kXdxmeA2vR1rHqb86SxvDya7W8MGRRKJ3EdMpk6jED85'}).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}


export default app