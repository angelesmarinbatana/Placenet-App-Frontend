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
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function fetchPropertySummary() {
      try {
        const propertyQuery = query(
          collection(db, "properties"),
          where("userId", "==", auth.currentUser.uid)
        );
        const querySnapshot = await getDocs(propertyQuery);
        const propertyList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setProperties(propertyList);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Failed to load property summary.");
        setLoading(false);
      }
    }
    fetchPropertySummary();
  }, []);

  const renderProperty = ({ item }) => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyName}>{item.name}</Text>

      {/* Projects Section */}
      <Text style={styles.sectionTitle}>Projects:</Text>
      {item.projects && item.projects.map((project) => (
        <View key={project.id}>
          <Text style={styles.itemText}>- {project.name}</Text>

          {/* Documents Section */}
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
        {/* Header */}
        <Image source={require("../assets/placenet.png")} style={styles.logo} />
        <Text style={styles.titleText}>Property Summary</Text>
        
        {/* Custom Buttons */}
        <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/settings_page')}
          >
            <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator 
            size="large" 
            color="#0000ff" 
            testID="loading-spinner"  // Added testID here
          />
        ) : (
          <>
            {/* Error Message */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Property List */}
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
