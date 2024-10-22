import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';

/* 
  'PROJECT'PAGE  
*/

export default function ProjectManagement() {
    const [projectName, setProjectName] = useState('');
    //const project description 

    const handleAddProject = () => {
        if (projectName /*and project description*/) {
            //success message 
            //set name 
        } else {
            //error message 
        }// end if else 
    }

    return (
        <View style={styles.container}>
          <TextInput 
            //style text input 
          />
          <Button 
            title="Add a Project" 
          />
        </View>
      );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#e8f4f8',
      alignItems: 'center',
      justifyContent: 'center',
    },
  });



