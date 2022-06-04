//! Use importScripts('..') instead of using 'import .. from ..' , import .. from is not available from service workers '
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

firebase.initializeApp({
  apiKey: "AIzaSyB-DWVmONlD4kTc92lenN7XeoTTsuv7IKg",
  authDomain: "fir-cloud-messaging-3fd3a.firebaseapp.com",
  projectId: "fir-cloud-messaging-3fd3a",
  storageBucket: "fir-cloud-messaging-3fd3a.appspot.com",
  messagingSenderId: "948741768361",
  appId: "1:948741768361:web:37a4cff14da9592e2595b8",
  measurementId: "G-HCYNE9SW5R",
});

const messaging = firebase.messaging();

//* This method handles background messages
messaging.onBackgroundMessage((payload) => {
  console.log("firebase-messaging-sw received notification", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
