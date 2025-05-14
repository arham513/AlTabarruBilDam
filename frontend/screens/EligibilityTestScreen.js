import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

const questions = [
  { id: 1, question: "Do you have any transmittable disease?" },
  { id: 2, question: "Do you suffer from Asthma?" },
  { id: 3, question: "Have you had a Cardiac arrest?" },
  { id: 4, question: "Do you have Hypertension?" },
  { id: 5, question: "Do you have Blood pressure problems?" },
  { id: 6, question: "Do you have Diabetes?" },
  { id: 7, question: "Have you been diagnosed with Cancer?" },
];

export default function EligibilityQ1({ navigation, route }) {
  const { name, email, phone, address, password, confirmPassword } =
    route.params;

  const [currentQ, setCurrentQ] = useState(0);
  const [isEligible, setIsEligible] = useState(true);

  const handleAnswer = (answer) => {
    console.log(name);
    if (answer === "Yes") {
      setIsEligible(false);
    }

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      navigation.navigate("EligibilityQ4", {
        userData: {
          name,
          email,
          phone,
          address,
          password,
          confirmPassword,
        },
        isValid: isEligible,
      });
    }
  };

  const goToNextScreen = () => {
    navigation.navigate("EligibilityQ4", {
      userData: {
        name,
        email,
        phone,
        address,
        password,
        confirmPassword,
      },
      isValid: isEligible,
    });
  };

  return (
    <View style={styles.container}>
      {/* Donut header */}
      <View style={styles.donutSolid}>
        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.navButton}>{"<"}</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextScreen}>
          <Text style={styles.navButton}>{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <Text style={styles.question}>{questions[currentQ].question}</Text>

        {/* Answer Buttons */}
        {["Yes", "No"].map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => handleAnswer(label)}
            style={styles.optionButton}
          >
            <Text style={styles.optionText}>{label}</Text>
          </TouchableOpacity>
        ))}

        {/* Progress */}
        <Text style={styles.progressText}>
          Question {currentQ + 1} of {questions.length}
        </Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingTop: 24,
    paddingHorizontal: 16,
    elevation: 8,
    shadowColor: "#8B0000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 10,
  },
  navButton: {
    fontSize: 24,
    color: "white",
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
  question: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#111",
    marginBottom: 20,
    textAlign: "center",
  },
  optionButton: {
    borderWidth: 1.5,
    borderColor: "#D2042D",
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 15,
    width: "100%",
    backgroundColor: "rgba(210, 4, 45, 0.04)",
  },
  optionText: {
    color: "#D2042D",
    fontWeight: "600",
    fontSize: 16,
  },
  progressText: {
    marginTop: 15,
    fontSize: 14,
    color: "#666",
  },
});
