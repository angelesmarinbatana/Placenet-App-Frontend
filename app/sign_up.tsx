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
  Alert
} from "react-native";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseConfig";
import styles from "../styles/sign_upStyles";

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
      Alert.alert("Success", "Account Created! Please Log In.", [{ text: "OK", onPress: () => router.push("/sign_in") }]);
    } catch (error) {
      setErrorMessage("Failed to create account.");
      console.log("error", error)
    }
  }

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Image source={require("../assets/placenet.png")} style={styles.logo} />
        <Text style={styles.titleText}>Create Your Account</Text>
        <Text style={styles.subText}>Password should be at least 6 characters</Text>

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
        <TextInput 
          style={styles.input} 
          onChangeText={setConfirmPassword} 
          value={confirmPassword} 
          placeholder="Confirm Password" 
          placeholderTextColor="gray" 
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
