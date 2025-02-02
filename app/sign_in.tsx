import { 
  SafeAreaProvider, 
  SafeAreaView 
} from 'react-native-safe-area-context';

import { 
  TextInput, 
  Text, 
  TouchableOpacity, 
  View, 
  Image 
} from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import api from '../API/api';
import * as SecureStore from 'expo-secure-store';
import styles from '../styles/sign_inStyles';

export default function LoginPage() {
  const router = useRouter();
  const [username, onChangeUser] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  async function handleSubmit() {
    //console.log('Submitting:', username, password); debug
    try {
      //send request to enpoint 
      const response = await api.post('/auth/login', { username, password });
      const token = response.data.token;
      const userId = response.data.userId;

      //save token & id 
      await SecureStore.setItemAsync('userToken', token);
      await SecureStore.setItemAsync('userId', String(userId));

      const storedToken = await SecureStore.getItemAsync('userToken');
      if (storedToken) {
      //console.log('Token successfully saved to SecureStore:', storedToken); debug
    } else {
      console.error('Failed to save token in SecureStore');
    }

      setErrorMessage('');//clear prev mgs
      router.push('/navigation_bar'); //go to main
    } catch (error) {
      setErrorMessage('Invalid Credentials! Try Again.');
      console.error('Login error:', error);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/placenet.png')} style={styles.logo} />
        <Text style={styles.titleText}>Welcome Back!</Text>
        <Text style={styles.subtitleText}>Sign in your account</Text>

        <TextInput
          style={styles.input}
          onChangeText={onChangeUser}
          value={username}
          placeholder="Username"
          placeholderTextColor="#A9A9A9"
        />

        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        <View style={styles.signupContainer}>
          <Text style={styles.signupText}>Don't have an account?</Text>
          <Text
            style={styles.signupLink}
            onPress={() => router.push('/sign_up')}
          >
            Sign Up
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}