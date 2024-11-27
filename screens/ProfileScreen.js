import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { auth } from '../../firebaseConfig';
import { signOut } from 'firebase/auth';

export default function ProfileScreen({ navigation }) {
  const user = auth.currentUser; // Get the current user

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out', 'You have successfully logged out.');
      navigation.replace('SignIn'); // Redirect to SignIn screen
    } catch (error) {
      Alert.alert('Error', 'Failed to log out.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      {user ? (
        <>
          <Text style={{ fontSize: 18, marginBottom: 10 }}>Profile</Text>
          <Text>Email: {user.email}</Text>
          <Text>User ID: {user.uid}</Text>
          <Button title="Log Out" onPress={handleLogout} />
        </>
      ) : (
        <Text>No user logged in.</Text>
      )}
    </View>
  );
}