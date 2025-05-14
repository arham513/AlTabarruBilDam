// import React, { useState } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   StyleSheet,
//   Image,
//   Alert,
// } from "react-native";

// export default function RegisterDonorScreen({ navigation }) {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const [confirmPassword, setConfirmPassword] = useState("");

//   const handleEligibilityTest = () => {
//     if (!name || !password || !confirmPassword) {
//       Alert.alert("Error", "Please fill all the fields");
//       return;
//     }

//     if (password !== confirmPassword) {
//       Alert.alert("Error", "Passwords do not match");
//       return;
//     }

//     navigation.navigate("EligibilityTest");
//   };

//   return (
//     <View style={styles.container}>
//       <Image
//         source={{
//           uri: "https://cdn-icons-png.flaticon.com/512/6772/6772262.png",
//         }}
//         style={styles.logo}
//       />

//       <Text style={styles.title}>Register As Donor</Text>

//       <TextInput
//         style={styles.input}
//         placeholder="Enter Your Name"
//         value={name}
//         onChangeText={setName}
//         placeholderTextColor="#ddd"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Password"
//         secureTextEntry
//         value={password}
//         onChangeText={setPassword}
//         placeholderTextColor="#ddd"
//       />

//       <TextInput
//         style={styles.input}
//         placeholder="Confirm Password"
//         secureTextEntry
//         value={confirmPassword}
//         onChangeText={setConfirmPassword}
//         placeholderTextColor="#ddd"
//       />

//       <TouchableOpacity style={styles.button} onPress={handleEligibilityTest}>
//         <Text style={styles.buttonText}>Take Eligibility Test</Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     backgroundColor: "#fff5f5", // Light red/pink background
//     padding: 20,
//   },
//   logo: {
//     width: 80,
//     height: 80,
//     marginBottom: 20,
//   },
//   title: {
//     fontSize: 26,
//     fontWeight: "bold",
//     color: "#d32f2f", // Dark Red
//     marginBottom: 20,
//   },
//   input: {
//     width: "100%",
//     padding: 12,
//     marginVertical: 10,
//     borderWidth: 1,
//     borderColor: "#d32f2f", // Red border
//     borderRadius: 8,
//     backgroundColor: "#fff",
//     color: "#333",
//   },
//   button: {
//     backgroundColor: "#d32f2f", // Dark red button
//     padding: 12,
//     borderRadius: 8,
//     width: "100%",
//     marginTop: 10,
//   },
//   buttonText: {
//     color: "#fff",
//     fontSize: 18,
//     textAlign: "center",
//     fontWeight: "bold",
//   },
//   linkText: {
//     marginTop: 15,
//     color: "#d32f2f", // Red color for the link
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   wrapper: {
//     flex: 1,
//     justifyContent: "space-between",
//     alignItems: "center",
//     backgroundColor: "#fff5f5",
//     padding: 20,
//   },
//   adminLink: {
//     marginBottom: 20,
//     color: "#6a1b9a", // Purple shade for contrast
//     fontSize: 16,
//     fontWeight: "bold",
//   },
// });
