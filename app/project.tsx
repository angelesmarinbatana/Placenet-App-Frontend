import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, Text, FlatList, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../API/api';
import { useFocusEffect } from '@react-navigation/native';


export default function ProjectManagement() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDate, setProjectDate] = useState(new Date()); // Date state as Date object
  const [showDatePicker, setShowDatePicker] = useState(false); // Control date picker visibility
  const [projects, setProjects] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [selectedPropertyId, setSelectedPropertyId] = useState<number | null>(null);

  useEffect(() => {
    const fetchSelectedPropertyId = async () => {
      try {
        const propertyId = await AsyncStorage.getItem('selectedPropertyId');
        if (propertyId) {
          setSelectedPropertyId(parseInt(propertyId, 10));
        } else {
          Alert.alert('Error', 'No property selected. Please select a property first.');
        }
      } catch (error) {
        console.error('Error retrieving selected property ID:', error);
        Alert.alert('Error', 'Failed to retrieve selected property ID');
      }
    };

    fetchSelectedPropertyId();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (selectedPropertyId !== null) {
        fetchProjects(selectedPropertyId);
      }
    }, [selectedPropertyId])
  );

  const fetchProjects = async (propertyId) => {
    try {
      const response = await api.get(`/projects?property_id=${propertyId}`);
      setProjects(response.data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      Alert.alert('Error', 'Failed to load projects');
    }
  };
  
  const handleAddOrUpdateProject = async () => {
    if (!projectName || !projectDescription) {
      Alert.alert('Error', 'All fields must be filled!');
      return;
    }
  
    if (selectedPropertyId === null) {
      Alert.alert('Error', 'No property selected. Please select a property first.');
      return;
    }
  
    const formattedDate = projectDate.toISOString().slice(0, 10); // Format date to YYYY-MM-DD
    const projectData = {
      property_id: selectedPropertyId,
      name: projectName,
      description: projectDescription,
      start_date: formattedDate,
    };
  
    try {
      if (isEditing && editIndex !== null) {
        const projectId = projects[editIndex].project_id;
        
        // Log the data to verify it includes the updated date
        console.log("Updating project with data:", projectData);
  
        // Send the PUT request to update the project
        await api.put(`/projects/${projectId}`, projectData);
        Alert.alert('Success', 'Project updated successfully!');
  
        // Update the local state with the edited project
        const updatedProjects = [...projects];
        updatedProjects[editIndex] = { ...projectData, project_id: projectId }; // Ensure the new date is included
        setProjects(updatedProjects); // This should reflect the updated date in the state
      } else {
        // Adding a new project
        const response = await api.post('/projects', projectData);
        Alert.alert('Success', 'Project added successfully!');
        
        setProjects([...projects, response.data]);
      }
    } catch (error) {
      console.error('Error saving project:', error);
      Alert.alert('Error', 'Failed to save project');
    }
  
    setProjectName('');
    setProjectDescription('');
    setProjectDate(new Date()); // Reset to current date
    setIsEditing(false);
    setEditIndex(null);
  };
     

  const handleEditProject = (index: number) => {
    const project = projects[index];
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectDate(new Date(project.date)); // Convert stored date string back to Date object
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteProject = async (index: number) => {
    const projectId = projects[index].project_id;

    try {
      await api.delete(`/projects/${projectId}`);
      Alert.alert('Success', 'Project deleted successfully!');
      setProjects(projects.filter((_, i) => i !== index));
    } catch (error) {
      console.error('Error deleting project:', error);
      Alert.alert('Error', 'Failed to delete project');
    }
  };

  const handleSelectProject = async (projectId: number) => {
    try {
      await AsyncStorage.setItem('selectedProjectId', projectId.toString());
      Alert.alert('Selected!', 'Project selected for document management.');
    } catch (error) {
      console.error('Error selecting project:', error);
      Alert.alert('Error', 'Failed to select project');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Project Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <Text style={styles.label}>Project Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project description"
        value={projectDescription}
        onChangeText={setProjectDescription}
      />
      <Text style={styles.label}>Project Date:</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
        <Text>{projectDate.toLocaleDateString("en-US")}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={projectDate}
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            setShowDatePicker(false);
            if (selectedDate) {
              setProjectDate(selectedDate);
            }
          }}
        />
      )}
      <Button
        title={isEditing ? "Update Project" : "Add Project"}
        onPress={handleAddOrUpdateProject}
        color="#1e90ff"
      />

      {projects.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Projects Added:</Text>
          <FlatList
            data={projects}
            keyExtractor={(item) => item.project_id.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.projectItem}>
                <Text style={styles.projectText}>Name: {item.name}</Text>
                <Text style={styles.projectText}>Description: {item.description}</Text>
                <Text style={styles.projectText}>Date: {new Date(item.date).toLocaleDateString("en-US")}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => handleEditProject(index)} style={styles.editButton}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProject(index)} style={styles.deleteButton}>
                    <Text style={styles.buttonText}>Delete</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleSelectProject(item.project_id)} style={styles.selectButton}>
                    <Text style={styles.buttonText}>Select Project</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  label: {
    alignSelf: 'flex-start',
    fontSize: 16,
    marginBottom: 4,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  dateButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
  },
  listContainer: {
    marginTop: 20,
    width: '100%',
  },
  listTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  projectItem: {
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
  projectText: {
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 10,
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  selectButton: {
    backgroundColor: '#1E90FF',
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
