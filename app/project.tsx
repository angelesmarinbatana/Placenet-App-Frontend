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
import api from '../API/api';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/projectStyles';

interface Property {
  property_id: number;
  name: string;
}

interface Project {
  project_id: number;
  name: string;
  description: string;
  completion_date: string; 
}

const ProjectManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [completionDate, setCompletionDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState<boolean>(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchProperties();
    initializeProjects();
  }, []);

  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      Alert.alert('Error!', 'Failed to fetch properties.');
      //console.error('Error fetching properties:', error); //debug
    }
  };

  const initializeProjects = async () => {
    try {
      const propertyId = await AsyncStorage.getItem('selectedPropertyId');
      if (propertyId) {
        fetchProjects(parseInt(propertyId));
      }
    } catch (error) {
      Alert.alert('Error!', 'Failed to fetch projects.');
      //.error('Error fetching property ID:', error); //debug
    }
  };

  const fetchProjects = async (propertyId: number) => {
    try {
      const response = await api.get(`/projects?property_id=${propertyId}`);
      setProjects(response.data);
    } catch (error) {
      Alert.alert('Error!', 'Failed to fetch projects.');
      //console.error('Error fetching projects:', error); //debug
    }
  };

  const handleSelectProperty = async (property: Property) => {
    setSelectedProperty(property);
    try {
      await AsyncStorage.setItem('selectedPropertyId', 
        property.property_id.toString());
      Alert.alert('Property Selected', `You selected: ${property.name}`);
      fetchProjects(property.property_id);
    } catch (error) {
      Alert.alert('Error!', 'Failed to select property.');
      //console.error('Error saving property ID:', error); debug
    }
  };

  const handleAddProject = async () => {
    if (selectedProperty && projectName.trim() && projectDescription.trim() && completionDate) {
      const formattedDate = completionDate?.toISOString();//format date for db
      const projectData = {
        property_id: selectedProperty.property_id,
        name: projectName,
        description: projectDescription,
        completion_date: formattedDate, 
      };

      try {
        const response = await api.post('/projects', projectData);
        setProjects([...projects, response.data]); //add to list
        Alert.alert('Success!', 'Project has been added!');
        resetForm();
      } catch (error) {
        //console.error('API error during update:', error.response || error); //debug
        Alert.alert('Error', 'Failed to add project.');
      }
    } else {
      Alert.alert('Error', 'Please select a property, fill out all project fields, and choose a completion date.');
    }
  };

  const handleUpdateProject = async () => {
    //console.log("updating project...") //debug 

    if (selectedProperty && projectName.trim() && projectDescription.trim() && completionDate && editingProjectId) {
      const formattedDate = completionDate?.toISOString();
      const projectData = {
        property_id: selectedProperty.property_id,
        name: projectName,
        description: projectDescription,
        completion_date: formattedDate,
      };

      //console.log("editing project id:", editingProjectId); //debug
      //console.log("sending data:", projectData);//debug

      try {
        //console.log(`Updating project at URL: /projects/${editingProjectId}`); //debug
        await api.put(`/projects/${editingProjectId}`, projectData);
        Alert.alert('Success!', 'Project has been updated!');
        setEditingProjectId(null);
        fetchProjects(selectedProperty.property_id);//refresh after updating
        resetForm();
      } catch (error) {
        //console.error('API error during update:', error.response || error); //debug
        Alert.alert('Error', 'Failed to update project.');
      }
    } else {
      Alert.alert('Error', 'Please fill out all project fields and choose a completion date.');
    }
  };

  const handleDeleteProject = async (projectId: number) => {
    try {
      await api.delete(`/projects/${projectId}`);
      Alert.alert('Deleted!', 'Project has been removed.');
      setProjects(projects.filter((project) => project.project_id !== projectId));
    } catch (error) {
      Alert.alert('Error!', 'Failed to delete project.');
      //console.error('Error deleting project:', error); //debug
    }
  };

  const handleEditProject = (project: Project) => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setCompletionDate(new Date(project.completion_date));
    setEditingProjectId(project.project_id);
    //console.log("Editing project ID:", editingProjectId); //debug 
  };

  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
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
        keyExtractor={(item) => item.property_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.propertyItem,
              selectedProperty?.property_id === item.property_id && styles.selectedProperty,
            ]}
            onPress={() => handleSelectProperty(item)}
          >
            <Text style={styles.propertyText}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />

      {selectedProperty && (
        <>
          <Text style={styles.subtitle}>Add or Update a Project for:</Text>
          <Text style={styles.selectedPropertyName}>{selectedProperty.name}</Text>
          
          <Text style={styles.label}>Project Name:</Text>
          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={projectName}
            onChangeText={setProjectName}
          />
          <Text style={styles.label}>Project Description:</Text>
          <TextInput
            style={styles.input}
            placeholder="Project Description"
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
            keyExtractor={(item) => item.project_id.toString()}
            renderItem={({ item }) => (
              <View style={styles.projectItem}>
                <Text style={styles.projectText}>
                  {item.name} - {new Date(item.completion_date).toDateString()}
                </Text>
                <Text style={styles.projectDescription}>{item.description}</Text>
                <View style={styles.buttonContainer}>
                  <TouchableOpacity style={styles.editButton} onPress={() => handleEditProject(item)}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={() => handleDeleteProject(item.project_id)}>
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
