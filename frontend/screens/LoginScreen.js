import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { UserContext } from "../context/userContext";
import Constants from 'expo-constants';
const { LOCALLINK } = Constants.expoConfig.extra;

export default function LoginScreen({ navigation }) {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [adminModalVisible, setAdminModalVisible] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const ADMIN_PASSCODE = '1234567';

  const { setUser } = useContext(UserContext);

  const handleLogin = async () => {
    if (!name || !password) {
      Alert.alert("Error", "Please enter both name and password.");
      return;
    }

    try {
      const response = await fetch(`http://${LOCALLINK}:8080/api/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: name,
          password: password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login success:", data.name, data.userId);
        setUser(data);
        navigation.replace("Home");
      } else {
        Alert.alert("Login Failed", data.message || "Invalid credentials");
      }
    } catch (error) {
      Alert.alert("Error", "Something went wrong: " + error.message);
    }
  };

  const handleAdminAccess = () => {
    if (adminCode === ADMIN_PASSCODE) {
      setAdminModalVisible(false);
      setAdminCode('');
      navigation.navigate("AdminPanel");
    } else {
      Alert.alert('Invalid Passcode', 'Access Denied. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>LOG IN</Text>

        <Text style={styles.inputLabel}>Your Name</Text>
        <TextInput
          placeholder="Enter Your Name"
          placeholderTextColor="#555"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Text style={styles.inputLabel}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#555"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            style={styles.input}
          />
          <TouchableOpacity
            onPress={() => setShowPassword(!showPassword)}
            style={styles.eyeIcon}
          >
            <Ionicons
              name={showPassword ? "eye-off" : "eye"}
              size={20}
              color="#555"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
          <Text style={styles.link}>Haven’t registered yet? Sign Up Now</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.primaryButton} onPress={handleLogin}>
          <Text style={styles.primaryButtonText}>Step In, Be a Hero</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={() => setAdminModalVisible(true)}
        >
          <Text style={styles.secondaryButtonText}>Access Admin Panel</Text>
        </TouchableOpacity>
      </View>

      {/* Admin Passcode Modal */}
      <Modal visible={adminModalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Enter 7-digit Admin Code</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="e.g. 4587251"
              placeholderTextColor="#999"
              keyboardType="numeric"
              maxLength={7}
              value={adminCode}
              onChangeText={setAdminCode}
            />
            <View style={styles.modalButtons}>
              <TouchableOpacity style={styles.modalBtn} onPress={handleAdminAccess}>
                <Text style={styles.modalBtnText}>Enter</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => {
                  setAdminModalVisible(false);
                  setAdminCode('');
                }}
              >
                <Text style={[styles.modalBtnText, { color: '#333' }]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#870D25",
    borderRadius: 20,
    padding: 30,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 3, height: 5 },
    shadowRadius: 8,
    elevation: 5,
  },
  inputLabel: {
    color: "#fff",
    alignSelf: "flex-start",
    marginBottom: 8,
    fontWeight: "200",
  },
  title: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "200",
    alignSelf: "center",
    marginBottom: 30,
    fontFamily: "Roboto",
  },
  input: {
    backgroundColor: "#ddd",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 20,
    color: "#000",
    fontFamily: "Roboto",
    fontWeight: "200",
  },
  passwordContainer: {
    position: "relative",
  },
  eyeIcon: {
    position: "absolute",
    right: 20,
    top: 14,
  },
  link: {
    color: "#fff",
    textDecorationLine: "underline",
    marginBottom: 25,
    textAlign: "center",
    fontFamily: "Roboto",
    fontWeight: "200",
  },
  primaryButton: {
    backgroundColor: "#6d0b1e",
    paddingVertical: 12,
    borderRadius: 30,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#fff",
    fontWeight: "200",
    fontFamily: "Roboto",
  },
  secondaryButton: {
    backgroundColor: "#ccc",
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#444",
    fontFamily: "Roboto",
    fontWeight: "200",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalCard: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 15,
    width: '85%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#870D25',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    backgroundColor: '#870D25',
    padding: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
