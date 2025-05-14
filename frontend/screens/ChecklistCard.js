import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const checklistItems = [
  {
    icon: "moon",
    text: "Get plenty of sleep",
    description: "Aim for 7-8 hours the night before",
  },
  {
    icon: "coffee",
    text: "Eat iron-rich foods",
    description: "Spinach, beans, red meat, or fortified cereals",
  },
  {
    icon: "droplet",
    text: "Drink extra water",
    description: "16oz extra in the 2-3 hours before donating",
  },
  {
    icon: "credit-card",
    text: "Bring ID to donation center",
    description: "Government-issued photo ID required",
  },
];

export default function ChecklistCard() {
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Feather name="check-square" size={18} color="#D2042D" />
        <Text style={styles.title}>Preparation Checklist</Text>
      </View>

      {checklistItems.map((item, index) => (
        <View key={index} style={styles.itemRow}>
          <View style={styles.iconCircle}>
            <Feather name={item.icon} size={14} color="#fff" />
          </View>
          <View style={styles.textContainer}>
            <Text style={styles.itemText}>{item.text}</Text>
            <Text style={styles.itemDescription}>{item.description}</Text>
          </View>
        </View>
      ))}

      <TouchableOpacity style={styles.learnMore}>
        <Text style={styles.learnMoreText}>View Complete Guidelines</Text>
        <Feather name="chevron-right" size={16} color="#D2042D" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    marginHorizontal: 0, // Removed horizontal margins to match BloodTypeChart
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#D2042D",
    marginLeft: 10,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  iconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#D2042D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    marginTop: 2,
  },
  textContainer: {
    flex: 1,
  },
  itemText: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginBottom: 2,
  },
  itemDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  learnMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  learnMoreText: {
    color: "#D2042D",
    fontSize: 14,
    fontWeight: "500",
    marginRight: 6,
  },
});
