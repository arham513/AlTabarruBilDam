import React, { useState, useCallback, memo, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  Platform,
  useColorScheme,
  ActivityIndicator,
} from "react-native";
import * as Animatable from "react-native-animatable";
import { MaterialIcons } from "@expo/vector-icons";
import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
import FeedbackList from "./FeedbackList";
import BlacklistManager from "./BlacklistManager";
import Constants from "expo-constants";
const { LOCALLINK } = Constants.expoConfig.extra;

const { width, height } = Dimensions.get("window");

// Memoized tab button component for better performance
const TabButton = memo(({ title, icon, isActive, onPress }) => {
  return (
    <TouchableOpacity
      style={[styles.tab, isActive && styles.activeTab]}
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: isActive }}
      accessibilityLabel={`${title} tab`}
    >
      <MaterialIcons
        name={icon}
        size={20}
        color={isActive ? "white" : "rgba(255,255,255,0.7)"}
        style={styles.tabIcon}
      />
      <Text style={[styles.tabText, isActive && styles.activeTabText]}>
        {title}
      </Text>
      {isActive && <View style={styles.activeIndicator} />}
    </TouchableOpacity>
  );
});

// Memoized StatsCard component
const StatsCard = memo(
  ({ title, value, icon, color, trend = null, isDarkMode }) => {
    const isTrendPositive = trend > 0;
    const trendColor = isTrendPositive ? "#22C55E" : "#EF4444";
    const trendIcon = isTrendPositive ? "trending-up" : "trending-down";
    // const [stats, setStats] = useState(null);

    return (
      <View
        style={[
          styles.statsCard,
          { borderLeftColor: color },
          isDarkMode && styles.darkCard,
        ]}
        accessible={true}
        accessibilityLabel={`${title}: ${value}${
          trend
            ? `, ${Math.abs(trend)}% ${
                isTrendPositive ? "increase" : "decrease"
              }`
            : ""
        }`}
      >
        <View style={styles.statsHeader}>
          <MaterialIcons name={icon} size={24} color={color} />
          {trend !== null && (
            <View style={styles.trendContainer}>
              <MaterialIcons name={trendIcon} size={16} color={trendColor} />
              <Text style={[styles.trendText, { color: trendColor }]}>
                {Math.abs(trend)}%
              </Text>
            </View>
          )}
        </View>
        <Text style={[styles.statsValue, isDarkMode && styles.darkText]}>
          {value}
        </Text>
        <Text style={[styles.statsTitle, isDarkMode && styles.darkSubText]}>
          {title}
        </Text>
      </View>
    );
  }
);

