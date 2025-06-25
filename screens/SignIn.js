import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform, Modal } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignIn({ visible = true, onClose, onShowSignUp }) {
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');
  const [showPass, setShowPass] = useState(false);

  const handleSignIn = async () => {
    if (!user || !pass) {
      Alert.alert('Error', 'Please enter username and password.');
      return;
    }
    if (pass.length < 8) {
      Alert.alert('Error', 'Password must be at least 8 characters.');
      return;
    }
    try {
      const savedUser = await AsyncStorage.getItem('user');
      const savedPass = await AsyncStorage.getItem('pass');
      if (user === savedUser && pass === savedPass) {
        await AsyncStorage.setItem('isSignedIn', 'true');
        await AsyncStorage.setItem('signedInUser', user);
        if (onClose) onClose();
      } else {
        Alert.alert('Error', 'Invalid username or password.');
      }
    } catch (e) {
      Alert.alert('Error', 'Failed to sign in.');
    }
  };

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <KeyboardAvoidingView style={styles.bg} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.popup}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={26} color="#333" />
          </TouchableOpacity>
          <Text style={styles.title}>Sign In</Text>
          <TextInput
            style={styles.input}
            placeholder="Username"
            value={user}
            onChangeText={setUser}
            autoCapitalize="none"
          />
          <View style={styles.passRow}>
            <TextInput
              style={[styles.input, { flex: 1, marginBottom: 0 }]}
              placeholder="Password"
              value={pass}
              onChangeText={setPass}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={styles.eyeBtn}>
              <Ionicons name={showPass ? 'eye-off' : 'eye'} size={22} color="#888" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.signInBtn} onPress={handleSignIn}>
            <MaterialCommunityIcons name="login" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.registerBtn}
            onPress={onShowSignUp}
          >
            <MaterialCommunityIcons name="account-plus" size={22} color="#fff" style={{ marginRight: 8 }} />
            <Text style={styles.registerText}>Register</Text>
          </TouchableOpacity>
          <View style={styles.rowLinks}>
            <TouchableOpacity style={{ flex: 1, alignItems: 'center' }}>
              <Text style={styles.linkText}>FORGOT PASSWORD</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    width: 340,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.18,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 24,
    alignItems: 'stretch',
    position: 'relative',
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
    zIndex: 2,
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#262626',
    marginBottom: 18,
    alignSelf: 'flex-start',
  },
  input: {
    backgroundColor: '#f6f6f6',
    borderRadius: 6,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 0,
    color: '#222',
  },
  passRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyeBtn: {
    position: 'absolute',
    right: 12,
    top: 10,
    padding: 4,
  },
  signInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e60000',
    borderRadius: 6,
    paddingVertical: 13,
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 4,
  },
  signInText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  registerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    borderRadius: 6,
    paddingVertical: 13,
    justifyContent: 'center',
    marginBottom: 10,
  },
  registerText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 17,
    letterSpacing: 0.5,
  },
  rowLinks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    marginBottom: 2,
  },
  linkText: {
    color: '#888',
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.5,
  },
});