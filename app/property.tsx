import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import api from '../API/api'; // Assuming this is the Axios instance configured with the base URL
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Property {
  property_id: number;
  name: string;
}

const PropertyManagement: React.FC = () => {
    const [street, setStreet] = useState<string>(''); // State for street
    const [city, setCity] = useState<string>(''); // State for city
    const [state, setState] = useState<string>(''); // State for state
    const [zip, setZip] = useState<string>(''); // State for zip code
    const [properties, setProperties] = useState<Property[]>([]); // State for storing the list of properties
    const [editingIndex, setEditingIndex] = useState<number | null>(null); // State to track which property is being edited

    // Function to fetch properties for the logged-in user
    const fetchProperties = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId'); // Retrieve userId from AsyncStorage
        if (userId) {
          const response = await api.get(`/properties?user_id=${userId}`);
          setProperties(response.data);
        }
      } catch (error) {
        Alert.alert('Error!', 'Failed to fetch properties.');
        console.error('Error fetching properties:', error);
      }
    };

    // Fetch properties on component mount
    useEffect(() => {
        fetchProperties();
    }, []);

    // Function to handle adding a new property
    const handleAddProperty = async () => {
        if (street.trim() && city.trim() && state.trim() && zip.trim()) {
            const userId = localStorage.getItem('userID');
            const fullAddress = `${street}, ${city}, ${state} ${zip}`;

            if (editingIndex !== null) {
                // Edit existing property (for local state, assuming API call if editing in the backend)
                const updatedProperties = [...properties];
                updatedProperties[editingIndex] = { ...updatedProperties[editingIndex], name: fullAddress };
                setProperties(updatedProperties);
                Alert.alert('Successful!', 'Property has been updated!');
                setEditingIndex(null); // Reset editing state
            } else {
                // Add new property
                try {
                    const response = await api.post('/properties', {
                        user_id: userId,
                        name: fullAddress,
                    });
                    setProperties([...properties, response.data]); // Append new property to list
                    Alert.alert('Successful!', 'Property has been added!');
                } catch (error) {
                    Alert.alert('Error!', 'Failed to add property.');
                    console.error('Error adding property:', error);
                }
            }

            // Clear input fields
            setStreet('');
            setCity('');
            setState('');
            setZip('');
        } else {
            Alert.alert('Error!', 'All address fields must be filled out!');
        }
    };

    // Function to handle editing a property
    const handleEditProperty = (index: number) => {
        const [street, city, state, zip] = properties[index].name.split(/, | /);
        setStreet(street);
        setCity(city);
        setState(state);
        setZip(zip);
        setEditingIndex(index);
    };

    // Function to handle deleting a property
    const handleDeleteProperty = (index: number) => {
        const updatedProperties = properties.filter((_, i) => i !== index);
        setProperties(updatedProperties);
        Alert.alert('Deleted!', 'Property has been removed.');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Street:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Street"
                value={street}
                onChangeText={setStreet}
            />
            <Text style={styles.label}>City:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter City"
                value={city}
                onChangeText={setCity}
            />
            <Text style={styles.label}>State:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter State"
                value={state}
                onChangeText={setState}
            />
            <Text style={styles.label}>Zip Code:</Text>
            <TextInput
                style={styles.input}
                placeholder="Enter Zip Code"
                value={zip}
                onChangeText={setZip}
                keyboardType="numeric"
            />

            <Button
                title={editingIndex !== null ? "Update Property" : "Add Property"}
                onPress={handleAddProperty}
            />

            {properties.length > 0 && (
                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>Properties Added:</Text>
                    <FlatList
                        data={properties}
                        keyExtractor={(item) => item.property_id.toString()}
                        renderItem={({ item, index }) => (
                            <View style={styles.propertyItemContainer}>
                                <Text style={styles.propertyItem}>{item.name}</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity onPress={() => handleEditProperty(index)} style={styles.editButton}>
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => handleDeleteProperty(index)} style={styles.deleteButton}>
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
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8f4f8',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    label: {
        alignSelf: 'flex-start',
        fontSize: 16,
        marginBottom: 4,
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
    propertyItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 10,
    },
    propertyItem: {
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
    },
    editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
        marginRight: 10,
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

export default PropertyManagement;
