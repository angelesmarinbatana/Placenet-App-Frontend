import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import api from '../API/api';
import * as SecureStore from 'expo-secure-store';

export default function ProfileSummaryPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    //get prof sum
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

  //refresh sum
  const refreshProfileSummary = async () => {
    setLoading(true);
    setErrorMessage('');
    await fetchProfileSummary();
  };

  //delete prop
  const handleDeleteProperty = async (propertyId) => {
    try {
      await api.delete(`/properties/${propertyId}`);
      Alert.alert('Success!', 'Property deleted successfully.');
      refreshProfileSummary();
    } catch (error) {
      console.error('Error deleting property:', error);
      Alert.alert('Error!', 'Failed to delete property.');
    }
  };

  //add update proj

  //delete proj
  const handleDeleteProject = async (projectId) => {
    try {
      await api.delete(`/projects/${projectId}`);
      Alert.alert('Success!', 'Project deleted successfully.');
      refreshProfileSummary();
    } catch (error) {
      console.error('Error deleting project:', error);
      Alert.alert('Error!', 'Failed to delete project.');
    }
  };

  //add update proj

  //delete doc
  const handleDeleteDocument = async (documentId) => {
    try {
      await api.delete(`/documents/${documentId}`);
      Alert.alert('Success!', 'Document deleted successfully.');
      refreshProfileSummary();
    } catch (error) {
      console.error('Error deleting document:', error);
      Alert.alert('Error!', 'Failed to delete document.');
    }
  };

  //render prop
  const renderProperty = ({ item }) => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyName}>{item.name}</Text>

      {/* Delete Property Button */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => handleDeleteProperty(item.property_id)}
      >
        <Text style={styles.buttonText}>Delete Property</Text>
      </TouchableOpacity>

      {/* Projects Section */}
      <Text style={styles.sectionTitle}>Projects:</Text>
      {item.Projects && item.Projects.map((project) => (
        <View key={project.project_id} style={styles.projectContainer}>
          <Text style={styles.itemText}>- {project.name}</Text>

          {/* Delete Project Button */}
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteProject(project.project_id)}
          >
            <Text style={styles.buttonText}>Delete Project</Text>
          </TouchableOpacity>

          {/* Documents Section */}
          <Text style={styles.sectionTitle}>Documents:</Text>
          {project.Documents && project.Documents.map((document) => (
            <View key={document.document_id} style={styles.documentContainer}>
              <Text style={styles.itemText}>- {document.file_name}</Text>

              {/* Delete Document Button */}
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDeleteDocument(document.document_id)}
              >
                <Text style={styles.buttonText}>Delete Document</Text>
              </TouchableOpacity>
            </View>
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
  projectContainer: {
    paddingBottom: 10,
  },
  documentContainer: {
    paddingLeft: 10,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#404040',
    marginBottom: 3,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    alignSelf: 'flex-start',
    marginVertical: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
