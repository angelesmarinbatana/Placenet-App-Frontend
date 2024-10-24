import { View, Button, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import React, { useState } from 'react';
import * as DocumentPicker from "expo-document-picker"
//import lib for documents 

/* 
  'DOCUMENT'PAGE  
*/



const UploadFile = () => {
  const [fileUri,  setFileUri] = useState(null);
  const [fileType, setFileType] = useState(null);

  const pickDocument = async () => {
    try{
      let result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        setFileUri(result.uri);
        setFileType(result.name.split('.').pop());
        console.log('File URI: ', result.uri);
        console.log('File Name: ', result.name);
      }
    } catch (error) {
      console.error('Error picking document: ', error);
    }
  };

  return (
    <View style={styles.background}>
      <Text style={styles.file}>Upload File</Text>
      <View style={styles.button}>
        <TouchableOpacity>
          <Button
            title="upload your file"
            color="#1e90ff"
            onPress={pickDocument}
          />
        </TouchableOpacity>
      </View>

      {/* Display the image if the file is an image */}
      {fileUri && (fileType === 'jpg' || fileType === 'jpeg' || fileType === 'png') && (
        <Image
          source={{ uri: fileUri }}
          style={{ width: 200, height: 200, marginTop: 20 }}
        />
      )}
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