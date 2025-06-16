import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Modal, Platform } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CarDetailsScreen({ route, navigation }) {
  const { car } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [returnDate, setReturnDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleConfirm = () => {
    setModalVisible(false);
    navigation.navigate('Rentals', {
      rentedCar: {
        ...car,
        dateFrom: new Date().toLocaleDateString(),
        dateTo: returnDate.toLocaleDateString(),
        status: 'Active',
      },
    });
  };

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || returnDate;
    setShowPicker(Platform.OS === 'ios');
    setReturnDate(currentDate);
  };

  return (
    <View style={styles.container}>
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
            <Text style={styles.modalLabel}>Select return date:</Text>
            <TouchableOpacity
              style={styles.dateButton}
              onPress={() => setShowPicker(true)}
            >
              <Text style={styles.dateButtonText}>{returnDate.toLocaleDateString()}</Text>
            </TouchableOpacity>
            {showPicker && (
              <DateTimePicker
                value={returnDate}
                mode="date"
                display="default"
                minimumDate={new Date()}
                onChange={onChange}
              />
            )}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#ccc' }]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: '#333' }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalBtn, { backgroundColor: '#06a566' }]}
                onPress={handleConfirm}
              >
                <Text style={{ color: '#fff' }}>Confirm</Text>
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
  image: { width: '100%', height: 200, borderRadius: 8 },
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
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalLabel: { fontSize: 16, marginBottom: 10 },
  dateButton: {
    backgroundColor: '#f2f2f2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    minWidth: 120,
    alignItems: 'center',
  },
  dateButtonText: { fontSize: 16, color: '#06a566', fontWeight: 'bold' },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalBtn: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
});
