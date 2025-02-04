import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Image } from 'react-native'
import styles from '../styles/navigation_barStyles';


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
      <Tab.Navigator
        initialRouteName={homeName}
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            let rn = route.name;

            // Use custom image for HomeScreen
            if (rn === homeName) {
              return (
                <Image
                  source={focused ? require('../assets/placenet.png') : require('../assets/placenet.png')}
                  style={styles.logo}
                />
              );
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

            return <MaterialCommunityIcons name={iconName} size={size} color={color}/>;
          },
          tabBarActiveTintColor: '#404040ff',
          tabBarInactiveTintColor: 'gray',
        })}>

        <Tab.Screen
          name={homeName}
          component={HomeScreen}
          options={{
            headerShown: false, // Remove header for this screen
          }}
        />
        <Tab.Screen
          name={propertyName}
          component={PropertyScreen}
          options={{
            headerShown: false, // Remove header for this screen
          }}
        />
        <Tab.Screen
          name={projectName}
          component={ProjectScreen}
          options={{
            headerShown: false, // Remove header for this screen
          }}
        />
        <Tab.Screen
          name={documentName}
          component={DocumentScreen}
          options={{
            headerShown: false, // Remove header for this screen
          }}
        />
        <Tab.Screen
          name={listingsName}
          component={ListingsScreen}
          options={{
            headerShown: false, // Remove header for this screen
          }}
        />
        <Tab.Screen
          name={profileName}
          component={ProfileScreen}
          options={{
            headerShown: false, // Remove header for this screen
          }}
        />

      </Tab.Navigator>
  );
}

export default MainContainer;


