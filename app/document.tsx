import React, { 
  useState, 
  useEffect 
} from 'react';
import { 
  SafeAreaProvider, 
  SafeAreaView 
} from 'react-native-safe-area-context';

import {
  View,
  Button,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Linking,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { db, storage, auth } from "../config/firebaseConfig";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import styles from '../styles/documentStyles';


const UploadFile = () => {
  const [projects, setProjects] = useState([]); 
  const [selectedProject, setSelectedProject] = useState(null); 
  const [documents, setDocuments] = useState([]); 
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  useEffect(() => {
    fetchProjects();
  }, []);

  async function fetchProjects() {
    const querySnapshot = await getDocs(collection(db, "properties", propertyId, "projects"));
    const projectList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setProjects(projectList);
  }

  async function fetchDocuments(projectId) {
    const querySnapshot = await getDocs(collection(db, "documents"));
    const documentList = querySnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() }))
      .filter(doc => doc.projectId === projectId);
    setDocuments(documentList);
  }

  const handleSelectProject = (project) => {
    setSelectedProject(project);
    fetchDocuments(project.id);
    Alert.alert("Project Selected", `You selected: ${project.name}`);
  };

  const pickDocument = async () => {
    if (!selectedProject) {
      Alert.alert("Error", "Please select a project before uploading documents.");
      return;
    }
    const result = await DocumentPicker.getDocumentAsync({ type: "application/pdf" });
    if (!result.canceled) {
      const successResult = result as DocumentPicker.DocumentPickerSuccessResult;
      setSelectedDocuments([...selectedDocuments, ...successResult.assets]);
    }
  };

  async function uploadFile(fileUri, fileName) {
    const response = await fetch(fileUri);
    const blob = await response.blob();
    const fileRef = ref(storage, `documents/${fileName}`);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
  }

  const uploadDocuments = async () => {
    if (!selectedProject) {
      Alert.alert("Error", "Please select a project before uploading documents.");
      return;
    }
    try {
      for (const document of selectedDocuments) {
        const fileUrl = await uploadFile(document.uri, document.name);
        await addDoc(collection(db, "documents"), {
          fileName: document.name,
          filePath: fileUrl,
          projectId: selectedProject.id,
          userId: auth.currentUser.uid
        });
      }
      setSelectedDocuments([]);
      Alert.alert("Success", "Documents uploaded successfully.");
      fetchDocuments(selectedProject.id);
    } catch (error) {
      Alert.alert("Error", "Failed to upload documents.");
    }
  };

  const handleDownloadDocument = async (documentUrl) => {
    Linking.openURL(documentUrl);
  };

  const handleDeleteDocument = async (documentId, filePath) => {
    try {
      await deleteDoc(doc(db, "documents", documentId));
      const fileRef = ref(storage, filePath);
      await deleteObject(fileRef);
      Alert.alert("Deleted!", "Document has been removed.");
      fetchDocuments(selectedProject.id);
    } catch (error) {
      Alert.alert("Error!", "Failed to delete document.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Project:</Text>
      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        horizontal
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.projectItem,
              selectedProject?.id === item.id && styles.selectedProject
            ]}
            onPress={() => handleSelectProject(item)}
          >
            <Text style={styles.projectText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedProject && <Text style={styles.selectedProjectText}>Selected Project: {selectedProject.name}</Text>}

      <View style={styles.uploadButton}>
        <Button title="Upload PDF" color="#1e90ff" onPress={pickDocument} />
      </View>

      <FlatList
        data={selectedDocuments}
        keyExtractor={(item, index) => item.uri + index}
        renderItem={({ item, index }) => (
          <View style={styles.documentItem}>
            <Text style={styles.fileName}>Name: {item.name}</Text>
            <TouchableOpacity onPress={() => handleDeleteDocument(index, item.uri)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />

      {selectedDocuments.length > 0 && (
        <TouchableOpacity style={styles.uploadDocumentsButton} onPress={uploadDocuments}>
          <Text style={styles.uploadDocumentsText}>Upload Documents</Text>
        </TouchableOpacity>
      )}

      {selectedProject && (
        <FlatList
          data={documents}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.documentItem}>
              <Text style={styles.fileName}>Name: {item.fileName}</Text>
              <TouchableOpacity onPress={() => handleDownloadDocument(item.filePath)}>
                <Text style={styles.downloadButton}>Download</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDeleteDocument(item.id, item.filePath)}>
                <Text style={styles.removeButton}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default UploadFile;