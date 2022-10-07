import firebaseAdmin from "firebase-admin";
import { exit } from "process";

export const dbConfig = () => {
  try {
    firebaseAdmin.initializeApp({
      credential: firebaseAdmin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY
      })
    });
  } catch (error) {
    console.log(error);
    exit(1);
  }
}