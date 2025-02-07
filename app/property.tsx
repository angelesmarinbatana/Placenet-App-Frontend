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
 import { db, auth } from "../firebaseConfig";
 import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
 } from "firebase/firestore";
 import styles from "../styles/propertyStyles";
 import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
 
 
 const PropertyManagement = () => {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [properties, setProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);
 
 
  // prop for auth user
  useEffect(() => {
    fetchUserProperties();
  }, []);
 
 
  const fetchUserProperties = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
 
 
      const propertiesSnapshot = await getDocs(collection(db, `users/${userId}/properties`));
      const propertyList = propertiesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
 
 
      setProperties(propertyList);
    } catch (error) {
      Alert.alert("Error!", "Failed to fetch properties.");
    }
  };
 
 
  //prop under user collection
  const handleAddProperty = async () => {
    if (!street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      Alert.alert("Error!", "All address fields must be filled out.");
      return;
    }
 
 
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        Alert.alert("Error!", "User not authenticated.");
        return;
      }
 
 
      const newProperty = await addDoc(collection(db, `users/${userId}/properties`), {
        street,
        city,
        state,
        zip,
      });
 
 
      setProperties([...properties, { id: newProperty.id, street, city, state, zip }]);
      Alert.alert("Success!", "Property added.");
      resetForm();
    } catch (error) {
      Alert.alert("Error!", "Failed to add property.");
    }
  };
 
 
  //update prop
  const handleUpdateProperty = async () => {
    if (!editingId || !street.trim() || !city.trim() || !state.trim() || !zip.trim()) {
      Alert.alert("Error!", "All address fields must be filled out.");
      return;
    }
 
 
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
 
 
      const propertyRef = doc(db, `users/${userId}/properties`, editingId);
      await updateDoc(propertyRef, { street, city, state, zip });
 
 
      setProperties((prev) =>
        prev.map((prop) =>
          prop.id === editingId ? { ...prop, street, city, state, zip } : prop
        )
      );
 
 
      Alert.alert("Success!", "Property updated.");
      resetForm();
    } catch (error) {
      Alert.alert("Error!", "Failed to update property.");
    }
  };
 
 
  //del prop
  const handleDeleteProperty = async (propertyId) => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;
 
 
      await deleteDoc(doc(db, `users/${userId}/properties`, propertyId));
      setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
 
 
      Alert.alert("Deleted!", "Property has been removed.");
    } catch (error) {
      Alert.alert("Error!", "Failed to delete property.");
    }
  };
 
 
  //edit prop
  const handleEditProperty = (property) => {
    setStreet(property.street);
    setCity(property.city);
    setState(property.state);
    setZip(property.zip);
    setEditingId(property.id);
  };
 
 
  //reset form
  const resetForm = () => {
    setStreet('');
    setCity('');
    setState('');
    setZip('');
    setEditingId(null);
  };
 
 
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.container}>
          <Text style={styles.title}>Enter a Property:</Text>
 
 
          <Text style={styles.label}>Street:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Street"
            placeholderTextColor="gray"
            value={street}
            onChangeText={setStreet}
          />
          <Text style={styles.label}>City:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter City"
            placeholderTextColor="gray"
            value={city}
            onChangeText={setCity}
          />
          <Text style={styles.label}>State:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter State"
            placeholderTextColor="gray"
            value={state}
            onChangeText={setState}
          />
          <Text style={styles.label}>Zip Code:</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Zip Code"
            placeholderTextColor="gray"
            value={zip}
            onChangeText={setZip}
            keyboardType="numeric"
          />
 
 
          <Button
            title={editingId ? "Update Property" : "Add Property"}
            onPress={editingId ? handleUpdateProperty : handleAddProperty}
          />
 
 
          {properties.length > 0 && (
            <View style={styles.listContainer}>
              <Text style={styles.listTitle}>Properties Added:</Text>
              <FlatList
                data={properties}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.propertyItemContainer}>
                    <Text style={styles.propertyItem}>
                      {item.street}, {item.city}, {item.state}, {item.zip}
                    </Text>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity onPress={() => handleEditProperty(item)} style={styles.editButton}>
                        <Text style={styles.buttonText}>Edit</Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => handleDeleteProperty(item.id)} style={styles.deleteButton}>
                        <Text style={styles.buttonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              />
            </View>
          )}
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
 };
 
 
 export default PropertyManagement;
 
 
 
 