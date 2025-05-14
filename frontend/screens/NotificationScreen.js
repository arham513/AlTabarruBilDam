import React, { useState, useContext, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { UserContext } from "../context/userContext";
import Constants from "expo-constants";
const { LOCALLINK } = Constants.expoConfig.extra;

export default function NotificationScreen({ navigation }) {
  const [tab, setTab] = useState("received");
  const { user } = useContext(UserContext);
  const { userId } = user || {};
  const [myRequests, setMyRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [reportModalVisible, setReportModalVisible] = useState(false);
  const [reportReason, setReportReason] = useState("");
  const [reportDescription, setReportDescription] = useState("");
  const [reportingUser, setReportingUser] = useState(null);

  // Predefined report reasons
  const reportReasons = [
    "Fake Request",
    "Didn't Show Up",
    "Inappropriate Behavior",
    "Spam",
    "Other",
  ];

  useEffect(() => {
    const fetchReceivedRequests = async () => {
      if (!userId) return;
      try {
        const response = await fetch(
          `http://${LOCALLINK}:8080/api/receivedrequests/get`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        const data = await response.json();
        console.log("Received data:", data);

        if (Array.isArray(data) && data.length > 0) {
          const formattedData = data
            .filter((item) => item.status?.toLowerCase() === "pending")
            .map((item, index) => ({
              id: item.userId || index.toString(),
              name: item.name,
              blood: item.bloodGroup,
              units: "1 Unit",
              city: "Unknown City",
              distance: "0 Km",
              hospital: "Unknown Hospital",
              time: new Date(item.timestamp).toLocaleDateString(),
              status: item.status?.toLowerCase(),
            }));

          console.log("recepient", formattedData);
          setReceivedRequests(formattedData);
        } else if (data === null || data == {}) {
          console.error("No data received or data is an empty object");
        }
      } catch (error) {
        console.error("Error fetching received requests:", error);
      }
    };

    const fetchMyRequests = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await fetch(
          `http://${LOCALLINK}:8080/api/myrequests/get`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId }),
          }
        );

        const data = await response.json();
        if (Array.isArray(data)) {
          const formattedData = data.map((item) => ({
            id: item.donorId || item._id,
            name: item.name,
            blood: item.bloodGroup,
            units: "1 Unit",
            city: item.city || "Unknown City",
            distance: item.distance || "0 Km",
            hospital: item.hospital || "Unknown Hospital",
            time: new Date(item.timestamp).toLocaleDateString(),
            status: item.status.toLowerCase(),
          }));
          console.log("this is item :", formattedData);
          setMyRequests(formattedData);
        } else {
          console.error("My requests data is not an array:", data);
        }
      } catch (error) {
        console.error("Error fetching my requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReceivedRequests();
    fetchMyRequests();
  }, [userId]);

  const handleCancelRequest = async (item) => {
    try {
      const response = await fetch(
        `http://${LOCALLINK}:8080/api/myrequests/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: item.id,
          }),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.log("Server Response (Plain Text):", responseText);

        if (responseText.includes("Request canceled successfully")) {
          setMyRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== item.id)
          );
          console.log("Request canceled successfully!");
        } else {
          console.error("Failed to cancel the request:", responseText);
        }
        return;
      }

      const result = await response.json();
      if (response.ok) {
        setMyRequests((prevRequests) =>
          prevRequests.filter((request) => request.id !== item.id)
        );
        console.log("Request canceled successfully:", result.message);
      } else {
        console.error("Failed to cancel the request:", result.message);
      }
    } catch (error) {
      console.error("Error canceling request:", error);
    }
  };

  const handleCancelReceivedRequest = async (item) => {
    try {
      const response = await fetch(
        `http://${LOCALLINK}:8080/api/myrequests/cancel`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: item.id,
          }),
        }
      );

      const contentType = response.headers.get("content-type");

      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text();
        console.log("Plain Text Response:", responseText);
        if (responseText.includes("Request canceled successfully")) {
          setReceivedRequests((prev) =>
            prev.filter((req) => req.id !== item.id)
          );
          console.log("Received request canceled successfully!");
        } else {
          console.error("Cancel failed:", responseText);
        }
        return;
      }

      const result = await response.json();
      if (response.ok) {
        setReceivedRequests((prev) => prev.filter((req) => req.id !== item.id));
        console.log("Received request canceled:", result.message);
      } else {
        console.error("Cancel error:", result.message);
      }
    } catch (error) {
      console.error("Error canceling received request:", error);
    }
  };

  const handleAcceptRequest = async (item) => {
    try {
      const response = await fetch(
        `http://${LOCALLINK}:8080/api/acceptedrequests/accept`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            donorId: userId,
            requesterId: item.id,
          }),
        }
      );

      const text = await response.text();

      if (response.ok && text.includes("Request accepted")) {
        console.log("✅ Request accepted on backend:", text);
        setReceivedRequests((prev) => prev.filter((req) => req.id !== item.id));
      } else {
        console.error("❌ Accept failed:", text);
      }
    } catch (error) {
      console.error("🔥 Error in handleAcceptRequest:", error);
    }
  };

  const handleReportUser = (item) => {
    setReportingUser(item);
    setReportModalVisible(true);
  };

  const [reportMessage, setReportMessage] = useState(""); // Add this state to control report message

  const handleSubmitReport = async () => {
    if (!reportReason) {
      setReportMessage("Please select a reason for reporting.");
      setReportModalVisible(true); // Show the modal
      return;
    }

    try {
      const response = await fetch(
        `http://${LOCALLINK}:8080/api/users/report`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reportedUserId: reportingUser?.id,
            reporterId: userId,
            reason: reportReason,
            description: reportDescription,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log(result);
        if (result.message === "You have already reported this user.") {
          setReportMessage("You have already reported this user.");
        } else {
          setReportMessage("Report submitted successfully.");
        }
        setReportModalVisible(true); // Show the modal with the message
      } else {
        const errorText = await response.text();
        setReportMessage("Failed to submit report. Please try again later.");
        setReportModalVisible(true); // Show the modal with the error message
      }
    } catch (error) {
      setReportMessage("An error occurred while submitting the report.");
      setReportModalVisible(true); // Show the modal with the error message
    } finally {
      // Reset after submission
      setReportReason("");
      setReportDescription("");
      setReportingUser(null);
    }
  };
  

  const renderRequest = (item) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.bloodGroup}>{item.blood}</Text>
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={styles.name}>{item.name}</Text>
          {/* <Text style={styles.details}>{item.city}</Text>
          <Text style={styles.details}>{item.distance}</Text>
          <Text style={styles.details}>{item.hospital}</Text> */}
          <Text style={styles.time}>Time Limit: {item.time}</Text>
        </View>
        <Feather name="more-vertical" size={18} color="#333" />
      </View>

      {tab === "received" ? (
        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.chatButton}
            onPress={() => handleCancelReceivedRequest(item)}
          >
            <Text style={styles.chatText}>✕ Cancel</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.acceptButton}
            onPress={() => handleAcceptRequest(item)}
          >
            <Text style={styles.acceptText}>✓ Accept</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.statusRow}>
          {item.status === "pending" ? (
            <>
              <Text style={styles.pending}>⏳ Request pending</Text>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => handleCancelRequest(item)}
              >
                <Text style={styles.cancelText}>✕ Cancel</Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.accepted}>✔ Request accepted</Text>
              <TouchableOpacity
                style={styles.reportButton}
                onPress={() => handleReportUser(item)}
              >
                <Text style={styles.reportText}>⚠️ Report User</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      )}
    </View>
  );

  const requestsToShow = tab === "received" ? receivedRequests : myRequests;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notification</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.tabs}>
        <TouchableOpacity onPress={() => setTab("received")}>
          <Text
            style={[styles.tabText, tab === "received" && styles.activeTab]}
          >
            Received Requests ({receivedRequests.length})
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setTab("my")}>
          <Text style={[styles.tabText, tab === "my" && styles.activeTab]}>
            My Requests ({myRequests.length})
          </Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : (
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {requestsToShow.map((item) => (
            <View key={item.id}>{renderRequest(item)}</View>
          ))}
        </ScrollView>
      )}

      {/* Report User Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={reportModalVisible}
        onRequestClose={() => setReportModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalContainer}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Report User</Text>

            <Text style={styles.modalSubtitle}>
              {reportingUser
                ? `Reporting ${reportingUser.name}`
                : "Select a reason for reporting"}
            </Text>

            {/* Reason Selection */}
            <Text style={styles.inputLabel}>Reason for reporting:</Text>
            <View style={styles.reasonContainer}>
              {reportReasons.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonButton,
                    reportReason === reason && styles.selectedReasonButton,
                  ]}
                  onPress={() => setReportReason(reason)}
                >
                  <Text
                    style={[
                      styles.reasonText,
                      reportReason === reason && styles.selectedReasonText,
                    ]}
                  >
                    {reason}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Additional Details */}
            <Text style={styles.inputLabel}>
              Additional details (optional):
            </Text>
            <TextInput
              style={styles.textInput}
              multiline
              numberOfLines={4}
              value={reportDescription}
              onChangeText={setReportDescription}
              placeholder="Please provide more details about the issue..."
            />

            {/* Display report message */}
            {reportMessage ? (
              <Text style={styles.reportMessage}>{reportMessage}</Text>
            ) : null}

            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={handleSubmitReport}
              >
                <Text style={styles.modalButtonText}>Submit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "#ccc" }]}
                onPress={() => setReportModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  header: {
    backgroundColor: "#870D25",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  headerTitle: {
    color: "white",
    fontSize: 20,
    fontWeight: "bold",
  },
  backButton: {
    color: "white",
    fontSize: 14,
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  tabText: {
    fontSize: 14,
    paddingVertical: 10,
    color: "#999",
  },
  activeTab: {
    color: "#D2042D",
    borderBottomWidth: 2,
    borderColor: "#D2042D",
  },
  card: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  bloodGroup: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#D2042D",
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  details: {
    fontSize: 12,
    color: "#444",
  },
  time: {
    fontSize: 12,
    color: "green",
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  chatButton: {
    backgroundColor: "#eee",
    padding: 8,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  chatText: {
    color: "#555",
  },
  acceptButton: {
    backgroundColor: "#D2042D",
    padding: 8,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  acceptText: {
    color: "white",
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    alignItems: "center",
  },
  pending: {
    color: "#F59E0B",
    fontWeight: "600",
    fontSize: 12,
  },
  cancelButton: {
    backgroundColor: "#ddd",
    padding: 8,
    borderRadius: 8,
  },
  cancelText: {
    fontSize: 12,
  },
  accepted: {
    color: "green",
    fontWeight: "600",
    fontSize: 12,
  },
  reportButton: {
    backgroundColor: "#FFEBEE",
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#D2042D",
  },
  reportText: {
    fontSize: 12,
    color: "#D2042D",
    fontWeight: "500",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#D2042D",
    marginBottom: 5,
  },
  modalSubtitle: {
    fontSize: 14,
    color: "#666",
    marginBottom: 15,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
  },
  reasonContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 15,
  },
  reasonButton: {
    backgroundColor: "#F5F5F5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: "#EEEEEE",
  },
  selectedReasonButton: {
    backgroundColor: "#FFE5E8",
    borderColor: "#D2042D",
  },
  reasonText: {
    fontSize: 12,
    color: "#666",
  },
  selectedReasonText: {
    color: "#D2042D",
    fontWeight: "500",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 10,
    minHeight: 100,
    textAlignVertical: "top",
    marginBottom: 20,
    fontSize: 14,
    backgroundColor: "#FAFAFA",
  },
  modalButtonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cancelModalButton: {
    backgroundColor: "#F5F5F5",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  cancelModalText: {
    color: "#666",
    fontWeight: "500",
  },
  submitButton: {
    backgroundColor: "#D2042D",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    width: "48%",
    alignItems: "center",
  },
  submitText: {
    color: "white",
    fontWeight: "500",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    gap: 10, // Optional, for spacing between buttons
  },

  modalButton: {
    flex: 1,
    backgroundColor: "#E53935",
    paddingVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },

  modalButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
