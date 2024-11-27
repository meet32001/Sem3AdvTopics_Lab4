import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Alert, StyleSheet, Button } from "react-native";
import { db, auth } from "../../firebaseConfig";
import { collection, onSnapshot } from "firebase/firestore";
import { signOut } from "firebase/auth";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Add Logout button to header
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Logout"
          onPress={async () => {
            try {
              await signOut(auth);
              Alert.alert("Logged out", "You have successfully logged out.");
              navigation.replace("SignIn");
            } catch (error) {
              Alert.alert("Error", "Failed to log out.");
            }
          }}
        />
      ),
      headerTitle: "Favorites", // Set header title for Favorites
    });
  }, [navigation]);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "favorites"),
      (querySnapshot) => {
        const fetchedFavorites = querySnapshot.docs
          .map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }))
          .filter((event) => event.isFavorite); // Filter only favorite events
        setFavorites(fetchedFavorites);
        setLoading(false);
      },
      (error) => {
        Alert.alert("Error", "Failed to fetch favorite events.");
        setLoading(false);
      }
    );

    return unsubscribe; // Cleanup the listener on unmount
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading favorite events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favorites}
        ListEmptyComponent={<Text>No favorite events found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text>{item.eventDate}</Text>
            <Text>{item.eventDescription}</Text>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  eventCard: {
    marginBottom: 10,
    padding: 16,
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  eventName: {
    fontSize: 18,
    fontWeight: "bold",
  },
});