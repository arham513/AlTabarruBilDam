import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { UserContext } from "../context/userContext";
import Constants from "expo-constants";
const { LOCALLINK } = Constants.expoConfig.extra;
import RNHTMLtoPDF from "react-native-html-to-pdf";
import * as FileSystem from "expo-file-system";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";

export default function ProfileScreen({ navigation, route }) {
  const { user, setUser } = useContext(UserContext);
  const { userId, name, email, phone, address, eligibilityStatus } = user || {};
  const [historyData, setHistoryData] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const [userData, setUserData] = useState({
    name: name,
    email: email,
    donationsCount: 0,
    bloodType: "NA",
  });

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await fetch(
          `http://${LOCALLINK}:8080/api/acceptedrequests/history/${userId}`
        );
        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          setHistoryData(data);
        } else {
          console.log("No history data found.");
        }
      } catch (error) {
        console.error("Error fetching user history:", error);
      }
    };

    if (userId) fetchHistory();
  }, [userId]);

  useEffect(() => {
    const fetchDonationDetails = async () => {
      try {
        const response = await fetch(
          `http://${LOCALLINK}:8080/api/find-donors/user-details`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        const text = await response.text();
        if (text) {
          const data = JSON.parse(text);
          setUserData((prev) => ({
            ...prev,
            donationsCount: data.unitsToDonate || 0,
            bloodType: data.bloodgroup || "NA",
          }));
        } else {
          console.log("No donation data found.");
        }
      } catch (error) {
        console.error("Error fetching donation details:", error);
      }
    };

    if (userId) fetchDonationDetails();
  }, [userId]);
  const handleLogout = () => {
    Alert.alert("Log Out", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Log Out",
        onPress: () => {
          // Step 1: Clear user data
          if (setUser) setUser(null); // <-- make sure you have access to setUser from UserContext

          // Step 2: Navigate to Login and reset history
          navigation.reset({
            index: 0,
            routes: [{ name: "Login" }],
          });
        },
        style: "destructive",
      },
    ]);
  };

  const openModal = (modalType) => {
    setActiveModal(modalType);
    setModalVisible(true);
  };

  const renderModalContent = () => {
    switch (activeModal) {
      case "guidelines":
        return (
          <>
            <Text style={styles.modalTitle}>Donor & Recipient Guidelines</Text>
            <Text style={styles.modalText}>
              <Text style={styles.boldText}>For Donors:</Text>
              {"\n"}• Must be 18–65 years old, in good health, and weigh at
              least 50kg{"\n"}• Avoid donating on an empty stomach{"\n"}• Wait 3
              months between donations{"\n"}• Avoid donation if you have flu,
              recent surgery, or infections{"\n"}• Stay hydrated before and
              after donation{"\n\n"}
              <Text style={styles.boldText}>For Recipients:</Text>
              {"\n"}• Must match blood group compatibility{"\n"}• Must pass
              cross-match test{"\n"}• Medical assessment required before
              transfusion{"\n"}• Regular follow-ups may be needed{"\n"}• Report
              any adverse reactions immediately
            </Text>
          </>
        );
      case "about":
        return (
          <>
            <Text style={styles.modalTitle}>About Us</Text>
            <Text style={styles.modalText}>
              LifeFlow is dedicated to connecting blood donors with those in
              need. Founded in 2022, our mission is to ensure that no patient
              goes without the life-saving blood they require.
              {"\n\n"}
              Our platform facilitates quick and efficient blood donation
              matching, helping hospitals and patients during critical
              situations. Through technology and community engagement, we aim to
              increase blood donation rates and save lives.
              {"\n\n"}
              Join us in our mission to make blood donation accessible,
              efficient, and impactful.
            </Text>
          </>
        );
      default:
        return null;
    }
  };

  const generateAndSharePDF = async () => {
    const historyHtml = historyData.length
      ? historyData
          .map((entry, index) => `<p>${index + 1}. ${entry}</p>`)
          .join("")
      : "<p>No donation history available.</p>";

    const htmlContent = `
      <html>
        <body>
          <h1>Donation History</h1>
          <p><strong>Name:</strong> ${userData.name}</p>
          <p><strong>Email:</strong> ${userData.email}</p>
          <p><strong>Donations Count:</strong> ${userData.donationsCount}</p>
          <p><strong>Blood Type:</strong> ${userData.bloodType}</p>
          <h2>History</h2>
          ${historyHtml}
        </body>
      </html>
    `;

    try {
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(uri);
      } else {
        alert("Sharing is not available on this device.");
      }
    } catch (error) {
      console.error("PDF generation error:", error);
    }
  };

  const options = [
    {
      icon: "award",
      text: "Leaderboard",
      onPress: () => navigation.navigate("leadBoard"),
    },
    {
      icon: "download",
      text: "Download Receipt",
      onPress: generateAndSharePDF,
    },
    {
      icon: "book-open",
      text: "Donor & Recipient Guidelines",
      onPress: () => openModal("guidelines"),
    },
    {
      icon: "info",
      text: "About Us",
      onPress: () => openModal("about"),
    },
    // {
    //   icon: "message-circle", // Feather icon for feedback
    //   text: "Feedback",
    //   onPress: () => navigation.navigate("Feedback"), // Navigate to Feedback screen
    // },
  ];

  return (
    <View style={styles.container}>
      <ScrollView>
        <View style={styles.profileSection}>
          <View style={styles.profileImage}>
            <Feather name="user" size={40} color="#fff" />
          </View>
          <Text style={styles.name}>{userData.name}</Text>
          <Text style={styles.email}>{userData.email}</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.donationsCount}</Text>
              <Text style={styles.statLabel}>Donations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{userData.bloodType}</Text>
              <Text style={styles.statLabel}>Blood Type</Text>
            </View>
          </View>
        </View>

        <View style={styles.optionList}>
          {options.map((item, index) => (
            <Pressable
              key={index}
              style={({ pressed }) => [
                styles.optionRow,
                pressed && styles.optionPressed,
              ]}
              onPress={item.onPress}
            >
              <View style={styles.iconContainer}>
                <Feather name={item.icon} size={18} color="#fff" />
              </View>
              <Text style={styles.optionText}>{item.text}</Text>
              <Feather name="chevron-right" size={18} color="#999" />
            </Pressable>
          ))}
        </View>

        <Pressable
          style={({ pressed }) => [
            styles.logoutButton,
            pressed && styles.logoutPressed,
          ]}
          onPress={handleLogout}
        >
          <Feather name="log-out" size={18} color="#fff" />
          <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>
      </ScrollView>

      {/* Bottom Tab Bar (fixed outside the scroll) */}
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
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Request")}
        >
          <Feather name="droplet" size={22} color="#111" />
          <Text style={styles.tabText}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem}>
          <Feather name="user" size={22} color="#D2042D" />
          <Text style={[styles.tabText, { color: "#D2042D" }]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.centeredBackdrop}>
          <Pressable
            style={styles.backdropTouchable}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalContent}>
            <ScrollView contentContainerStyle={styles.modalScrollContent}>
              {renderModalContent()}
              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFF5F5" },
  profileSection: {
    alignItems: "center",
    paddingVertical: 30,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#870D25",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  name: { fontSize: 20, fontWeight: "bold", color: "#111" },
  email: { fontSize: 14, color: "#666", marginBottom: 10 },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F8F8",
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 24,
    marginTop: 10,
  },
  statItem: { alignItems: "center", flex: 1 },
  statValue: { fontSize: 18, fontWeight: "bold", color: "#870D25" },
  statLabel: { fontSize: 12, color: "#666", marginTop: 4 },
  statDivider: { width: 1, backgroundColor: "#DDD", marginHorizontal: 15 },
  optionList: { paddingHorizontal: 20, paddingTop: 20 },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
  },
  optionPressed: { backgroundColor: "#f0f0f0" },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#870D25",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  optionText: { flex: 1, fontSize: 16, color: "#333", fontWeight: "500" },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E63946",
    paddingVertical: 16,
    borderRadius: 12,
    margin: 20,
  },
  logoutPressed: { opacity: 0.8 },
  logoutText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    marginLeft: 8,
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  tabItem: { alignItems: "center" },
  tabText: { fontSize: 12, marginTop: 4, color: "#111" },
  centeredBackdrop: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdropTouchable: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    maxHeight: "80%",
    elevation: 5,
  },
  modalScrollContent: {
    paddingVertical: 20,
    paddingBottom: 40,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#870D25",
    marginBottom: 16,
  },
  modalText: {
    fontSize: 15,
    color: "#333",
    lineHeight: 24,
  },
  boldText: { fontWeight: "bold", color: "#222" },
  closeButton: {
    backgroundColor: "#870D25",
    padding: 14,
    borderRadius: 12,
    marginTop: 24,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
});
