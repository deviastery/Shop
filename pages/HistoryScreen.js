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

const HistoryScreen = () => {
  const route = useRoute();
  const orderId = route.params?.orderId;
  const mapRef = useRef(null);

  const [date, setDate] = useState(new Date());
  const [mode, setMode] = useState("date");
  const [show, setShow] = useState(false);
  const [coordinates, setCoordinates] = useState({
    latitude: 55.75222,
    longitude: 37.61556,
    latitudeDelta: 0.1,
    longitudeDelta: 0.1,
  });

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

  const onMarkerDragEnd = (e) => {
    setCoordinates({
      latitude: e.nativeEvent.coordinate.latitude,
      longitude: e.nativeEvent.coordinate.longitude,
      latitudeDelta: coordinates.latitudeDelta, // Сохраняем уровень масштабирования
      longitudeDelta: coordinates.longitudeDelta, // Сохраняем уровень масштабирования
    });
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

export default HistoryScreen;
