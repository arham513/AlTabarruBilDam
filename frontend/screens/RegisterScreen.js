import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const passwordsMatch = password === confirmPassword;

  const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const isFormValid = () => {
    return (
      name.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      address.trim() !== "" &&
      password.trim() !== "" &&
      confirmPassword.trim() !== "" &&
      passwordsMatch &&
      isValidEmail(email)
    );
  };

  const handleSignUp = () => {
    navigation.navigate("EligibilityQ1", {
      name,
      email,
      phone,
      address,
      password,
      confirmPassword,
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>SIGN UP</Text>

        <Text style={styles.inputLabel}>Enter Your Name</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Your Name"
          placeholderTextColor="#555"
          style={styles.input}
        />

        <Text style={styles.inputLabel}>Enter Your Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Your Email"
          placeholderTextColor="#555"
          style={styles.input}
          keyboardType="email-address"
        />

        <Text style={styles.inputLabel}>Enter Your Phone Number</Text>
        <TextInput
          value={phone}
          onChangeText={setPhone}
          placeholder="Phone Number"
          placeholderTextColor="#555"
          style={styles.input}
          keyboardType="phone-pad"
        />

        <Text style={styles.inputLabel}>Enter Your Address</Text>
        <TextInput
          value={address}
          onChangeText={setAddress}
          placeholder="Your Address"
          placeholderTextColor="#555"
          style={styles.input}
        />

        <Text style={styles.inputLabel}>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Password"
          placeholderTextColor="#555"
          style={styles.input}
        />

        <Text style={styles.inputLabel}>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm Password"
          placeholderTextColor="#555"
          style={styles.input}
        />

        {/* Validation messages */}
        {!passwordsMatch && (
          <Text style={{ color: "yellow", marginBottom: 10 }}>
            Passwords do not match
          </Text>
        )}
        {email && !isValidEmail(email) && (
          <Text style={{ color: "yellow", marginBottom: 10 }}>
            Invalid email format
          </Text>
        )}
        {!isFormValid() && (
          <Text style={{ color: "yellow", marginBottom: 10 }}>
            Please fill all fields correctly
          </Text>
        )}

        <TouchableOpacity
          style={styles.button}
          disabled={!isFormValid()}
          onPress={handleSignUp}
        >
          <Text style={styles.buttonText}>Take Eligibility Test</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text
            style={{
              color: "#fff",
              textDecorationLine: "underline",
              marginTop: 15,
            }}
          >
            Already have an account? Log In
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  card: {
    backgroundColor: "#870D25",
    borderRadius: 25,
    padding: 30,
    width: "100%",
    maxWidth: 350,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "200",
    marginBottom: 30,
  },
  inputLabel: {
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 8,
    fontWeight: "200",
  },
  input: {
    backgroundColor: "#e0e0e0",
    width: "100%",
    borderRadius: 20,
    padding: 12,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    borderRadius: 20,
    paddingVertical: 12,
    paddingHorizontal: 30,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8, // for Android
  },
  buttonText: {
    color: "#fff",
  },
});
