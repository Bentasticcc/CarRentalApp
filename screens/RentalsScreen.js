import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

export default function RentalsScreen({ navigation }) {
  const [rentals, setRentals] = useState([]);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [username, setUsername] = useState('');
  const isFocused = useIsFocused();

  // Load sign-in state
  useEffect(() => {
    const checkSignIn = async () => {
      const signed = await AsyncStorage.getItem('isSignedIn');
      const user = await AsyncStorage.getItem('signedInUser');
      setIsSignedIn(signed === 'true');
      setUsername(user || '');
    };
    checkSignIn();
  }, [isFocused]);

  // Load rentals from AsyncStorage
  useEffect(() => {
    const loadRentals = async () => {
      if (!username) {
        setRentals([]);
        return;
      }
      try {
        const stored = await AsyncStorage.getItem(`rentals_${username}`);
        if (stored) setRentals(JSON.parse(stored));
        else setRentals([]);
      } catch {
        setRentals([]);
      }
    };
    if (isFocused && username) loadRentals();
  }, [isFocused, username]);

  // Update rental status and save to AsyncStorage
  const updateStatus = async (index, newStatus) => {
    const updated = [...rentals];
    updated[index] = { ...updated[index], status: newStatus };
    setRentals(updated);
    await AsyncStorage.setItem(`rentals_${username}`, JSON.stringify(updated));
    let message = '';
    if (newStatus === 'Paid') {
      message = `Payment received! Your rental for the ${updated[index].name} is confirmed.`;
    } else if (newStatus === 'Returned') {
      message = `You have just returned your ${updated[index].name} rental. Thank you for choosing us!`;
    }
    if (message) await addNotification(message);
  };

  const addNotification = async (message) => {
    if (!username) return;
    let notifications = [];
    try {
      const stored = await AsyncStorage.getItem(`notifications_${username}`);
      if (stored) notifications = JSON.parse(stored);
    } catch {}
    notifications.push(message);
    await AsyncStorage.setItem(`notifications_${username}`, JSON.stringify(notifications));
  };

  if (!isSignedIn) {
    return (
      <View style={{ flex: 1, backgroundColor: '#f7fff7' }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{
            fontSize: 20,
            color: '#06a566',
            marginBottom: 24,
            fontWeight: 'bold',
            textAlign: 'center',
            paddingHorizontal: 24,
          }}>
            You need to create an account to access this page.
          </Text>
          <TouchableOpacity
            style={{
              backgroundColor: '#06a566',
              paddingVertical: 14,
              paddingHorizontal: 32,
              borderRadius: 8,
              alignItems: 'center',
              minWidth: 180,
            }}
            onPress={() => navigation.replace('SignUp')}
          >
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 18 }}>Go to Registration</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={{ position: 'absolute', top: 30, left: 10, zIndex: 2, backgroundColor: '#fff', borderRadius: 20, padding: 4, elevation: 4 }} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>
      {/* Spacer for top margin */}
      <View style={{ height: 40 }} />
      <Text style={styles.title}>My Rentals</Text>
      <View style={{ height: 10 }} />
      <FlatList
        data={rentals}
        keyExtractor={item => item.id}
        renderItem={({ item, index }) => (
          <View style={styles.card}>
            <Text style={styles.carName}>{item.name}</Text>
            <Text style={styles.dates}>
              {item.dateFrom} to {item.dateTo}
            </Text>
            <Text style={[
              styles.status,
              item.status === 'Processing Payment' && { color: '#e6b800' },
              item.status === 'Paid' && { color: '#06a566' },
              item.status === 'Returned' && { color: '#888' }
            ]}>
              {item.status}
            </Text>
            {item.status === 'Processing Payment' && (
              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: '#06a566' }]}
                onPress={() => updateStatus(index, 'Paid')}
              >
                <Text style={styles.statusBtnText}>Mark as Paid</Text>
              </TouchableOpacity>
            )}
            {item.status === 'Paid' && (
              <TouchableOpacity
                style={[styles.statusBtn, { backgroundColor: '#888' }]}
                onPress={() => updateStatus(index, 'Returned')}
              >
                <Text style={styles.statusBtnText}>Mark as Returned</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>You have no rentals yet.</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7', paddingHorizontal: 20 },
  title: { fontSize: 26, fontWeight: 'bold', alignSelf: 'center', color: '#222', letterSpacing: 1 },
  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  carName: { fontSize: 18, fontWeight: 'bold', color: '#222' },
  dates: { fontSize: 16, color: '#888', marginTop: 2 },
  status: { fontSize: 16, marginTop: 5, fontWeight: 'bold' },
  emptyText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 16,
    marginTop: 40,
  },
  dateButton: {
    backgroundColor: '#06a566',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  dateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  statusBtn: {
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  statusBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});