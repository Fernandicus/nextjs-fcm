import { initializeApp } from "firebase/app";
import { getToken, getMessaging, onMessage } from "firebase/messaging";
import firebaseConfig from "./firebase-config";

const app = initializeApp(firebaseConfig);

//* Generated from firebase > configuracion proyecto > cloud messaging > certificados push web > generate new
const publicVapidKey = process.env.PUBLIC_VAPID_KEY;

//! IMPORTANT: The file firebase-messaging-sw.js must be empty
export const askPermits = async () => {
  const permission = await Notification.requestPermission();

  if (permission === "denied") {
    console.log("Permission denied");
    return;
  } else {
    try {
      const messaging = getMessaging(app);
      const token = await getToken(messaging, { vapidKey: publicVapidKey });
      
      if (token) {
        return token;
      } else {
        console.log("No registration token available. Request permissions");
      }
      return;
    } catch (error) {
      console.error(error);
    }
  }
};
