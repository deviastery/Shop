import React, { useState, useEffect } from "react";
import {
  Alert,
  View,
  FlatList,
  StyleSheet,
  Button,
  TextInput,
  Text,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CartItem from "../components/CartItem";
import { useNavigation } from "@react-navigation/native";

const HomeScreen = () => {
  const [cart, setCart] = useState([
    {
      id: "1",
      name: "Товар 1",
      price: 100,
      quantity: 1,
      image:
        "https://cdn.laredoute.com/cdn-cgi/image/width=500,height=500,fit=pad,dpr=1/products/9/1/9/919a86747fac793280c5d5bc40c4ae2c.jpg",
    },
    {
      id: "2",
      name: "Товар 2",
      price: 200,
      quantity: 2,
      image:
        "https://img.fix-price.com/800x800/_marketplace/images/origin/ed/eda3309edd5d93e181b58afc1634bc19.jpg",
    },
    {
      id: "3",
      name: "Товар 3",
      price: 150,
      quantity: 1,
      image:
        "https://cdn.laredoute.com/cdn-cgi/image/width=500,height=500,fit=pad,dpr=1/products/9/1/9/919a86747fac793280c5d5bc40c4ae2c.jpg",
    },
    {
      id: "4",
      name: "Товар 4",
      price: 200,
      quantity: 2,
      image:
        "https://img.fix-price.com/800x800/_marketplace/images/origin/ed/eda3309edd5d93e181b58afc1634bc19.jpg",
    },
  ]);
  const [savedForLater, setSavedForLater] = useState([]);
  const [promoCode, setPromoCode] = useState("");
  const [discount, setDiscount] = useState(0);

  const navigation = useNavigation();

  const clearAllData = async () => {
    try {
      await AsyncStorage.clear();
      console.log("AsyncStorage очистился");
    } catch (e) {
      console.error("Ошибка очищения AsyncStorage:", e);
    }
  };

  // Увеличить количество товара в корзине
  const handleAdd = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // Уменьшить количество товара в корзине
  const handleRemove = (id) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === id && item.quantity > 0
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  // Отложить
  const handleSaveForLater = (id) => {
    const itemToMove = cart.find((item) => item.id === id);
    setSavedForLater((prev) => [...prev, itemToMove]);
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  // Удалить товар из отложенных
  const handleRemoveSaved = (id) => {
    setSavedForLater((prev) => prev.filter((item) => item.id !== id));
  };

  // Применить промокод
  const applyPromoCode = () => {
    if (promoCode === "NEWYEAR") {
      setDiscount(0.2); // 20% скидка
      alert("Промокод применён! Скидка 20%");
    } else {
      alert("Неверный промокод");
    }
  };

  // Посчитать сумму корзины
  const calculateTotal = () => {
    const total = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return total - total * discount;
  };

  // Сохранить в AsyncStorage
  const saveData = async () => {
    try {
      const jsonValue = JSON.stringify({ cart, savedForLater });
      await AsyncStorage.setItem("@appData", jsonValue);
    } catch (e) {
      console.error("Ошибка сохранения данных", e);
    }
  };

  // Загрузить из AsyncStorage
  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem("@appData");
      if (jsonValue != null) {
        const { cart, savedForLater } = JSON.parse(jsonValue);
        setCart(cart);
        setSavedForLater(savedForLater);
      }
    } catch (e) {
      console.error("Ошибка загрузки данных", e);
    }
  };

  // Начальная загрузка данных
  useEffect(() => {
    loadData();
  }, []);

  // Сохранение корзины в AsyncStorage при ее изменении
  useEffect(() => {
    saveData();
  }, [cart, savedForLater]);

  // Отправка запроса оформления заказа
  const handlePlaceOrder = async () => {
    const transformedCart = [];
    const cartMap = new Map();

    for (const item of cart) {
      const id = parseInt(item.id);
      if (cartMap.has(id)) {
        cartMap.set(id, cartMap.get(id) + item.quantity); // если товар уже есть в корзине, увеличиваем его количество
      } else {
        cartMap.set(id, item.quantity);
      }
    }

    for (const [id, quantity] of cartMap) {
      transformedCart.push({ id, quantity });
    }

    const total = calculateTotal();
    const orderData = {
      userId: 1,
      products: transformedCart,
    };

    try {
      const response = await fetch("https://dummyjson.com/carts/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      console.log("Код состояния ответа:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        const errorMessage =
          errorData.message || `Ошибка. Статус: ${response.status}`;
        throw new Error(errorMessage);
      }

      const data = await response.json();
      Alert.alert("Заказ оформлен!", `Номер заказа: ${data.id}`);
      navigation.navigate("Order", { orderId: data.id, total: total });
    } catch (error) {
      Alert.alert("Ошибка при оформлении заказа", error.message);
      console.error("Ошибка при оформлении заказа:", error);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onAdd={handleAdd}
            onRemove={handleRemove}
            onSaveForLater={handleSaveForLater}
          />
        )}
        keyExtractor={(item) => item.id}
      />
      <TextInput
        style={styles.input}
        placeholder="Введите промокод"
        value={promoCode}
        onChangeText={setPromoCode}
      />
      <Button title="Применить" onPress={applyPromoCode} />
      <Button title="Оформить заказ" onPress={handlePlaceOrder} />
      <Button title="Очистить AsyncStorage" onPress={clearAllData} />
      <Text>Итоговая стоимость: {calculateTotal()} ₽</Text>
      <Text>Отложенные товары:</Text>
      <FlatList
        data={savedForLater}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onAdd={() => {}}
            onRemove={() => {}}
            onSaveForLater={() => {}}
            onLongPress={() => handleRemoveSaved(item.id)}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default HomeScreen;