// Memoized chart section with integrated charts
const DashboardView = memo(({ isDarkMode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [activeChartTab, setActiveChartTab] = useState("donations");
  const [chartDimensions, setChartDimensions] = useState({
    width: width - 40,
    height: 220,
  });

  // Get screen dimensions for responsiveness
  const screenWidth = Dimensions.get("window").width;
  const isSmallScreen = screenWidth < 350;

  // Stats data for the dashboard
  const statsData = stats
    ? [
        {
          id: 1,
          title: "Total Donations",
          value: stats.totalDonations,
          icon: "water-drop",
          color: "#870D25",
          trend: null,
        },
        {
          id: 2,
          title: "Active Donors",
          value: stats.totalActiveUsers,
          icon: "people",
          color: "#22C55E",
          trend: null,
        },
        {
          id: 3,
          title: "Pending Requests",
          value: stats.totalPendingRequests,
          icon: "pending",
          color: "#F59E0B",
          trend: null,
        },
        {
          id: 4,
          title: "Blacklisted Users",
          value: "N/A",
          icon: "block",
          color: "#EF4444",
          trend: null,
        },
      ]
    : [];

  // Chart configuration
  const chartConfig = {
    backgroundGradientFrom: isDarkMode ? "#1E1E1E" : "#fff",
    backgroundGradientTo: isDarkMode ? "#1E1E1E" : "#fff",
    backgroundGradientFromOpacity: 1,
    backgroundGradientToOpacity: 1,
    color: (opacity = 1) =>
      isDarkMode
        ? `rgba(255, 107, 129, ${opacity})`
        : `rgba(135, 13, 37, ${opacity})`,
    labelColor: (opacity = 1) =>
      isDarkMode
        ? `rgba(255, 255, 255, ${opacity})`
        : `rgba(51, 51, 51, ${opacity})`,
    strokeWidth: 2,
    barPercentage: 0.75,
    useShadowColorFromDataset: false,
    propsForDots: {
      r: "5",
      strokeWidth: "2",
      stroke: isDarkMode ? "#FF6B81" : "#870D25",
    },
    fillShadowGradientFrom: isDarkMode ? "#FF6B81" : "#870D25",
    fillShadowGradientTo: isDarkMode
      ? "rgba(255, 107, 129, 0.2)"
      : "rgba(135, 13, 37, 0.1)",
    fillShadowGradientOpacity: 0.6,
    propsForBackgroundLines: {
      strokeDasharray: "",
      strokeWidth: 1,
      stroke: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
    },
    decimalPlaces: 0,
  };

  // Chart data
  const monthlyDonations = stats
    ? {
        labels: Object.keys(stats.monthlyDonations || {}),
        datasets: [
          {
            data: Object.values(stats.monthlyDonations || {}),
            color: (opacity = 1) => `rgba(135, 13, 37, ${opacity})`,
            strokeWidth: 2.5,
          },
        ],
      }
    : { labels: [], datasets: [] };

  const bloodGroupColors = {
    "A+": "#8B0000", // dark red
    "B+": "#B22222", // firebrick
    "O+": "#DC143C", // crimson
    "AB+": "#FF0000", // red
    "A-": "#800000", // maroon
    "O-": "#4B0000", // very dark red
    "B-": "#A52A2A", // brown (optional if present)
    "AB-": "#660000", // deep blood red (optional if present)
  };

  const bloodTypes = stats
    ? Object.entries(stats.bloodGroupStats || {}).map(([group, count]) => ({
        name: group,
        population: count,
        color: bloodGroupColors[group] || "#999", // fallback color if group is missing in map
        legendFontColor: isDarkMode ? "#E0E0E0" : "#444",
        legendFontSize: 12,
      }))
    : [];

  const userGrowth = stats
    ? {
        labels: Object.keys(stats.userGrowth || {}),
        datasets: [
          {
            data: Object.values(stats.userGrowth || {}),
            color: (opacity = 1) => `rgba(135, 13, 37, ${opacity})`,
            strokeWidth: 2.5,
          },
        ],
      }
    : { labels: [], datasets: [] };

  // Handle dimension changes
  useEffect(() => {
    const updateDimensions = () => {
      const { width: screenWidth, height: screenHeight } =
        Dimensions.get("window");
      const isLandscape = screenWidth > screenHeight;

      const chartWidth = isLandscape
        ? Math.min(screenWidth * 0.65, 650)
        : screenWidth - 40;

      const chartHeight = isLandscape ? 220 : Math.min(240, screenHeight * 0.3);

      setChartDimensions({ width: chartWidth, height: chartHeight });
    };

    updateDimensions();
    const subscription = Dimensions.addEventListener(
      "change",
      updateDimensions
    );

    // Fetch data from API
    fetch(`http://${LOCALLINK}:8080/api/stats`)
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch stats", err);
        setIsLoading(false);
      });

    return () => subscription?.remove();
  }, []);

  // Chart tab buttons
  const chartTabs = [
    { id: "donations", title: "Donations", icon: "water-drop" },
    { id: "distribution", title: "Blood Types", icon: "pie-chart" },
    { id: "growth", title: "User Growth", icon: "trending-up" },
  ];

  // Change chart tab
  const handleChartTabChange = useCallback((tabId) => {
    setActiveChartTab(tabId);
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          isDarkMode && { backgroundColor: "#121212" },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={isDarkMode ? "#FF6B81" : "#870D25"}
        />
        <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
          Loading dashboard data...
        </Text>
      </View>
    );
  }

  // Render the appropriate chart based on active tab
  const renderActiveChart = () => {
    switch (activeChartTab) {
      case "donations":
        return (
          <LineChart
            data={monthlyDonations}
            width={chartDimensions.width}
            height={chartDimensions.height}
            chartConfig={chartConfig}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withShadow={true}
            yAxisLabel=""
            yAxisSuffix=""
            formatYLabel={(value) => Math.round(value).toString()}
          />
        );
      case "distribution":
        return (
          <PieChart
            data={bloodTypes}
            width={chartDimensions.width}
            height={chartDimensions.height}
            chartConfig={chartConfig}
            accessor={"population"}
            backgroundColor={"transparent"}
            paddingLeft={"15"}
            center={[10, 0]}
            absolute
            hasLegend={true}
          />
        );
      case "growth":
        return (
          <BarChart
            data={userGrowth}
            width={chartDimensions.width}
            height={chartDimensions.height}
            chartConfig={{
              ...chartConfig,
              barPercentage: 0.7,
              formatYLabel: (value) => Math.round(value).toString(),
            }}
            style={styles.chart}
            showValuesOnTopOfBars
            fromZero
            yAxisLabel=""
            yAxisSuffix=""
          />
        );
      default:
        return null;
    }
  };

  return (
    <Animatable.View animation="fadeIn" duration={800}>
      {/* Stats Cards - Modified for better responsiveness */}
      <View style={[styles.statsGrid, isSmallScreen && styles.statsGridSmall]}>
        {statsData.map((item, index) => (
          <Animatable.View
            key={item.id}
            animation="fadeInUp"
            delay={300 + index * 100}
            style={[
              styles.statsCardWrapper,
              isSmallScreen && styles.statsCardWrapperSmall,
            ]}
          >
            <StatsCard
              title={item.title}
              value={item.value}
              icon={item.icon}
              color={item.color}
              trend={item.trend}
              isDarkMode={isDarkMode}
            />
          </Animatable.View>
        ))}
      </View>

      {/* Integrated Dashboard */}
      <Animatable.View
        animation="fadeInUp"
        delay={800}
        style={[styles.dashboardCard, isDarkMode && styles.darkCard]}
      >
        <View style={styles.dashboardHeader}>
          <Text style={[styles.dashboardTitle, isDarkMode && styles.darkText]}>
            Analytics Dashboard
          </Text>
          <TouchableOpacity style={styles.optionsButton}>
            <MaterialIcons
              name="more-vert"
              size={24}
              color={isDarkMode ? "#E0E0E0" : "#333"}
            />
          </TouchableOpacity>
        </View>

        {/* Chart Tabs */}
        <View
          style={[
            styles.chartTabContainer,
            isDarkMode && styles.darkChartTabContainer,
          ]}
        >
          {chartTabs.map((tab) => (
            <TouchableOpacity
              key={tab.id}
              style={[
                styles.chartTab,
                activeChartTab === tab.id && styles.activeChartTab,
                isDarkMode &&
                  activeChartTab === tab.id &&
                  styles.darkActiveChartTab,
              ]}
              onPress={() => handleChartTabChange(tab.id)}
            >
              <MaterialIcons
                name={tab.icon}
                size={16}
                color={
                  activeChartTab === tab.id
                    ? isDarkMode
                      ? "#FF6B81"
                      : "#870D25"
                    : isDarkMode
                    ? "#AAA"
                    : "#777"
                }
                style={styles.chartTabIcon}
              />
              <Text
                style={[
                  styles.chartTabText,
                  activeChartTab === tab.id && styles.activeChartTabText,
                  isDarkMode && styles.darkChartTabText,
                  isDarkMode &&
                    activeChartTab === tab.id &&
                    styles.darkActiveChartTabText,
                ]}
              >
                {tab.title}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart Area */}
        <View style={styles.chartContainer}>{renderActiveChart()}</View>

        {/* Legend/Status Row */}
        <View style={styles.chartStatusRow}>
          <View style={styles.dataPeriodContainer}>
            <Text
              style={[styles.dataPeriodLabel, isDarkMode && styles.darkSubText]}
            >
              {activeChartTab === "distribution"
                ? "Current Distribution"
                : "Last 6 Months"}
            </Text>
          </View>

          <TouchableOpacity style={styles.downloadButton}>
            <MaterialIcons
              name="file-download"
              size={16}
              color={isDarkMode ? "#AAA" : "#666"}
            />
            <Text
              style={[styles.downloadText, isDarkMode && styles.darkSubText]}
            >
              Export
            </Text>
          </TouchableOpacity>
        </View>
      </Animatable.View>

      {/* Recent Activity */}
      <Animatable.View
        animation="fadeInUp"
        delay={1000}
        style={[styles.recentActivityCard, isDarkMode && styles.darkCard]}
      >
        <View style={styles.recentActivityHeader}>
          <Text
            style={[styles.recentActivityTitle, isDarkMode && styles.darkText]}
          >
            Recent Activity
          </Text>
          <TouchableOpacity style={styles.viewAllButton}>
            <Text
              style={[
                styles.viewAllText,
                { color: isDarkMode ? "#FF6B81" : "#870D25" },
              ]}
            >
              View All
            </Text>
          </TouchableOpacity>
        </View>

        {/* Activity items */}
        {[1, 2, 3].map((item) => (
          <View key={item} style={styles.activityItem}>
            <View
              style={[
                styles.activityIconContainer,
                {
                  backgroundColor: isDarkMode
                    ? "rgba(255,107,129,0.1)"
                    : "rgba(135,13,37,0.1)",
                },
              ]}
            >
              <MaterialIcons
                name={
                  item === 1
                    ? "person-add"
                    : item === 2
                    ? "water-drop"
                    : "notifications"
                }
                size={18}
                color={isDarkMode ? "#FF6B81" : "#870D25"}
              />
            </View>
            <View style={styles.activityContent}>
              <Text
                style={[styles.activityText, isDarkMode && styles.darkText]}
              >
                {item === 1
                  ? "New donor registered"
                  : item === 2
                  ? "Donation completed"
                  : "Blood request approved"}
              </Text>
              <Text
                style={[styles.activityTime, isDarkMode && styles.darkSubText]}
              >
                {item === 1
                  ? "10 mins ago"
                  : item === 2
                  ? "2 hours ago"
                  : "5 hours ago"}
              </Text>
            </View>
          </View>
        ))}
      </Animatable.View>
    </Animatable.View>
  );
});

export default function AdminScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState("overview");
  const systemColorScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

  // Tab configuration
  const tabs = [
    { id: "overview", title: "Overview", icon: "dashboard" },
    { id: "feedback", title: "Feedback", icon: "feedback" },
    { id: "blacklist", title: "Blacklist", icon: "block" },
  ];

  // Using useCallback to optimize tab switching
  const handleTabPress = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Handle back button press
  const handleBackPress = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Handle theme toggle
  const toggleTheme = useCallback(() => {
    setIsDarkMode((prev) => !prev);
  }, []);

  return (
    <SafeAreaView
      style={[styles.container, isDarkMode && styles.darkContainer]}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={isDarkMode ? "#5D0919" : "#870D25"}
      />

      {/* Header */}
      <Animatable.View
        animation="fadeIn"
        duration={600}
        style={[styles.header, isDarkMode && styles.darkHeader]}
      >
        <View style={styles.headerContent}>
          <Text style={styles.headerText}>Admin Panel</Text>
          <TouchableOpacity
            style={styles.backButton}
            accessibilityLabel="Go back"
            accessibilityRole="button"
            onPress={handleBackPress}
          >
            <MaterialIcons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer} accessibilityRole="tablist">
          {tabs.map((tab) => (
            <TabButton
              key={tab.id}
              title={tab.title}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onPress={() => handleTabPress(tab.id)}
            />
          ))}
        </View>
      </Animatable.View>

      {/* Content Area */}
      <ScrollView
        contentContainerStyle={[
          styles.contentContainer,
          isDarkMode && styles.darkContentContainer,
        ]}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "overview" && <DashboardView isDarkMode={isDarkMode} />}

        {activeTab === "feedback" && (
          <Animatable.View animation="fadeInUp" duration={600}>
            <FeedbackList isDarkMode={isDarkMode} />
          </Animatable.View>
        )}

        {activeTab === "blacklist" && (
          <Animatable.View animation="fadeInUp" duration={600}>
            <BlacklistManager isDarkMode={isDarkMode} />
          </Animatable.View>
        )}
      </ScrollView>

      {/* Theme Toggle Button (replaced FAB) */}
      <Animatable.View
        animation="bounceIn"
        delay={1000}
        style={styles.fabContainer}
      >
        <TouchableOpacity
          style={[styles.fab, isDarkMode && styles.darkFab]}
          activeOpacity={0.8}
          accessibilityLabel={
            isDarkMode ? "Switch to light mode" : "Switch to dark mode"
          }
          accessibilityRole="button"
          onPress={toggleTheme}
        >
          <MaterialIcons
            name={isDarkMode ? "light-mode" : "dark-mode"}
            size={24}
            color="white"
          />
        </TouchableOpacity>
      </Animatable.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  darkContainer: {
    backgroundColor: "#121212",
  },
  header: {
    backgroundColor: "#870D25",
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
  },
  darkHeader: {
    backgroundColor: "#5D0919",
  },
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  headerText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  backButton: {
    padding: 5,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 12,
    padding: 4,
    marginTop: 5,
  },
  tab: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 10,
    position: "relative",
    flex: 1,
    justifyContent: "center",
  },
  activeTab: {
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  tabIcon: {
    marginRight: 6,
  },
  tabText: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 14,
    fontWeight: "500",
  },
  activeTabText: {
    color: "white",
    fontWeight: "bold",
  },
  activeIndicator: {
    position: "absolute",
    bottom: 0,
    left: "25%",
    right: "25%",
    height: 3,
    backgroundColor: "white",
    borderRadius: 1.5,
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 80, // Extra padding for FAB
  },
  darkContentContainer: {
    backgroundColor: "#121212",
  },
  fabContainer: {
    position: "absolute",
    right: 20,
    bottom: 20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#870D25",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 6,
  },
  darkFab: {
    backgroundColor: "#B71C1C",
  },

  // Stats Section Styles - MODIFIED FOR BETTER MOBILE LAYOUT
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 16,
    width: "100%",
  },
  statsGridSmall: {
    flexDirection: "column",
  },
  statsCardWrapper: {
    width: "48%",
    marginBottom: 12,
    height: 100, // Fixed height
    maxHeight: 100, // Maximum height constraint
  },
  statsCardWrapperSmall: {
    width: "100%", // Full width on small screens
    height: 90,
    maxHeight: 90,
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 14,
    borderLeftWidth: 4,
    height: "100%", // Fill parent height
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  darkCard: {
    backgroundColor: "#1E1E1E",
    borderColor: "#333",
  },
  statsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statsValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4,
  },
  statsTitle: {
    fontSize: 12,
    color: "#666",
  },
  trendContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
  },
  trendText: {
    fontSize: 11,
    fontWeight: "600",
    marginLeft: 2,
  },
  darkText: {
    color: "#E0E0E0",
  },
  darkSubText: {
    color: "#AAAAAA",
  },

  // Dashboard Card Styles
  dashboardCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  dashboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dashboardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  optionsButton: {
    padding: 4,
  },
  chartTabContainer: {
    flexDirection: "row",
    backgroundColor: "#F5F5F7",
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
  },
  darkChartTabContainer: {
    backgroundColor: "#2A2A2A",
  },
  chartTab: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    flex: 1,
  },
  activeChartTab: {
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  darkActiveChartTab: {
    backgroundColor: "#383838",
  },
  chartTabIcon: {
    marginRight: 5,
  },
  chartTabText: {
    fontSize: 12,
    color: "#777",
    fontWeight: "500",
  },
  activeChartTabText: {
    color: "#870D25",
    fontWeight: "600",
  },
  darkChartTabText: {
    color: "#AAA",
  },
  darkActiveChartTabText: {
    color: "#FF6B81",
  },
  chartContainer: {
    alignItems: "center",
    marginVertical: 10,
  },
  chart: {
    borderRadius: 8,
    marginVertical: 8,
  },
  chartStatusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 12,
    marginTop: 5,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  dataPeriodContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  dataPeriodLabel: {
    fontSize: 12,
    color: "#777",
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    backgroundColor: "#F5F5F7",
  },
  downloadText: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },

  // Recent Activity Styles
  recentActivityCard: {
    backgroundColor: "white",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  recentActivityHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  recentActivityTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  viewAllButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  viewAllText: {
    fontSize: 12,
    fontWeight: "500",
  },
  activityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  activityIconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: 14,
    color: "#333",
    marginBottom: 4,
  },
  activityTime: {
    fontSize: 12,
    color: "#999",
  },

  // Loading styles
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    backgroundColor: "#F8F9FA",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666",
  },
});

