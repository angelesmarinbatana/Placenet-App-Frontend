import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { FormEvent } from 'react';
import { useRouter } from 'expo-router'
import { StyleSheet, TextInput } from 'react-native';
import { Button } from 'react-native'
import React from 'react';
 
export default function LoginPage() {
  const router = useRouter()
  const [username, onChangeUser] = React.useState('Username');
  const [password, onChangePassword] = React.useState('Password');
 
  function handleSubmit() {
    //event.preventDefault()
    if (username == "lala" && password == "lala") {    //scuffed "authentication"
      router.push('/main')
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
            />
            <TextInput
              style={styles.input}
              onChangeText={onChangePassword}
              value={password}
            />
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
});