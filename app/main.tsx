import { View, Button, StyleSheet } from 'react-native'; // need to import on every page -> import things from react native lib
import { useRouter } from 'expo-router'; // need to import on every page -> for app routing 

/* 
  'MAIN MENU' PAGE  
*/

export default function MainMenu() { //make resuable component 
  const router = useRouter(); // use router for navigation

  return (
    // make 'view' container + apply styling 
    <View style={styles.container}>
      <Button 
        title="Property Management" 
        onPress={() => router.push('/property')} 
        color="#1e90ff"
      />
      <Button 
        title="Project Management" 
        onPress={() => router.push('/project')} 
        color="#1e90ff"
      />
      <Button 
        title="Document Management" 
        onPress={() => router.push('/document')} 
        color="#1e90ff"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // container grows dynamically to screen size 
    backgroundColor: '#25292e',
    alignItems: 'center', //center things horizontal 
    justifyContent: 'center', //center things vertical
  },
});
