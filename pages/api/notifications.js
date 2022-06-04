// Go to Firebase > Configuracion Proyecto > Cuentas de servicio > Generar nueva clave privada > Descargar archivo JSON con las claves
// guardar en el proyecto y añadir a .gitignore y añadir ruta completa escritorio/projekts/etc.. a la variable GOOGLE_APPLICATION_CREDENTIALS
import { applicationDefault, initializeApp, getApps } from "firebase-admin/app";
import { getMessaging } from "firebase-admin/messaging";

//if app is not initialized..
if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

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
