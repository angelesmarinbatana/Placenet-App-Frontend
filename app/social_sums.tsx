import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, View, FlatList, Image } from 'react-native';
import React from 'react';


//change later 
const mockUserData = [
  {
    user_id: 1,
    name: 'John Doe',
    properties: [
      {
        property_id: 101,
        name: 'Greenwood Estate',
        projects: [
          {
            project_id: 201,
            name: 'Renovation Project',
            documents: [
              { document_id: 301, file_name: 'Blueprint.pdf' },
              { document_id: 302, file_name: 'BudgetPlan.pdf' },
            ],
          },
        ],
      },
    ],
  },
  {
    user_id: 2,
    name: 'Jane Smith',
    properties: [
      {
        property_id: 102,
        name: 'Sunnyvale Apartments',
        projects: [
          {
            project_id: 202,
            name: 'New Construction',
            documents: [
              { document_id: 303, file_name: 'SitePlan.pdf' },
            ],
          },
        ],
      },
    ],
  },
];

export default function AllUsersPropertySummaryPage() {
  const renderProperty = (property) => (
    <View style={styles.propertyContainer}>
      <Text style={styles.propertyName}>{property.name}</Text>
      <Text style={styles.sectionTitle}>Projects:</Text>
      {property.projects.map((project) => (
        <View key={project.project_id}>
          <Text style={styles.itemText}>- {project.name}</Text>
          <Text style={styles.sectionTitle}>Documents:</Text>
          {project.documents.map((document) => (
            <Text key={document.document_id} style={styles.itemText}>
              - {document.file_name}
            </Text>
          ))}
        </View>
      ))}
    </View>
  );

  const renderUser = ({ item }) => (
    <View style={styles.userContainer}>
      <Text style={styles.userName}>{item.name}</Text>
      {item.properties.map((property) => renderProperty(property))}
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../assets/placenet.png')}
          style={styles.logo}
        />
        <Text style={styles.titleText}>All Users' Property Summaries</Text>
        <FlatList
          data={mockUserData}
          keyExtractor={(item) => item.user_id.toString()}
          renderItem={renderUser}
          contentContainerStyle={styles.listContainer}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  logo: {
    width: 200,
    height: 110,
    marginBottom: 20,
  },
  titleText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
    width: '100%',
  },
  userContainer: {
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    padding: 15,
    marginVertical: 15,
    width: '100%',
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  userName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#404040',
    marginBottom: 10,
  },
  propertyContainer: {
    backgroundColor: '#F8F8F8',
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    borderColor: '#E0E0E0',
    borderWidth: 1,
  },
  propertyName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#404040',
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    marginTop: 10,
    marginBottom: 5,
  },
  itemText: {
    fontSize: 14,
    color: '#404040',
    marginBottom: 3,
  },
});
