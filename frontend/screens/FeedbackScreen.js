import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"; // ✅ SafeAreaView
import { UserContext } from "../context/userContext";
import Constants from "expo-constants";
const { LOCALLINK } = Constants.expoConfig.extra;

const FeedbackScreen = () => {
  const { user } = useContext(UserContext);
  const { userId } = user || {};
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMatchedUsers = async () => {
      try {
        const res = await fetch(
          `http://${LOCALLINK}:8080/api/acceptedrequests/matched-users/${userId}`
        );
        const data = await res.json();
        setMatchedUsers(data);
      } catch (error) {
        console.error("Error fetching matched users:", error);
      } finally {
        setLoading(false);
      }
    };

    if (userId) fetchMatchedUsers();
  }, [userId]);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        console.log("userId:", userId);
        console.log("feedbackTo:", item._id);
        console.log("feedback:", item.feedback || "No feedback");
      }}
      style={styles.card}
    >
      <Text style={styles.name}>{item.name || "Unnamed User"}</Text>
      <Text style={styles.email}>{item.email}</Text>
      <Text style={styles.feedback}>
        <Text style={{ fontWeight: "bold" }}>Feedback: </Text>
        <Text>{String(item.feedback || "No feedback provided.")}</Text>
      </Text>
    </Pressable>
  );

  return (
    <SafeAreaView style={styles.container}>
      {" "}
      {/* ✅ SafeAreaView here */}
      <Text style={styles.header}>Feedback Received</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#4f46e5" />
      ) : matchedUsers.length === 0 ? (
        <Text style={styles.empty}>No feedback received yet.</Text>
      ) : (
        <FlatList
          data={matchedUsers}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item._id ? item._id.toString() : index.toString()
          }
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default FeedbackScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb",
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2937",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1d4ed8",
  },
  email: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 8,
  },
  feedback: {
    fontSize: 14,
    color: "#374151",
  },
  empty: {
    fontSize: 16,
    color: "#9ca3af",
    marginTop: 20,
  },
  list: {
    paddingBottom: 20,
  },
});
