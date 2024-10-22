import { useRouter } from 'expo-router';
import { Text, View, /* @tutinfo Import <CODE>StyleSheet</CODE> to define styles. */ StyleSheet, Button } from 'react-native';

//
// This is the welcome screen 
//

export default function Index() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Yo, Welcome to Placenet!</Text>
      <Button
      title="Click to Enter" //button
      onPress={() => router.push('/main')} //when clicked, go to main menu 
      color="#E8F3FF" //change "Click to Enter" color 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    /* @tutinfo Add the value of <CODE>backgroundColor</CODE> property with <CODE>'#25292e'</CODE>.*/
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#fff',
    fontSize: 25,
  },
});
