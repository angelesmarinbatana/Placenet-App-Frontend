import React, { useState, useEffect } from 'react';
import {
  View,
  Button,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import api from '../API/api';


const UploadFile = () => {
  const [projects, setProjects] = useState([]); 
  const [selectedProject, setSelectedProject] = useState(null); 
  const [documents, setDocuments] = useState([]); 
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

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

  const fetchDocuments = async (projectId: number) => {
    try {
      const response = await api.get(`/documents?project_id=${projectId}`);
      setDocuments(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch documents.');
      console.error('Error fetching documents:', error);
    }
  };

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchDocuments(project.project_id);
    Alert.alert('Project Selected', `You selected: ${project.name}`);
  };

  const pickDocument = async () => {
    if (!selectedProject) {
      Alert.alert('Error', 'Please select a project before uploading documents.');
      return;
    }

    try {
      const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
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
        } as any); 
        formData.append('project_id', selectedProject.project_id);

        const response = await api.post('/documents', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('Document uploaded:', response.data);
      }

      setSelectedDocuments([]);
      Alert.alert('Success', 'Documents uploaded successfully.');
      fetchDocuments(selectedProject.project_id); //refrsh list
    } catch (error) {
      console.error('Error uploading documents:', error);
      Alert.alert('Error', 'Failed to upload documents.');
    }
  };

  //downld pdf from S3 w pre-signed url
  const handleDownloadDocument = async (documentId: number) => {
    try {
      const response = await api.get(`/documents/${documentId}/download`);
      const url = response.data.url;

      if (url) {
        Linking.openURL(url); //open url
      } else {
        Alert.alert('Error', 'Failed to retrieve document URL.');
      }
    } catch (error) {
      console.error('Error fetching document URL:', error);
      Alert.alert('Error', 'Failed to download document.');
    }
  };

  //delete doc
  const handleDeleteDocument = async (documentId: number) => {
    try {
      await api.delete(`/documents/${documentId}`);
      Alert.alert('Deleted!', 'Document has been removed.');
      fetchDocuments(selectedProject.project_id); //refresh
    } catch (error) {
      Alert.alert('Error!', 'Failed to delete document.');
      console.error('Error deleting document:', error);
    }
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

      {/* List All Uploaded Documents */}
      {selectedProject && (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.document_id.toString()}
          renderItem={({ item }) => (
            <View style={styles.documentItem}>
              <Text style={styles.fileName}>Name: {item.file_name}</Text>
              <TouchableOpacity onPress={() => handleDownloadDocument(item.document_id)}>
                <Text style={styles.downloadButton}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteDocument(item.document_id)}>
                <Text style={styles.removeButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};


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
  downloadButton: {
    color: 'blue',
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
