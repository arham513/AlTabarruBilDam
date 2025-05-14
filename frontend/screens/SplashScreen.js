import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, StatusBar, Image, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export default function SplashScreen({ navigation }) {
  // Animation values
  const logoScale = useRef(new Animated.Value(0.2)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const titleOpacity = useRef(new Animated.Value(0)).current;
  const titleSlide = useRef(new Animated.Value(50)).current;
  const subtitleOpacity = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const backgroundFade = useRef(new Animated.Value(0)).current;
  
  // For shimmer effect on background
  const shimmerAnim = useRef(new Animated.Value(-width)).current;

  useEffect(() => {
    // Immersive experience
    StatusBar.setHidden(true);
    
    // Start shimmer animation
    Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: width,
        duration: 6000,
        useNativeDriver: true,
      })
    ).start();
    
    // Sequence of animations
    Animated.sequence([
      // Fade in background
      Animated.timing(backgroundFade, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      
      // Logo animation - scale and fade in
      Animated.parallel([
        Animated.spring(logoScale, {
          toValue: 1,
          friction: 7,
          tension: 40,
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Title animation
      Animated.parallel([
        Animated.timing(titleOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(titleSlide, {
          toValue: 0,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
      
      // Subtitle fade in
      Animated.timing(subtitleOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
    
    // Start pulsing effect for logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();

    // Navigate to Login after splash screen
    const timer = setTimeout(() => {
      StatusBar.setHidden(false);
      navigation.replace('Login');
    }, 4200);

    return () => {
      clearTimeout(timer);
      StatusBar.setHidden(false);
    };
  }, [navigation]);

  // Logo scale combines normal scale with pulse effect
  const logoScaleTransform = Animated.multiply(logoScale, pulseAnim);

  return (
    <Animated.View style={[styles.container, { opacity: backgroundFade }]}>
      {/* Layered background instead of gradient */}
      <View style={styles.backgroundTop} />
      <View style={styles.backgroundMiddle} />
      <View style={styles.backgroundBottom} />
      
      {/* Subtle shimmer effect */}
      <Animated.View 
        style={[
          styles.shimmer,
          {
            transform: [{ translateX: shimmerAnim }],
          }
        ]} 
      />
      
      <View style={styles.contentContainer}>
        <Animated.View
          style={[
            styles.logoContainer,
            {
              opacity: logoOpacity,
              transform: [{ scale: logoScaleTransform }],
            },
          ]}>
          <Image
            source={require('../assets/blood-drop.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.View
          style={[
            styles.titleContainer,
            {
              opacity: titleOpacity,
              transform: [{ translateY: titleSlide }],
            },
          ]}>
          <Text style={styles.titleFirstWord}>CRIMSON</Text>
          <Text style={styles.titleSecondWord}>CHAIN</Text>
        </Animated.View>
        
        <Animated.Text
          style={[
            styles.subtitle,
            {
              opacity: subtitleOpacity,
            },
          ]}>
          Empowering Blood Donors Worldwide
        </Animated.Text>
        
        <Animated.View 
          style={[
            styles.taglineContainer,
            {
              opacity: subtitleOpacity,
            },
          ]}>
          <Text style={styles.tagline}>Connect • Donate • Save Lives</Text>
        </Animated.View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#6D0B1E', // Base color
  },
  backgroundTop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '40%',
    backgroundColor: '#8B0000',
    opacity: 0.5,
  },
  backgroundMiddle: {
    position: 'absolute',
    top: '40%',
    left: 0,
    right: 0,
    height: '30%',
    backgroundColor: '#6D0B1E',
  },
  backgroundBottom: {
    position: 'absolute',
    top: '70%',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#4A0010',
  },
  shimmer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    transform: [{ skewX: '-20deg' }],
  },
  contentContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  logoContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
  },
  logo: {
    width: 70,
    height: 70,
  },
  titleContainer: {
    alignItems: 'center',
  },
  titleFirstWord: {
    color: '#FFFFFF',
    fontSize: 36,
    fontWeight: '800',
    letterSpacing: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 3,
    textAlign: 'center',
  },
  titleSecondWord: {
    color: '#FFFFFF',
    fontSize: 40,
    fontWeight: '300',  // Lighter weight creates nice contrast
    letterSpacing: 12,
    marginTop: -5,
    textShadowColor: 'rgba(255, 255, 255, 0.3)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: '#FFD0D0',
    fontSize: 19,
    marginTop: 20,
    letterSpacing: 1.2,
    fontWeight: '500',
    textAlign: 'center',
  },
  taglineContainer: {
    marginTop: 30,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  tagline: {
    color: '#FFFFFF',
    opacity: 0.8,
    fontSize: 14,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
});