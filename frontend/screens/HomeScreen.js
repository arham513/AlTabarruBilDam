import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  Dimensions,
  Animated,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import ChecklistCard from "./ChecklistCard";
import BloodTypeChart from "./BloodTypeChart";

export default function HomeScreen({ navigation }) {
  // Get device width for responsive sizing
  const { width } = Dimensions.get("window");

  // Current date for the calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());
  // State for rotating quotes
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  // State to track if images failed to load
  const [imageLoadError, setImageLoadError] = useState(false);
  // Animation value for sliding
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Motivational quotes array with images - UPDATED QUOTES
  const motivationalQuotes = [
    {
      text: "Your blood brings a mother home, a friend back, a dream alive.",
      image: require("../assets/images/quote1.jpg"),
      fallbackColor: "#F8D7DA",
    },
    {
      text: "Blood can't be manufactured only heroes like you can provide it.",
      image: require("../assets/images/quote2.jpeg"),
      fallbackColor: "#FCE4EC",
    },
    {
      text: "Your kindness flows through someone's veins, giving them another day.",
      image: require("../assets/images/quote3.jpeg"),
      fallbackColor: "#F5F5F5",
    },
    {
      text: "Today you're not just giving blood you're giving hugs, smiles, and second chances.",
      image: require("../assets/images/quote4.jpeg"),
      fallbackColor: "#EDF2F7",
    },
    {
      text: "You are the unseen miracle behind a family's smile and tomorrow's hope.",
      image: require("../assets/images/quote5.jpeg"),
      fallbackColor: "#FFEBEE",
    },
  ];

  // Function to animate to the next quote with sliding effect
  const slideToNextQuote = () => {
    // First slide out to the left
    Animated.timing(slideAnim, {
      toValue: -width,
      duration: 600,
      useNativeDriver: true,
    }).start(() => {
      // Change to next quote index
      setCurrentQuoteIndex((prevIndex) =>
        prevIndex === motivationalQuotes.length - 1 ? 0 : prevIndex + 1
      );

      // Reset position to right side (not visible)
      slideAnim.setValue(width);

      // Then slide in from the right
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }).start();
    });
  };

  // Auto rotate quotes with sliding effect every 6 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      slideToNextQuote();
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  // Manual quote navigation
  const navigateQuote = (direction) => {
    // Clear any ongoing animation
    slideAnim.stopAnimation();

    if (direction === "next") {
      // Slide out to left, then update and slide in from right
      Animated.timing(slideAnim, {
        toValue: -width,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuoteIndex((prevIndex) =>
          prevIndex === motivationalQuotes.length - 1 ? 0 : prevIndex + 1
        );
        slideAnim.setValue(width);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    } else {
      // Slide out to right, then update and slide in from left
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setCurrentQuoteIndex((prevIndex) =>
          prevIndex === 0 ? motivationalQuotes.length - 1 : prevIndex - 1
        );
        slideAnim.setValue(-width);
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }).start();
      });
    }
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    const firstDayOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    ).getDay();

    const days = [];

    // Add empty spaces for days before the first day of month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push({ day: "", empty: true });
    }

    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({ day: i, empty: false });
    }

    return days;
  };

  // Handle month navigation
  const changeMonth = (direction) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(currentMonth.getMonth() + direction);
    setCurrentMonth(newMonth);
  };

  // Calendar days
  const calendarDays = generateCalendarDays();

  // Format month and year
  const monthYearString = currentMonth.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  const currentQuote = motivationalQuotes[currentQuoteIndex];

  return (
    <View style={styles.container}>
      {/* Header with Countdown */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Days Until Next Donation:</Text>
        <Text style={styles.countdown}>
          <Text style={styles.countNum}>3</Text> :{" "}
          <Text style={styles.countNum}>07</Text>
        </Text>
        <Text style={styles.unitLabel}>Months Days</Text>

        <TouchableOpacity style={styles.eligibilityButton}>
          <Text style={styles.eligibilityText}>You're eligible to Donate</Text>
        </TouchableOpacity>

        {/* Top Right Icons */}
        <View style={styles.topRightIcons}>
          <TouchableOpacity onPress={() => navigation.navigate("Chat")}>
            <Feather name="message-square" size={20} color="white" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Notification")}>
            <Feather
              name="bell"
              size={20}
              color="white"
              style={{ marginLeft: 12 }}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Decorative Circles */}
      <View style={styles.circleSmall} />
      <View style={styles.circleMedium} />
      <View style={styles.circleLarge} />
      <View style={[styles.circleSmall, { top: 40, right: 80 }]} />
      <View style={[styles.circleMedium, { bottom: 20, left: 60 }]} />

      {/* Content Section */}
      <ScrollView style={styles.scrollContainer}>
        {/* Sliding Motivational Quote Card */}
        <View style={styles.quoteCardContainer}>
          <View style={styles.quoteCardWrapper}>
            <Animated.View
              style={[
                styles.quoteCard,
                {
                  backgroundColor: imageLoadError
                    ? currentQuote.fallbackColor
                    : "transparent",
                  transform: [{ translateX: slideAnim }],
                },
              ]}
            >
              {!imageLoadError && (
                <Image
                  source={currentQuote.image}
                  style={styles.backgroundImage}
                  onError={() => setImageLoadError(true)}
                  resizeMode="cover"
                />
              )}
              <View style={styles.quoteOverlay}>
                <Text style={styles.quoteText}>"{currentQuote.text}"</Text>
              </View>
            </Animated.View>
          </View>

          {/* Quote Navigation Controls */}
          <View style={styles.quoteNavigation}>
            <TouchableOpacity
              style={styles.quoteNavButton}
              onPress={() => navigateQuote("prev")}
            >
              <Feather name="chevron-left" size={22} color="#D2042D" />
            </TouchableOpacity>

            <View style={styles.quotePagination}>
              {motivationalQuotes.map((_, index) => (
                <View
                  key={index}
                  style={[
                    styles.paginationDot,
                    currentQuoteIndex === index ? styles.activeDot : {},
                  ]}
                />
              ))}
            </View>

            <TouchableOpacity
              style={styles.quoteNavButton}
              onPress={() => navigateQuote("next")}
            >
              <Feather name="chevron-right" size={22} color="#D2042D" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Calendar Section */}
        <View style={styles.card}>
          <View style={styles.calendarHeader}>
            <TouchableOpacity onPress={() => changeMonth(-1)}>
              <Feather name="chevron-left" size={24} color="#D2042D" />
            </TouchableOpacity>
            <Text style={styles.monthYearText}>{monthYearString}</Text>
            <TouchableOpacity onPress={() => changeMonth(1)}>
              <Feather name="chevron-right" size={24} color="#D2042D" />
            </TouchableOpacity>
          </View>

          {/* Calendar weekday headers */}
          <View style={styles.weekdaysRow}>
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((day, index) => (
              <Text key={index} style={styles.weekdayText}>
                {day}
              </Text>
            ))}
          </View>

          {/* Calendar days grid */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.calendarDay,
                  item.empty ? styles.emptyDay : null,
                  item.day === 15 ? styles.currentDay : null,
                  item.day === 20 ? styles.donationDay : null,
                ]}
                disabled={item.empty}
              >
                <Text
                  style={[
                    styles.dayText,
                    item.day === 15 ? styles.currentDayText : null,
                    item.day === 20 ? styles.donationDayText : null,
                  ]}
                >
                  {item.day}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#D2042D" }]}
              />
              <Text style={styles.legendText}>Donation Day</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#539A77" }]}
              />
              <Text style={styles.legendText}>Today</Text>
            </View>
          </View>
        </View>

        {/* Checklist Card */}
        <ChecklistCard />

        {/* Blood Type Chart */}
        <BloodTypeChart />

        {/* Extra padding at bottom for scroll */}
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Home")}
        >
          <Feather name="home" size={22} color="#D2042D" />
          <Text style={[styles.tabText, { color: "#D2042D" }]}>Home</Text>
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
        <TouchableOpacity
          style={styles.tabItem}
          onPress={() => navigation.navigate("Profile")}
        >
          <Feather name="user" size={22} color="#111" />
          <Text style={styles.tabText}>Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF5F5",
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "#840C24",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    position: "relative",
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    marginBottom: 10,
  },
  countdown: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
  countNum: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  unitLabel: {
    color: "white",
    fontSize: 12,
    marginTop: 2,
    letterSpacing: 1,
  },
  circleSmall: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "rgba(255, 102, 128, 0.4)",
    top: 30,
    left: 30,
  },
  circleMedium: {
    position: "absolute",
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255, 102, 128, 0.25)",
    top: 70,
    right: 60,
  },
  circleLarge: {
    position: "absolute",
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(255, 102, 128, 0.15)",
    top: 90,
    right: 20,
  },
  eligibilityButton: {
    marginTop: 16,
    backgroundColor: "#539A77",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 30,
  },
  eligibilityText: {
    color: "white",
    fontWeight: "bold",
  },
  topRightIcons: {
    position: "absolute",
    top: 30,
    right: 20,
    flexDirection: "row",
  },
  // Scroll container
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  // Quote card container and enhanced styles for sliding
  quoteCardContainer: {
    marginTop: 20,
  },
  quoteCardWrapper: {
    height: 150,
    overflow: "hidden",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  quoteCard: {
    height: 150,
    width: "100%",
    overflow: "hidden",
    borderRadius: 16,
    position: "relative",
  },
  backgroundImage: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  quoteOverlay: {
    flex: 1,
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  quoteText: {
    fontSize: 19,
    color: "#333",
    fontWeight: "600",
    textAlign: "center",
    fontStyle: "italic",
    letterSpacing: 0.5,
    lineHeight: 26,
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    fontFamily: "Roboto",
  },
  // Quote navigation controls
  quoteNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  quoteNavButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  quotePagination: {
    flexDirection: "row",
    justifyContent: "center",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ddd",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#D2042D",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  // Card style for all cards
  card: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 18,
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  // Calendar styles
  calendarHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  monthYearText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  weekdaysRow: {
    flexDirection: "row",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 5,
  },
  weekdayText: {
    flex: 1,
    textAlign: "center",
    color: "#666",
    fontSize: 12,
    fontWeight: "500",
  },
  calendarGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  calendarDay: {
    width: "14.28%", // 7 days per row
    aspectRatio: 1, // Square cells
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  emptyDay: {
    backgroundColor: "transparent",
  },
  currentDay: {
    backgroundColor: "#539A77",
    borderRadius: 50,
  },
  donationDay: {
    backgroundColor: "#D2042D",
    borderRadius: 50,
  },
  dayText: {
    fontSize: 14,
    color: "#333",
  },
  currentDayText: {
    color: "white",
    fontWeight: "bold",
  },
  donationDayText: {
    color: "white",
    fontWeight: "bold",
  },
  legendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
  },
  legendDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 5,
  },
  legendText: {
    fontSize: 12,
    color: "#666",
  },
  // Tab Bar styles
  tabBar: {
    flexDirection: "row",
    backgroundColor: "white",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
  },
  tabItem: {
    alignItems: "center",
  },
  tabText: {
    fontSize: 12,
    marginTop: 4,
    color: "#111",
  },
});
