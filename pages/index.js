import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";
import { askPermits } from "../services/firebase-permits";
import { getToken, getMessaging, onMessage } from "firebase/messaging";

export default function Home() {
  const [showNotificationButton, setShowNotificationButton] = useState(false);
  const [token, setToken] = useState(null);

  async function activateNotifications() {
    try {
      const token = await askPermits();
      if (!token) return;
      console.log("COPY PASTE TOKEN IN FIREBASE CLOUD MESSAGE: ", token);
      setToken(token);
      //* save user subscription token in db
      await fetch("/api/subscriptions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });
    } catch (err) {
      console.error(err);
    }
  }

  async function receiveNotification() {
    //* send custom message from server to user
    await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    });
  }

  useEffect(() => {
    //* Escuchar posibles mensajes puede hacerse desde cualquier lugar
    //* este metodo escucha solo las notificaciones cuando la ventana está en primer plano
    if ("serviceWorker" in navigator) {
      const messaging = getMessaging();
      onMessage(messaging, (payload) => {
        console.log("Message received. ", payload);
      });
      setShowNotificationButton(true);
    }
  }, []);

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <h1>HOLA LOKO</h1>
        {showNotificationButton && (
          <button onClick={activateNotifications}>
            Activate Notifications
          </button>
        )}
        <br />
        {token && (
          <button onClick={receiveNotification}>Receive Notification</button>
        )}
      </main>
    </div>
  );
}
