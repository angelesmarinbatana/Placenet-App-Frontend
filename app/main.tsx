import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { 
  StyleSheet, 
  Text, 
  TouchableOpacity, 
  View, 
  Image 
} from 'react-native';
import React from 'react';

/* Main Menu Page */
export default function MainMenu() {
  const router = useRouter();

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require('../assets/placenet.png')} style={styles.logo} />

        {/* Title */}
        <Text style={styles.titleText}>Main Menu</Text>

        {/* Custom Buttons */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/property')}
        >
          <Text style={styles.buttonText}>Add a New Property</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/project')}
        >
          <Text style={styles.buttonText}>Add a New Project</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/document')}
        >
          <Text style={styles.buttonText}>Add an Invoice/Receipt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => router.push('/property_summary')}
        >
          <Text style={styles.buttonOutlineText}>Property Summary</Text>
        </TouchableOpacity>
        

        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => router.push('/listing_summaries')}
        >
          <Text style={styles.buttonOutlineText}>Community Property Summaries</Text>
        </TouchableOpacity>



      </SafeAreaView>
    </SafeAreaProvider>
  );
}




//move this
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
    marginBottom: 30,
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
