import { Stack } from 'expo-router';
/* NAVIGATION STRUCTURE  */
export default function RootLayout() {
  return (
    //PAGES IN APP: 
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Welcome' }} />
      <Stack.Screen name="main" options={{ title: 'Main Menu' }} />
      <Stack.Screen name="property" options={{ title: 'Property Management' }} />
      <Stack.Screen name="project" options={{ title: 'Project Management' }} />
      <Stack.Screen name="document" options={{ title: 'Document Management' }} />
      <Stack.Screen name="property_summary" options={{ title: 'Property Summary' }} />
      <Stack.Screen name="sign_in" options={{ title: 'Sign In', headerShown: false }} />
      <Stack.Screen name="sign_up" options={{ title: 'Sign Up', headerShown: false }} />
      <Stack.Screen name="listing_summaries" options={{ title: 'Social Project Summaries' }} />
      <Stack.Screen name="navigation_bar" options={{ title: 'Navigation Bar', headerShown: false }} />
      <Stack.Screen name="settings_page" options={{ title: 'Settings' }} />
    </Stack>
  );
}