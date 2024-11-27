import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { auth } from './firebaseConfig';

import SignUpScreen from './screens/Auth/SignUpScreen';
import SignInScreen from './screens/Auth/SignInScreen';
import EventListScreen from './screens/Events/EventListScreen';
import FavoritesScreen from './screens/Events/FavoritesScreen';
import AddEditEventScreen from './screens/Events/AddEditEventScreen';

const AuthStack = createStackNavigator();
const Tab = createBottomTabNavigator();
const EventStack = createStackNavigator(); // Create a Stack Navigator for Events

function AuthNavigator() {
  return (
    <AuthStack.Navigator>
      <AuthStack.Screen name="SignIn" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />
    </AuthStack.Navigator>
  );
}

// Event Stack Navigator for Events and Add/Edit Event
function EventStackNavigator() {
  return (
    <EventStack.Navigator>
      <EventStack.Screen name="EventListScreen" component={EventListScreen} />
      <EventStack.Screen name="AddEditEvent" component={AddEditEventScreen} />
    </EventStack.Navigator>
  );
}

function AppNavigator() {
  return (
      <Tab.Navigator >
        <Tab.Screen name="Events" component={EventStackNavigator} />
        <Tab.Screen name="Favorites" component={FavoritesScreen} />
      </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return unsubscribe; // Cleanup subscription
  }, []);

  return (
    <NavigationContainer>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}