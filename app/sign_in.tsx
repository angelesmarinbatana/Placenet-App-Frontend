import React from 'react';
import {StyleSheet, TextInput, Button} from 'react-native'; // need to import on every page -> import things from react native lib
import { useRouter } from 'expo-router'; // need to import on every page -> for app routing 
import {SafeAreaView, SafeAreaProvider} from 'react-native-safe-area-context';

const TextFields = () => { //make resuable component 
    const router = useRouter();
    const [username, onChangeUser] = React.useState('Username');
    const [password, onChangePassword] = React.useState('Password');

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
                onPress={() => router.push('/main')} //when clicked, go to 'main menu' 
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

export default TextFields;