import { 
  SafeAreaProvider, 
  SafeAreaView } 
  from "react-native-safe-area-context";

import { 
  TextInput, 
  Text, 
  TouchableOpacity, 
  View, 
  Image, 
  Alert } 
  from "react-native";

import { 
  getAuth, 
  signInWithEmailAndPassword 
} from "firebase/auth";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import * as SecureStore from "expo-secure-store";
import api from "../API/api"; // Import axios API
import styles from "../styles/sign_inStyles";
import { auth } from "../config/firebaseConfig"; // Import Firebase authentication instance

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignIn() {
    //console.log('Submitting:', username, password); debug
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get Firebase token

      //store token
      await SecureStore.setItemAsync("userToken", token);
      console.log("Firebase token stored:", token);

     //route to main
      setErrorMessage(""); //clear prev msg
      router.push("/main");//gt main
    } catch (error) {
      setErrorMessage("Invalid Credentials! Try Again.");
      console.error("Firebase login error:", error.message);
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
          placeholderTextColor="#A9A9A9"
        />
        <TextInput
          style={styles.input}
          onChangeText={setPassword}
          value={password}
          placeholder="Password"
          placeholderTextColor="#A9A9A9"
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
