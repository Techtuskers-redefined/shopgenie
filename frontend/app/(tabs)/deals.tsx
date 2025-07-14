import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { apiService } from '../../constants/api';

interface Deal {
  id: string;
  title: string;
  discount: string;
  originalPrice: number;
  salePrice: number;
  image: string;
  aisle: number;
  category: string;
  isSponsored?: boolean;
}

export default function DealsScreen() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { colors } = useTheme();

  const categories = ['All', 'Grocery', 'Household', 'Organic', 'Dairy'];

  useEffect(() => {
    loadDeals();
  }, []);

  const loadDeals = async () => {
    try {
      setLoading(true);
      const response = await apiService.getDeals();
      setDeals(response.deals);
    } catch (error) {
      Alert.alert('Error', 'Failed to load deals');
    } finally {
      setLoading(false);
    }
  };

  const filteredDeals = selectedCategory === 'All' 
    ? deals 
    : deals.filter(deal => deal.category.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <View className="flex-1" style={{ backgroundColor: colors.background }}>
      {/* Header */}
      <View className="px-6 pt-12 pb-4">
        <Text 
          className="text-2xl font-bold mb-2"
          style={{ color: colors.text }}
        >
          Smart Deals
        </Text>
        <Text 
          className="text-base"
          style={{ color: colors.textSecondary }}
        >
          Location-aware promotions just for you
        </Text>
      </View>

      {/* Category Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        className="px-6 mb-4"
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => setSelectedCategory(category)}
            className={`mr-3 px-4 py-2 rounded-full ${
              selectedCategory === category ? 'bg-blue-600' : ''
            }`}
            style={{ 
              backgroundColor: selectedCategory === category 
                ? colors.primary 
                : colors.card 
            }}
          >
            <Text 
              className="font-medium"
              style={{ 
                color: selectedCategory === category 
                  ? 'white' 
                  : colors.text 
              }}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Deals List */}
      <ScrollView className="flex-1 px-6">
        {loading ? (
          <View className="flex-1 justify-center items-center">
            <Text style={{ color: colors.textSecondary }}>Loading deals...</Text>
          </View>
        ) : (
          filteredDeals.map((deal) => (
            <TouchableOpacity
              key={deal.id}
              className="mb-4 rounded-lg overflow-hidden"
              style={{ backgroundColor: colors.card }}
            >
              {deal.isSponsored && (
                <View className="bg-orange-500 px-2 py-1">
                  <Text className="text-white text-xs font-medium">Sponsored</Text>
                </View>
              )}
              
              <View className="flex-row p-4">
                <Image
                  source={{ uri: deal.image }}
                  className="w-20 h-20 rounded-lg mr-4"
                />
                
                <View className="flex-1">
                  <Text 
                    className="font-bold text-lg mb-1"
                    style={{ color: colors.text }}
                  >
                    {deal.title}
                  </Text>
                  
                  <Text className="text-green-600 font-bold text-base mb-1">
                    {deal.discount}
                  </Text>
                  
                  <View className="flex-row items-center mb-2">
                    <Text className="text-red-500 line-through mr-2">
                      ${deal.originalPrice.toFixed(2)}
                    </Text>
                    <Text 
                      className="font-bold text-lg"
                      style={{ color: colors.text }}
                    >
                      ${deal.salePrice.toFixed(2)}
                    </Text>
                  </View>
                  
                  <View className="flex-row items-center justify-between">
                    <View 
                      className="bg-gray-200 rounded-full px-2 py-1"
                    >
                      <Text className="text-xs text-gray-600">
                        Aisle {deal.aisle}
                      </Text>
                    </View>
                    
                    <TouchableOpacity className="bg-blue-600 rounded-lg px-4 py-2">
                      <Text className="text-white font-medium">Add to Cart</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </View>
  );
}