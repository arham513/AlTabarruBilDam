import React, { useState, useEffect, useContext } from "react";
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  StatusBar,
} from "react-native";
import {
  Feather,
  Ionicons,
  MaterialIcons,
  FontAwesome5,
  FontAwesome,
} from "@expo/vector-icons";
import { UserContext } from "../context/userContext";
import { useFocusEffect } from "@react-navigation/native";
import Constants from "expo-constants";
const { LOCALLINK } = Constants.expoConfig.extra;

const DonorCard = ({ donor, setDonors, setFilteredDonors }) => {
  const { user } = useContext(UserContext);
  const { userId } = user || {};

  const handleRequestBlood = async () => {
    console.log("Donor info before request:", donor);
    console.log("User ID requesting:", userId);

    try {
      const response = await fetch(
        `http://${LOCALLINK}:8080/api/requests/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            requesterId: userId,
            donorId: donor.userId,
            name: donor.fullname,
            gender: donor.gender,
            bloodGroup: donor.bloodgroup,
            status: "pending",
            timestamp: new Date().toISOString(),
          }),
        }
      );

      const result = await response.json();
      if (response.ok) {
        console.log("Request created successfully:", result.message);

        // Remove the donor from both donors and filteredDonors
        setDonors((prevDonors) =>
          prevDonors.filter((d) => d.userId !== donor.userId)
        );

        setFilteredDonors((prevFilteredDonors) =>
          prevFilteredDonors.filter((d) => d.userId !== donor.userId)
        );
      } else {
        console.error("Error creating request:", result.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <View style={styles.donorCard}>
      <View style={styles.donorHeader}>
        <View style={styles.bloodGroupContainer}>
          <FontAwesome5
            name="tint"
            size={18}
            color="#870D25"
            style={styles.dropIcon}
          />
          <Text style={styles.bloodGroup}>
            {donor.bloodgroup}
            <Text style={styles.superscript}></Text>
          </Text>
        </View>
        <View style={styles.donorInfo}>
          <Text style={styles.donorGenderAge}>
            {donor.gender}, {donor.age}yr old
          </Text>
          <TouchableOpacity style={styles.callButton}>
            <FontAwesome name="phone" size={18} color="#870D25" />
          </TouchableOpacity>
          <TouchableOpacity>
            <MaterialIcons name="more-vert" size={24} color="#888" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.donorDetails}>
        <View style={styles.detailItem}>
          <FontAwesome name="user" size={16} color="#666" />
          <Text style={styles.detailText}>{donor.fullname}</Text>
        </View>
        <View style={styles.detailItem}>
          <Ionicons name="location-outline" size={16} color="#666" />
          <Text style={styles.detailText}>{donor.location}</Text>
        </View>
        {/* <View style={styles.detailItem}>
          <MaterialIcons name="directions" size={16} color="#666" />
          <Text style={styles.detailText}>{donor.distance} Km</Text>
        </View> */}
        <View style={styles.detailItem}>
          <Text style={styles.timeLabel}>Time Limit:</Text>
          <Text style={styles.timeValue}>{donor.timeLimit}</Text>
        </View>
      </View>

      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.shareButton}>
          <Ionicons name="share-social-outline" size={18} color="#555" />
          <Text style={styles.actionText}>share</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.requestButton}
          onPress={handleRequestBlood}
        >
          <Text style={styles.requestText}>Request</Text>
          <MaterialIcons name="arrow-forward" size={18} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const FindDonorScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const { userId } = user || {};
  const [selectedBloodGroup, setSelectedBloodGroup] = useState("");
  const [location, setLocation] = useState(""); // ✅ New state for location
  const [donors, setDonors] = useState([]);
  const [filteredDonors, setFilteredDonors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`http://${LOCALLINK}:8080/api/find-donors/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: userId,
        bloodGroup: selectedBloodGroup,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        const donorsWithDefaults = data
          .filter((donor) => donor.requested === false)
          .map((donor) => {
            const timestamp = donor.timestamp
              ? new Date(donor.timestamp)
              : new Date(0); // Default to Unix epoch if no timestamp
            const newTimestamp = new Date(
              timestamp.setDate(timestamp.getDate() + 10)
            ); // Add 10 days

            const formattedTimestamp = newTimestamp.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'

            return {
              ...donor,
              timeLimit: formattedTimestamp, // Updated timestamp
              distance: donor.distance || "0",
            };
          });

        setDonors(donorsWithDefaults);
        setFilteredDonors(donorsWithDefaults);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching donors:", error);
        setIsLoading(false);
      });
  }, [userId]);

  // ✅ Updated Search Handler
  const handleSearch = () => {
    const filteredData = donors.filter((donor) => {
      const matchBloodGroup =
        !selectedBloodGroup ||
        donor.bloodgroup.toUpperCase() === selectedBloodGroup.toUpperCase();
      const matchLocation =
        !location ||
        donor.location.toLowerCase().includes(location.toLowerCase());

      return matchBloodGroup && matchLocation;
    });

    setFilteredDonors(filteredData);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#870D25" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Find Donor</Text>
        <Text style={styles.headerSubtitle}>Blood donors around you</Text>

        <View style={styles.filterSection}>
  <Text style={styles.filterTitle}>Choose Blood group</Text>
  <View style={styles.inputRow}> 
    <View style={styles.selectContainer}>
      <TextInput
        style={styles.selectInput}
        placeholder="Select Blood Group"
        value={selectedBloodGroup}
        onChangeText={(text) => setSelectedBloodGroup(text.toUpperCase())}
      />
      <MaterialIcons
        name="arrow-drop-down"
        size={24}
        color="#666"
        style={styles.selectIcon}
      />
    </View>

    <View style={styles.selectContainer}>
      <TextInput
        style={styles.selectInput}
        placeholder="Enter city or area"
        value={location}
        onChangeText={setLocation}
      />
      <Ionicons
        name="location-outline"
        size={20}
        color="#666"
        style={styles.selectIcon}
      />
    </View>
  </View>

  <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
    <Ionicons name="search" size={18} color="#870D25" />
    <Text style={styles.searchButtonText}>Search</Text>
  </TouchableOpacity>
</View>



      </View>

      <View style={styles.resultsContainer}>
        <View style={styles.resultsHeader}>
          <Ionicons name="people" size={16} color="#666" />
          <Text style={styles.resultsText}>
            Found {filteredDonors.length} donors
          </Text>
        </View>

        {isLoading ? (
          <Text>Loading donors...</Text>
        ) : (
          <FlatList
            data={filteredDonors}
            keyExtractor={(item) => item.userId.toString()}
            renderItem={({ item }) => (
              <DonorCard
                donor={item}
                setDonors={setDonors}
                setFilteredDonors={setFilteredDonors}
              />
            )}
            contentContainerStyle={styles.donorsList}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      {/* Bottom Navigation – No Changes */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Feather name="home" size={22} color="#111" />
          <Text style={styles.tabText}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabItem}>
          <Feather name="search" size={22} color="#D2042D" />
          <Text style={[styles.tabText, { color: "#D2042D" }]}>Find Donor</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Request")}
        >
          <Feather name="droplet" size={22} color="#111" />
          <Text style={styles.tabText}>Request</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Feather name="user" size={22} color="#111" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
  },
  header: {
    backgroundColor: "#870D25",
    paddingVertical: 20,
    paddingTop: 60,
    paddingHorizontal: 16,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    position: "relative",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 15,
  },
  topRightIcons: {
    position: "absolute",
    top: 30,
    right: 20,
    flexDirection: "row",
  },
  filterSection: {
    marginTop: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  selectContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    marginBottom: 15,
  },
  selectInput: {
    height: 42,
    flex: 1,
    fontSize: 16,
  },
  selectIcon: {
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    alignSelf: "center",
    paddingHorizontal: 25,
  },
  searchButtonText: {
    color: "#870D25",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 16,
  },
  resultsContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  resultsHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 8,
  },
  resultsText: {
    fontSize: 14,
    color: "#666",
    marginLeft: 8,
  },
  donorsList: {
    paddingBottom: 80,
  },
  donorCard: {
    backgroundColor: "white",
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#eee",
  },
  donorHeader: {
    flexDirection: "row",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  bloodGroupContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dropIcon: {
    marginRight: 5,
  },
  bloodGroup: {
    color: "#870D25",
    fontSize: 24,
    fontWeight: "bold",
  },
  superscript: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#870D25",
    lineHeight: 22,
  },
  donorInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  donorGenderAge: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#333",
    marginRight: 10,
  },
  callButton: {
    marginRight: 10,
  },
  donorDetails: {
    padding: 12,
  },
  detailItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  detailText: {
    fontSize: 14,
    color: "#444",
    marginLeft: 8,
  },
  timeLabel: {
    fontSize: 14,
    color: "#666",
    marginRight: 5,
  },
  timeValue: {
    fontSize: 14,
    color: "#870D25",
    fontWeight: "bold",
    backgroundColor: "rgba(135, 13, 37, 0.1)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardActions: {
    flexDirection: "row",
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  shareButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRightWidth: 1,
    borderRightColor: "#f0f0f0",
  },
  actionText: {
    color: "#555",
    marginLeft: 6,
    fontSize: 14,
  },
  requestButton: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#870D25",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderBottomRightRadius: 12,
  },
  requestText: {
    color: "white",
    fontWeight: "bold",
    marginRight: 5,
    fontSize: 14,
  },
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
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#111",
  },
  filterSection: {
    marginTop: 10,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  selectContainer: {
    backgroundColor: "white",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    width: '48%', // Makes each input take 48% of the space
  },
  selectInput: {
    height: 42,
    flex: 1,
    fontSize: 16,
  },
  selectIcon: {
    marginLeft: 8,
  },
  searchButton: {
    backgroundColor: "white",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    alignSelf: "center",
    paddingHorizontal: 25,
  },
  searchButtonText: {
    color: "#870D25",
    fontWeight: "bold",
    marginLeft: 5,
    fontSize: 16,
  },
});

export default FindDonorScreen;
