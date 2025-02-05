import {
  SafeAreaProvider,
  SafeAreaView
} from "react-native-safe-area-context";
import {
  TextInput,
  Text,
  TouchableOpacity,
  View,
  Image
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import styles from "../styles/sign_inStyles";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn() {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); 

      await SecureStore.setItemAsync("userToken", token);
      router.push("/navigation_bar");
    } catch (error) {
      setErrorMessage("Invalid Credentials! Try Again.");
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require("../assets/placenet.png")} style={styles.logo} />
        <Text style={styles.titleText}>Welcome Back!</Text>
        <Text style={styles.subtitleText}>Sign in to your account</Text>

        <TextInput 
          style={styles.input} 
          onChangeText={setEmail} 
          value={email} 
          placeholder="Email"
          placeholderTextColor="gray" 
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput 
          style={styles.input} 
          onChangeText={setPassword} 
          value={password} 
          placeholder="Password" 
          placeholderTextColor="gray"
          secureTextEntry 
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignIn}>
          <Text style={styles.buttonText}>Sign In</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
