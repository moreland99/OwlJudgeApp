import React, { useState } from "react";
import { View, TextInput, Button, Text, StyleSheet, Image, Alert } from "react-native";
import { Card } from "react-native-paper";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { app } from "../firebase/firebaseConfig";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const navigation = useNavigation();
  const auth = getAuth(app);

  const handleLogin = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate("Admin Dashboard");
      setEmail("");
      setPassword("");
      Alert.alert("Login Successful", "Welcome back!", [{ text: "OK" }]);
    } catch (error) {
      console.error("Login Error:", error.message);
      setErrorMessage(error.message);
      Alert.alert("Login Failed", error.message, [{ text: "OK" }]);
    }
  };

  return (
    <View style={styles.container}>
      <Card style={styles.cardStyle}>
        <Card.Content>
          <Image
            source={require("../assets/owlJudgeLogo.png")}
            style={styles.logo}
          />
          <Text style={styles.title}>Login</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Button title="Log In" onPress={handleLogin} />
          <Button
            title="Create Account"
            onPress={() => navigation.navigate("CreateAccount")}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
        </Card.Content>
      </Card>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  cardStyle: {
    flex: 1,
    padding: 20,
    borderRadius: 10,
    elevation: 3,
  },
  logo: {
    width: 100,
    height: 100,
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginTop: 10,
  },
});

export default LoginScreen;