// import React, { useState, useCallback, memo, useEffect } from "react";
// import {
//   View,
//   Text,
//   ScrollView,
//   TouchableOpacity,
//   StyleSheet,
//   Dimensions,
//   StatusBar,
//   SafeAreaView,
//   Platform,
//   useColorScheme,
//   ActivityIndicator,
// } from "react-native";
// import * as Animatable from "react-native-animatable";
// import { MaterialIcons } from "@expo/vector-icons";
// import { LineChart, BarChart, PieChart } from "react-native-chart-kit";
// import FeedbackList from "./FeedbackList";
// import BlacklistManager from "./BlacklistManager";
// import Constants from "expo-constants";
// const { LOCALLINK } = Constants.expoConfig.extra;

// const { width, height } = Dimensions.get("window");

// // Memoized tab button component for better performance
// const TabButton = memo(({ title, icon, isActive, onPress }) => {
//   return (
//     <TouchableOpacity
//       style={[styles.tab, isActive && styles.activeTab]}
//       onPress={onPress}
//       accessibilityRole="tab"
//       accessibilityState={{ selected: isActive }}
//       accessibilityLabel={`${title} tab`}
//     >
//       <MaterialIcons
//         name={icon}
//         size={20}
//         color={isActive ? "white" : "rgba(255,255,255,0.7)"}
//         style={styles.tabIcon}
//       />
//       <Text style={[styles.tabText, isActive && styles.activeTabText]}>
//         {title}
//       </Text>
//       {isActive && <View style={styles.activeIndicator} />}
//     </TouchableOpacity>
//   );
// });

