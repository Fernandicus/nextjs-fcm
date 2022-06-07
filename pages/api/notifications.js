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
  const { token, link } = req.body;
  if (token && !link) {
    if (typeof token !== "array") {
      sendDataToOneUser(token);
    } else {
      sendDataToMultipleUsers([token]);
    }
  } else if (link) {
    sendNotificationWithLink();
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

//* If you want to send links to redirect the user to your app you must subribe them to a topic
//* and make a HTTP request
async function sendNotificationWithLink() {
  const accessToken = await applicationDefault().getAccessToken();
  const firebaseAccessToken = accessToken.access_token;

  await fetch(
    "https://fcm.googleapis.com//v1/projects/<PROJECT-ID>/messages:send",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${firebaseAccessToken}`,
      },
      body: JSON.stringify({
        message: {
          topic: "Topic-Name", //* First you must subscribe users to this topic
          notification: {
            title: "Title",
            body: `Content`,
          },
          webpush: {
            fcm_options: {
              link: `http://localhost:3000/something/more`, //* Link to your page
            },
          },
        },
      }),
    }
  )
    .then(async (resp) => {
      console.log("SENT :", resp.status);
      console.log(resp);
    })
    .catch(async (err) => {
      console.error("ERROR :", err.status);
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
