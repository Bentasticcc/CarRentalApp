import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Platform, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CarDetailsScreen({ route, navigation }) {
  const { car } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [showPicker, setShowPicker] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date());

  // Parse price from car.price (e.g., "₱2,500/day")
  const dailyPrice = parseInt(car.price.replace(/[^\d]/g, ''), 10);

  // Calculate days and total price
  const getDays = () => {
    const today = new Date();
    const end = new Date(returnDate);
    today.setHours(0,0,0,0);
    end.setHours(0,0,0,0);
    const diff = Math.max(1, Math.ceil((end - today) / (1000 * 60 * 60 * 24)));
    return diff;
  };

  const getTotal = () => {
    return getDays() * dailyPrice;
  };

  const handleConfirm = async () => {
    const username = await AsyncStorage.getItem('signedInUser');
    if (!username) {
      Alert.alert('Not signed in', 'Please sign in to rent a car.');
      return;
    }

    const newRental = {
      ...car,
      dateFrom: new Date().toLocaleDateString(),
      dateTo: returnDate.toLocaleDateString(),
      status: 'Processing Payment',
      id: car.id + '-' + Date.now(), // unique id
    };

    // Load existing rentals for this user
    let rentals = [];
    try {
      const stored = await AsyncStorage.getItem(`rentals_${username}`);
      if (stored) rentals = JSON.parse(stored);
    } catch {}

    // Add new rental and save
    rentals.push(newRental);
    await AsyncStorage.setItem(`rentals_${username}`, JSON.stringify(rentals));

    // Add notification for this user
    let notifications = [];
    try {
      const stored = await AsyncStorage.getItem(`notifications_${username}`);
      if (stored) notifications = JSON.parse(stored);
    } catch {}
    notifications.push(`Your rental for the ${car.name} is now being processed for payment.`);
    await AsyncStorage.setItem(`notifications_${username}`, JSON.stringify(notifications));

    Alert.alert('Rental Confirmed', `You will pay ₱${getTotal().toLocaleString()} for ${getDays()} day(s).`);
    setModalVisible(false);
    navigation.navigate('MainTabs', { screen: 'Rentals' });
  };

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={28} color="#222" />
      </TouchableOpacity>

      <Image source={car.image} style={styles.image} />
      <Text style={styles.name}>{car.name}</Text>
      <Text style={styles.price}>{car.price}</Text>
      <Text style={styles.info}>
        Rental includes basic insurance, 100km/day free mileage, and roadside assistance.
      </Text>

      <TouchableOpacity style={styles.button} onPress={() => setModalVisible(true)}>
        <Text style={styles.buttonText}>Confirm Rental</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Confirm Rental</Text>
            <Text style={styles.label}>Return Date:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
              activeOpacity={0.7}
            >
              <Text style={styles.dateButtonText}>{returnDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            <Text style={styles.hint}>Tap the date to change return date.</Text>
            {showPicker && (
              <DateTimePicker
                value={returnDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={(event, selectedDate) => {
                  setShowPicker(false);
                  if (selectedDate) setReturnDate(selectedDate);
                }}
              />
            )}
            <Text style={styles.label}>
              Total: <Text style={{ color: '#06a566', fontWeight: 'bold' }}>₱{getTotal().toLocaleString()}</Text>
            </Text>
            <View style={{ flexDirection: 'row', marginTop: 20 }}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#e60000', marginRight: 10 }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.modalBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#06a566' }]}
                onPress={handleConfirm}
              >
                <Text style={styles.modalBtnText}>Confirm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  backBtn: {
    position: 'absolute',
    top: 30,
    left: 10,
    zIndex: 2,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 4,
    elevation: 4,
  },
  image: { width: '100%', height: 200, borderRadius: 8, marginTop: 30 },
  name: { fontSize: 24, fontWeight: 'bold', marginTop: 10 },
  price: { fontSize: 20, color: 'gray', marginBottom: 10 },
  info: { fontSize: 16, marginVertical: 20 },
  button: { backgroundColor: '#06a566', padding: 15, borderRadius: 8 },
  buttonText: { color: 'white', textAlign: 'center', fontSize: 16 },

  modalOverlay: {
    flex: 1,
    backgroundColor: '#0008',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 24,
    width: '85%',
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 18, color: '#222' },
  label: {
    fontSize: 16,
    color: '#222',
    marginTop: 10,
    marginBottom: 6,
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginBottom: 4,
  },
  dateButtonText: {
    fontSize: 16,
    color: '#222',
  },
  hint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 10,
  },
  modalBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginHorizontal: 2,
  },
  modalBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
