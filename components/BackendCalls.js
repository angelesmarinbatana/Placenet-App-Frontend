import { db, auth } from "../firebaseConfig";
 import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
 } from "firebase/firestore";


 export async function add_property(street, city, state, zip){
    const userId = auth.currentUser?.uid;
    if (!userId) {
        Alert.alert("Error!", "User not authenticated.");
        return;
    }

    const newProperty = await addDoc(collection(db, `users/${userId}/properties`), {
        street,
        city,
        state,
        zip,
    });

    return newProperty;
 }


 export async function update_property(street, city, state, zip, id){
    const userId = auth.currentUser?.uid;
    if (!userId) {
        Alert.alert("Error!", "User not authenticated.");
        return;
    }

    const propertyRef = doc(db, `users/${userId}/properties`, id);
    await updateDoc(propertyRef, { street, city, state, zip });
 }