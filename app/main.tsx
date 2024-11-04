import { View, Button, StyleSheet, TouchableOpacity, Text } from 'react-native'; // need to import on every page -> import things from react native lib
import { useRouter } from 'expo-router'; // need to import on every page -> for app routing 
import React from 'react';

/* 
  'MAIN MENU' PAGE  
*/

export default function MainMenu() { //make resuable component 
  const router = useRouter(); // use router for navigation

  return (
    <View style={styles.container}>
      {/* Custom Button */}
      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/property')}
      >
        <Text style={styles.buttonText}>Add a new Property</Text>
      </TouchableOpacity>
      

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/project')}
      >
        <Text style={styles.buttonText}>Add a New Project</Text>
      </TouchableOpacity>
      

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/document')}
      >
        <Text style={styles.buttonText}>Add an Invoice/ Receipt</Text>
      </TouchableOpacity>

      <TouchableOpacity 
        style={styles.button} 
        onPress={() => router.push('/document')}
      >
        <Text style={styles.buttonText}>Profile Summary</Text>
      </TouchableOpacity>
    </View>
  );
}
   

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25292e',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#5a5a5a', //
    paddingVertical: 12,        // adjust h
    paddingHorizontal: 20,      // adjust w
    borderRadius: 15,            
    marginVertical: 8,          
    width: '80%',               //adjust  
    alignItems: 'center',
    borderWidth: 3,

  },
  buttonText: {          
    fontSize: 17,
    color: '#fff',
  },
});
