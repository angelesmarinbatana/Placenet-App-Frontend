import {
  SafeAreaProvider,
  SafeAreaView
 } from 'react-native-safe-area-context';
 import {
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator
 } from 'react-native';
 import React, {
  useEffect,
  useState
 } from "react";
 import { db, auth } from "../firebaseConfig";
 import { collection, getDocs } from "firebase/firestore";
 import styles from "../styles/property_summaryStyle";
 
 
 export default function PropertySummaryPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
 
 
  useEffect(() => {
    async function fetchUserProperties() {
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) {
          setErrorMessage("User not authenticated. Please log in.");
          setLoading(false);
          return;
        }
 
 
        //fetch prop for auth user
        const propertiesSnapshot = await getDocs(collection(db, `users/${userId}/properties`));
 
 
        const propertyList = await Promise.all(
          propertiesSnapshot.docs.map(async (propertyDoc) => {
            const propertyData = propertyDoc.data();
 
 
            //fetch proj under prop
            const projectsSnapshot = await getDocs(collection(db, `users/${userId}/properties/${propertyDoc.id}/projects`));
 
 
            const projects = await Promise.all(
              projectsSnapshot.docs.map(async (projectDoc) => {
                const projectData = projectDoc.data();
 
 
                //fetch doc under proj
                const documentsSnapshot = await getDocs(collection(db, `users/${userId}/properties/${propertyDoc.id}/projects/${projectDoc.id}/documents`));
 
 
                const documents = documentsSnapshot.docs.map(doc => ({
                  id: doc.id,
                  ...doc.data(),
                }));
 
 
                return { id: projectDoc.id, ...projectData, documents };
              })
            );
 
 
            return { id: propertyDoc.id, ...propertyData, projects };
          })
        );
 
 
        console.log("Final Properties List:", propertyList);
        setProperties(propertyList);
      } catch (error) {
        console.error("Error fetching properties:", error);
        setErrorMessage("Failed to load property summaries.");
      } finally {
        setLoading(false);
      }
    }
 
 
    fetchUserProperties();
  }, []);
 
 
  const renderProperty = ({ item }) => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyName}>{item.street || "Unnamed Property"}</Text>
 
 
      <Text style={styles.sectionTitle}>Projects:</Text>
      {item.projects?.length > 0 ? (
        item.projects.map((project) => (
          <View key={project.id}>
            <Text style={styles.itemText}>- {project.name}</Text>
 
 
            <Text style={styles.sectionTitle}>Documents:</Text>
            {project.documents?.length > 0 ? (
              project.documents.map((document) => (
                <Text key={document.id} style={styles.itemText}>
                  - {document.fileName}
                </Text>
              ))
            ) : (
              <Text style={styles.itemText}>No documents found.</Text>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.itemText}>No projects found.</Text>
      )}
    </View>
  );
 
 
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require("../assets/placenet.png")} style={styles.logo} />
        <Text style={styles.titleText}>Your Property Summary</Text>
 
 
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
 
 
            <FlatList
              data={properties}
              keyExtractor={(item) => item.id}
              renderItem={renderProperty}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
 }
 