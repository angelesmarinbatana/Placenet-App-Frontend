import { 
  SafeAreaProvider, 
  SafeAreaView
 } from 'react-native-safe-area-context';

import { 
  Text, 
  TouchableOpacity, 
  Image 
} from 'react-native';
import React from 'react';
import styles from '../styles/indexStyles';
import { useRouter } from 'expo-router';

export default function IndexPage() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/placenet.png')} style={styles.logo} />
        <Text style={styles.titleText}>Welcome to Placenet!</Text>
        <Text style={styles.subtitleText}>For property and community care</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/sign_in')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => router.push('/sign_up')}
        >
          <Text style={styles.buttonOutlineText}>Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
