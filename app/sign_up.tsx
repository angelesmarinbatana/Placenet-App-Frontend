import { 
  SafeAreaProvider, 
  SafeAreaView 
} from "react-native-safe-area-context";
import { 
  TextInput, 
  Text, 
  TouchableOpacity, 
  View, 
  Image, 
  Alert } from "react-native";
  import { 
    getAuth, 
    createUserWithEmailAndPassword 
  } from "firebase/auth";

import { useRouter } from "expo-router";
import React, { useState } from "react";
import styles from "../styles/sign_upStyles";
import { auth } from "../config/firebaseConfig"; 

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSignUp() {
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match!");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Success", "User created successfully! Please log in.", [
        { text: "OK", onPress: () => router.push("/sign_in") },
      ]);
    } catch (error) {
      setErrorMessage("Registration failed! Please try again.");
      console.error("Firebase registration error:", error.message);
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require("../assets/placenet.png")} style={styles.logo} />
        <Text style={styles.titleText}>Create Your Account</Text>
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
        <TextInput
          style={styles.input}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          placeholder="Confirm Password"
          placeholderTextColor="#A9A9A9"
          secureTextEntry
        />

        {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

        <TouchableOpacity style={styles.button} onPress={handleSignUp}>
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
