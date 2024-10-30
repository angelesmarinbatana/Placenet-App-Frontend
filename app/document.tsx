import { View, Button, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import React, { useState } from 'react';
import * as DocumentPicker from "expo-document-picker"
//import lib for documents 

/* 
  'DOCUMENT'PAGE  
*/

const UploadFile = () => {
  const [selectedDocuments, setSelectedDocuments] = useState<DocumentPicker.DocumentPickerAsset[]>([]);

  const pickDocument = async () => {
    try{
      const result = await DocumentPicker.getDocumentAsync({ multiple: true});
      if (!result.canceled) {
        const successResult = result as DocumentPicker.DocumentPickerSuccessResult;

        if (selectedDocuments.length + successResult.assets.length <= 5) {
          console.log('Hello')
          setSelectedDocuments((prevSelectedDocuments) => [
            ...prevSelectedDocuments,
            ...successResult.assets,
          ]);
        } else {
          console.log("Maximim of 5 documents allowed.");
        }
      } else {
        console.log("Document selection cancelled.");
      }
    } catch (error){
      console.log("Error picking documents:", error)
    }
  };

   // Additional code snippet to get the document type 
const getFileType = (fileName: string): string => {
  const extension = fileName.split('.').pop()?.toLowerCase();
  switch (extension) {
    case 'pdf':
      return 'PDF';
    case 'doc':
    case 'docx':
      return 'Word';
    case 'xls':
    case 'xlsx':
      return 'Excel';
    default:
      return 'Unknown';
  }
};

// Remove a document from the array 
const removeDocument = (index: number) => {
  setSelectedDocuments((prevSelectedDocuments) =>
    prevSelectedDocuments.filter((_, i) => i !== index)
  );
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

      {/* Display selected documents */}
      <FlatList
        data={selectedDocuments}
        keyExtractor={(item, index) => item.uri + index}
        renderItem={({ item, index }) => (
          <View style={styles.documentItem}>
            <Text style={styles.fileName}>Name: {item.name}</Text>
            <Text>Type: {getFileType(item.name)}</Text>
            <TouchableOpacity onPress={() => removeDocument(index)}>
              <Text style={styles.removeButton}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
      />
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
    documentItem: {
      marginTop: 10,
      padding: 10,
      backgroundColor: '#f9f9f9',
      borderRadius: 5,
      alignItems: 'center',
      width: 300,
    },
    fileName: {
      fontSize: 16,
      fontWeight: 'bold',
    },
    removeButton: {
      color: 'red',
      marginTop: 5,
      fontWeight: 'bold',
    },
  });

export default UploadFile;