// // Memoized StatsCard component
// const StatsCard = memo(
//   ({ title, value, icon, color, trend = null, isDarkMode }) => {
//     const isTrendPositive = trend > 0;
//     const trendColor = isTrendPositive ? "#22C55E" : "#EF4444";
//     const trendIcon = isTrendPositive ? "trending-up" : "trending-down";
//     // const [stats, setStats] = useState(null);

//     return (
//       <View
//         style={[
//           styles.statsCard,
//           { borderLeftColor: color },
//           isDarkMode && styles.darkCard,
//         ]}
//         accessible={true}
//         accessibilityLabel={`${title}: ${value}${
//           trend
//             ? `, ${Math.abs(trend)}% ${
//                 isTrendPositive ? "increase" : "decrease"
//               }`
//             : ""
//         }`}
//       >
//         <View style={styles.statsHeader}>
//           <MaterialIcons name={icon} size={24} color={color} />
//           {trend !== null && (
//             <View style={styles.trendContainer}>
//               <MaterialIcons name={trendIcon} size={16} color={trendColor} />
//               <Text style={[styles.trendText, { color: trendColor }]}>
//                 {Math.abs(trend)}%
//               </Text>
//             </View>
//           )}
//         </View>
//         <Text style={[styles.statsValue, isDarkMode && styles.darkText]}>
//           {value}
//         </Text>
//         <Text style={[styles.statsTitle, isDarkMode && styles.darkSubText]}>
//           {title}
//         </Text>
//       </View>
//     );
//   }
// );

// // Memoized chart section with integrated charts
// const DashboardView = memo(({ isDarkMode }) => {
//   const [isLoading, setIsLoading] = useState(true);
//   const [stats, setStats] = useState(null);
//   const [activeChartTab, setActiveChartTab] = useState("donations");
//   const [chartDimensions, setChartDimensions] = useState({
//     width: width - 40,
//     height: 220,
//   });

//   // Get screen dimensions for responsiveness
//   const screenWidth = Dimensions.get("window").width;
//   const isSmallScreen = screenWidth < 350;

