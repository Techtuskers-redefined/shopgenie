import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  originalPrice?: number;
}

export default function CartScreen() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalSavings, setTotalSavings] = useState(12.34);
  const [healthScore, setHealthScore] = useState(8);
  const { colors } = useTheme();

  useEffect(() => {
    // Mock cart data
    setCartItems([
      { id: '1', name: 'Organic Bananas', price: 2.99, originalPrice: 3.49, quantity: 2 },
      { id: '2', name: 'Free-Range Eggs', price: 4.49, originalPrice: 4.99, quantity: 1 },
      { id: '3', name: 'Plant-Based Milk', price: 5.99, originalPrice: 6.49, quantity: 1 },
      { id: '4', name: 'Organic Apples', price: 3.99, originalPrice: 4.49, quantity: 3 },
      { id: '5', name: 'Recycled Paper Towels', price: 3.79, originalPrice: 4.29, quantity: 2 },
    ]);
  }, []);

  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getItemCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const monthlyData = [
    { month: 'Jan', value: 7 },
    { month: 'Feb', value: 8 },
    { month: 'Mar', value: 6 },
    { month: 'Apr', value: 9 },
    { month: 'May', value: 8 },
    { month: 'Jun', value: 8 },
  ];

  const SimpleChart = () => (
    <View className="flex-row items-end justify-between h-16 mt-2">
      {monthlyData.map((item, index) => (
        <View key={index} className="items-center flex-1">
          <View 
            className="bg-blue-500 rounded-t mb-1"
            style={{ 
              height: (item.value / 10) * 40,
              width: 12
            }}
          />
          <Text 
            className="text-xs"
            style={{ color: colors.textSecondary }}
          >
            {item.month}
          </Text>
        </View>
      ))}
    </View>
  );

  const handleCheckout = () => {
    Alert.alert(
      'Checkout',
      'Proceed to payment?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Proceed', 
          onPress: () => Alert.alert('Success', 'Order placed successfully!')
        }
      ]
    );
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-6 pt-12 pb-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text 
            className="text-xl font-bold ml-4"
            style={{ color: colors.text }}
          >
            Cart
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {/* Summary Section */}
        <View 
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: colors.card }}
        >
          <Text 
            className="text-xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Summary
          </Text>

          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text 
                className="text-lg font-bold"
                style={{ color: colors.text }}
              >
                Cart total
              </Text>
              <Text 
                className="text-sm"
                style={{ color: colors.textSecondary }}
              >
                {getItemCount()} items
              </Text>
            </View>
            <Text 
              className="text-xl font-bold"
              style={{ color: colors.text }}
            >
              ${getCartTotal().toFixed(2)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-3">
            <View>
              <Text 
                className="text-lg font-bold"
                style={{ color: colors.text }}
              >
                Total savings
              </Text>
              <Text 
                className="text-sm text-green-600"
              >
                You saved ${totalSavings.toFixed(2)}
              </Text>
            </View>
            <Text 
              className="text-xl font-bold text-green-600"
            >
              ${totalSavings.toFixed(2)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center">
            <View>
              <Text 
                className="text-lg font-bold"
                style={{ color: colors.text }}
              >
                Green rating
              </Text>
              <Text 
                className="text-sm text-green-600"
              >
                Good
              </Text>
            </View>
            <Text 
              className="text-xl font-bold"
              style={{ color: colors.text }}
            >
              {healthScore}/10
            </Text>
          </View>
        </View>

        {/* Health Score Chart */}
        <View 
          className="rounded-lg p-4 mb-6"
          style={{ backgroundColor: colors.card }}
        >
          <Text 
            className="text-xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Green rating
          </Text>
          
          <Text 
            className="text-4xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            {healthScore}/10
          </Text>
          
          <Text 
            className="text-sm mb-4"
            style={{ color: colors.textSecondary }}
          >
            Last 30 days
          </Text>

          <SimpleChart />
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          onPress={handleCheckout}
          className="bg-blue-600 rounded-lg py-4 mb-6"
        >
          <Text className="text-white text-center font-bold text-lg">
            Checkout
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}