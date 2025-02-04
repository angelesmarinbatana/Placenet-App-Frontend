import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
  onAuthStateChanged
} from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
const firebaseConfig = {
   apiKey: "AIzaSyBna45W_H693X66Ln4PDYeM7R2r5D7N3Aw",
   authDomain: "placenet-94dd7.firebaseapp.com",
   projectId: "placenet-94dd7",
   storageBucket: "placenet-94dd7.firebasestorage.app",
   messagingSenderId: "898606453149",
   appId: "1:898606453149:web:96815b04cc551ae07f5f74",
   measurementId: "G-FSSQD3ZM41"
 };
 //init app
const app = initializeApp(firebaseConfig);
//persistance
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage)
  });
const db = getFirestore(app);
const storage = getStorage(app);
export { auth, db, storage, onAuthStateChanged };