import React from "react";
import { View, Text, Image, Button, StyleSheet } from "react-native";

const CartItem = ({ item, onAdd, onRemove, onSaveForLater }) => {
  return (
    <View style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <View style={styles.details}>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.price}>Цена: {item.price} ₽</Text>
        <View style={styles.actions}>
          <Button title="+" onPress={() => onAdd(item.id)} />
          <Text>{item.quantity}</Text>
          <Button title="-" onPress={() => onRemove(item.id)} />
          <Button title="Отложить" onPress={() => onSaveForLater(item.id)} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
  },
  image: { width: 50, height: 50, marginRight: 10 },
  details: { flex: 1 },
  name: { fontSize: 16, fontWeight: "bold" },
  price: { fontSize: 14, color: "#888" },
  actions: { flexDirection: "row", alignItems: "center", marginTop: 10 },
});

export default CartItem;
