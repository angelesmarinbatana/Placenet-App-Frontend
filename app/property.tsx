import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text } from 'react-native'; // Importing all necessary components
import React, { useState } from 'react';

/* 
  'PROPERTY'PAGE  
*/

export default function PropertyManagement() {
    const [propertyAddress, setPropertyAddress] = useState(''); // State for handling the property address input
    const [properties, setProperties] = useState<string[]>([]); // State for storing the list of added properties

    const handleAddProperty = () => { 
        if (propertyAddress.trim()) { // Ensure the input is not empty or just whitespace
          setProperties([...properties, propertyAddress]); // Add the new property to the list
          Alert.alert('Successful!', 'Property has been added!'); // Success message
          setPropertyAddress(''); // Clear the input field after adding the property
        } else {
          Alert.alert('Error!', 'Property address cannot be empty!'); // Error message for empty input
        }
    };

    return (
        <View style={styles.container}>
          {/* Input field for property address */}
          <TextInput
            style={styles.input}
            placeholder="Enter Property Address"
            value={propertyAddress}
            onChangeText={setPropertyAddress} // Update the state with input text
          />

          {/* Button to add property */}
          <Button
            title="Add Property"
            onPress={handleAddProperty} // Call the handler when the button is pressed
          />

          {/* Displaying the list of added properties */}
          {properties.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Properties Added:</Text>
              <FlatList
                data={properties}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <Text style={styles.propertyItem}>{item}</Text>
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
    height: 40,
    width: '100%',
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 8,
    borderRadius: 5,
    backgroundColor: '#fff',
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
  propertyItem: {
    fontSize: 16,
    padding: 10,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1,
  },
});
