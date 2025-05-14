import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Pressable,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useColorScheme } from "react-native";
import Constants from "expo-constants";
const { LOCALLINK } = Constants.expoConfig.extra;

// Mock data for user reports
const MOCK_REPORTED_USERS = [
  {
    reportedUserId: "usr_123456",
    reportedEmail: "user1@example.com",
    reason: "Inappropriate content and harassment in multiple messages",
    reporterCount: 5,
  },
  {
    reportedUserId: "usr_789012",
    reportedEmail: "baduser@email.com",
    reason: "Spam and unsolicited promotional messages",
    reporterCount: 3,
  },
  {
    reportedUserId: "usr_345678",
    reportedEmail: "fake.account@test.com",
    reason: "Fake profile with misleading information",
    reporterCount: 7,
  },
  {
    reportedUserId: "usr_901234",
    reportedEmail: "scammer99@example.org",
    reason: "Attempting to scam other users",
    reporterCount: 12,
  },
];

const UserReportsScreen = () => {
  const [reportedUsers, setReportedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const scheme = useColorScheme(); // Detects the current color scheme (light or dark)

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch(
          `http://${LOCALLINK}:8080/api/reports/all`
        );
        const data = await response.json();

        // Transform the data to match the current rendering structure
        const transformedData = data.map((report) => ({
          reportedUserId: report.reportedUserId,
          reportedEmail: report.reportedUserEmail,
          reason: report.reportReason,
          reporterCount: 1, // Assuming 1 report per item; update logic if needed
        }));

        setReportedUsers(transformedData);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  const renderItem = ({ item }) => (
    <Pressable
      onPress={() => {
        console.log("Reported User ID:", item.reportedUserId);
        console.log("Reported Email:", item.reportedEmail);
        console.log("Report Reason:", item.reason);
        console.log("Reporter Count:", item.reporterCount);
      }}
      style={[styles.card, scheme === "dark" && styles.cardDark]}
    >
      <View style={styles.reportHeader}>
        <Text style={[styles.email, scheme === "dark" && styles.emailDark]}>
          {item.reportedEmail || "Unknown Email"}
        </Text>
        <View style={styles.badgeContainer}>
          <Text
            style={[
              styles.reporterBadge,
              scheme === "dark" && styles.reporterBadgeDark,
            ]}
          >
            {item.reporterCount} reports
          </Text>
        </View>
      </View>

      <Text style={[styles.userId, scheme === "dark" && styles.userIdDark]}>
        ID: {item.reportedUserId || "Unknown ID"}
      </Text>

      <View style={styles.reasonContainer}>
        <Text
          style={[
            styles.reasonLabel,
            scheme === "dark" && styles.reasonLabelDark,
          ]}
        >
          Reason:
        </Text>
        <Text
          style={[
            styles.reasonText,
            scheme === "dark" && styles.reasonTextDark,
          ]}
        >
          {item.reason || "No reason provided"}
        </Text>
      </View>
    </Pressable>
  );

  return (
    <SafeAreaView
      style={[styles.container, scheme === "dark" && styles.containerDark]}
    >
      <Text style={[styles.header, scheme === "dark" && styles.headerDark]}>
        User Report Management
      </Text>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={scheme === "dark" ? "#fff" : "#4f46e5"}
        />
      ) : reportedUsers.length === 0 ? (
        <Text style={[styles.empty, scheme === "dark" && styles.emptyDark]}>
          No reported users found.
        </Text>
      ) : (
        <FlatList
          data={reportedUsers}
          renderItem={renderItem}
          keyExtractor={(item, index) =>
            item.reportedUserId
              ? item.reportedUserId.toString()
              : index.toString()
          }
          contentContainerStyle={styles.list}
        />
      )}
    </SafeAreaView>
  );
};

export default UserReportsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9fafb", // Light background
    padding: 20,
  },
  containerDark: {
    backgroundColor: "#121212", // Dark background for dark mode
  },
  header: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 20,
    color: "#1f2937", // Dark text for light mode
  },
  headerDark: {
    color: "#ffffff", // Light text for dark mode
  },
  card: {
    backgroundColor: "#fff", // Light card background
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  cardDark: {
    backgroundColor: "#1e1e1e", // Dark card background for dark mode
  },
  reportHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  email: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1d4ed8", // Light blue for emails in light mode
    flex: 1,
  },
  emailDark: {
    color: "#bb86fc", // Light purple for emails in dark mode
  },
  badgeContainer: {
    marginLeft: 8,
  },
  reporterBadge: {
    backgroundColor: "#ef4444", // Red badge for reports in light mode
    color: "#fff",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "500",
  },
  reporterBadgeDark: {
    backgroundColor: "#FF6B81", // Light red badge for dark mode
  },
  userId: {
    fontSize: 14,
    color: "#6b7280", // Grey text for user ID in light mode
    marginBottom: 12,
  },
  userIdDark: {
    color: "#bbb", // Light grey text for user ID in dark mode
  },
  reasonContainer: {
    backgroundColor: "#f3f4f6", // Light background for reason in light mode
    borderRadius: 8,
    padding: 10,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#374151", // Dark text for reason label in light mode
    marginBottom: 4,
  },
  reasonLabelDark: {
    color: "#e0e0e0", // Light text for reason label in dark mode
  },
  reasonText: {
    fontSize: 14,
    color: "#4b5563", // Dark text for reason in light mode
  },
  reasonTextDark: {
    color: "#e0e0e0", // Light text for reason in dark mode
  },
  empty: {
    fontSize: 16,
    color: "#9ca3af", // Grey text for empty state in light mode
    marginTop: 20,
    textAlign: "center",
  },
  emptyDark: {
    color: "#bb86fc", // Light text for empty state in dark mode
  },
  list: {
    paddingBottom: 20,
  },
});
