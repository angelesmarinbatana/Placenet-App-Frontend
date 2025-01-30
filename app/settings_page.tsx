import * as React from 'react';
import { 
    SafeAreaProvider, 
    SafeAreaView 
} from 'react-native-safe-area-context';

import {  
    Text, 
    TouchableOpacity,  
} from 'react-native';

import { useRouter } from 'expo-router';
import styles from '../styles/mainStyles';


export default function Settings() {
    const router = useRouter();
  
    return (
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          {/* Custom Buttons */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push('/sign_in')}
          >
            <Text style={styles.buttonText}>Log out</Text>
          </TouchableOpacity>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}