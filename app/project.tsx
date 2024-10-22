import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';

/* 
  'PROJECT'PAGE  
*/

export default function ProjectManagement() {
    //need 2 const: 1. project name; 2. project description 
    const [projectName, setProjectName] = useState('');


    const handleAddProject = () => {
        if (projectName) {
            //success message 

        } else {
            //error message 
        }// end if else 
    }

    return (
        <View style={styles.container}>
          <TextInput 
          //syle 
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



