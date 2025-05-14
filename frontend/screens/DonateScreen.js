import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import RNPickerSelect from "react-native-picker-select";
import { UserContext } from "../context/userContext";
import Constants from "expo-constants";
import * as Location from "expo-location";

const { LOCALLINK } = Constants.expoConfig.extra;

export default function DonateScreen({ navigation }) {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    gender: "",
    bloodGroup: "",
    location: "",
    units: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useContext(UserContext);
  const { name, phone, eligibilityStatus, userId } = user || {};

  const handleChange = (key, value) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async () => {
    if (eligibilityStatus === false) {
      alert("You are not eligible to donate blood at this time.");
      return;
    }

    const finalName = formData.name || name;

    if (
      !finalName ||
      !formData.age ||
      !formData.gender ||
      !formData.bloodGroup ||
      !formData.location ||
      !formData.units
    ) {
      alert("Please fill all fields.");
      return;
    }

    const payload = {
      fullname: finalName,
      age: parseInt(formData.age),
      gender: formData.gender,
      bloodgroup: formData.bloodGroup,
      location: formData.location,
      unitsToDonate: parseInt(formData.units),
      userId: userId,
      phone: phone,
      requested: false,
      timestamp: new Date().toISOString(),
    };

    console.log("Submitting payload:", payload);

    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://${LOCALLINK}:8080/api/donations/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message || "Donation registered successfully!");
        setFormData({
          name: "",
          age: "",
          gender: "",
          bloodGroup: "",
          location: "",
          units: "",
        });
      } else {
        alert(data.message || "Failed to register donation");
      }
    } catch (error) {
      console.error("Error submitting donation:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };
  const handleLocationPress = async () => {
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        alert("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      let [reverseGeocode] = await Location.reverseGeocodeAsync(
        location.coords
      );

      if (reverseGeocode) {
        const { city, subregion, subLocality } = reverseGeocode;

        let locationText = "";
        if (subLocality) locationText += subLocality + ", ";
        if (city) locationText += city;

        if (locationText) {
          handleChange("location", locationText);
        } else {
          alert("Unable to detect detailed location.");
        }
      } else {
        alert("Unable to detect location.");
      }
    } catch (error) {
      console.error("Location error:", error);
      alert("Failed to get location. Please try again.");
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Donate Blood</Text>
        <Text style={styles.headerSubtext}>Register yourself as a donor</Text>
        <View style={styles.topRightIcons}>
          <Feather name="message-square" size={20} color="white" />
          <Feather
            name="bell"
            size={20}
            color="white"
            style={{ marginLeft: 12 }}
          />
        </View>
      </View>

      {/* Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.formContainer}>
          {/* Name */}
          <Text style={styles.label}>Full Name</Text>
          {user ? (
            <Text style={styles.input}>{name}</Text>
          ) : (
            <TextInput
              style={styles.input}
              placeholder="Enter your full name"
              value={formData.name}
              onChangeText={(text) => handleChange("name", text)}
            />
          )}

          {/* Age */}
          <Text style={styles.label}>Age</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your age"
            keyboardType="numeric"
            value={formData.age}
            onChangeText={(text) => handleChange("age", text)}
          />

          {/* Gender */}
          <Text style={styles.label}>Gender</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange("gender", value)}
            placeholder={{ label: "Select Gender", value: "" }}
            value={formData.gender}
            items={[
              { label: "Male", value: "Male" },
              { label: "Female", value: "Female" },
              { label: "Other", value: "Other" },
            ]}
            style={pickerStyles}
            Icon={() => <Feather name="chevron-down" size={20} color="#999" />}
          />

          {/* Blood Group */}
          <Text style={styles.label}>Blood Group</Text>
          <RNPickerSelect
            onValueChange={(value) => handleChange("bloodGroup", value)}
            placeholder={{ label: "Select Blood Group", value: "" }}
            value={formData.bloodGroup}
            items={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(
              (group) => ({
                label: group,
                value: group,
              })
            )}
            style={pickerStyles}
            Icon={() => <Feather name="chevron-down" size={20} color="#999" />}
          />

          {/* Location */}
          <Text style={styles.label}>Location</Text>
          <View style={styles.locationWrapper}>
            <TextInput
              style={[
                styles.input,
                { flex: 1, color: formData.location ? "#000" : "#999" },
              ]}
              placeholder="Tap pin to get location"
              value={formData.location}
              editable={false} // ❌ prevent manual editing
              pointerEvents="none"
            />
            <TouchableOpacity onPress={handleLocationPress}>
              <Feather
                name="map-pin"
                size={24}
                color="#870D25"
                style={{ marginLeft: 10 }}
              />
            </TouchableOpacity>
          </View>

          {/* Units */}
          <Text style={styles.label}>Units to Donate</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter units (e.g., 1, 2)"
            keyboardType="numeric"
            value={formData.units}
            onChangeText={(text) => handleChange("units", text)}
          />

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.submitButton,
              isSubmitting && { backgroundColor: "#aaa" },
            ]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Register as Donor</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Navigation */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Feather name="home" size={22} color="#111" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("FindDonor")}
        >
          <Feather name="search" size={22} color="#111" />
          <Text style={styles.tabText}>Find Donor</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.tabItem, styles.activeTab]}>
          <Feather name="droplet" size={22} color="#D2042D" />
          <Text style={[styles.tabText, { color: "#D2042D" }]}>Donate</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Feather name="user" size={22} color="#111" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles remain the same
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  header: {
    backgroundColor: "#870D25",
    padding: 20,
    paddingTop: 60,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    position: "relative",
  },
  headerTitle: { color: "white", fontSize: 22, fontWeight: "bold" },
  headerSubtext: { color: "white", fontSize: 12, marginTop: 4 },
  topRightIcons: {
    position: "absolute",
    top: 30,
    right: 20,
    flexDirection: "row",
  },
  locationWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    elevation: 2,
  },

  formContainer: { padding: 20 },
  label: { fontSize: 14, fontWeight: "bold", color: "#444", marginBottom: 5 },
  input: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 12,
    marginBottom: 15,
    elevation: 2,
  },
  submitButton: {
    backgroundColor: "#870D25",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  submitButtonText: { color: "white", fontWeight: "bold", fontSize: 16 },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
  tabItem: { alignItems: "center" },
  tabText: { fontSize: 12, marginTop: 4, color: "#111" },
  activeTab: { backgroundColor: "rgba(210, 4, 45, 0.1)", borderRadius: 20 },
});

const pickerStyles = {
  inputIOS: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
    color: "#111",
  },
  inputAndroid: {
    backgroundColor: "white",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
    fontSize: 16,
    elevation: 2,
    color: "#111",
  },
  iconContainer: {
    top: 15,
    right: 12,
  },
};
