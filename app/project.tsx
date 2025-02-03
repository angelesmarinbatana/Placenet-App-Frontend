import React, { 
  useState, 
  useEffect 
} from 'react';

import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { db, auth } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";
import styles from "../styles/projectStyles";

const ProjectManagement = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    const querySnapshot = await getDocs(collection(db, "properties"));
    const propertyList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProperties(propertyList);
  }

  async function fetchProjects(propertyId) {
    const querySnapshot = await getDocs(collection(db, "projects"));
    const projectList = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }))
      .filter((proj) => proj.propertyId === propertyId);
    setProjects(projectList);
  }

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
    fetchProjects(property.id);
    Alert.alert("Property Selected", `You selected: ${property.name}`);
  };

  const handleAddProject = async () => {
    if (!selectedProperty || !projectName.trim() || !projectDescription.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const newProject = await addDoc(collection(db, "projects"), {
        name: projectName,
        description: projectDescription,
        propertyId: selectedProperty.id,
        userId: auth.currentUser.uid,
      });

      setProjects([...projects, { id: newProject.id, name: projectName, description: projectDescription }]);
      Alert.alert("Success!", "Project added.");
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to add project.");
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProjectId || !selectedProperty || !projectName.trim() || !projectDescription.trim()) {
      Alert.alert("Error", "Please fill out all fields.");
      return;
    }

    try {
      const projectRef = doc(db, "projects", editingProjectId);
      await updateDoc(projectRef, { name: projectName, description: projectDescription });

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === editingProjectId ? { ...proj, name: projectName, description: projectDescription } : proj
        )
      );

      Alert.alert("Success!", "Project updated.");
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to update project.");
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await deleteDoc(doc(db, "projects", projectId));
      setProjects((prev) => prev.filter((proj) => proj.id !== projectId));
      Alert.alert("Deleted!", "Project has been removed.");
    } catch (error) {
      Alert.alert("Error!", "Failed to delete project.");
    }
  };

  const handleEditProject = (project) => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setEditingProjectId(project.id);
  };

  const resetForm = () => {
    setProjectName("");
    setProjectDescription("");
    setEditingProjectId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select a Property:</Text>
      <FlatList
        data={properties}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.propertyItem,
              selectedProperty?.id === item.id && styles.selectedProperty,
            ]}
            onPress={() => handleSelectProperty(item)}
          >
            <Text style={styles.propertyText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedProperty && (
        <>
          <Text style={styles.subtitle}>Manage Projects for:</Text>
          <Text style={styles.selectedPropertyName}>{selectedProperty.name}</Text>

          <Text style={styles.label}>Project Name:</Text>
          <TextInput style={styles.input} placeholder="Project Name" value={projectName} onChangeText={setProjectName} />
          <Text style={styles.label}>Project Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Project Description"
            value={projectDescription}
            onChangeText={setProjectDescription}
            multiline
          />

          <Button title={editingProjectId ? "Update Project" : "Add Project"} onPress={editingProjectId ? handleUpdateProject : handleAddProject} />
        </>
      )}

      {selectedProperty && projects.length > 0 && (
        <View style={styles.projectListContainer}>
          <Text style={styles.subtitle}>Projects for {selectedProperty.name}:</Text>
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View style={styles.projectItem}>
                <Text style={styles.projectText}>{item.name}</Text>
                <Text style={styles.projectDescription}>{item.description}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEditProject(item)}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProject(item.id)}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default ProjectManagement;