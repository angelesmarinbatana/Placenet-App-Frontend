import { View, TextInput, Button, StyleSheet, Alert, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';

export default function ProjectManagement() {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectDate, setProjectDate] = useState('');
  const [projects, setProjects] = useState([]); // To store added projects
  const [isEditing, setIsEditing] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null); // Track index of the project being edited

  const handleAddOrUpdateProject = () => {
    if (!projectName || !projectDescription || !projectDate) {
      Alert.alert('Error', 'All fields must be filled!');
      return;
    }

    if (isEditing && editIndex !== null) {
      // Update existing project
      const updatedProjects = [...projects];
      updatedProjects[editIndex] = {
        id: projects[editIndex].id,
        name: projectName,
        description: projectDescription,
        date: projectDate,
      };
      setProjects(updatedProjects);
      Alert.alert('Success', 'Project updated successfully!');
      setIsEditing(false);
      setEditIndex(null);
    } else {
      // Add new project
      const newProject = {
        id: projects.length.toString(),
        name: projectName,
        description: projectDescription,
        date: projectDate,
      };
      setProjects([...projects, newProject]);
      Alert.alert('Success', 'Project added successfully!');
    }

    // Clear form
    setProjectName('');
    setProjectDescription('');
    setProjectDate('');
  };

  const handleEditProject = (index: number) => {
    const project = projects[index];
    setProjectName(project.name);
    setProjectDescription(project.description);
    setProjectDate(project.date);
    setIsEditing(true);
    setEditIndex(index);
  };

  const handleDeleteProject = (index: number) => {
    const updatedProjects = projects.filter((_, i) => i !== index);
    setProjects(updatedProjects);
    Alert.alert('Success', 'Project deleted successfully!');
  };

  return (
    <View style={styles.container}>
      <Text>Project Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project name"
        value={projectName}
        onChangeText={setProjectName}
      />
      <Text>Project Description:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project description"
        value={projectDescription}
        onChangeText={setProjectDescription}
      />
      <Text>Project Date:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter project date"
        value={projectDate}
        onChangeText={setProjectDate}
      />
      <Button
        title={isEditing ? "Update Project" : "Add Project"}
        onPress={handleAddOrUpdateProject}
        color="#1e90ff"
      />

      {/* Displaying the list of added projects */}
      {projects.length > 0 && (
        <View style={styles.listContainer}>
          <Text style={styles.listTitle}>Projects Added:</Text>
          <FlatList
            data={projects}
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => (
              <View style={styles.projectItem}>
                <Text style={styles.projectText}>Name: {item.name}</Text>
                <Text style={styles.projectText}>Description: {item.description}</Text>
                <Text style={styles.projectText}>Date: {item.date}</Text>
                <View style={styles.buttonRow}>
                  <TouchableOpacity onPress={() => handleEditProject(index)} style={styles.editButton}>
                    <Text style={styles.buttonText}>Edit</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteProject(index)} style={styles.deleteButton}>
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e8f4f8',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    marginVertical: 10,
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
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
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});



