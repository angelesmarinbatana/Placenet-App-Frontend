import { 
  SafeAreaProvider, 
  SafeAreaView 
} from 'react-native-safe-area-context';

import { 
  TextInput, 
  Text, 
  TouchableOpacity, 
  View, 
  Image, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';
import React from 'react';
import api from '../API/api';
import styles from '../styles/sign_upStyles';

export default function SignUpPage() {
  const router = useRouter();
  const [username, onChangeUsername] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [confirmPassword, onChangeConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');


  //handle sign in 
  async function handleSignUp() {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await api.post('/auth/register', { username, password });
      
      if (response.status === 201) {
        //redirect to sign in + success message 
        setErrorMessage('');
        Alert.alert('Success', 'User created successfully! Please log in.', [
          { text: 'OK', onPress: () => router.push('/sign_in') },
        ]);
      }
    } catch (error) {
      setErrorMessage('Registration failed! Please try again.');
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/placenet.png')} style={styles.logo} />
        <Text style={styles.titleText}>Create Your Account</Text>
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
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
          secureTextEntry
        />
        <TextInput
          style={styles.input}
          onChangeText={onChangeConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
        />
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
        <View style={styles.signinContainer}>
          <Text style={styles.signinText}>Already have an account?</Text>
          <Text
            style={styles.signinLink}
            onPress={() => router.push('/sign_in')}
          >
            Sign In
          </Text>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}