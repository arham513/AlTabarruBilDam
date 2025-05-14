// import React, { useState, useRef, useEffect, useContext } from "react";
// import {
//   View,
//   Text,
//   StyleSheet,
//   FlatList,
//   TextInput,
//   TouchableOpacity,
//   SafeAreaView,
//   StatusBar,
//   KeyboardAvoidingView,
//   Platform,
//   Dimensions,
// } from "react-native";
// import Icon from "react-native-vector-icons/Feather";
// import { Linking } from "react-native";

// import {
//   collection,
//   addDoc,
//   query,
//   orderBy,
//   onSnapshot,
//   serverTimestamp,
// import * as Location from "expo-location";

// const { width } = Dimensions.get("window");

// const ChatDetailScreen = ({ route, navigation }) => {
//   const { conversation } = route.params;
//   const { user } = useContext(UserContext);
//   const { userId } = user || {};
//   const receiverId = conversation.id;
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const flatListRef = useRef(null);

//   const chatId = [userId, receiverId].sort().join("_");
//   const messagesRef = collection(db, "chats", chatId, "messages");

//   useEffect(() => {
//     const q = query(messagesRef, orderBy("timestamp", "asc"));
//     const unsubscribe = onSnapshot(q, (snapshot) => {
//       const loadedMessages = snapshot.docs.map((doc) => ({
//         id: doc.id,
//         ...doc.data(),
//       }));
//       setMessages(loadedMessages);
//     });

//     return unsubscribe; // Cleanup listener on unmount
//   }, []);

//   const sendMessage = async () => {
//     if (message.trim().length === 0) return;

//     await addDoc(messagesRef, {
//       text: message,
//       senderId: userId,
//       receiverId: receiverId,
//       timestamp: serverTimestamp(),
//     });

//     setMessage("");
//   };

//   const sendLocation = async () => {
//     try {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         alert("Permission to access location was denied");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       const { latitude, longitude } = location.coords;

//       const mapLink = `https://www.google.com/maps?q=${latitude},${longitude}`;

//       await addDoc(messagesRef, {
//         text: mapLink,
//         senderId: userId,
//         receiverId: receiverId,
//         timestamp: serverTimestamp(),
//         type: "location", // You can add a type to identify location messages
//       });
//     } catch (error) {
//       console.error("Error sending location:", error);
//     }
//   };

//   const renderMessageItem = ({ item }) => {
//     const isLocation = item.text.startsWith("https://www.google.com/maps?q=");

//     return (
//       <View
//         style={[
//           styles.messageBubble,
//           item.senderId === userId ? styles.myMessage : styles.theirMessage,
//         ]}
//       >
//         {isLocation ? (
//           <Text
//             style={[styles.messageText, { color: "blue" }]}
//             onPress={() => Linking.openURL(item.text)}
//           >
//             📍 Location (Tap to view)
//           </Text>
//         ) : (
//           <Text style={styles.messageText}>{item.text}</Text>
//         )}
//         <Text style={styles.messageTime}>
//           {item.timestamp?.toDate().toLocaleTimeString([], {
//             hour: "2-digit",
//             minute: "2-digit",
//           })}
//         </Text>
//       </View>
//     );
//   };

//   return (
//     <SafeAreaView style={styles.container}>
//       <StatusBar barStyle="light-content" backgroundColor="#9A1C2E" />

//       {/* Header */}
//       <View style={styles.header}>
//         <View style={styles.headerLeft}>
//           <TouchableOpacity
//             onPress={() => navigation.goBack()}
//             style={styles.backButton}
//           >
//             <Icon name="arrow-left" size={22} color="white" />
//           </TouchableOpacity>
//           <View style={styles.headerProfile}>
//             <View
//               style={[
//                 styles.avatar,
//                 { backgroundColor: conversation.color || "#F3F3F3" },
//               ]}
//             >
//               <Text
//                 style={[
//                   styles.avatarText,
//                   { color: conversation.textColor || "#616161" },
//                 ]}
//               >
//                 {conversation.initials}
//               </Text>
//             </View>
//             <View style={styles.headerTextContainer}>
//               <Text style={styles.headerName} numberOfLines={1}>
//                 {conversation.name}
//               </Text>
//               <Text style={styles.headerStatus} numberOfLines={1}>
//                 Active now
//               </Text>
//             </View>
//           </View>
//         </View>
//         <View style={styles.headerRight}>
//           <TouchableOpacity style={styles.headerButton}>
//             <Icon name="phone" size={20} color="white" />
//           </TouchableOpacity>
//           <TouchableOpacity style={styles.headerButton}>
//             <Icon name="more-vertical" size={20} color="white" />
//           </TouchableOpacity>
//         </View>
//       </View>

