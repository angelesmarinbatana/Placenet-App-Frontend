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
} from 'react';
import { db } from "../config/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";
import styles from "../styles/listing_summariesStyles";

export default function ListingSummariesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    async function fetchListings() {
      try {
        const querySnapshot = await getDocs(collection(db, "properties"));
        const propertyList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setProperties(propertyList);
        setLoading(false);
      } catch (error) {
        setErrorMessage("Failed to load property summaries.");
        setLoading(false);
      }
    }
    fetchListings();
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
        <Text style={styles.titleText}>Community Property Summaries</Text>

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
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