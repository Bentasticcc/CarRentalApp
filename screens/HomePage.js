import React, { useRef, useEffect, useState } from 'react';
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
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignUp from './SignUp';
import SignIn from './SignIn';
import carIcon from '../images/car_icon.gif';

const { width } = Dimensions.get('window');

const COLORS = {
  gradientStart: '#f7fff7',
  gradientEnd: '#e0ffe7',
  primary: '#222',
  accent: '#06a566',
  cardBg: '#fff',
  iconBg: '#e6f7f1',
};

export default function HomePage({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [showSignUp, setShowSignUp] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signedInUser, setSignedInUser] = useState('');

  useEffect(() => {
    const checkSignIn = async () => {
      const signed = await AsyncStorage.getItem('isSignedIn');
      const user = await AsyncStorage.getItem('signedInUser');
      setIsSignedIn(signed === 'true');
      setSignedInUser(user || '');
    };
    const unsubscribe = navigation.addListener('focus', checkSignIn);
    checkSignIn();
    return unsubscribe;
  }, [navigation, showSignIn, showSignUp]);

  const handleSignInOrRegister = () => {
    setShowSignIn(true);
  };

  return (
    <LinearGradient
      colors={[COLORS.gradientStart, COLORS.gradientEnd]}
      style={styles.bg}
    >
      <StatusBar
        barStyle={Platform.OS === 'ios' ? 'dark-content' : 'default'}
        backgroundColor={COLORS.gradientStart}
      />
      <View style={styles.outerContainer}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <LinearGradient
              colors={[COLORS.primary, COLORS.accent]}
              style={styles.headerWave}
            />
            <View style={styles.iconCircle}>
              <Image source={carIcon} style={styles.carIcon} />
            </View>
            <Text style={styles.brand}>Car Rental App</Text>
            <Text style={styles.subtitle}>
              Drive your journey with comfort and style.
            </Text>
          </View>

          <LinearGradient
            colors={['#f0fff4', '#e6f7f1']}
            style={styles.centerContent}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            {isSignedIn ? (
              <Text style={styles.welcomeText}>
                Welcome,{' '}
                <Text style={{ color: COLORS.accent }}>{signedInUser}</Text>!
              </Text>
            ) : (
              <View style={styles.ctaContainer}>
                <Ionicons
                  name="car-sport-outline"
                  size={38}
                  color={COLORS.accent}
                  style={{ marginBottom: 10 }}
                />
                <Text style={styles.rentTitle}>Ready for your next ride?</Text>
                <Text style={styles.rentSubtitle}>
                  Find the perfect car for your journey. Sign in or register to get
                  started!
                </Text>
                <TouchableOpacity
                  style={styles.signInOrRegisterButton}
                  onPress={handleSignInOrRegister}
                  activeOpacity={0.85}
                >
                  <Text style={styles.signInOrRegisterText}>
                    SIGN IN OR REGISTER
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </LinearGradient>
        </ScrollView>
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            © {new Date().getFullYear()} Car Rental App
          </Text>
        </View>
      </View>
      {/* SignIn Modal */}
      {showSignIn && (
        <SignIn
          visible={showSignIn}
          onClose={() => setShowSignIn(false)}
          onShowSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
          onLoginSuccess={(username) => {
            setSignedInUser(username);
            setIsSignedIn(true);
            setShowSignIn(false);
          }}
        />
      )}
      {/* SignUp Modal */}
      {showSignUp && (
        <SignUp
          visible={showSignUp}
          onClose={() => setShowSignUp(false)}
          onShowSignIn={() => {
            setShowSignUp(false);
            setShowSignIn(true);
          }}
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  outerContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: 40,
    paddingTop: 40,
  },
  header: {
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    position: 'relative',
  },
  headerWave: {
    position: 'absolute',
    top: 0,
    width: '130%',
    height: 160,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.1,
    zIndex: 1,
  },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: COLORS.iconBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    marginBottom: 12,
    zIndex: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
  },
  carIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  brand: {
    fontSize: 28,
    fontWeight: '700',
    color: COLORS.primary,
    marginTop: 8,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    zIndex: 2,
  },
  subtitle: {
    fontSize: 15,
    color: '#444',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
    zIndex: 2,
  },
  centerContent: {
    width: '92%',
    borderRadius: 18,
    paddingVertical: 36,
    paddingHorizontal: 18,
    alignItems: 'center',
    marginTop: 30,
    minHeight: 120,
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#d6f5e6',
    shadowColor: '#06a566',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 3,
    backgroundColor: 'transparent', // let the gradient show
  },
  welcomeText: {
    fontSize: 22,
    fontWeight: '600',
    color: COLORS.primary,
    textAlign: 'center',
    letterSpacing: 0.5,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  ctaContainer: {
    alignItems: 'center',
    width: '100%',
    paddingVertical: 18,
    paddingHorizontal: 10,
  },
  rentTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: COLORS.primary,
    marginBottom: 6,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  rentSubtitle: {
    fontSize: 15,
    color: '#4a4a4a',
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
    lineHeight: 22,
  },
  signInOrRegisterButton: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 36,
    alignItems: 'center',
    marginTop: 4,
    shadowColor: '#06a566',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  signInOrRegisterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingVertical: 18,
    backgroundColor: 'transparent',
    position: 'absolute',
    bottom: 0,
    left: 0,
  },
  footerText: {
    fontSize: 13,
    color: '#999',
    letterSpacing: 1,
    fontFamily: Platform.OS === 'ios' ? 'Helvetica Neue' : 'Roboto',
  },
});
