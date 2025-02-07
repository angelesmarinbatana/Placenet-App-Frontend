import React, { useState, useEffect } from 'react';
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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styles from "../styles/projectStyles";

const ProjectManagement = () => {
  const [properties, setProperties] = useState([]);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [projects, setProjects] = useState([]);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [completionDate, setCompletionDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    const querySnapshot = await getDocs(collection(db, "properties"));
    const propertyList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
    .filter(property => property.userId === auth.currentUser?.uid);
    setProperties(propertyList);
  }

  async function fetchProjects(propertyId) {
    const projectsRef = collection(db, "properties", propertyId, "projects"); 
    const querySnapshot = await getDocs(projectsRef);
    const projectList = querySnapshot.docs
      .map((doc) => ({ id: doc.id, ...doc.data() }));
    setProjects(projectList);
  }

  const handleSelectProperty = (property) => {
    setSelectedProperty(property);
    fetchProjects(property.id);
    Alert.alert("Property Selected", `You selected: ${property.name}`);
  };

  const handleAddProject = async () => {
    if (!selectedProperty || !projectName.trim() || !projectDescription.trim() || !completionDate) {
      Alert.alert("Error", "Please fill out all fields, including completion date.");
      return;
    }
  
    try {
      const projectsRef = collection(db, "properties", selectedProperty.id, "projects");
  
      const newProject = await addDoc(projectsRef, {
        name: projectName,
        description: projectDescription,
        propertyId: selectedProperty.id,
        userId: auth.currentUser.uid,
        completionDate: completionDate.toISOString(),
      });
  
      setProjects([...projects, { id: newProject.id, name: projectName, description: projectDescription, completionDate: completionDate }]);
      Alert.alert("Success!", "Project added.");
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to add project.");
    }
  };

  const handleUpdateProject = async () => {
    if (!editingProjectId || !selectedProperty || !projectName.trim() || !projectDescription.trim() || !completionDate) {
      Alert.alert("Error", "Please fill out all fields, including completion date.");
      return;
    }

    try {
      const projectRef = doc(db, "properties", selectedProperty.id, "projects", editingProjectId);
      await updateDoc(projectRef, { 
        name: projectName, 
        description: projectDescription, 
        completionDate: completionDate.toISOString() 
      });

      setProjects((prev) =>
        prev.map((proj) =>
          proj.id === editingProjectId 
            ? { ...proj, name: projectName, description: projectDescription, completionDate } 
            : proj
        )
      );

      Alert.alert("Success!", "Project updated.");
      resetForm();
    } catch (error) {
      Alert.alert("Error", "Failed to update project.");
      console.log(error);
    }
  };

  const handleDeleteProject = async (propertyId, projectId) => {
    try {
      await deleteDoc(doc(db, "properties", propertyId, "projects", projectId));
      setProjects((prev) => 
        prev.filter((proj) => proj.id !== projectId) 
      );
  
      Alert.alert("Deleted!", "Project has been removed.");
    } catch (error) {
      Alert.alert("Error!", "Failed to delete project.");
    }
  };

  const handleEditProject = (project) => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setCompletionDate(new Date(project.completionDate)); 
    setEditingProjectId(project.id);
  };

  const resetForm = () => {
    setProjectName("");
    setProjectDescription("");
    setCompletionDate(null);
    setEditingProjectId(null);
  };

  const handleDateChange = (selectedDate?: Date) => {
    setDatePickerVisibility(false);
    if (selectedDate) {
      setCompletionDate(selectedDate);
    }
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
            <Text style={styles.propertyText}>{item.street}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedProperty && (
        <>
          <Text style={styles.subtitle}>Manage Projects for:</Text>
          <Text style={styles.selectedPropertyName}>{selectedProperty.street}</Text>

          <Text style={styles.label}>Project Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            placeholderTextColor="gray"
            value={projectName}
            onChangeText={setProjectName}
          />
          <Text style={styles.label}>Project Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Project Description"
            placeholderTextColor="gray"
            value={projectDescription}
            onChangeText={setProjectDescription}
            multiline
          />

          <TouchableOpacity onPress={() => setDatePickerVisibility(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {completionDate ? completionDate.toDateString() : 'Select Completion Date'}
            </Text>
          </TouchableOpacity>

          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleDateChange}
            onCancel={() => setDatePickerVisibility(false)}
          />

                  <Button
                    title={editingProjectId ? "Update Project" : "Add Project"}
                    onPress={editingProjectId ? handleUpdateProject : handleAddProject}
                  />
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
                <Text style={styles.projectText}>
                  {item.name} - {new Date(item.completionDate).toDateString()}
                </Text>
                <Text style={styles.projectDescription}>{item.description}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEditProject(item)}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProject(item.propertyId, item.id)}>
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