//       {/* Chat Messages */}
//       <FlatList
//         ref={flatListRef}
//         data={messages}
//         renderItem={renderMessageItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.messagesList}
//         onContentSizeChange={() =>
//           flatListRef.current.scrollToEnd({ animated: true })
//         }
//         showsVerticalScrollIndicator={true}
//         showsHorizontalScrollIndicator={false}
//       />

//       {/* Message Input */}
//       <KeyboardAvoidingView
//         behavior={Platform.OS === "ios" ? "padding" : "height"}
//         keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
//       >
//         <View style={styles.inputContainer}>
//           <TouchableOpacity style={styles.attachButton} onPress={sendLocation}>
//             <Icon name="map-pin" size={22} color="#757575" />
//           </TouchableOpacity>

//           <TextInput
//             style={styles.input}
//             placeholder="Type a message..."
//             value={message}
//             onChangeText={setMessage}
//             multiline
//             maxLength={500}
//           />
//           <TouchableOpacity
//             style={[
//               styles.sendButton,
//               message.trim().length > 0 ? styles.sendButtonActive : null,
//             ]}
//             onPress={sendMessage}
//             disabled={message.trim().length === 0}
//           >
//             <Icon
//               name="send"
//               size={20}
//               color={message.trim().length > 0 ? "white" : "#BDBDBD"}
//             />
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//     width: "100%",
//   },
//   header: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "space-between",
//     backgroundColor: "#9A1C2E",
//     paddingVertical: 12,
//     paddingHorizontal: 16,
//     elevation: 4,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.2,
//     shadowRadius: 2,
//     width: "100%",
//   },
//   headerLeft: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   backButton: {
//     marginRight: 12,
//     padding: 4,
//   },
//   headerProfile: {
//     flexDirection: "row",
//     alignItems: "center",
//     flex: 1,
//   },
//   avatar: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     justifyContent: "center",
//     alignItems: "center",
//     marginRight: 10,
//   },
//   avatarText: {
//     fontSize: 14,
//     fontWeight: "600",
//   },
//   headerTextContainer: {
//     flex: 1,
//   },
//   headerName: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "white",
//   },
//   headerStatus: {
//     fontSize: 12,
//     color: "#F8F8F8",
//     marginTop: 2,
//   },
//   headerRight: {
//     flexDirection: "row",
//   },
//   headerButton: {
//     padding: 8,
//     marginLeft: 8,
//   },
//   messagesList: {
//     paddingHorizontal: 16,
//     paddingVertical: 8,
//     width: "100%",
//   },
//   messageBubble: {
//     maxWidth: "80%",
//     padding: 12,
//     borderRadius: 18,
//     marginVertical: 4,
//   },
//   myMessage: {
//     backgroundColor: "#E3F2FD",
//     alignSelf: "flex-end",
//     borderBottomRightRadius: 4,
//   },
//   theirMessage: {
//     backgroundColor: "white",
//     alignSelf: "flex-start",
//     borderBottomLeftRadius: 4,
//   },
//   messageText: {
//     fontSize: 14,
//     color: "#212121",
//     lineHeight: 20,
//     flexWrap: "wrap",
//   },
//   messageTime: {
//     fontSize: 11,
//     color: "#757575",
//     alignSelf: "flex-end",
//     marginTop: 4,
//   },
//   inputContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "white",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderTopWidth: 1,
//     borderTopColor: "#EEEEEE",
//     width: "100%",
//   },
//   attachButton: {
//     padding: 8,
//     marginRight: 4,
//   },
//   input: {
//     flex: 1,
//     backgroundColor: "#F5F5F5",
//     borderRadius: 20,
//     paddingHorizontal: 12,
//     paddingVertical: 8,
//     maxHeight: 80,
//     fontSize: 14,
//     width: "100%",
//   },
//   sendButton: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     backgroundColor: "#E0E0E0",
//     justifyContent: "center",
//     alignItems: "center",
//     marginLeft: 8,
//   },
//   sendButtonActive: {
//     backgroundColor: "#9A1C2E",
//   },
// });

// export default ChatDetailScreen;
