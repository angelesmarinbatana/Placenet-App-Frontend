import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, StyleSheet, Alert, FlatList, Text, TouchableOpacity } from 'react-native';
import api from '../API/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Property {
  property_id: number;
  name: string;
}

const PropertyManagement: React.FC = () => {
    const [street, setStreet] = useState<string>(''); 
    const [city, setCity] = useState<string>(''); 
    const [state, setState] = useState<string>(''); 
    const [zip, setZip] = useState<string>(''); 
    const [properties, setProperties] = useState<Property[]>([]); 
    const [editingIndex, setEditingIndex] = useState<number | null>(null); 

    const fetchProperties = async () => {
      try {
        const userId = await AsyncStorage.getItem('userId');
        if (userId) {
          const response = await api.get(`/properties?user_id=${userId}`);
          setProperties(response.data);
        }
      } catch (error) {
        Alert.alert('Error!', 'Failed to fetch properties.');
        console.error('Error fetching properties:', error);
      }
    };

    useEffect(() => {
        fetchProperties();
    }, []);

    const handleAddProperty = async () => {
        if (street.trim() && city.trim() && state.trim() && zip.trim()) {
            const userId = await AsyncStorage.getItem('userId');
            const fullAddress = `${street}, ${city}, ${state} ${zip}`;

            if (editingIndex !== null) {
                await updateProperty(editingIndex, fullAddress);
            } else {
                try {
                    const response = await api.post('/properties', {
                        user_id: userId,
                        name: fullAddress,
                    });
                    setProperties([...properties, response.data]);
                    Alert.alert('Successful!', 'Property has been added!');
                } catch (error) {
                    Alert.alert('Error!', 'Failed to add property.');
                    console.error('Error adding property:', error);
                }
            }

            setStreet('');
            setCity('');
            setState('');
            setZip('');
            setEditingIndex(null);
        } else {
            Alert.alert('Error!', 'All address fields must be filled out!');
        }
    };

    const updateProperty = async (propertyId: number, newAddress: string) => {
        try {
            await api.put(`/properties/${propertyId}`, { name: newAddress });
            Alert.alert('Successful!', 'Property has been updated!');
            fetchProperties();
        } catch (error) {
            Alert.alert('Error!', 'Failed to update property.');
            console.error('Error updating property:', error);
        }
    };

    const handleEditProperty = (property: Property) => {
        const [street, city, state, zip] = property.name.split(', ');
        setStreet(street);
        setCity(city);
        setState(state);
        setZip(zip);
        setEditingIndex(property.property_id);
    };

    const handleDeleteProperty = async (propertyId: number) => {
        try {
            await api.delete(`/properties/${propertyId}`);
            Alert.alert('Deleted!', 'Property has been removed.');
            fetchProperties();
        } catch (error) {
            Alert.alert('Error!', 'Failed to delete property.');
            console.error('Error deleting property:', error);
        }
    };

    // New function to select a property for project management
    const handleSelectProperty = async (propertyId: number) => {
        try {
            await AsyncStorage.setItem('selectedPropertyId', propertyId.toString());
            Alert.alert('Selected!', 'Property selected for project management.');
        } catch (error) {
            Alert.alert('Error!', 'Failed to select property.');
            console.error('Error selecting property:', error);
        }
    };

    return (
        <View style={styles.container}>
            {/* Input fields for adding/editing properties */}
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

            {/* Display the list of properties */}
            {properties.length > 0 && (
                <View style={styles.listContainer}>
                    <Text style={styles.listTitle}>Properties Added:</Text>
                    <FlatList
                        data={properties}
                        keyExtractor={(item) => item.property_id.toString()}
                        renderItem={({ item }) => (
                            <View style={styles.propertyItemContainer}>
                                <Text style={styles.propertyItem}>{item.name}</Text>
                                <View style={styles.buttonContainer}>
                                    <TouchableOpacity 
                                        onPress={() => handleEditProperty(item)} 
                                        style={styles.editButton}
                                    >
                                        <Text style={styles.buttonText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => handleDeleteProperty(item.property_id)} 
                                        style={styles.deleteButton}
                                    >
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        onPress={() => handleSelectProperty(item.property_id)} 
                                        style={styles.selectButton}
                                    >
                                        <Text style={styles.buttonText}>Select Property</Text>
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
        alignItems: 'flex-start',  // Aligns contents to the start
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 10,
        marginBottom: 10,          // Adds space between properties
    },
    propertyItem: {
        fontSize: 16,
        marginBottom: 8,           // Adds space between the name and buttons
    },
    buttonContainer: {
        flexDirection: 'row',       // Aligns buttons horizontally
        justifyContent: 'flex-start', // Aligns buttons to the left
        gap: 8,                     // Adds space between buttons
    },
    editButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    deleteButton: {
        backgroundColor: '#f44336',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 5,
    },
    selectButton: { 
        backgroundColor: '#1E90FF', 
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
