import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import EventListScreen from '../screens/Events/EventListScreen';
import AddEditEventScreen from '../screens/Events/AddEditEventScreen';
import FavoritesScreen from '../screens/Events/FavoritesScreen';

const Tab = createBottomTabNavigator();
const EventStack = createStackNavigator();

const EventStackNavigator = () => (
  <EventStack.Navigator>
    <EventStack.Screen name="EventListScreen" component={EventListScreen} />
    <EventStack.Screen name="AddEditEvent" component={AddEditEventScreen} />
  </EventStack.Navigator>
);

export const MainNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Events" component={EventStackNavigator} />
    <Tab.Screen name="Favorites" component={FavoritesScreen} />
  </Tab.Navigator>
);