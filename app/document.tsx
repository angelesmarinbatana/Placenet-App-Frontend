import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import api from '../API/api';

//doc manage page 
const UploadFile = () => {
  const [projects, setProjects] = useState([]); //get proj from backend
  const [selectedProject, setSelectedProject] = useState(null); // project
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  // get projects from backend 
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/projects');
        setProjects(response.data);
      } catch (error) {
        Alert.alert('Error', 'Failed to fetch projects.');
        console.error('Error fetching projects:', error);
      }
    };
    fetchProjects();
  }, []);

  //doc picker for pdfs
  const pickDocument = async () => {
    if (!selectedProject) {
      Alert.alert('Error', 'Please select a project before uploading documents.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' }); //only pdfs
      if (!result.canceled) {
        const successResult = result as DocumentPicker.DocumentPickerSuccessResult;

        setSelectedDocuments((prevSelectedDocuments) => [
          ...prevSelectedDocuments,
          ...successResult.assets,
        ]);
      } else {
        console.log('Document selection cancelled.');
      }
    } catch (error) {
      console.log('Error picking documents:', error);
    }
  };

  //upload to backend 
  const uploadDocuments = async () => {
    if (!selectedProject) {
      Alert.alert('Error', 'Please select a project before uploading documents.');
      return;
    }

    try {
      for (const document of selectedDocuments) {
        const formData = new FormData();
        formData.append('file', {
          uri: document.uri,
          name: document.name,
          type: document.mimeType,
        } as any); // Using "any" for type compatibility
        formData.append('project_id', selectedProject.project_id); // link doc to proj

        const response = await api.post('/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Document uploaded:', response.data);
      }

      // clear selected documents after upload //maybe fix later 
      setSelectedDocuments([]);
      Alert.alert('Success', 'Documents uploaded successfully.');
    } catch (error) {
      console.error('Error uploading documents:', error);
      Alert.alert('Error', 'Failed to upload documents.');
    }
  };

  //delete doc
  const handleDeleteDocument = async (documentId: number) => {
    try {
      await api.delete(`/documents/${documentId}`);
      Alert.alert('Deleted!', 'Document has been removed.');
      //update list 
      setSelectedDocuments((prevSelectedDocuments) =>
        prevSelectedDocuments.filter((document) => document.document_id !== documentId)
      );
    } catch (error) {
      Alert.alert('Error!', 'Failed to delete document.');
      console.error('Error deleting document:', error);
    }
  };

  // Handle selecting a project
  const handleSelectProject = (project) => {
    setSelectedProject(project);
    Alert.alert('Project Selected', `You selected: ${project.name}`);
  };

  return (
    <View style={styles.container}>
      {/* Project Selection */}
      <Text style={styles.title}>Select a Project:</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.project_id.toString()}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.projectItem,
              selectedProject?.project_id === item.project_id && styles.selectedProject,
            ]}
            onPress={() => handleSelectProject(item)}
          >
            <Text style={styles.projectText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {/* Display Selected Project */}
      {selectedProject && (
        <Text style={styles.selectedProjectText}>
          Selected Project: {selectedProject.name}
        </Text>
      )}

      {/* Upload Button */}
      <View style={styles.uploadButton}>
        <Button title="Upload PDF" color="#1e90ff" onPress={pickDocument} />
      </View>

      {/* Display Selected Documents */}
      <FlatList
        data={selectedDocuments}
        keyExtractor={(item, index) => item.uri + index}
        renderItem={({ item, index }) => (
          <View style={styles.documentItem}>
            <Text style={styles.fileName}>Name: {item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteDocument(index)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {/* Upload Documents Button */}
      {selectedDocuments.length > 0 && (
        <TouchableOpacity style={styles.uploadDocumentsButton} onPress={uploadDocuments}>
          <Text style={styles.uploadDocumentsText}>Upload Documents</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// Styles unchanged
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4f8',
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectItem: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
    marginHorizontal: 10,
  },
  selectedProject: {
    backgroundColor: '#4CAF50',
  },
  projectText: {
    fontSize: 16,
    color: '#333',
  },
  selectedProjectText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 10,
  },
  uploadButton: {
    marginVertical: 20,
  },
  documentItem: {
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    marginBottom: 10,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  removeButton: {
    color: 'red',
    marginTop: 5,
    fontWeight: 'bold',
  },
  uploadDocumentsButton: {
    backgroundColor: '#1e90ff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  uploadDocumentsText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default UploadFile;
