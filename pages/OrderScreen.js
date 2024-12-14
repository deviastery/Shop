import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  Platform,
  TextInput,
} from "react-native"; // Добавлено Platform
import MapView, { Marker } from "react-native-maps";
import { useRoute } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geocoder from "react-native-geocoding";

const OrderScreen = () => {
  const route = useRoute();
  const orderId = route.params?.orderId;
  const total = route.params?.total;
  const mapRef = useRef(null);

  const navigation = useNavigation();

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 55.75222,
    longitude: 37.61556,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });
  const [address, setAddress] = useState("");

  const onChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShow(Platform.OS === "ios");
    setDate(currentDate);
  };

  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode("date");
  };

  const initialRegion = {
    latitude: 55.75222, // Широта Москвы
    longitude: 37.61556, // Долгота Москвы
    latitudeDelta: 0.1, // Увеличение области отображения для Москвы
    longitudeDelta: 0.1, // Увеличение области отображения для Москвы
  };

  const handleConfirmOrder = async () => {
    const orderData = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`,
      total: total,
      orderId: orderId,
      deliveryDate: date.toISOString(), // Используем ISO string для даты
      deliveryCoordinates: {
        latitude: coordinates.latitude,
        longitude: coordinates.longitude,
      },
    };

    console.log("orderData:", orderData);

    try {
      const jsonValue = await AsyncStorage.getItem("@orders");
      let orders = jsonValue != null ? JSON.parse(jsonValue) : [];
      orders.push(orderData);
      const jsonValue2 = JSON.stringify(orders);
      await AsyncStorage.setItem("@orders", jsonValue2);
    } catch (e) {
      console.error("Error saving order:", e);
    }

    navigation.navigate("History");
  };

  const onMarkerDragEnd = async (e) => {
    const newCoordinates = {
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: coordinates.latitudeDelta,
      longitudeDelta: coordinates.longitudeDelta,
    };

    setCoordinates(newCoordinates);
  };

  return (
    <View style={styles.container}>
      <Text>Номер заказа: {orderId}</Text>

      <View>
        <Button title="Выбрать дату доставки" onPress={showDatepicker} />
        {show && (
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={mode}
            is24Hour={true}
            onChange={onChange}
          />
        )}
        <Text>Выбранная дата: {date.toLocaleDateString()}</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={initialRegion}
        ref={mapRef}
        onRegionChangeComplete={(region) => setCoordinates(region)}
      >
        <Marker
          coordinate={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }}
          draggable
          onDragEnd={onMarkerDragEnd}
        />
      </MapView>

      <Button title="Подтвердить заказ" onPress={handleConfirmOrder} />
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
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    width: 200,
  },
});

export default OrderScreen;
