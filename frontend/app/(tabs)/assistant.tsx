import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { apiService } from '../../constants/api';

export default function AssistantScreen() {
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const { colors } = useTheme();

  const handleSearch = async () => {
    if (!prompt.trim()) {
      Alert.alert('Error', 'Please enter a shopping request');
      return;
    }

    setLoading(true);
    try {
      const response = await apiService.searchProducts(prompt.trim());
      setResults(response.items);
    } catch {
      Alert.alert('Error', 'Failed to get shopping suggestions');
    } finally {
      setLoading(false);
    }
  };

  const saveList = async () => {
    if (results.length === 0) {
      Alert.alert('Error', 'No items to save');
      return;
    }

    try {
      await apiService.saveShoppingList({
        name: `Shopping List - ${new Date().toLocaleDateString()}`,
        items: results
      });
      Alert.alert('Success', 'Shopping list saved!');
    } catch {
      Alert.alert('Error', 'Failed to save shopping list');
    }
  };

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-6 pt-12 pb-4">
        <Text 
          className="text-2xl font-bold mb-2"
          style={{ color: colors.text }}
        >
          ShopGenie Assistant
        </Text>
        
        <Text 
          className="text-base mb-4"
          style={{ color: colors.textSecondary }}
        >
          Ask me anything about your shopping needs
        </Text>
      </View>

      {/* Genie Character */}
      <View className="items-center mb-6">
        <View 
          className="rounded-2xl p-6 mx-6"
          style={{ backgroundColor: colors.card }}
        >
          <Image
            source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot%202025-07-13%20at%2011.59.39-z5FXPNoNNhT6oUKOcl8KZNLEbW06MS.png' }}
            className="w-48 h-64"
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Input Section */}
      <View className="px-6 mb-4">
        <View className="flex-row">
          <TextInput
            className="flex-1 border rounded-l-lg px-4 py-3 text-base"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.card,
              color: colors.text 
            }}
            placeholder="Ask me anything"
            placeholderTextColor={colors.textSecondary}
            value={prompt}
            onChangeText={setPrompt}
            multiline
          />
          <TouchableOpacity
            onPress={handleSearch}
            disabled={loading}
            className="bg-blue-600 rounded-r-lg px-4 justify-center"
          >
            <Ionicons 
              name={loading ? "hourglass" : "send"} 
              size={20} 
              color="white" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Results */}
      {results.length > 0 && (
        <ScrollView className="flex-1 px-6">
          <View className="flex-row justify-between items-center mb-4">
            <Text 
              className="text-lg font-bold"
              style={{ color: colors.text }}
            >
              Shopping Suggestions
            </Text>
            <TouchableOpacity
              onPress={saveList}
              className="bg-green-600 rounded-lg px-4 py-2"
            >
              <Text className="text-white font-medium">Save List</Text>
            </TouchableOpacity>
          </View>

          {results.map((item, index) => (
            <View
              key={index}
              className="flex-row items-center p-4 mb-3 rounded-lg"
              style={{ backgroundColor: colors.card }}
            >
              <Image
                source={{ uri: item.image }}
                className="w-16 h-16 rounded-lg mr-4"
              />
              <View className="flex-1">
                <Text 
                  className="font-semibold text-base mb-1"
                  style={{ color: colors.text }}
                >
                  {item.name}
                </Text>
                <Text 
                  className="text-lg font-bold text-green-600 mb-1"
                >
                  ${item.price}
                </Text>
                <View className="flex-row items-center">
                  <View 
                    className="bg-gray-200 rounded-full px-2 py-1 mr-2"
                  >
                    <Text className="text-xs text-gray-600">
                      Aisle {item.aisle}
                    </Text>
                  </View>
                  <Text 
                    className="text-xs"
                    style={{ color: item.available ? '#10b981' : '#ef4444' }}
                  >
                    {item.available ? 'In Stock' : 'Out of Stock'}
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}