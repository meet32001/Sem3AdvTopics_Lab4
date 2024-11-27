import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAV4APAed1cgsKt-B_RABz4gQwqRD_EpLM",
  authDomain: "sem3advtopiclab4.firebaseapp.com",
  projectId: "sem3advtopiclab4",
  storageBucket: "sem3advtopiclab4.appspot.com",
  messagingSenderId: "687851412496",
  appId: "1:687851412496:web:2e44c5afd9667960f33e95",
  measurementId: "G-M0X3V7P4D1",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