//   // Stats data for the dashboard
//   const statsData = stats
//     ? [
//         {
//           id: 1,
//           title: "Total Donations",
//           value: stats.totalDonations,
//           icon: "water-drop",
//           color: "#870D25",
//           trend: null,
//         },
//         {
//           id: 2,
//           title: "Active Donors",
//           value: stats.totalActiveUsers,
//           icon: "people",
//           color: "#22C55E",
//           trend: null,
//         },
//         {
//           id: 3,
//           title: "Pending Requests",
//           value: stats.totalPendingRequests,
//           icon: "pending",
//           color: "#F59E0B",
//           trend: null,
//         },
//         {
//           id: 4,
//           title: "Blacklisted Users",
//           value: "N/A",
//           icon: "block",
//           color: "#EF4444",
//           trend: null,
//         },
//       ]
//     : [];

//   // Chart configuration
//   const chartConfig = {
//     backgroundGradientFrom: isDarkMode ? "#1E1E1E" : "#fff",
//     backgroundGradientTo: isDarkMode ? "#1E1E1E" : "#fff",
//     backgroundGradientFromOpacity: 1,
//     backgroundGradientToOpacity: 1,
//     color: (opacity = 1) =>
//       isDarkMode
//         ? `rgba(255, 107, 129, ${opacity})`
//         : `rgba(135, 13, 37, ${opacity})`,
//     labelColor: (opacity = 1) =>
//       isDarkMode
//         ? `rgba(255, 255, 255, ${opacity})`
//         : `rgba(51, 51, 51, ${opacity})`,
//     strokeWidth: 2,
//     barPercentage: 0.75,
//     useShadowColorFromDataset: false,
//     propsForDots: {
//       r: "5",
//       strokeWidth: "2",
//       stroke: isDarkMode ? "#FF6B81" : "#870D25",
//     },
//     fillShadowGradientFrom: isDarkMode ? "#FF6B81" : "#870D25",
//     fillShadowGradientTo: isDarkMode
//       ? "rgba(255, 107, 129, 0.2)"
//       : "rgba(135, 13, 37, 0.1)",
//     fillShadowGradientOpacity: 0.6,
//     propsForBackgroundLines: {
//       strokeDasharray: "",
//       strokeWidth: 1,
//       stroke: isDarkMode ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.05)",
//     },
//     decimalPlaces: 0,
//   };

//   // Chart data
//   const monthlyDonations = stats
//     ? {
//         labels: Object.keys(stats.monthlyDonations || {}),
//         datasets: [
//           {
//             data: Object.values(stats.monthlyDonations || {}),
//             color: (opacity = 1) => `rgba(135, 13, 37, ${opacity})`,
//             strokeWidth: 2.5,
//           },
//         ],
//       }
//     : { labels: [], datasets: [] };

//   const bloodGroupColors = {
//     "A+": "#8B0000", // dark red
//     "B+": "#B22222", // firebrick
//     "O+": "#DC143C", // crimson
//     "AB+": "#FF0000", // red
//     "A-": "#800000", // maroon
//     "O-": "#4B0000", // very dark red
//     "B-": "#A52A2A", // brown (optional if present)
//     "AB-": "#660000", // deep blood red (optional if present)
//   };

//   const bloodTypes = stats
//     ? Object.entries(stats.bloodGroupStats || {}).map(([group, count]) => ({
//         name: group,
//         population: count,
//         color: bloodGroupColors[group] || "#999", // fallback color if group is missing in map
//         legendFontColor: isDarkMode ? "#E0E0E0" : "#444",
//         legendFontSize: 12,
//       }))
//     : [];

//   const userGrowth = stats
//     ? {
//         labels: Object.keys(stats.userGrowth || {}),
//         datasets: [
//           {
//             data: Object.values(stats.userGrowth || {}),
//             color: (opacity = 1) => `rgba(135, 13, 37, ${opacity})`,
//             strokeWidth: 2.5,
//           },
//         ],
//       }
//     : { labels: [], datasets: [] };

//   // Handle dimension changes
//   useEffect(() => {
//     const updateDimensions = () => {
//       const { width: screenWidth, height: screenHeight } =
//         Dimensions.get("window");
//       const isLandscape = screenWidth > screenHeight;

//       const chartWidth = isLandscape
//         ? Math.min(screenWidth * 0.65, 650)
//         : screenWidth - 40;

//       const chartHeight = isLandscape ? 220 : Math.min(240, screenHeight * 0.3);

//       setChartDimensions({ width: chartWidth, height: chartHeight });
//     };

//     updateDimensions();
//     const subscription = Dimensions.addEventListener(
//       "change",
//       updateDimensions
//     );

//     // Fetch data from API
//     fetch(`http://${LOCALLINK}:8080/api/stats`)
//       .then((res) => res.json())
//       .then((data) => {
//         setStats(data);
//         setIsLoading(false);
//       })
//       .catch((err) => {
//         console.error("Failed to fetch stats", err);
//         setIsLoading(false);
//       });

//     return () => subscription?.remove();
//   }, []);

//   // Chart tab buttons
//   const chartTabs = [
//     { id: "donations", title: "Donations", icon: "water-drop" },
//     { id: "distribution", title: "Blood Types", icon: "pie-chart" },
//     { id: "growth", title: "User Growth", icon: "trending-up" },
//   ];

//   // Change chart tab
//   const handleChartTabChange = useCallback((tabId) => {
//     setActiveChartTab(tabId);
//   }, []);

//   // Loading state
//   if (isLoading) {
//     return (
//       <View
//         style={[
//           styles.loadingContainer,
//           isDarkMode && { backgroundColor: "#121212" },
//         ]}
//       >
//         <ActivityIndicator
//           size="large"
//           color={isDarkMode ? "#FF6B81" : "#870D25"}
//         />
//         <Text style={[styles.loadingText, isDarkMode && styles.darkText]}>
//           Loading dashboard data...
//         </Text>
//       </View>
//     );
//   }

