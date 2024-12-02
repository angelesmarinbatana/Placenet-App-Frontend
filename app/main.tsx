import { 
  SafeAreaProvider, 
  SafeAreaView 
} from 'react-native-safe-area-context';

import {  
  Text, 
  TouchableOpacity,  
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import styles from '../styles/mainStyles';

export default function MainMenu() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/placenet.png')} style={styles.logo} />

        {/* Title */}
        <Text style={styles.titleText}>Main Menu</Text>

        {/* Custom Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/property')}
        >
          <Text style={styles.buttonText}>Add a New Property</Text>
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
          <Text style={styles.buttonText}>Add an Invoice/Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => router.push('/property_summary')}
        >
          <Text style={styles.buttonOutlineText}>Property Summary</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => router.push('/listing_summaries')}
        >
          <Text style={styles.buttonOutlineText}>Community Property Summaries</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
