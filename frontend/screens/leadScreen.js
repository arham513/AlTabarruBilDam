import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
} from "react-native";
import {
  Feather,
  MaterialIcons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { UserContext } from "../context/userContext";
import Constants from "expo-constants";
const { LOCALLINK } = Constants.expoConfig.extra;

export default function LeaderboardScreen({ navigation }) {
  const [leaderboardData, setLeaderboardData] = useState([]); // State to hold leaderboard data
  const { user } = useContext(UserContext);
  const { name } = user || {};

  useEffect(() => {
    // Fetch leaderboard data on component mount
    const fetchLeaderboardData = async () => {
      try {
        const response = await fetch(
          `http://${LOCALLINK}:8080/api/donations/leaderboard`
        );
        const data = await response.json();

        // Sort the data based on totalDonated in descending order
        const sortedData = data.sort((a, b) => b.totalDonated - a.totalDonated);

        // Find your position based on the name and donations
        const updatedData = sortedData.map((user, index) => ({
          ...user,
          rank: index + 1, // Assign rank based on sorted order
        }));

        // Find the current user and their rank
        const currentUser = updatedData.find((user) => user.name === name);
        if (currentUser) {
          // Update the rank and donations for the current user
          currentUser.rank = updatedData.indexOf(currentUser) + 1;
        }

        setLeaderboardData(updatedData); // Update state with fetched and updated data
      } catch (error) {
        console.error("Error fetching leaderboard data:", error);
      }
    };

    fetchLeaderboardData(); // Call the function to fetch the leaderboard data
  }, [name]);

  const renderTopDonors = () => {
    // Only show top 3 in special podium view
    const topThree = leaderboardData.slice(0, 3);
    return (
      <View style={styles.podiumContainer}>
        {/* 1st Place */}
        {/* 1st Place */}
        <View style={styles.podiumItem}>
          <Image
            source={{
              uri: `https://randomuser.me/api/portraits/men/${
                topThree[0]?.rank || Math.floor(Math.random() * 100)
              }.jpg`,
            }}
            style={[styles.podiumAvatar, styles.podiumFirstAvatar]}
          />
          <View style={[styles.podium, styles.podiumFirst]}>
            <Text style={styles.podiumRank}>1</Text>
          </View>
          <Text style={[styles.podiumName, styles.podiumFirstName]}>
            {topThree[0]?.name}
          </Text>
          <Text style={styles.podiumDonations}>
            {topThree[0]?.totalDonated} donations
          </Text>
          <View style={styles.crownContainer}>
            <MaterialIcons name="stars" size={22} color="#FFD700" />
          </View>
        </View>

        {/* 2nd Place */}
        <View style={styles.podiumItem}>
          <Image
            source={{
              uri: `https://randomuser.me/api/portraits/men/${
                topThree[1]?.rank || Math.floor(Math.random() * 100)
              }.jpg`,
            }}
            style={styles.podiumAvatar}
          />
          <View style={[styles.podium, styles.podiumSecond]}>
            <Text style={styles.podiumRank}>2</Text>
          </View>
          <Text style={styles.podiumName}>{topThree[1]?.name}</Text>
          <Text style={styles.podiumDonations}>
            {topThree[1]?.totalDonated} donations
          </Text>
        </View>

        {/* 3rd Place */}
        <View style={styles.podiumItem}>
          <Image
            source={{
              uri: `https://randomuser.me/api/portraits/men/${
                topThree[2]?.rank || Math.floor(Math.random() * 100)
              }.jpg`,
            }}
            style={styles.podiumAvatar}
          />
          <View style={[styles.podium, styles.podiumThird]}>
            <Text style={styles.podiumRank}>3</Text>
          </View>
          <Text style={styles.podiumName}>{topThree[2]?.name}</Text>
          <Text style={styles.podiumDonations}>
            {topThree[2]?.totalDonated} donations
          </Text>
        </View>
      </View>
    );
  };

  const renderMedalIcon = (rank) => {
    if (rank === 1)
      return <MaterialIcons name="looks-one" size={16} color="#FFD700" />;
    if (rank === 2)
      return <MaterialIcons name="looks-two" size={16} color="#C0C0C0" />;
    if (rank === 3)
      return <MaterialIcons name="looks-3" size={16} color="#CD7F32" />;
    return null;
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Feather name="arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Donation Leaders</Text>
      </View>

      {/* Current user rank highlight */}
      <View style={styles.userRankCard}>
        <View style={styles.userRankInfo}>
          <Text style={styles.userRankTitle}>Your Rank</Text>
          <Text style={styles.userRank}>
            #{leaderboardData.find((user) => user.name === name)?.rank || "N/A"}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.userDonationInfo}>
          <Text style={styles.userDonationTitle}>Your Donations</Text>
          <Text style={styles.userDonations}>
            {leaderboardData.find((user) => user.name === name)?.totalDonated ||
              0}
          </Text>
        </View>
        <View style={styles.divider} />
        <TouchableOpacity style={styles.showMeButton}>
          <Text style={styles.showMeButtonText}>View My Position</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {renderTopDonors()}

        <View style={styles.listContainer}>
          <Text style={styles.rankingsTitle}>Other Rankings</Text>
          {leaderboardData.slice(3).map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.rank}>#{item.rank}</Text>
              <Image
                source={{
                  uri: `https://randomuser.me/api/portraits/men/${
                    item.rank || Math.floor(Math.random() * 100)
                  }.jpg`,
                }}
                style={styles.avatar}
              />
              <View style={styles.info}>
                <Text style={styles.name}>{item.name}</Text>
                <View style={styles.locationContainer}>
                  <Feather name="map-pin" size={12} color="#888" />
                  <Text style={styles.location}>{item.location}</Text>
                </View>
                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <MaterialCommunityIcons
                      name="water"
                      size={12}
                      color="#D2042D"
                    />
                    <Text style={styles.statText}>
                      {item.totalDonated} donations
                    </Text>
                  </View>
                  <View style={styles.statItem}>
                    <Feather name="clock" size={12} color="#888" />
                    <Text style={styles.statText}>
                      {new Date(item.timestamp).toISOString().split("T")[0]}
                    </Text>
                  </View>
                </View>
              </View>
              {renderMedalIcon(item.rank)}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFAFA",
  },
  header: {
    backgroundColor: "#870D25",
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  backButton: {
    position: "absolute",
    top: 60,
    left: 20,
    zIndex: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    letterSpacing: 0.5,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 25,
    paddingVertical: 4,
    paddingHorizontal: 4,
    width: "80%",
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: "#fff",
  },
  tabText: {
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
    fontSize: 14,
  },
  activeTabText: {
    color: "#870D25",
  },
  userRankCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: -25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  userRankInfo: {
    alignItems: "center",
    flex: 1,
  },
  userRankTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    fontWeight: "500",
  },
  userRank: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#870D25",
  },
  divider: {
    width: 1,
    height: "70%",
    backgroundColor: "#E0E0E0",
  },
  userDonationInfo: {
    alignItems: "center",
    flex: 1,
  },
  userDonationTitle: {
    fontSize: 12,
    color: "#666",
    marginBottom: 5,
    fontWeight: "500",
  },
  userDonations: {
    fontWeight: "bold",
    fontSize: 24,
    color: "#870D25",
  },
  showMeButton: {
    backgroundColor: "#F5F5F5",
    borderRadius: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
    marginLeft: 15,
    alignItems: "center",
  },
  showMeButtonText: {
    color: "#333",
    fontSize: 12,
    fontWeight: "600",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  filterContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 10,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    letterSpacing: 0.2,
  },
  filterButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  filterText: {
    color: "#555",
    marginLeft: 5,
    fontSize: 13,
    fontWeight: "500",
  },
  podiumContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginVertical: 25,
    paddingHorizontal: 10,
  },
  podiumItem: {
    alignItems: "center",
    position: "relative",
    width: width / 3.5,
  },
  podiumAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
    zIndex: 1,
  },
  podiumFirstAvatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
  },
  podium: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: -15,
    width: "100%",
    paddingVertical: 20,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  podiumFirst: {
    backgroundColor: "#FFD700",
    height: 100,
  },
  podiumSecond: {
    backgroundColor: "#C0C0C0",
    height: 70,
  },
  podiumThird: {
    backgroundColor: "#CD7F32",
    height: 50,
  },
  podiumRank: {
    fontWeight: "bold",
    fontSize: 18,
    color: "#fff",
    marginTop: 10,
  },
  podiumName: {
    fontWeight: "500",
    fontSize: 12,
    marginTop: 5,
    textAlign: "center",
  },
  podiumFirstName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  podiumDonations: {
    fontSize: 11,
    color: "#666",
  },
  crownContainer: {
    position: "absolute",
    top: -10,
    zIndex: 2,
  },
  listContainer: {
    paddingHorizontal: 20,
  },
  rankingsTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 15,
    letterSpacing: 0.2,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  rank: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    width: 36,
  },
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    fontWeight: "600",
    fontSize: 15,
    color: "#222",
    marginBottom: 2,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  location: {
    fontSize: 12,
    color: "#888",
    marginLeft: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  statText: {
    fontSize: 11,
    color: "#666",
    marginLeft: 4,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  yourCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    padding: 14,
    marginVertical: 15,
    borderLeftWidth: 3,
    borderLeftColor: "#870D25",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  you: {
    fontSize: 12,
    color: "#666",
    fontWeight: "500",
  },
  progressContainer: {
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 20,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 10,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#870D25",
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: "#666",
  },
  motivationBox: {
    backgroundColor: "#fff",
    margin: 20,
    marginTop: 10,
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
    alignItems: "center",
  },
  motivationTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    letterSpacing: 0.2,
  },
  motivationText: {
    fontSize: 14,
    color: "#333",
    lineHeight: 20,
    textAlign: "center",
    marginBottom: 15,
  },
  donateButton: {
    backgroundColor: "#870D25",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 6,
    alignItems: "center",
  },
  donateButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 14,
  },
});