//   // Render the appropriate chart based on active tab
//   const renderActiveChart = () => {
//     switch (activeChartTab) {
//       case "donations":
//         return (
//           <LineChart
//             data={monthlyDonations}
//             width={chartDimensions.width}
//             height={chartDimensions.height}
//             chartConfig={chartConfig}
//             bezier
//             style={styles.chart}
//             withInnerLines={true}
//             withShadow={true}
//             yAxisLabel=""
//             yAxisSuffix=""
//             formatYLabel={(value) => Math.round(value).toString()}
//           />
//         );
//       case "distribution":
//         return (
//           <PieChart
//             data={bloodTypes}
//             width={chartDimensions.width}
//             height={chartDimensions.height}
//             chartConfig={chartConfig}
//             accessor={"population"}
//             backgroundColor={"transparent"}
//             paddingLeft={"15"}
//             center={[10, 0]}
//             absolute
//             hasLegend={true}
//           />
//         );
//       case "growth":
//         return (
//           <BarChart
//             data={userGrowth}
//             width={chartDimensions.width}
//             height={chartDimensions.height}
//             chartConfig={{
//               ...chartConfig,
//               barPercentage: 0.7,
//               formatYLabel: (value) => Math.round(value).toString(),
//             }}
//             style={styles.chart}
//             showValuesOnTopOfBars
//             fromZero
//             yAxisLabel=""
//             yAxisSuffix=""
//           />
//         );
//       default:
//         return null;
//     }
//   };

//   return (
//     <Animatable.View animation="fadeIn" duration={800}>
//       {/* Stats Cards - Modified for better responsiveness */}
//       <View style={[styles.statsGrid, isSmallScreen && styles.statsGridSmall]}>
//         {statsData.map((item, index) => (
//           <Animatable.View
//             key={item.id}
//             animation="fadeInUp"
//             delay={300 + index * 100}
//             style={[
//               styles.statsCardWrapper,
//               isSmallScreen && styles.statsCardWrapperSmall,
//             ]}
//           >
//             <StatsCard
//               title={item.title}
//               value={item.value}
//               icon={item.icon}
//               color={item.color}
//               trend={item.trend}
//               isDarkMode={isDarkMode}
//             />
//           </Animatable.View>
//         ))}
//       </View>

//       {/* Integrated Dashboard */}
//       <Animatable.View
//         animation="fadeInUp"
//         delay={800}
//         style={[styles.dashboardCard, isDarkMode && styles.darkCard]}
//       >
//         <View style={styles.dashboardHeader}>
//           <Text style={[styles.dashboardTitle, isDarkMode && styles.darkText]}>
//             Analytics Dashboard
//           </Text>
//           <TouchableOpacity style={styles.optionsButton}>
//             <MaterialIcons
//               name="more-vert"
//               size={24}
//               color={isDarkMode ? "#E0E0E0" : "#333"}
//             />
//           </TouchableOpacity>
//         </View>

//         {/* Chart Tabs */}
//         <View
//           style={[
//             styles.chartTabContainer,
//             isDarkMode && styles.darkChartTabContainer,
//           ]}
//         >
//           {chartTabs.map((tab) => (
//             <TouchableOpacity
//               key={tab.id}
//               style={[
//                 styles.chartTab,
//                 activeChartTab === tab.id && styles.activeChartTab,
//                 isDarkMode &&
//                   activeChartTab === tab.id &&
//                   styles.darkActiveChartTab,
//               ]}
//               onPress={() => handleChartTabChange(tab.id)}
//             >
//               <MaterialIcons
//                 name={tab.icon}
//                 size={16}
//                 color={
//                   activeChartTab === tab.id
//                     ? isDarkMode
//                       ? "#FF6B81"
//                       : "#870D25"
//                     : isDarkMode
//                     ? "#AAA"
//                     : "#777"
//                 }
//                 style={styles.chartTabIcon}
//               />
//               <Text
//                 style={[
//                   styles.chartTabText,
//                   activeChartTab === tab.id && styles.activeChartTabText,
//                   isDarkMode && styles.darkChartTabText,
//                   isDarkMode &&
//                     activeChartTab === tab.id &&
//                     styles.darkActiveChartTabText,
//                 ]}
//               >
//                 {tab.title}
//               </Text>
//             </TouchableOpacity>
//           ))}
//         </View>

//         {/* Chart Area */}
//         <View style={styles.chartContainer}>{renderActiveChart()}</View>

//         {/* Legend/Status Row */}
//         <View style={styles.chartStatusRow}>
//           <View style={styles.dataPeriodContainer}>
//             <Text
//               style={[styles.dataPeriodLabel, isDarkMode && styles.darkSubText]}
//             >
//               {activeChartTab === "distribution"
//                 ? "Current Distribution"
//                 : "Last 6 Months"}
//             </Text>
//           </View>

//           <TouchableOpacity style={styles.downloadButton}>
//             <MaterialIcons
//               name="file-download"
//               size={16}
//               color={isDarkMode ? "#AAA" : "#666"}
//             />
//             <Text
//               style={[styles.downloadText, isDarkMode && styles.darkSubText]}
//             >
//               Export
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </Animatable.View>

//       {/* Recent Activity */}
//       <Animatable.View
//         animation="fadeInUp"
//         delay={1000}
//         style={[styles.recentActivityCard, isDarkMode && styles.darkCard]}
//       >
//         <View style={styles.recentActivityHeader}>
//           <Text
//             style={[styles.recentActivityTitle, isDarkMode && styles.darkText]}
//           >
//             Recent Activity
//           </Text>
//           <TouchableOpacity style={styles.viewAllButton}>
//             <Text
//               style={[
//                 styles.viewAllText,
//                 { color: isDarkMode ? "#FF6B81" : "#870D25" },
//               ]}
//             >
//               View All
//             </Text>
//           </TouchableOpacity>
//         </View>

