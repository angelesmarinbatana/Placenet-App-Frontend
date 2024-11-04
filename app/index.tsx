import { Text, View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useRouter } from 'expo-router';

/* 
  WELCOME SCREEN 
*/

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image
      source={require('../assets/file.png')}
      style={styles.logo}
      />
      <Text style={styles.text}>Welcome to Placenet</Text>

      <TouchableOpacity
      style={styles.button}
      onPress={() => router.push('/sign_in')} //when clicked, go to 'main menu' 
      >
        <Text style={styles.buttonText}>Click to Enter</Text>
</TouchableOpacity> 
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width:100,
    height:100,
    marginBottom:20,
  },
  text: {
    color: '#fff',
    fontSize: 27,
    marginBottom:20,
  },

  button: {
    backgroundColor: '#5a5a5a',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 3, 
    
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
  },
});
