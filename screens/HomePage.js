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
  primary: '#262626',
  accent: '#43e97b',
  cardBg: '#ffffff',
  iconBg: '#e6f7f1',
  menuBg: '#f6fef9',
};

export default function HomePage({ navigation }) {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const [showSignUp, setShowSignUp] = React.useState(false);
  const [showSignIn, setShowSignIn] = React.useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [signedInUser, setSignedInUser] = useState('');

  // Always check sign-in state and username on focus and when modals close
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
        barStyle="dark-content"
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
            <Image source={carIcon} style={styles.carIcon} />
            <Text style={styles.brand}>Car Rental App</Text>
            <Text style={styles.subtitle}>
              Drive your journey with comfort and style.
            </Text>
          </View>

          <View style={styles.centerContent}>
            {isSignedIn ? (
              <Text style={styles.rentText}>
                Welcome,{' '}
                <Text style={{ color: COLORS.accent }}>{signedInUser}</Text>!
              </Text>
            ) : (
              <>
                <Text style={styles.rentText}>Want to rent a car?</Text>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
                  <TouchableOpacity
                    style={styles.signInOrRegisterButton}
                    onPress={handleSignInOrRegister}
                    activeOpacity={0.85}
                  >
                    <Text style={styles.signInOrRegisterText}>
                      SIGN IN OR REGISTER
                    </Text>
                  </TouchableOpacity>
                </Animated.View>
              </>
            )}
          </View>
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
    height: 180,
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    transform: [{ scaleX: 1.5 }],
    opacity: 0.95,
  },
  carIcon: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginTop: 100,
    marginBottom: 12,
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
  },
  subtitle: {
    fontSize: 15,
    color: '#333',
    textAlign: 'center',
    paddingHorizontal: 20,
    marginTop: 4,
    zIndex: 2,
  },
  centerContent: {
    width: '90%',
    backgroundColor: COLORS.cardBg,
    borderRadius: 18,
    paddingVertical: 36,
    paddingHorizontal: 18,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 2,
    marginTop: 30,
  },
  rentText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: COLORS.primary,
    marginBottom: 30,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  signInOrRegisterButton: {
    backgroundColor: '#06a566',
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 32,
    alignItems: 'center',
    marginTop: 10,
  },
  signInOrRegisterText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
    letterSpacing: 1,
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
  },
});
