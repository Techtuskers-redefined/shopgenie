import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { apiService } from '../constants/api';

interface ShoppingItem {
  id: string;
  name: string;
  price: number;
  image: string;
  aisle?: number;
  completed: boolean;
}

interface ShoppingList {
  id: string;
  name: string;
  items: ShoppingItem[];
  createdAt: string;
}

export default function ShoppingListScreen() {
  const [lists, setLists] = useState<ShoppingList[]>([]);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    loadShoppingLists();
  }, []);

  const loadShoppingLists = async () => {
    try {
      setLoading(true);
      const response = await apiService.getShoppingLists();
      setLists(response.lists);
    } catch (error) {
      console.error('Failed to load shopping lists:', error);
      // Mock data for demo
      setLists([
        {
          id: '1',
          name: 'Eco-Friendly Shopping',
          createdAt: '2024-01-15',
          items: [
            {
              id: '1',
              name: 'Organic Bananas',
              price: 2.99,
              image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=100&h=100&fit=crop',
              aisle: 3,
              completed: false
            },
            {
              id: '2',
              name: 'Free-Range Eggs',
              price: 4.49,
              image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=100&h=100&fit=crop',
              aisle: 5,
              completed: false
            },
            {
              id: '3',
              name: 'Recycled Paper Towels',
              price: 3.79,
              image: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=100&h=100&fit=crop',
              aisle: 8,
              completed: true
            },
            {
              id: '4',
              name: 'Plant-Based Milk',
              price: 5.99,
              image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=100&h=100&fit=crop',
              aisle: 5,
              completed: false
            },
            {
              id: '5',
              name: 'Reusable Shopping Bag',
              price: 2.49,
              image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop',
              completed: false
            }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleItemCompletion = (listId: string, itemId: string) => {
    setLists(prevLists =>
      prevLists.map(list =>
        list.id === listId
          ? {
              ...list,
              items: list.items.map(item =>
                item.id === itemId
                  ? { ...item, completed: !item.completed }
                  : item
              )
            }
          : list
      )
    );
  };

  const getTotalPrice = (items: ShoppingItem[]) => {
    return items.reduce((total, item) => total + item.price, 0);
  };

  const getCompletedCount = (items: ShoppingItem[]) => {
    return items.filter(item => item.completed).length;
  };

  if (loading) {
    return (
      <View 
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text style={{ color: colors.textSecondary }}>Loading shopping lists...</Text>
      </View>
    );
  }

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
            Shopping Lists
          </Text>
        </View>
      </View>

      <ScrollView className="flex-1 px-6">
        {lists.map((list) => (
          <View
            key={list.id}
            className="mb-6 rounded-lg overflow-hidden"
            style={{ backgroundColor: colors.card }}
          >
            {/* List Header */}
            <View className="p-4 border-b" style={{ borderBottomColor: colors.border }}>
              <View className="flex-row justify-between items-center mb-2">
                <Text 
                  className="text-lg font-bold"
                  style={{ color: colors.text }}
                >
                  {list.name}
                </Text>
                <View 
                  className="bg-green-100 rounded-full px-2 py-1"
                >
                  <Text className="text-green-800 text-xs font-medium">
                    Eco-Friendly
                  </Text>
                </View>
              </View>
              
              <View className="flex-row justify-between items-center">
                <Text 
                  className="text-sm"
                  style={{ color: colors.textSecondary }}
                >
                  {getCompletedCount(list.items)}/{list.items.length} items completed
                </Text>
                <Text 
                  className="text-sm font-medium"
                  style={{ color: colors.text }}
                >
                  Total: ${getTotalPrice(list.items).toFixed(2)}
                </Text>
              </View>
            </View>

            {/* List Items */}
            {list.items.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => toggleItemCompletion(list.id, item.id)}
                className="flex-row items-center p-4 border-b"
                style={{ borderBottomColor: colors.border }}
              >
                <View className="mr-4">
                  <Ionicons
                    name={item.completed ? 'checkmark-circle' : 'ellipse-outline'}
                    size={24}
                    color={item.completed ? '#10b981' : colors.textSecondary}
                  />
                </View>
                
                <Image
                  source={{ uri: item.image }}
                  className="w-12 h-12 rounded-lg mr-4"
                />
                
                <View className="flex-1">
                  <Text 
                    className={`font-medium text-base ${item.completed ? 'line-through' : ''}`}
                    style={{ 
                      color: item.completed ? colors.textSecondary : colors.text 
                    }}
                  >
                    {item.name}
                  </Text>
                  <Text 
                    className="text-sm font-bold text-green-600"
                  >
                    ${item.price.toFixed(2)}
                  </Text>
                  {item.aisle && (
                    <Text 
                      className="text-xs"
                      style={{ color: colors.textSecondary }}
                    >
                      Aisle {item.aisle}
                    </Text>
                  )}
                </View>
              </TouchableOpacity>
            ))}

            {/* List Actions */}
            <View className="p-4 flex-row justify-between">
              <TouchableOpacity
                onPress={() => router.push('/(tabs)/assistant')}
                className="flex-1 bg-blue-600 rounded-lg py-3 mr-2"
              >
                <Text className="text-white text-center font-medium">
                  Add More Items
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                onPress={() => router.push('/cart')}
                className="flex-1 bg-green-600 rounded-lg py-3 ml-2"
              >
                <Text className="text-white text-center font-medium">
                  Proceed to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}