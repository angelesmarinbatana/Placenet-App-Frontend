import { 
  SafeAreaProvider, 
  SafeAreaView 
} from 'react-native-safe-area-context';

import { 
  StyleSheet, 
  Text, 
  View, 
  FlatList, 
  Image, 
  ActivityIndicator 
} from 'react-native';

import React, { 
  useEffect, 
  useState 
} from 'react';
import api from '../API/api';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/listing_summariesStyles';

export default function ListingSummariesPage() {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    //get summary
    async function fetchProfileSummary() {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (!token) {
          setErrorMessage('Authentication failed! Please log in again.');
          return;
        }

        const response = await api.get('/listings');
        var properties: { [id: string] : Array<T>; } = {}
        var i = 1;
        properties["Properties"] = response.data[0].Properties;

        while(i != response.data.length){
          for(var j in response.data[i].Properties) 
            properties["Properties"].push(response.data[i].Properties[j]);
          i++;
        }
       // console.log(properties); //debug
        
        
        //console.log(response.data); //debug 
        //console.log(properties["Properties"]); //debug 
        //console.log(properties.Properties);  //debug
        setProperties(properties.Properties);
        setLoading(false);
      } catch (error) {
        //console.error('Error fetching property summary:', error); //debug
        setErrorMessage('Failed to load property summary. Please try again later.');
        setLoading(false);
      }
    }

    fetchProfileSummary();
  }, []);

  //render prop items
  const renderProperty = ({ item }) => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyName}>{item.name}</Text>

      {/* Projects Section */}
      <Text style={styles.sectionTitle}>Projects:</Text>
      {item.Projects && item.Projects.map((project) => (
        <View key={project.project_id}>
          <Text style={styles.itemText}>- {project.name}</Text>

          {/* Documents Section */}
          <Text style={styles.sectionTitle}>Documents:</Text>
          {project.Documents && project.Documents.map((document) => (
            <Text key={document.document_id} style={styles.itemText}>
              - {document.file_name}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Image
          source={require('../assets/placenet.png')}
          style={styles.logo}
        />
        <Text style={styles.titleText}>Property Summary</Text>

        {/* Loading Indicator */}
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <>
            {/* Error Message */}
            {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

            {/* Property List */}
            <FlatList
              data={properties}
              keyExtractor={(item) => item.property_id.toString()}
              renderItem={renderProperty}
              contentContainerStyle={styles.listContainer}
            />
          </>
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
}