// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Initialize the Firebase app in the service worker by passing the generated config
var firebaseConfig = {
    apiKey: "AIzaSyDgKhaIwjPMMN_Pxv9rVSLNfhfrwRaNlkM",
    authDomain: "attendance-14669.firebaseapp.com",
    projectId: "attendance-14669",
    storageBucket: "attendance-14669.appspot.com",
    messagingSenderId: "332574020347",
    appId: "1:332574020347:web:164aa235c7790b28cb565e",
};

firebase.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
    console.log('Received background message ', payload);

    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});
