import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const settings = [
  { id: '1', icon: 'person-outline', label: 'Profile' },
  { id: '2', icon: 'notifications-outline', label: 'Notifications' },
  { id: '3', icon: 'help-circle-outline', label: 'Help & Support' },
  { id: '4', icon: 'log-out-outline', label: 'Logout' },
];

export default function SettingsScreen({ navigation }) {
  return (
    <View style={styles.container}>
      {/* Spacer for top margin */}
      <View style={{ height: 40 }} />
      <Text style={styles.title}>Settings</Text>
      <View style={{ height: 10 }} />
      {settings.map(item => (
        <TouchableOpacity key={item.id} style={styles.row} activeOpacity={0.7}>
          <View style={styles.iconCircle}>
            <Ionicons name={item.icon} size={22} color="#06a566" />
          </View>
          <Text style={styles.label}>{item.label}</Text>
        </TouchableOpacity>
      ))}
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
});