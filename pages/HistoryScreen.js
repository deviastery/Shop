import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, Button, Alert } from "react-native";

const HistoryScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch("https://dummyjson.com/carts/user/1");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOrders(data.carts);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleDeleteOrder = async (orderId) => {
    Alert.alert(
      "Удалить заказ?",
      "Вы уверены, что хотите удалить этот заказ?",
      [
        { text: "Отмена", style: "cancel" },
        {
          text: "Удалить",
          onPress: async () => {
            try {
              const response = await fetch(
                `https://dummyjson.com/carts/${orderId}`,
                {
                  method: "DELETE",
                }
              );
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
              }
              const updatedOrders = orders.filter(
                (order) => order.id !== orderId
              );
              setOrders(updatedOrders);
            } catch (error) {
              Alert.alert(
                "Ошибка",
                "Не удалось удалить заказ. Попробуйте позже."
              );
              console.error("Error deleting order:", error);
            }
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Загрузка...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text>Ошибка загрузки заказов: {error.message}</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View style={styles.container}>
        <Text>История заказов пуста.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.order}>
            <Text style={styles.orderText}>ID заказа: {item.id}</Text>
            <Text style={styles.orderText}>Товары:</Text>
            {item.products.map((product) => (
              <Text key={product.id} style={styles.productText}>
                - {product.title} x {product.quantity}
              </Text>
            ))}
            <Button
              title="Удалить"
              onPress={() => handleDeleteOrder(item.id)}
            />
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  order: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
  },
  orderText: {
    fontSize: 16,
    marginBottom: 5,
  },
  productText: {
    fontSize: 14,
    marginLeft: 10,
  },
});

export default HistoryScreen;
