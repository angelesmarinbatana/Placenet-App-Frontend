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
import React, { useEffect, useState } from 'react';
import api from '../API/api';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/property_summaryStyle';
import { router } from 'expo-router';

export default function PropertySummaryPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    //get summary
    async function fetchProfileSummary() {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          setErrorMessage('Authentication failed! Please log in again.');
          return;
        }

        const response = await api.get('/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProperties(response.data.Properties);
        setLoading(false);
      } catch (error) {
        //console.error('Error fetching property summary:', error); //debug
        setErrorMessage('Failed to load property summary. Please try again later.');
        setLoading(false);
      }
    }

    fetchProfileSummary();
  }, []);

  //render prop items
  const renderProperty = ({ item }) => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyName}>{item.name}</Text>

      {/* projects */}
      <Text style={styles.sectionTitle}>Projects:</Text>
      {item.Projects && item.Projects.map((project) => (
        <View key={project.project_id}>
          <Text style={styles.itemText}>- {project.name}</Text>

          {/* documents */}
          <Text style={styles.sectionTitle}>Documents:</Text>
          {project.Documents && project.Documents.map((document) => (
            <Text key={document.document_id} style={styles.itemText}>
              - {document.file_name}
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
        <Image
          source={require('../assets/placenet.png')}
          style={styles.logo}
        />
        <Text style={styles.titleText}>Property Summary</Text>
        
        {/* Custom Buttons */}
        <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/settings_page')}
          >
            <Text style={styles.buttonText}>Settings</Text>
        </TouchableOpacity>

        {/* loading */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {/* error */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* property list */}
            <FlatList
              data={properties}
              keyExtractor={(item) => item.property_id.toString()}
              renderItem={renderProperty}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
