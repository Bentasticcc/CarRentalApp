import React, { useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Animated,
  Dimensions,
  StatusBar,
  ScrollView,
  Image,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import carIcon from '../images/car_icon.gif'; // Use a PNG or JPG, not a GIF

const { width } = Dimensions.get('window');

// Uniform green palette
const COLORS = {
  gradientStart: '#06a566',
  gradientEnd: '#43e97b',
  primary: '#262626',
  accent: '#43e97b',
  cardBg: '#ffffff',
  iconBg: '#e6f7f1',
  menuBg: '#f6fef9',
};

export default function HomePage({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePress = (screen) => {
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.06, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, useNativeDriver: true }),
    ]).start(() => {
      navigation.navigate(screen);
    });
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.bg}
    >
      <StatusBar
        barStyle="light-content"
        backgroundColor={COLORS.gradientStart}
      />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerWaveContainer}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              style={styles.headerWave}
            />
            <Image source={carIcon} style={styles.carIcon} />
          </View>
          <Text style={styles.brand}>BenGo Rentals</Text>
          <Text style={styles.subtitle}>
            Drive your journey with comfort and style.
          </Text>
        </View>

        {/* NAVIGATION CARDS */}
        <View style={styles.card}>
          {[
            {
              icon: 'car-outline',
              label: 'Browse Cars',
              screen: 'Cars',
            },
            {
              icon: 'clipboard-outline',
              label: 'My Rentals',
              screen: 'Rentals',
            },
            {
              icon: 'settings-outline',
              label: 'Settings',
              screen: 'Settings',
            }
          ].map((item, idx) => (
            <Animated.View key={item.label} style={{ transform: [{ scale: scaleAnim }] }}>
              <TouchableOpacity
                style={styles.menuButton}
                onPress={() => handlePress(item.screen)}
                activeOpacity={0.85}
              >
                <View style={styles.menuIconContainer}>
                  <Ionicons name={item.icon} size={22} color={COLORS.primary} />
                </View>
                <Text style={styles.menuText}>{item.label}</Text>
                <Ionicons name="chevron-forward" size={20} color={COLORS.accent} />
              </TouchableOpacity>
            </Animated.View>
          ))}
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>© {new Date().getFullYear()} BenGo Rentals</Text>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  headerWaveContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
    height: 160,
    marginBottom: 8,
  },
  headerWave: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '130%',
    height: 140,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.95,
  },
  carIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    marginTop: 60,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#fff',
    zIndex: 2,
  },
  brand: {
    fontSize: 30,
    fontWeight: '800',
    color: COLORS.primary,
    zIndex: 2,
    marginTop: 8,
  },
  subtitle: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    zIndex: 2,
  },
  card: {
    backgroundColor: COLORS.cardBg,
    borderRadius: 20,
    width: width * 0.92,
    paddingVertical: 20,
    paddingHorizontal: 18,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    marginBottom: 30,
  },
  menuButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.menuBg,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginVertical: 10,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  menuIconContainer: {
    backgroundColor: COLORS.iconBg,
    borderRadius: 16,
    padding: 6,
    marginRight: 14,
  },
  menuText: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '600',
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: 10,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
  },
});
