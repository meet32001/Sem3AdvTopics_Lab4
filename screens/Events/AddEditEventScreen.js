import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Switch,
} from "react-native";
import { db } from "../../firebaseConfig";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { auth } from "../../firebaseConfig";

export default function AddEditEventScreen({ route, navigation }) {
  // Destructure parameters with defaults
  const {
    eventId = null,
    eventName = "EventTitle",
    eventDate = "2024-12-02",
    eventDescription = "Hello world 1",
    isFavorite = false,
    userId = auth.currentUser?.email || "Unknown User",
  } = route.params || {};

  const [name, setName] = useState(eventName);
  const [date, setDate] = useState(eventDate);
  const [description, setDescription] = useState(eventDescription);
  const [favorite, setFavorite] = useState(isFavorite);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!name || !date || !description) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);

    try {
      const eventRef = eventId
        ? doc(db, "favorites", eventId)
        : doc(db, "favorites", `unique_event_id_${Date.now()}`);

      const eventData = {
        eventName: name,
        eventDate: date,
        eventDescription: description,
        isFavorite: favorite,
        userId,
        eventId: eventRef.id,
      };

      if (eventId) {
        // Update existing event
        await updateDoc(eventRef, eventData);
        Alert.alert("Success", "Event updated successfully!");
      } else {
        // Add new event
        await setDoc(eventRef, eventData);
        Alert.alert("Success", "Event created successfully!");
      }

      navigation.goBack(); // Return to EventListScreen
    } catch (error) {
      Alert.alert("Error", "Failed to save event.");
      console.error("Error saving event:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{eventId ? "Edit Event" : "Add Event"}</Text>

      {/* Non-editable User ID */}
      <View style={styles.field}>
        <Text style={styles.label}>User ID:</Text>
        <Text style={styles.value}>{userId}</Text>
      </View>

      {/* Editable Fields */}
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Date"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
      />

      {/* Favorite Switch */}
      <View style={styles.switchContainer}>
        <Text style={styles.switchLabel}>Mark as Favorite:</Text>
        <Switch value={favorite} onValueChange={setFavorite} />
      </View>

      {/* Save Button */}
      <Button
        title={loading ? "Saving..." : eventId ? "Update Event" : "Add Event"}
        onPress={handleSave}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f5f5f5",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    color: "#333",
  },
  field: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    color: "#333",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#555",
    padding: 10,
    backgroundColor: "#e9ecef",
    borderRadius: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: "#fff",
  },
  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 15,
  },
  switchLabel: {
    fontSize: 16,
    color: "#333",
  },
});
