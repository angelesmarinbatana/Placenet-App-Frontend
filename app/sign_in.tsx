import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router'
import { StyleSheet, TextInput, Text, } from 'react-native';
import { Button } from 'react-native'
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
          <SafeAreaView>
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

            <Button
                title="Sign In" //button
                onPress={handleSubmit} //when clicked, go to 'main menu' 
                color="#000000" //change 'Click to Enter' color 
            />
          </SafeAreaView>
        </SafeAreaProvider>
      );
  
}

const styles = StyleSheet.create({
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  errorText: {
    color: 'red',
    textAlign: 'center'
  }
});