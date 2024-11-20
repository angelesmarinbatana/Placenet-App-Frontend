import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, FlatList, Image, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../API/api';
import * as SecureStore from 'expo-secure-store';

export default function ProfileSummaryPage() {
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
        console.error('Error fetching profile summary:', error);
        setErrorMessage('Failed to load profile summary. Please try again later.');
        setLoading(false);
      }
    }

    fetchProfileSummary();
  }, []);

  //render prop item
  const renderProperty = ({ item }) => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyName}>{item.name}</Text>

      {/* Projects Section */}
      <Text style={styles.sectionTitle}>Projects:</Text>
      {item.Projects && item.Projects.map((project) => (
        <View key={project.project_id}>
          <Text style={styles.itemText}>- {project.name}</Text>

          {/* Documents Section */}
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
        <Text style={styles.titleText}>Profile Summary</Text>

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

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  logo: {
    width: 200,
    height: 110,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  propertyContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    width: '100%',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#404040',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#404040',
    marginBottom: 3,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
