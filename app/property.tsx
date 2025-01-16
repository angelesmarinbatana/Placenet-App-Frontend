import React, { 
  useState,
   useEffect 
} from 'react';

import { 
  View, 
  TextInput, 
  Button, 
  Alert, 
  FlatList, 
  Text, 
  TouchableOpacity 
} from 'react-native';
import api from '../API/api';
import styles from '../styles/propertyStyles';

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

  //all props
  const fetchProperties = async () => {
    try {
      const response = await api.get('/properties');
      setProperties(response.data);
    } catch (error) {
      Alert.alert('Error!', 'Failed to fetch properties.');
      //console.error('Error fetching properties:', error); //debug
    }
  };
  useEffect(() => {
    fetchProperties();
  }, []);

  //helper function to reset form fields:
  const resetFeilds = () => {
    setStreet('');
    setCity('');
    setState('');
    setZip('');
    setEditingIndex(null);
  };
  
  //add/edit
  const handleAddProperty = async () => {
    if (street.trim() && city.trim() && state.trim() && zip.trim()) {
      const fullAddress = `${street}, ${city}, ${state}, ${zip}`;

      if (editingIndex !== null) {
        //update
        await updateProperty(editingIndex, fullAddress);
      } else {
        // add new
        try {
          const response = await api.post('/properties', {
            name: fullAddress,
          });
          setProperties([...properties, response.data]); //add to list 
          Alert.alert('Successful!', 'Property has been added!');
        } catch (error) {
          Alert.alert('Error!', 'Failed to add property.');
          //console.error('Error adding property:', error); //debug
        }
      }
      resetFeilds();
    } else {
      Alert.alert('Error!', 'All address fields must be filled out!');
    }
  };


  //update
  const updateProperty = async (propertyId: number, newAddress: string) => {
    try {
      await api.put(`/properties/${propertyId}`, { name: newAddress });
      Alert.alert('Successful!', 'Property has been updated!');
      fetchProperties(); //refresh list after update 
    } catch (error) {
      Alert.alert('Error!', 'Failed to update property.');
      //console.error('Error updating property:', error); //debug
    }
  };

  //edit proj
  const handleEditProperty = (property: Property) => {
    const [street, city, state, zip] = property.name.split(', ');
    setStreet(street);
    setCity(city);
    setState(state);
    setZip(zip);
    setEditingIndex(property.property_id); //track proj being edit 
  };

  //delete 
  const handleDeleteProperty = async (propertyId: number) => {
    try {
      await api.delete(`/properties/${propertyId}`);
      Alert.alert('Deleted!', 'Property has been removed.');
      fetchProperties(); //refresh list 
    } catch (error) {
      Alert.alert('Error!', 'Failed to delete property.');
      //console.error('Error deleting property:', error); //debug 
    }
  };

  return (
    <View style={styles.container}>
      {/* input fields for adding/editing properties */}
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

      {/* display the list of properties */}
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
                </View>
              </View>
            )}
          />
        </View>
      )}
    </View>
  );
};

export default PropertyManagement;
