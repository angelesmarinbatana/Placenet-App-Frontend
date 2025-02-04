import { 
  SafeAreaProvider, 
  SafeAreaView 
} from 'react-native-safe-area-context';
import { 
  Text, 
  View, 
  FlatList, 
  Image, 
  ActivityIndicator, 
  TouchableOpacity
} from 'react-native';
import React, { useEffect, useState } from "react";
import { db, auth } from "../config/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import styles from "../styles/property_summaryStyle";


export default function PropertySummaryPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchListings() {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));

        const propertyList = await Promise.all(
          querySnapshot.docs.map(async (docSnapshot) => {
            const propertyData = docSnapshot.data(); 

            if (propertyData.userId === auth.currentUser?.uid) {
              const projectsRef = collection(db, "properties", docSnapshot.id, "projects");
              const projectsSnapshot = await getDocs(projectsRef);

              const projects = projectsSnapshot.docs.map((projDoc) => ({
                id: projDoc.id,
                ...projDoc.data(),
              }));

              console.log(`Projects for ${docSnapshot.id}:`, projects);

              return { id: docSnapshot.id, ...propertyData, projects };
            }
            return null;
          })
        );

        const filteredProperties = propertyList.filter(Boolean);

        console.log("Final Properties List:", filteredProperties); 
        setProperties(filteredProperties); 
      } catch (error) {
        console.error("Error fetching properties:", error);
        setErrorMessage("Failed to load property summaries.");
      } finally {
        setLoading(false);
      }
    }

    fetchListings();
  }, []);

  const renderProperty = ({ item }) => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyName}>{item.street}</Text>

      <Text style={styles.sectionTitle}>Projects:</Text>
      {item.projects && item.projects.map((project) => (
        <View key={project.id}>
          <Text style={styles.itemText}>- {project.name}</Text>

          <Text style={styles.sectionTitle}>Documents:</Text>
          {project.documents && project.documents.map((document) => (
            <Text key={document.id} style={styles.itemText}>
              - {document.fileName}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require("../assets/placenet.png")} style={styles.logo} />
        <Text style={styles.titleText}>Property Summary</Text>
        {loading ? (
          <ActivityIndicator 
            size="large" 
            color="#0000ff" 
            testID="loading-spinner" 
          />
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