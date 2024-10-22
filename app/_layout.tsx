//
//This file sets up the navigation stack 
//

import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="main" options={{ title: 'Main Menu' }} />
      <Stack.Screen name="property" options={{ title: 'Property Management' }} />
      <Stack.Screen name="project" options={{ title: 'Project Management' }} />
      <Stack.Screen name="document" options={{ title: 'Document Management' }} />
    </Stack>
  );
}
