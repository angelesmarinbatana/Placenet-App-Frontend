import { View, TextInput, Button, StyleSheet, Alert, Text, FlatList, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';




interface Property {
 property_id: number;
 name: string;
}


const ProjectManagement: React.FC = () => {
 const [properties, setProperties] = useState<Property[]>([
   { property_id: 1, name: '123 Maple Street, Springfield, IL 62701' },
   { property_id: 2, name: '456 Oak Avenue, Lincoln, NE 68508' },
 ]);


 const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
 const [projectName, setProjectName] = useState<string>('');
 const [projectDescription, setProjectDescription] = useState<string>('');


 // Handle selecting a property
 const handleSelectProperty = (property: Property) => {
   setSelectedProperty(property);
   Alert.alert('Property Selected', `You selected: ${property.name}`);
 };


 // Handle adding a new project to the selected property
 const handleAddProject = () => {
   if (selectedProperty && projectName.trim() && projectDescription.trim()) {
     Alert.alert(
       'Project Added!',
       `Project "${projectName}" has been added to "${selectedProperty.name}".`
     );
     // Reset fields after adding a project
     setProjectName('');
     setProjectDescription('');
   } else {
     Alert.alert(
       'Error',
       'Please select a property and fill out all project fields.'
     );
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
             selectedProperty?.property_id === item.property_id &&
               styles.selectedProperty,
           ]}
           onPress={() => handleSelectProperty(item)}
         >
           <Text style={styles.propertyText}>{item.name}</Text>
         </TouchableOpacity>
       )}
     />


     {selectedProperty && (
       <>
         <Text style={styles.subtitle}>Add a New Project for:</Text>
         <Text style={styles.selectedPropertyName}>
           {selectedProperty.name}
         </Text>


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


         <Button title="Add Project" onPress={handleAddProject} />
       </>
     )}
   </View>
 );
};


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
});


export default ProjectManagement;

