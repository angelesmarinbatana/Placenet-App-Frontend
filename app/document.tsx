import { View, Button, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import React, { useState } from 'react';
import * as DocumentPicker from "expo-document-picker"
//import lib for documents 

/* 
  'DOCUMENT'PAGE  
*/



const UploadFile = () => {
  const pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({});
    console.log(result.url);
    console.log(result);
  };

  return (
    <View style={styles.background}>
      <Text style={styles.file}>Upload CSV File</Text>
      <View style={styles.button}>
        <TouchableOpacity>
          <Button
            title="upload your file"
            color="black"
            onPress={pickDocument}
          />
        </TouchableOpacity>
      </View>
    </View>
  ); 
}


const styles = StyleSheet.create({
    background: {
      flex: 1,
      backgroundColor: '#e8f4f8',
      alignItems: 'center',
      justifyContent: 'center',
    },
    file: {
      color: "black",
      marginHorizontal: 145,
    },
    button: {
      marginHorizontal: 60,
    },
  });

export default UploadFile;