import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  FlatList,
  TouchableOpacity,
  Platform,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import api from '../API/api';

interface Property {
  property_id: number;
  name: string;
}

interface Project {
  project_id: number;
  name: string;
  description: string;
  completion_date: string; //format
}

const ProjectManagement: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [projectName, setProjectName] = useState<string>('');
  const [projectDescription, setProjectDescription] = useState<string>('');
  const [completionDate, setCompletionDate] = useState<Date | null>(null); 
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false); 
  const [projects, setProjects] = useState<Project[]>([]);
  const [editingProjectId, setEditingProjectId] = useState<number | null>(null);

  useEffect(() => {
    fetchProperties(); //get prop
  }, []);

  //get prop in backend 
  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      Alert.alert('Error!', 'Failed to fetch properties.');
      console.error('Error fetching properties:', error);
    }
  };

  //get proj for prop
  const fetchProjects = async (propertyId: number) => {
    try {
      const response = await api.get(`/projects?property_id=${propertyId}`);
      setProjects(response.data);
    } catch (error) {
      Alert.alert('Error!', 'Failed to fetch projects.');
      console.error('Error fetching projects:', error);
    }
  };

  const handleSelectProperty = (property: Property) => {
    setSelectedProperty(property);
    Alert.alert('Property Selected', `You selected: ${property.name}`);
    fetchProjects(property.property_id);
  };

  //add/ update a proj
  const handleAddOrUpdateProject = async () => {
    if (selectedProperty && projectName.trim() && projectDescription.trim() && completionDate) {
      const projectData = {
        property_id: selectedProperty.property_id,
        name: projectName,
        description: projectDescription,
        completion_date: completionDate.toISOString().split('T')[0],
      };

      if (editingProjectId) {
        //update
        try {
          await api.put(`/projects/${editingProjectId}`, projectData);
          Alert.alert('Success!', 'Project has been updated!');
          fetchProjects(selectedProperty.property_id);
          resetForm();
        } catch (error) {
          Alert.alert('Error!', 'Failed to update project.');
          console.error('Error updating project:', error);
        }
      } else {
        //new
        try {
          const response = await api.post('/projects', projectData);
          setProjects([...projects, response.data]); //update
          Alert.alert('Success!', 'Project has been added!');
          resetForm();
        } catch (error) {
          Alert.alert('Error!', 'Failed to add project.');
          console.error('Error adding project:', error);
        }
      }
    } else {
      Alert.alert('Error', 'Please select a property, fill out all project fields, and choose a completion date.');
    }
  };

  //delete
  const handleDeleteProject = async (projectId: number) => {
    try {
      await api.delete(`/projects/${projectId}`);
      Alert.alert('Deleted!', 'Project has been removed.');
      setProjects(projects.filter((project) => project.project_id !== projectId)); //remove
    } catch (error) {
      Alert.alert('Error!', 'Failed to delete project.');
      console.error('Error deleting project:', error);
    }
  };

  //edit
  const handleEditProject = (project: Project) => {
    setProjectName(project.name);
    setProjectDescription(project.description);
    setCompletionDate(new Date(project.completion_date));
    setEditingProjectId(project.project_id);
  };

  //reset
  const resetForm = () => {
    setProjectName('');
    setProjectDescription('');
    setCompletionDate(null);
    setEditingProjectId(null);
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
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

          <TextInput
            style={styles.input}
            placeholder="Project Name"
            value={projectName}
            onChangeText={setProjectName}
          />
          <TextInput
            style={styles.input}
            placeholder="Project Description"
            value={projectDescription}
            onChangeText={setProjectDescription}
            multiline
          />

          <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
            <Text style={styles.datePickerText}>
              {completionDate ? completionDate.toDateString() : 'Select Completion Date'}
            </Text>
          </TouchableOpacity>

          {showDatePicker && (
            <DateTimePicker
              value={completionDate || new Date()}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={handleDateChange}
            />
          )}

          <Button title={editingProjectId ? "Update Project" : "Add Project"} onPress={handleAddOrUpdateProject} />
        </>
      )}

      {/* Display List of Projects */}
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
                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditProject(item)}
                  >
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteProject(item.project_id)}
                  >
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








//move

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f9f9f9',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 5,
  },
  propertyItem: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#e0e0e0',
    marginVertical: 5,
  },
  selectedProperty: {
    backgroundColor: '#4CAF50',
  },
  propertyText: {
    fontSize: 16,
    color: '#333',
  },
  selectedPropertyName: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  datePickerButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    marginBottom: 10,
  },
  datePickerText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  projectListContainer: {
    marginTop: 20,
  },
  projectItem: {
    padding: 15,
    borderRadius: 5,
    backgroundColor: '#f0f0f0',
    marginBottom: 10,
  },
  projectText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  projectDescription: {
    fontSize: 14,
    color: '#666',
    marginVertical: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  editButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProjectManagement;
