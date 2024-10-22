import { Stack } from 'expo-router';

/* 
  NAVIGATION STRUCTURE  
*/

export default function RootLayout() {
  return (
    //DIFFERENT PAGES IN APP: 
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="main" options={{ title: 'Main Menu' }} />
      <Stack.Screen name="property" options={{ title: 'Property Management' }} />
      <Stack.Screen name="project" options={{ title: 'Project Management' }} />
      <Stack.Screen name="document" options={{ title: 'Document Management' }} />
    </Stack>
  );
}
