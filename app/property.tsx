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
import { db, auth } from "../config/firebaseConfig";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore";
import styles from "../styles/propertyStyles";

const PropertyManagement = () => {
  const [propertyName, setPropertyName] = useState("");
  const [properties, setProperties] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchProperties();
  }, []);

  async function fetchProperties() {
    const querySnapshot = await getDocs(collection(db, "properties"));
    const propertyList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProperties(propertyList);
  }

  const handleAddProperty = async () => {
    if (!propertyName.trim()) {
      Alert.alert("Error!", "Property name is required.");
      return;
    }

    try {
      const newProperty = await addDoc(collection(db, "properties"), {
        name: propertyName,
        userId: auth.currentUser.uid,
      });

      setProperties([...properties, { id: newProperty.id, name: propertyName }]);
      Alert.alert("Success!", "Property added.");
      resetForm();
    } catch (error) {
      Alert.alert("Error!", "Failed to add property.");
    }
  };

  const handleUpdateProperty = async () => {
    if (!editingId || !propertyName.trim()) {
      Alert.alert("Error!", "Property name is required.");
      return;
    }

    try {
      const propertyRef = doc(db, "properties", editingId);
      await updateDoc(propertyRef, { name: propertyName });

      setProperties((prev) =>
        prev.map((prop) =>
          prop.id === editingId ? { ...prop, name: propertyName } : prop
        )
      );

      Alert.alert("Success!", "Property updated.");
      resetForm();
    } catch (error) {
      Alert.alert("Error!", "Failed to update property.");
    }
  };

  const handleDeleteProperty = async (propertyId) => {
    try {
      await deleteDoc(doc(db, "properties", propertyId));
      setProperties((prev) => prev.filter((prop) => prop.id !== propertyId));
      Alert.alert("Deleted!", "Property has been removed.");
    } catch (error) {
      Alert.alert("Error!", "Failed to delete property.");
    }
  };

  const handleEditProperty = (property) => {
    setPropertyName(property.name);
    setEditingId(property.id);
  };

  const resetForm = () => {
    setPropertyName("");
    setEditingId(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Property Name:</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Property Name"
        value={propertyName}
        onChangeText={setPropertyName}
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
                <Text style={styles.propertyItem}>{item.name}</Text>
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
  );
};

export default PropertyManagement;