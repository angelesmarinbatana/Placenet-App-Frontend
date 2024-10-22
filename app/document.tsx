import { View, Button, Text, StyleSheet, Alert } from 'react-native';
import React, { useState } from 'react';
//import lib for documents 

/* 
  'DOCUMENT'PAGE  
*/

export default function DocumentManagement() {
    const[document, setDocument] = useState(null) //no document uploaded yet 

    const pickDoc = () => {
    }
    return (
        <View style={styles.container}>
          <Button 
            title="Select a Document (PDF)" 
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