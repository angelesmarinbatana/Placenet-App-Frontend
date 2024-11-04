import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'
import { StyleSheet, TextInput, Text, TouchableOpacity} from 'react-native';
import React from 'react';
 
export default function LoginPage() {
  const router = useRouter()
  const [username, onChangeUser] = React.useState('');
  const [password, onChangePassword] = React.useState('');
  const [errorMessage, setErrorMessage] = React.useState(''); //error message 
 
  function handleSubmit() {
    //event.preventDefault()
    if (username == "lala" && password == "lala") {    //scuffed "authentication"
      setErrorMessage(''); //clear previous
      router.push('/main')
    } else {
      setErrorMessage('Invalid Credentials! Try Again.');
    }
    /*const formData = new FormData(event.currentTarget)
    const email = formData.get('email')
    const password = formData.get('password')
 
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
 
    if (response.ok) {
      router.push('/main')
    } else {
      // Handle errors
    }*/

      //TODO: Actual auth implementation, commented code is for that exact purpose, pls dont touch <3
  }
 
  return (
    <SafeAreaProvider>
          <SafeAreaView
            style={styles.container}>
            <TextInput
              style={styles.input}
              onChangeText={onChangeUser}
              value={username}
              placeholder='Username' //placeholder
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangePassword}
              value={password}
              placeholder='Password' //placeholder
            />

            {errorMessage ? ( <Text style={styles.errorText}>{errorMessage}</Text> ) : null}

            <TouchableOpacity 
            style={styles.button} 
            onPress={handleSubmit}>
          <Text 
          style={styles.buttonText}
          >Log In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
      );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#25292e',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
  },
  input: {
    backgroundColor: '#5a5a5a',
    borderColor: '#ffffff',
    borderRadius: 15,
    height: 40,
    width: '100%',
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  },
  button: {
    backgroundColor: '#ffffff',
    borderRadius: 15,
    height: 40,
    width: '30%',
    margin: 12,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
  },
  buttonText: {
    fontSize: 18,
    textAlign: 'center',
  },
});