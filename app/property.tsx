import { View, TextInput, Button, StyleSheet, Alert } from 'react-native'; //added alert input 
import React, { useState } from 'react';

/* 
  'PROPERTY'PAGE  
*/

export default function PropertyManagement() {
    const [propertyAddress, setPropertyAddress] = useState(''); //state variables are used to handle dynamic data (this one is a string)
   
    const handleAddProperty = () => { //function to handle adding properties 
        if (propertyAddress) {
          //success message ;
          // set address 
        } else {
          //  failure message 
        }// end if else 
      };
    
      return (
        <View style={styles.container}>
          <TextInput 
            //style text input 
          />
          <Button 
            title="Add a Property" 
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