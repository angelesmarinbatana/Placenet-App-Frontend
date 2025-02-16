import { signOut } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
 import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
 } from "firebase/firestore";


 //property methods
 export async function add_property(street, city, state, zip){      //add
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


 export async function update_property(street, city, state, zip, id){     //update
    const userId = auth.currentUser?.uid;
    if (!userId) {
        Alert.alert("Error!", "User not authenticated.");
        return;
    }

    const propertyRef = doc(db, `users/${userId}/properties`, id);
    await updateDoc(propertyRef, { street, city, state, zip });
 }


 export async function delete_property(id) {    //delete
    const userId = auth.currentUser?.uid;
    if (!userId) {
        Alert.alert("Error!", "User not authenticated.");
        return;
    }
     
    await deleteDoc(doc(db, `users/${userId}/properties`, id));
 }


 export async function fetch_properties() {    //fetch
    try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
            Alert.alert("Error!", "User not authenticated.");
            return [];
        }

        const propertiesSnapshot = await getDocs(collection(db, `users/${userId}/properties`));
        
        if (propertiesSnapshot.empty) {
            console.log("No properties found.");
            return [];
        }

        const propertyList = propertiesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
        }));

        console.log("Fetched properties:", propertyList);
        return propertyList;
    } catch (error) {
        console.error("Error fetching properties:", error);
        return [];
    }
}


 //project methods

 export async function fetch_projects(propertyId){   //fetch
    const userId = auth.currentUser?.uid;
    if (!userId) return;


    const projectsRef = collection(db, `users/${userId}/properties/${propertyId}/projects`);
    const querySnapshot = await getDocs(projectsRef);
    const projectList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    return projectList;
 }

 export async function add_project(propertyId, projectName, projectDescription, completionDate){ //add
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const projectsRef = collection(db, `users/${userId}/properties/${propertyId}/projects`);

    const newProject = await addDoc(projectsRef, {
        name: projectName,
        description: projectDescription,
        completionDate: completionDate.toISOString(),
    });

    return newProject
}

export async function update_project(propertyId, projectId, projectName, projectDescription, completionDate){   //update
    const userId = auth.currentUser?.uid;
    const projectRef = doc(db, `users/${userId}/properties/${propertyId}/projects`, projectId);
    
    await updateDoc(projectRef, {
        name: projectName,
        description: projectDescription,
        completionDate: completionDate.toISOString(),
    });
}

export async function delete_project(propertyId, id){     //delete
    const userId = auth.currentUser?.uid;   
    const projectRef = doc(db, `users/${userId}/properties/${propertyId}/projects`, id);
    
    await deleteDoc(projectRef);
}


//documents

