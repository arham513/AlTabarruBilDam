import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function EligibilityQ2({ navigation }) {
  const [selectedOption, setSelectedOption] = useState(null);

  return (
    <View style={styles.container}>
      {/* Top Donut with arrows */}
      <View style={styles.donutSolid}>
        <TouchableOpacity onPress={() => navigation.navigate('EligibilityQ1')}>
          <Text style={styles.navButton}>{'<'}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('EligibilityQ3')}>
          <Text style={styles.navButton}>{'>'}</Text>
        </TouchableOpacity>
      </View>

      {/* Question Card */}
      <View style={styles.card}>
        <Text style={styles.question}>
          Have you undergone{"\n"}immunization in the past{"\n"}one month?
        </Text>

        {["Yes", "No"].map((label) => (
          <TouchableOpacity
            key={label}
            onPress={() => setSelectedOption(label)}
            style={[
              styles.optionButton,
              selectedOption === label && styles.optionButtonSelected
            ]}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === label && styles.optionTextSelected
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        ))}

        <TouchableOpacity
          style={styles.skipContainer}
          onPress={() => navigation.navigate('EligibilityQ3')}
        >
          <Text style={styles.skipText}>Skip <Text style={styles.arrow}>→</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#FFF5F5',
      alignItems: 'center',
    },
    donutSolid: {
      width: '100%',
      height: 160,
      backgroundColor: '#870D25',
      borderBottomLeftRadius: 999,
      borderBottomRightRadius: 999,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      paddingTop: 24,
      paddingHorizontal: 16,
      elevation: 8,
      shadowColor: '#8B0000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.5,
      shadowRadius: 10,
    },
    navButton: {
      fontSize: 24,
      color: 'white',
      fontWeight: 'bold',
    },
    card: {
      marginTop: 30,
      backgroundColor: 'white',
      borderRadius: 25,
      padding: 24,
      width: '88%',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 6,
      elevation: 4,
    },
    question: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#111',
      marginBottom: 24,
      textAlign: 'center',
    },
    optionButton: {
      borderWidth: 1.5,
      borderColor: '#D2042D',
      borderRadius: 30,
      paddingVertical: 12,
      alignItems: 'center',
      marginBottom: 15,
      width: '100%',
      backgroundColor: 'rgba(210, 4, 45, 0.04)',
    },
    optionButtonSelected: {
      backgroundColor: '#rgba(144, 33, 55, 0.86)',
      borderColor: '#870D25',
    },
    optionText: {
      color: '#D2042D',
      fontWeight: '600',
      fontSize: 16,
    },
    optionTextSelected: {
      color: 'white',
    },
    skipContainer: {
      alignSelf: 'flex-end',
      marginTop: 5,
    },
    skipText: {
      color: '#870D25',
      fontWeight: '500',
      fontSize: 14,
    },
    arrow: {
      marginLeft: 4,
    },
  });
  