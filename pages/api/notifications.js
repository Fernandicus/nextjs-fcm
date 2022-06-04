// npm i firebase-admin to manage my proyect firebase account from my server
import { applicationDefault, initializeApp, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

// If app is not initialized..
if (!getApps().length) {
  // To make applicationDefault() work:
  // 1. Go to Firebase > Configuracion Proyecto > Cuentas de servicio > Generar nueva clave privada > Descargar archivo JSON con las claves
  // 2. Guardar el archivo JSON en el proyecto y añadir ruta completa a la variable de entorno GOOGLE_APPLICATION_CREDENTIALS
  // 3. Añadir archivo JSON al .gitignore
  initializeApp({
    credential: applicationDefault(),
  });
}

//* Use user token to send push notifications
export default async function handler(req, res) {
  const { token } = req.body;
  if (token) {
    if (typeof token !== "array") {
      sendDataToOneUser(token);
    } else {
      sendDataToMultipleUsers([token]);
    }
  }
  res.end();
}

async function sendDataToMultipleUsers(tokensArray) {
  const notification = message({ tokens: tokensArray });

  //*Enviar mensaje a un Multiples Usuarios (multiples tokens)
  getMessaging()
    .sendMulticast(notification)
    .then((response) => {
      console.log(response.successCount + " messages were sent successfully");
    });
}

async function sendDataToOneUser(token) {
  const notification = message({ tokens: token });

  //*Enviar mensaje a un usuario (un token)
  getMessaging()
    .send(notification)
    .then((response) => {
      // Response is a message ID string.
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      console.log("Error sending message:");
      console.err(err);
    });
}

function message({ tokens }) {
  return {
    data: {
      title: "Partido champions",
      teams: "Real Madrid vs Liverpool",
      score: "3 : 1",
    },
    token: tokens,
  };
}
