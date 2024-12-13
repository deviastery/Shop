import React, { useState, useRef } from "react";
import { View, Text, Button, StyleSheet, Platform } from "react-native"; // Добавлено Platform
import MapView, { Marker } from "react-native-maps";
import { useRoute } from "@react-navigation/native";

// YaMap.init("c4c17225-f7de-4c2e-8c91-290ebe7beb0c");

const OrderScreen = () => {
  const route = useRoute();
  const orderId = route.params?.orderId;

  const initialRegion = {
    latitude: 55.75222, // Широта Москвы
    longitude: 37.61556, // Долгота Москвы
    latitudeDelta: 0.1, // Увеличение области отображения для Москвы
    longitudeDelta: 0.1, // Увеличение области отображения для Москвы
  };

  return (
    <View style={styles.container}>
      <Text>Номер заказа: {orderId}</Text>

      <MapView style={styles.map} initialRegion={initialRegion}>
        <Marker
          coordinate={initialRegion}
          title="Marker Title"
          description="Marker Description"
        />
      </MapView>

      <Button
        title="Подтвердить заказ"
        onPress={() => {
          /*Здесь код подтверждения заказа*/
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  map: {
    width: 300,
    height: 300,
  },
});

export default OrderScreen;
