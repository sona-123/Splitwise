import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
    apiKey: "AIzaSyAmmC_eDwvi6MFguQS6NwzgkOM5WOYWEp0",
    authDomain: "splitwise-3c5f0.firebaseapp.com",
    projectId: "splitwise-3c5f0",
    storageBucket: "splitwise-3c5f0.appspot.com",
    messagingSenderId: "494525773098",
    appId: "1:494525773098:web:a99dcb69b8e13cd80e1a53",
    measurementId: "G-HZYFW7GG12"
  };
//connect firebase app to our application
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);
const storage = getStorage(app);
const auth=getAuth(app);
const db=getFirestore(app);
export { app, firestore, storage ,auth,db};