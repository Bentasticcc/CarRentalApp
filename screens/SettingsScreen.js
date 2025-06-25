import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SignIn from './SignIn';
import SignUp from './SignUp';

export default function SettingsScreen({ navigation }) {
  const [profileVisible, setProfileVisible] = useState(false);
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [username, setUsername] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);
  const [showSignUp, setShowSignUp] = useState(false);

  // Always check both sign-in state and username
  useEffect(() => {
    const checkSignIn = async () => {
      const signed = await AsyncStorage.getItem('isSignedIn');
      const user = await AsyncStorage.getItem('signedInUser');
      setIsSignedIn(signed === 'true');
      setUsername(user || '');
    };
    checkSignIn();
  }, [profileVisible, notificationsVisible, showSignIn, showSignUp]);

  useEffect(() => {
    const loadNotifications = async () => {
      if (!username) {
        setNotifications([]);
        return;
      }
      const stored = await AsyncStorage.getItem(`notifications_${username}`);
      setNotifications(stored ? JSON.parse(stored) : []);
    };
    if (notificationsVisible && username) loadNotifications();
  }, [notificationsVisible, username]);

  const handleLogout = async () => {
    await AsyncStorage.setItem('isSignedIn', 'false');
    await AsyncStorage.removeItem('signedInUser');
    setIsSignedIn(false);
    setUsername('');
    navigation.reset({
      index: 0,
      routes: [{ name: 'Home' }],
    });
  };

  const handlePress = (label) => {
    if (label === 'Profile') {
      if (!isSignedIn) {
        setShowSignIn(true); // Show SignIn modal if not signed in
      } else {
        setProfileVisible(true); // Show profile info if signed in
      }
    }
    else if (label === 'Notifications') setNotificationsVisible(true);
    else if (label === 'Logout') handleLogout();
    // Help & Support can be implemented as needed
  };

  // Dynamic settings array: Logout only if signed in
  const settings = [
    { id: '1', icon: 'person-outline', label: 'Profile' },
    { id: '2', icon: 'notifications-outline', label: 'Notifications' },
    { id: '3', icon: 'help-circle-outline', label: 'Help & Support' },
    // Only show Logout if signed in AND username exists
    ...((isSignedIn && username) ? [{ id: '4', icon: 'log-out-outline', label: 'Logout' }] : []),
  ];

  return (
    <View style={styles.container}>
      {/* Spacer for top margin */}
      <View style={{ height: 40 }} />
      <Text style={styles.title}>Settings</Text>
      <View style={{ height: 10 }} />
      {settings.map(item => (
        <TouchableOpacity
          key={item.id}
          style={styles.row}
          activeOpacity={0.7}
          onPress={() => handlePress(item.label)}
        >
          <View style={styles.iconCircle}>
            <Ionicons name={item.icon} size={22} color="#06a566" />
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}

      {/* Profile Modal */}
      <Modal visible={profileVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Profile</Text>
            <Text style={styles.profileLabel}>Username:</Text>
            <Text style={styles.profileValue}>{username}</Text>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setProfileVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Notifications Modal */}
      <Modal visible={notificationsVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Notifications</Text>
            {!isSignedIn ? (
              <Text style={{ color: '#888', marginVertical: 20 }}>Sign in to view notifications.</Text>
            ) : notifications.length === 0 ? (
              <Text style={{ color: '#888', marginVertical: 20 }}>No notifications yet.</Text>
            ) : (
              <FlatList
                data={[...notifications].reverse()}
                keyExtractor={(_, idx) => idx.toString()}
                renderItem={({ item }) => (
                  <View style={styles.notificationItem}>
                    <Text style={styles.notificationText}>{item}</Text>
                  </View>
                )}
                style={{ maxHeight: 200 }}
              />
            )}
            <TouchableOpacity style={styles.closeBtn} onPress={() => setNotificationsVisible(false)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Sign In Modal */}
      {showSignIn && (
        <SignIn
          visible={showSignIn}
          onClose={() => setShowSignIn(false)}
          onShowSignUp={() => {
            setShowSignIn(false);
            setShowSignUp(true);
          }}
          onLoginSuccess={(user) => {
            setUsername(user);
            setIsSignedIn(true);
            setShowSignIn(false);
          }}
        />
      )}
      {/* Sign Up Modal */}
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: 'bold', alignSelf: 'center', color: '#222', letterSpacing: 1 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 14,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
  },
  iconCircle: {
    backgroundColor: '#e6f7f1',
    borderRadius: 20,
    padding: 8,
    marginRight: 15,
  },
  label: { fontSize: 18, color: '#222', fontWeight: '500' },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: 320,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 18,
    color: '#222',
  },
  profileLabel: { fontSize: 16, color: '#222', marginBottom: 4 },
  profileValue: { fontSize: 18, color: '#06a566', fontWeight: 'bold', marginBottom: 18 },
  closeBtn: {
    marginTop: 18,
    backgroundColor: '#06a566',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 28,
  },
  closeBtnText: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  notificationItem: {
    backgroundColor: '#f6f6f6',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    width: 250,
  },
  notificationText: { color: '#222', fontSize: 15 },
});