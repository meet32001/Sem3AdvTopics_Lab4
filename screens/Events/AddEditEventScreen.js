import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { db } from "../../firebaseConfig";
import { doc, updateDoc, getDoc, collection, addDoc } from "firebase/firestore";

export default function AddEditEventScreen({ route, navigation }) {
  const { eventId, eventName, eventDate, eventDescription, isFavorite } =
    route.params || {}; // Destructure parameters from route

  const [name, setName] = useState(eventName || ""); // Pre-fill event name
  const [date, setDate] = useState(eventDate || ""); // Pre-fill event date
  const [description, setDescription] = useState(
    eventDescription || ""
  ); // Pre-fill event description
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (eventId) {
      fetchEventDetails(); // Fetch the event details if needed
    }
  }, [eventId]);

  const fetchEventDetails = async () => {
    try {
      const docRef = doc(db, "favorites", eventId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.eventName);
        setDate(data.eventDate);
        setDescription(data.eventDescription);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to fetch event details.");
    }
  };

  const handleSave = async () => {
    if (!name || !date || !description) {
      Alert.alert("Error", "All fields are required.");
      return;
    }

    setLoading(true);

    try {
      if (eventId) {
        // Update existing event
        const docRef = doc(db, "favorites", eventId);
        await updateDoc(docRef, {
          eventName: name,
          eventDate: date,
          eventDescription: description,
          isFavorite: isFavorite || false,
        });
        Alert.alert("Success", "Event updated successfully.");
      } else {
        // Add new event
        const collectionRef = collection(db, "favorites");
        await addDoc(collectionRef, {
          eventName: name,
          eventDate: date,
          eventDescription: description,
          isFavorite: false,
          user_Id: auth.currentUser.email,
        });
        Alert.alert("Success", "Event added successfully.");
      }
      navigation.goBack(); // Navigate back to the Event List screen
    } catch (error) {
      Alert.alert("Error", "Failed to save event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {eventId ? "Edit Event" : "Add New Event"}
      </Text>
      <TextInput
        style={styles.input}
        placeholder="Event Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Date (YYYY-MM-DD)"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Event Description"
        value={description}
        onChangeText={setDescription}
      />
      <Button
        title={loading ? "Saving..." : "Save"}
        onPress={handleSave}
        disabled={loading}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
});