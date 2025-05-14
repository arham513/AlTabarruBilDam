import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

export default function BloodCompatibilityCard() {
  const [selectedType, setSelectedType] = useState(null);

  const data = [
    { type: "A+", donate: "A+, AB+", receive: "A+, A-, O+, O-" },
    { type: "O+", donate: "O+, A+, B+, AB+", receive: "O+, O-" },
    { type: "B+", donate: "B+, AB+", receive: "B+, B-, O+, O-" },
    { type: "AB+", donate: "AB+", receive: "All Types" },
    { type: "A-", donate: "A+, A-, AB+, AB-", receive: "A-, O-" },
    { type: "O-", donate: "Everyone", receive: "O-" },
    { type: "B-", donate: "B+, B-, AB+, AB-", receive: "B-, O-" },
    { type: "AB-", donate: "AB+, AB-", receive: "AB-, A-, B-, O-" },
  ];

  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Feather name="droplet" size={18} color="#D2042D" />
        <Text style={styles.title}>Blood Type Compatibility</Text>
      </View>

      <View style={styles.bloodTypeSelector}>
        {data.map((item) => (
          <TouchableOpacity
            key={item.type}
            style={[
              styles.typeButton,
              selectedType === item.type && styles.selectedTypeButton,
            ]}
            onPress={() => setSelectedType(item.type)}
          >
            <Text
              style={[
                styles.typeButtonText,
                selectedType === item.type && styles.selectedTypeText,
              ]}
            >
              {item.type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {selectedType ? (
        <View style={styles.selectedTypeInfo}>
          <Text style={styles.selectedTitle}>Blood Type {selectedType}</Text>

          <View style={styles.infoSection}>
            <View style={styles.infoIcon}>
              <Feather name="arrow-right" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Can donate to:</Text>
              <Text style={styles.infoText}>
                {data.find((item) => item.type === selectedType).donate}
              </Text>
            </View>
          </View>

          <View style={styles.infoSection}>
            <View style={[styles.infoIcon, styles.receiveIcon]}>
              <Feather name="arrow-left" size={16} color="#fff" />
            </View>
            <View>
              <Text style={styles.infoLabel}>Can receive from:</Text>
              <Text style={styles.infoText}>
                {data.find((item) => item.type === selectedType).receive}
              </Text>
            </View>
          </View>
        </View>
      ) : (
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={[styles.cell, styles.headerText, styles.col1]}>
              Type
            </Text>
            <Text style={[styles.cell, styles.headerText, styles.col2]}>
              Can Donate To
            </Text>
            <Text style={[styles.cell, styles.headerText, styles.col3]}>
              Can Receive From
            </Text>
          </View>

          {data.slice(0, 6).map((row, index) => (
            <View
              key={row.type}
              style={[styles.tableRow, index % 2 === 1 && styles.stripedRow]}
            >
              <Text style={[styles.cell, styles.typeText, styles.col1]}>
                {row.type}
              </Text>
              <Text style={[styles.cell, styles.col2]}>{row.donate}</Text>
              <Text style={[styles.cell, styles.col3]}>{row.receive}</Text>
            </View>
          ))}
        </View>
      )}

      <TouchableOpacity style={styles.learnMore}>
        <Text style={styles.learnMoreText}>Learn more about blood types</Text>
        <Feather name="external-link" size={14} color="#D2042D" />
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
  bloodTypeSelector: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 16,
    marginTop: 4,
  },
  typeButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: "#F6F6F6",
    marginRight: 8,
    marginBottom: 8,
  },
  selectedTypeButton: {
    backgroundColor: "#D2042D",
  },
  typeButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  selectedTypeText: {
    color: "#fff",
  },
  selectedTypeInfo: {
    backgroundColor: "#FFF6F6",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  selectedTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#D2042D",
    marginBottom: 12,
  },
  infoSection: {
    flexDirection: "row",
    marginBottom: 12,
    alignItems: "flex-start",
  },
  infoIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#D2042D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  receiveIcon: {
    backgroundColor: "#870D25",
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#555",
    marginBottom: 2,
  },
  infoText: {
    fontSize: 15,
    color: "#333",
  },
  table: {
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  tableHeader: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#FAFAFA",
  },
  tableRow: {
    flexDirection: "row",
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#f5f5f5",
  },
  stripedRow: {
    backgroundColor: "#FFF6F6",
  },
  cell: {
    fontSize: 13,
    color: "#333",
    paddingHorizontal: 4,
  },
  headerText: {
    fontWeight: "600",
    color: "#444",
  },
  typeText: {
    fontWeight: "700",
    color: "#D2042D",
  },
  col1: { flex: 1 },
  col2: { flex: 2.5 },
  col3: { flex: 2.8 },
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
