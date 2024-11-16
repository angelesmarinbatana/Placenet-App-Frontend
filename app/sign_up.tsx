import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StyleSheet, TextInput, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';
import api from '../API/api';  // Import your API
import * as SecureStore from 'expo-secure-store';

export default function SignUpPage() {
  const router = useRouter();
  const [username, onChangeUsername] = React.useState('');
  const [email, onChangeEmail] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [confirmPassword, onChangeConfirmPassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState('');

  async function handleSignUp() {
    if (password !== confirmPassword) {
      setErrorMessage('Passwords do not match!');
      return;
    }

    try {
      const response = await api.post('/users/register', { username, email, password });
      const token = response.data.token;
      await SecureStore.setItem('userToken', token);
      setErrorMessage('');
      router.push('/main'); // Navigate to main screen after sign up
    } catch (error) {
      setErrorMessage('Registration failed! Please try again.');
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image
          source={require('../assets/placenet.png')} // Update path if necessary
          style={styles.logo}
        />
        <Text style={styles.titleText}>Create Your Account</Text>

        {/* Username Input */}
        <TextInput
          style={styles.input}
          onChangeText={onChangeUsername}
          value={username}
          placeholder="Username"
          placeholderTextColor="#A9A9A9"
        />

        {/* Email Input */}
        <TextInput
          style={styles.input}
          onChangeText={onChangeEmail}
          value={email}
          placeholder="Email"
          placeholderTextColor="#A9A9A9"
          keyboardType="email-address"
          autoCapitalize="none"
        />

        {/* Password Input */}
        <TextInput
          style={styles.input}
          onChangeText={onChangePassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
        />

        {/* Confirm Password Input */}
        <TextInput
          style={styles.input}
          onChangeText={onChangeConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
        />

        {/* Error Message */}
        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        {/* Sign Up Button */}
        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        {/* Link to Sign In */}
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
  input: {
    backgroundColor: '#F0F0F0',
    borderColor: '#C0C0C0',
    borderRadius: 5,
    height: 50,
    width: '80%',
    margin: 12,
    paddingHorizontal: 10,
    fontSize: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#404040ff',
    borderRadius: 5,
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  signinContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  signinText: {
    color: '#A9A9A9',
    fontSize: 14,
  },
  signinLink: {
    color: '#0000FF',
    fontSize: 14,
    marginLeft: 5,
    textDecorationLine: 'underline',
  },
});