//         {/* Activity items */}
//         {[1, 2, 3].map((item) => (
//           <View key={item} style={styles.activityItem}>
//             <View
//               style={[
//                 styles.activityIconContainer,
//                 {
//                   backgroundColor: isDarkMode
//                     ? "rgba(255,107,129,0.1)"
//                     : "rgba(135,13,37,0.1)",
//                 },
//               ]}
//             >
//               <MaterialIcons
//                 name={
//                   item === 1
//                     ? "person-add"
//                     : item === 2
//                     ? "water-drop"
//                     : "notifications"
//                 }
//                 size={18}
//                 color={isDarkMode ? "#FF6B81" : "#870D25"}
//               />
//             </View>
//             <View style={styles.activityContent}>
//               <Text
//                 style={[styles.activityText, isDarkMode && styles.darkText]}
//               >
//                 {item === 1
//                   ? "New donor registered"
//                   : item === 2
//                   ? "Donation completed"
//                   : "Blood request approved"}
//               </Text>
//               <Text
//                 style={[styles.activityTime, isDarkMode && styles.darkSubText]}
//               >
//                 {item === 1
//                   ? "10 mins ago"
//                   : item === 2
//                   ? "2 hours ago"
//                   : "5 hours ago"}
//               </Text>
//             </View>
//           </View>
//         ))}
//       </Animatable.View>
//     </Animatable.View>
//   );
// });

// export default function AdminScreen({ navigation }) {
//   const [activeTab, setActiveTab] = useState("overview");
//   const systemColorScheme = useColorScheme();
//   const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === "dark");

//   // Tab configuration
//   const tabs = [
//     { id: "overview", title: "Overview", icon: "dashboard" },
//     { id: "feedback", title: "Feedback", icon: "feedback" },
//     { id: "blacklist", title: "Blacklist", icon: "block" },
//   ];

//   // Using useCallback to optimize tab switching
//   const handleTabPress = useCallback((tabId) => {
//     setActiveTab(tabId);
//   }, []);

//   // Handle back button press
//   const handleBackPress = useCallback(() => {
//     navigation.goBack();
//   }, [navigation]);

//   // Handle theme toggle
//   const toggleTheme = useCallback(() => {
//     setIsDarkMode((prev) => !prev);
//   }, []);

//   return (
//     <SafeAreaView
//       style={[styles.container, isDarkMode && styles.darkContainer]}
//     >
//       <StatusBar
//         barStyle="light-content"
//         backgroundColor={isDarkMode ? "#5D0919" : "#870D25"}
//       />

//       {/* Header */}
//       <Animatable.View
//         animation="fadeIn"
//         duration={600}
//         style={[styles.header, isDarkMode && styles.darkHeader]}
//       >
//         <View style={styles.headerContent}>
//           <Text style={styles.headerText}>Admin Panel</Text>
//           <TouchableOpacity
//             style={styles.backButton}
//             accessibilityLabel="Go back"
//             accessibilityRole="button"
//             onPress={handleBackPress}
//           >
//             <MaterialIcons name="arrow-back" size={24} color="white" />
//           </TouchableOpacity>
//         </View>

//         {/* Tab Navigation */}
//         <View style={styles.tabContainer} accessibilityRole="tablist">
//           {tabs.map((tab) => (
//             <TabButton
//               key={tab.id}
//               title={tab.title}
//               icon={tab.icon}
//               isActive={activeTab === tab.id}
//               onPress={() => handleTabPress(tab.id)}
//             />
//           ))}
//         </View>
//       </Animatable.View>

//       {/* Content Area */}
//       <ScrollView
//         contentContainerStyle={[
//           styles.contentContainer,
//           isDarkMode && styles.darkContentContainer,
//         ]}
//         showsVerticalScrollIndicator={false}
//       >
//         {activeTab === "overview" && <DashboardView isDarkMode={isDarkMode} />}

//         {activeTab === "feedback" && (
//           <Animatable.View animation="fadeInUp" duration={600}>
//             <FeedbackList isDarkMode={isDarkMode} />
//           </Animatable.View>
//         )}

//         {activeTab === "blacklist" && (
//           <Animatable.View animation="fadeInUp" duration={600}>
//             <BlacklistManager isDarkMode={isDarkMode} />
//           </Animatable.View>
//         )}
//       </ScrollView>

