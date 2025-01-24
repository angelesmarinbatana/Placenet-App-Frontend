import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';

// Screens
import HomeScreen from './main';
import ProjectScreen from './project';
import PropertyScreen from './property';
import DocumentScreen from './document';
import ProfileScreen from './property_summary';
import ListingsScreen from './listing_summaries';

//Screen names
const homeName = "Home";
const projectName = "Project";
const propertyName = "Property";
const documentName = "Document";
const profileName = "Profile";
const listingsName = "Social";

const Tab = createBottomTabNavigator();

function MainContainer() {
  return (
    <NavigationContainer independent={true}>
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            if (rn === homeName) {
              iconName = focused ? 'home' : 'home-outline';
            }
            if (rn === projectName) {
              iconName = focused ? 'briefcase' : 'briefcase-outline';
            }
            if (rn === propertyName) {
              iconName = focused ? 'home' : 'home-outline';
            }  
            if (rn === documentName) {
              iconName = focused ? 'file' : 'file-outline';
            }
            if (rn === profileName) {
              iconName = focused ? 'account' : 'account-outline';
            }  
            if (rn === listingsName) {
              iconName = focused ? 'account-group' : 'account-group-outline';
            }    

            // You can return any component that you like here!
            return <MaterialCommunityIcons name={iconName} size={size} color={color}/>;
          },
          tabBarActiveTintColor: '#404040ff',
          tabBarInactiveTintColor: 'gray',
        })}>

        <Tab.Screen name={homeName} component={HomeScreen} />
        <Tab.Screen name={propertyName} component={PropertyScreen} />
        <Tab.Screen name={projectName} component={ProjectScreen} />
        <Tab.Screen name={documentName} component={DocumentScreen} />
        <Tab.Screen name={listingsName} component={ListingsScreen} />
        <Tab.Screen name={profileName} component={ProfileScreen} />

      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default MainContainer;


