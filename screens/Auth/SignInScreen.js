import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { auth } from '../firebaseConfig';
import { signInWithEmailAndPassword } from 'firebase/auth';

export default function SignInScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert('Welcome back!');
    } catch (error) {
      Alert.alert('Error:', error.message);
    }
  };

  return (
    <View>
      <Text>Sign In</Text>
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <Button title="Sign In" onPress={handleSignIn} />
    </View>
  );
}