// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { getMessaging } from "firebase-admin/messaging";
import { initializeApp, getApps, applicationDefault } from "firebase-admin/app";

if (!getApps().length) {
  initializeApp({
    credential: applicationDefault(),
  });
}

export default function handler(req, res) {
  console.log("FROM SERVER", req.body);
  console.log("Add user token to the DB...");

  //* If you want to send links to redirect the user to your app you must subribe them to a topic
  //* you can add up to 1000 tokens in at the same time
  getMessaging()
    .subscribeToTopic([req.body.token], "Topic-Name")
    .then((response) => {
      console.log("Successfully subscribed to topic:", response);
    })
    .catch((error) => {
      console.log("Error subscribing to topic:", error);
    });

  res.status(200);
  res.end();
}
