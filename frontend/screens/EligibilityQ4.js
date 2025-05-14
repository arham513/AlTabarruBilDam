import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import Toast from "react-native-toast-message";
import Constants from 'expo-constants';
const { LOCALLINK } = Constants.expoConfig.extra;

export default function ResultScreen({ navigation, route }) {
  const { userData, isValid } = route.params;
  console.log(userData, isValid);

  useEffect(() => {
    const registerUser = async () => {
      // Prepare the data to be sent to the backend
      const payload = {
        name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        address: userData.address,
        eligibilityStatus: isValid,
      };
  
      try {
        const response = await fetch(`http://${LOCALLINK}:8080/api/users/register`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        });
  
        const data = await response.json();
  
        if (response.ok) {
          Toast.show({
            type: "success",
            text1: "Account Created",
            text2: isValid
              ? "You are eligible to donate 🚀"
              : "Account created, but you are not eligible to donate",
            position: "bottom",
            visibilityTime: 2500,
          });
  
          setTimeout(() => {
            navigation.navigate("Login", { userData });
          }, 2700);
        } else {
          Toast.show({
            type: "error",
            text1: "Registration Failed",
            text2: data.message || "Please try again.",
            position: "bottom",
            visibilityTime: 2500,
          });
  
          setTimeout(() => {
            navigation.navigate("SignUp");
          }, 2700);
        }
      } catch (error) {
        console.error("Error during registration:", error);
        Toast.show({
          type: "error",
          text1: "Error",
          text2: "Something went wrong, please try again.",
          position: "bottom",
          visibilityTime: 2500,
        });
  
        setTimeout(() => {
          navigation.navigate("SignUp");
        }, 2700);
      }
    };
  
    registerUser();
  }, [isValid, userData, navigation]);
  

  return (
    <View style={styles.container}>
      {/* Top Donut Header */}
      <View style={styles.donutSolid}>
        <Text style={styles.headerText}>Creating Account</Text>
      </View>

      {/* Card with Loading */}
      <View style={styles.card}>
        <Text style={styles.message}>
          Please wait while we create your account...
        </Text>
        <ActivityIndicator
          size="large"
          color="#870D25"
          style={{ marginTop: 20 }}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    alignItems: "center",
  },
  donutSolid: {
    width: "100%",
    height: 160,
    backgroundColor: "#870D25",
    borderBottomLeftRadius: 999,
    borderBottomRightRadius: 999,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 24,
    elevation: 8,
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  card: {
    marginTop: 30,
    backgroundColor: "white",
    borderRadius: 25,
    padding: 24,
    width: "88%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  message: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#111",
    textAlign: "center",
  },
});
