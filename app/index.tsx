import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View, Image } from 'react-native';
import React from 'react';

export default function IndexPage() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Logo */}
        <Image
          source={require('../assets/placenet.png')}
          style={styles.logo}
        />

        {/* App Title */}
        <Text style={styles.titleText}>Welcome to Placenet!</Text>
        <Text style={styles.subtitleText}>For property and community care</Text>

        {/* Sign In Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/sign_in')}
        >
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>

        {/* Sign Up Button */}
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







//need to move this///

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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
    textAlign: 'center',
  },
  subtitleText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 40,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#404040ff',
    borderRadius: 5,
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
  },
  buttonOutline: {
    borderColor: '#404040ff',
    borderWidth: 1,
    borderRadius: 5,
    height: 50,
    width: '80%',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonOutlineText: {
    color: '#404040ff',
    fontSize: 18,
    textAlign: 'center',
  },
});
