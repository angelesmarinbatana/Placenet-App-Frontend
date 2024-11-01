import { Text, View, StyleSheet, Button, Image } from 'react-native';
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

      <Button
      title="Click to Enter" //button
      onPress={() => router.push('/sign_in')} //when clicked, go to 'main menu' 
      color="#E8F3FF" //change 'Click to Enter' color 
      />

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
    fontSize: 25,
    marginBottom:20,
  },

  button:{
    fontSize:10,
    color: '#0ff'
  },
});