//       {/* Theme Toggle Button (replaced FAB) */}
//       <Animatable.View
//         animation="bounceIn"
//         delay={1000}
//         style={styles.fabContainer}
//       >
//         <TouchableOpacity
//           style={[styles.fab, isDarkMode && styles.darkFab]}
//           activeOpacity={0.8}
//           accessibilityLabel={
//             isDarkMode ? "Switch to light mode" : "Switch to dark mode"
//           }
//           accessibilityRole="button"
//           onPress={toggleTheme}
//         >
//           <MaterialIcons
//             name={isDarkMode ? "light-mode" : "dark-mode"}
//             size={24}
//             color="white"
//           />
//         </TouchableOpacity>
//       </Animatable.View>
//     </SafeAreaView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#F8F9FA",
//   },
//   darkContainer: {
//     backgroundColor: "#121212",
//   },
//   header: {
//     backgroundColor: "#870D25",
//     padding: 20,
//     borderBottomLeftRadius: 25,
//     borderBottomRightRadius: 25,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 4 },
//     shadowOpacity: 0.25,
//     shadowRadius: 5,
//     elevation: 6,
//     paddingTop: Platform.OS === "android" ? StatusBar.currentHeight + 10 : 10,
//   },
//   darkHeader: {
//     backgroundColor: "#5D0919",
//   },
//   headerContent: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 15,
//   },
//   headerText: {
//     color: "white",
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   backButton: {
//     padding: 5,
//   },
//   tabContainer: {
//     flexDirection: "row",
//     justifyContent: "space-around",
//     backgroundColor: "rgba(0,0,0,0.15)",
//     borderRadius: 12,
//     padding: 4,
//     marginTop: 5,
//   },
//   tab: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 10,
//     paddingHorizontal: 16,
//     borderRadius: 10,
//     position: "relative",
//     flex: 1,
//     justifyContent: "center",
//   },
//   activeTab: {
//     backgroundColor: "rgba(0,0,0,0.2)",
//   },
//   tabIcon: {
//     marginRight: 6,
//   },
//   tabText: {
//     color: "rgba(255,255,255,0.9)",
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   activeTabText: {
//     color: "white",
//     fontWeight: "bold",
//   },
//   activeIndicator: {
//     position: "absolute",
//     bottom: 0,
//     left: "25%",
//     right: "25%",
//     height: 3,
//     backgroundColor: "white",
//     borderRadius: 1.5,
//   },
//   contentContainer: {
//     padding: 16,
//     paddingBottom: 80, // Extra padding for FAB
//   },
//   darkContentContainer: {
//     backgroundColor: "#121212",
//   },
//   fabContainer: {
//     position: "absolute",
//     right: 20,
//     bottom: 20,
//   },
//   fab: {
//     width: 56,
//     height: 56,
//     borderRadius: 28,
//     backgroundColor: "#870D25",
//     justifyContent: "center",
//     alignItems: "center",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.3,
//     shadowRadius: 5,
//     elevation: 6,
//   },
//   darkFab: {
//     backgroundColor: "#B71C1C",
//   },

//   // Stats Section Styles - MODIFIED FOR BETTER MOBILE LAYOUT
//   statsGrid: {
//     flexDirection: "row",
//     flexWrap: "wrap",
//     justifyContent: "space-between",
//     marginBottom: 16,
//     width: "100%",
//   },
//   statsGridSmall: {
//     flexDirection: "column",
//   },
//   statsCardWrapper: {
//     width: "48%",
//     marginBottom: 12,
//     height: 100, // Fixed height
//     maxHeight: 100, // Maximum height constraint
//   },
//   statsCardWrapperSmall: {
//     width: "100%", // Full width on small screens
//     height: 90,
//     maxHeight: 90,
//   },
//   statsCard: {
//     backgroundColor: "white",
//     borderRadius: 12,
//     padding: 14,
//     borderLeftWidth: 4,
//     height: "100%", // Fill parent height
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 3,
//     elevation: 2,
//   },
//   darkCard: {
//     backgroundColor: "#1E1E1E",
//     borderColor: "#333",
//   },
//   statsHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 10,
//   },
//   statsValue: {
//     fontSize: 20,
//     fontWeight: "bold",
//     color: "#333",
//     marginBottom: 4,
//   },
//   statsTitle: {
//     fontSize: 12,
//     color: "#666",
//   },
//   trendContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.03)",
//     paddingHorizontal: 6,
//     paddingVertical: 2,
//     borderRadius: 10,
//   },
//   trendText: {
//     fontSize: 11,
//     fontWeight: "600",
//     marginLeft: 2,
//   },
//   darkText: {
//     color: "#E0E0E0",
//   },
//   darkSubText: {
//     color: "#AAAAAA",
//   },

//   // Dashboard Card Styles
//   dashboardCard: {
//     backgroundColor: "white",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 3 },
//     shadowOpacity: 0.1,
//     shadowRadius: 5,
//     elevation: 3,
//   },
//   dashboardHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   dashboardTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   optionsButton: {
//     padding: 4,
//   },
//   chartTabContainer: {
//     flexDirection: "row",
//     backgroundColor: "#F5F5F7",
//     borderRadius: 10,
//     padding: 4,
//     marginBottom: 16,
//   },
//   darkChartTabContainer: {
//     backgroundColor: "#2A2A2A",
//   },
//   chartTab: {
//     flexDirection: "row",
//     alignItems: "center",
//     justifyContent: "center",
//     paddingVertical: 8,
//     paddingHorizontal: 12,
//     borderRadius: 8,
//     flex: 1,
//   },
//   activeChartTab: {
//     backgroundColor: "white",
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 1 },
//     shadowOpacity: 0.1,
//     shadowRadius: 2,
//     elevation: 1,
//   },
//   darkActiveChartTab: {
//     backgroundColor: "#383838",
//   },
//   chartTabIcon: {
//     marginRight: 5,
//   },
//   chartTabText: {
//     fontSize: 12,
//     color: "#777",
//     fontWeight: "500",
//   },
//   activeChartTabText: {
//     color: "#870D25",
//     fontWeight: "600",
//   },
//   darkChartTabText: {
//     color: "#AAA",
//   },
//   darkActiveChartTabText: {
//     color: "#FF6B81",
//   },
//   chartContainer: {
//     alignItems: "center",
//     marginVertical: 10,
//   },
//   chart: {
//     borderRadius: 8,
//     marginVertical: 8,
//   },
//   chartStatusRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     paddingTop: 12,
//     marginTop: 5,
//     borderTopWidth: 1,
//     borderTopColor: "#F0F0F0",
//   },
//   dataPeriodContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   dataPeriodLabel: {
//     fontSize: 12,
//     color: "#777",
//   },
//   downloadButton: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 6,
//     paddingHorizontal: 10,
//     borderRadius: 6,
//     backgroundColor: "#F5F5F7",
//   },
//   downloadText: {
//     fontSize: 12,
//     color: "#666",
//     marginLeft: 4,
//   },

//   // Recent Activity Styles
//   recentActivityCard: {
//     backgroundColor: "white",
//     borderRadius: 14,
//     padding: 16,
//     marginBottom: 16,
//     shadowColor: "#000",
//     shadowOffset: { width: 0, height: 2 },
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
//     elevation: 2,
//   },
//   recentActivityHeader: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 12,
//   },
//   recentActivityTitle: {
//     fontSize: 16,
//     fontWeight: "600",
//     color: "#333",
//   },
//   viewAllButton: {
//     paddingVertical: 4,
//     paddingHorizontal: 8,
//   },
//   viewAllText: {
//     fontSize: 12,
//     fontWeight: "500",
//   },
//   activityItem: {
//     flexDirection: "row",
//     alignItems: "center",
//     paddingVertical: 12,
//     borderBottomWidth: 1,
//     borderBottomColor: "#F0F0F0",
//   },
//   activityIconContainer: {
//     width: 36,
//     height: 36,
//     borderRadius: 18,
//     alignItems: "center",
//     justifyContent: "center",
//     marginRight: 12,
//   },
//   activityContent: {
//     flex: 1,
//   },
//   activityText: {
//     fontSize: 14,
//     color: "#333",
//     marginBottom: 4,
//   },
//   activityTime: {
//     fontSize: 12,
//     color: "#999",
//   },

//   // Loading styles
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 24,
//     backgroundColor: "#F8F9FA",
//   },
//   loadingText: {
//     marginTop: 12,
//     fontSize: 14,
//     color: "#666",
//   },
// });
