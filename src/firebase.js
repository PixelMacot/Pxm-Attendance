// Import the functions you need from the SDKs you need


import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// import { getMessaging } from "firebase/messaging";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { requestForToken } from './firebase';
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
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
const message = "Successfully registered FCM"

 function subscribeToTopic(token, topic) {
          fetch(`https://iid.googleapis.com/iid/v1/${token}/rel/topics/${topic}`, {
            method: 'POST',
            headers: new Headers({
              Authorization: `key=${FCM_SERVER_KEY}`
            })
          })
            .then((response) => {
              if (response.status < 200 || response.status >= 400) {
                console.log(response.status, response);
              }
              console.log(`"${topic}" is subscribed`);
            })
            .catch((error) => {
              console.error(error.result);
            });
          return true;
        }

export const requestForToken = () => {
  return getToken(messaging, { vapidKey: 'BHkt4e3hDotxxN0riYplQp85Wf17AocPthBjfGZw6deUob_ZwnadUIC4D-IweqVgtgxsFgqC6u5sE9YqYQ-jWOs' })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        subscribeToTopic(currentToken, 'allUsers')
        return currentToken
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};



export const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });



export default app