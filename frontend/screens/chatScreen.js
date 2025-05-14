import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import Icon from "react-native-vector-icons/Feather";
import { UserContext } from "../context/userContext";
import Constants from "expo-constants";
const { LOCALLINK } = Constants.expoConfig.extra;

const ChatScreen = ({ navigation }) => {
  const { user } = useContext(UserContext);
  const { userId } = user || {};
  const [searchQuery, setSearchQuery] = useState("");
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);

  const USER_ID = userId;
  const API_URL = `http://${LOCALLINK}:8080/api/acceptedrequests/matched-users/${USER_ID}`;

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Remove duplicates based on userId
        const uniqueUsers = [];
        const seenUserIds = new Set();

        for (let user of data) {
          if (!seenUserIds.has(user.userId)) {
            seenUserIds.add(user.userId);

            // Assign initials and some default visual properties
            const initials = user.name
              .split(" ")
              .map((word) => word[0])
              .join("")
              .toUpperCase();

            uniqueUsers.push({
              id: user.userId,
              name: user.name,
              lastMessage: "Say hello!", // default or fetched separately
              time: "Just now", // could be dynamic
              unread: false,
              initials,
              color: "#E8F5E9",
              textColor: "#388E3C",
            });
          }
        }

        setConversations(uniqueUsers);
      } catch (error) {
        console.error("Failed to fetch chat users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const filteredConversations = conversations.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderConversationItem = ({ item }) => (
    <TouchableOpacity
      style={styles.conversationItem}
      onPress={() =>
        navigation.navigate("ChatDetailScreen", { conversation: item })
      }
    >
      <View style={[styles.avatarContainer, { backgroundColor: item.color }]}>
        <Text style={[styles.avatarText, { color: item.textColor }]}>
          {item.initials}
        </Text>
        {item.unread && <View style={styles.unreadBadge} />}
      </View>
      <View style={styles.conversationContent}>
        <View style={styles.conversationHeader}>
          <Text style={styles.conversationName}>{item.name}</Text>
          <Text style={styles.conversationTime}>{item.time}</Text>
        </View>
        <View style={styles.messagePreviewContainer}>
          <Text
            style={[
              styles.conversationMessage,
              item.unread && styles.unreadMessage,
            ]}
            numberOfLines={1}
          >
            {item.lastMessage}
          </Text>
          <Icon name="chevron-right" size={16} color="#BDBDBD" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#9A1C2E" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Messages</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>Back</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <Icon
          name="search"
          size={16}
          color="#9E9E9E"
          style={styles.searchIcon}
        />
        <TextInput
          style={styles.searchInput}
          placeholder="Search conversations"
          placeholderTextColor="#9E9E9E"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery("")}>
            <Icon name="x" size={16} color="#9E9E9E" />
          </TouchableOpacity>
        )}
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#9A1C2E"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={(item) => item.id}
          style={styles.conversationList}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5F5F5",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#9A1C2E",
    paddingVertical: 16,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "white",
  },
  backButton: {
    fontSize: 14,
    fontWeight: "500",
    color: "white",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 8,
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    height: 30,
    padding: 0,
  },
  conversationList: {
    flex: 1,
  },
  conversationItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
    position: "relative",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
  },
  unreadBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#9A1C2E",
    borderWidth: 1,
    borderColor: "white",
  },
  conversationContent: {
    flex: 1,
  },
  conversationHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  conversationName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#212121",
  },
  conversationTime: {
    fontSize: 12,
    color: "#9E9E9E",
  },
  messagePreviewContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  conversationMessage: {
    fontSize: 12,
    color: "#757575",
    flex: 1,
    marginRight: 8,
  },
  unreadMessage: {
    fontWeight: "500",
    color: "#212121",
  },
});

export default ChatScreen;
