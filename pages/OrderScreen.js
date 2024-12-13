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

const OrderScreen = () => {
  const route = useRoute();
  const orderId = route.params?.orderId;
  const mapRef = useRef(null);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [coordinates, setCoordinates] = useState(null);

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

  const handleConfirmOrder = () => {
    console.log("Номер заказа:", orderId);
    console.log("Дата доставки:", date);
    console.log("Координаты доставки:", coordinates || initialRegion);
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
        <Marker coordinate={initialRegion} />
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
