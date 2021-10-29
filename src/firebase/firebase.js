import { initializeApp } from "firebase/app";
import { getFirestore } from 'firebase/firestore';


export const app = initializeApp({
  apiKey: "AIzaSyC8h3vZz5-PPrZx5_t6xJV1cA_1PWZ_RAg",
  authDomain: "inkindable.firebaseapp.com",
  projectId: "inkindable",
  storageBucket: "inkindable.appspot.com",
  messagingSenderId: "497991149121",
  appId: "1:497991149121:web:353c8f306319f76e8308c0",
  measurementId: "G-D2326GKV73"
});

export default getFirestore(app); 