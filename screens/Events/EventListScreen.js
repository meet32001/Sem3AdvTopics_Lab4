import React, { useState, useEffect } from "react";
import { View,Text,FlatList,Button,Alert,Switch,StyleSheet } from "react-native";
import { db, auth } from "../../firebaseConfig";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { useFocusEffect } from "@react-navigation/native";

export default function EventListScreen({ navigation }) {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "favorites"));
      const fetchedEvents = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      setEvents(fetchedEvents);
    } catch (error) {
      Alert.alert("Error", "Failed to fetch events.");
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      setLoading(true);
      fetchEvents();
    }, [])
  );

  const toggleFavoriteStatus = async (id, currentStatus) => {
    try {
      const eventRef = doc(db, "favorites", id);
      await updateDoc(eventRef, { isFavorite: !currentStatus });
      setEvents((prevEvents) =>
        prevEvents.map((event) =>
          event.id === id ? { ...event, isFavorite: !currentStatus } : event
        )
      );
      Alert.alert(
        "Success",
        currentStatus ? "Removed from favorites." : "Added to favorites."
      );
    } catch (error) {
      Alert.alert("Error", "Failed to update favorite status.");
    }
  };

  // Add Logout button in header
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          title="Logout"
          onPress={async () => {
            try {
              await signOut(auth);
              Alert.alert("Logged out", "You have successfully logged out.");
              // navigation.replace("SignIn");
            } catch (error) {
              Alert.alert("Error", "Failed to log out.");
            }
          }}
        />
      ),
      headerTitle: "Event List",
    });
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading events...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={events}
        ListEmptyComponent={<Text>No events found.</Text>}
        renderItem={({ item }) => (
          <View style={styles.eventCard}>
            <Text style={styles.eventName}>{item.eventName}</Text>
            <Text>{item.eventDate}</Text>
            <Text>{item.eventDescription}</Text>

            {item.user_Id === auth.currentUser.email && (
              <View style={styles.actionContainer}>
                {/* Favorites Switch */}
                <View style={styles.switchContainer}>
                  <Text>{item.isFavorite ? "Favorited" : "Not Favorited"}</Text>
                  <Switch
                    value={item.isFavorite}
                    onValueChange={() =>
                      toggleFavoriteStatus(item.id, item.isFavorite)
                    }
                  />
                </View>

                {/* Edit Button */}
                <Button
                  title="Edit"
                  onPress={() =>
                    navigation.navigate("AddEditEvent", {
                      eventId: item.id,
                      eventName: item.eventName,
                      eventDate: item.eventDate,
                      eventDescription: item.eventDescription,
                      isFavorite: item.isFavorite,
                    })
                  }
                />
              </View>
            )}
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
  actionContainer: {
    marginTop: 10,
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
});