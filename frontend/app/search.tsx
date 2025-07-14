import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useTheme } from '../hooks/useTheme';
import { apiService } from '../constants/api';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  discount?: string;
  image: string;
  aisle: number;
  category: string;
  isSponsored?: boolean;
}

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { colors } = useTheme();

  const categories = ['All', 'Grocery', 'Household', 'Organic'];

  useEffect(() => {
    if (searchQuery.length > 2) {
      searchProducts();
    } else {
      setProducts([]);
    }
  }, [searchQuery]);

  const searchProducts = async () => {
    try {
      setLoading(true);
      const response = await apiService.searchProducts(searchQuery);
      setProducts(response.items || []);
    } catch (error) {
      console.error('Search failed:', error);
      // Mock search results for demo
      setProducts([
        {
          id: '1',
          name: 'Organic Bananas',
          price: 2.99,
          originalPrice: 3.49,
          discount: '15% OFF',
          image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=150&h=150&fit=crop',
          aisle: 3,
          category: 'Organic',
          isSponsored: true
        },
        {
          id: '2',
          name: 'Organic Apples',
          price: 3.99,
          originalPrice: 4.49,
          discount: '10% OFF',
          image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=150&h=150&fit=crop',
          aisle: 3,
          category: 'Organic'
        },
        {
          id: '3',
          name: 'Organic Milk',
          price: 4.99,
          originalPrice: 5.49,
          discount: '5% OFF',
          image: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=150&h=150&fit=crop',
          aisle: 5,
          category: 'Organic',
          isSponsored: true
        },
        {
          id: '4',
          name: 'Organic Eggs',
          price: 5.49,
          originalPrice: 6.49,
          discount: '20% OFF',
          image: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=150&h=150&fit=crop',
          aisle: 5,
          category: 'Organic'
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setProducts([]);
  };

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(product => product.category === selectedCategory);

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
            Search Results
          </Text>
        </View>

        {/* Search Bar */}
        <View className="flex-row items-center mb-4">
          <View className="flex-1 flex-row items-center border rounded-lg px-4 py-3"
                style={{ 
                  borderColor: colors.border,
                  backgroundColor: colors.card 
                }}>
            <Ionicons name="search" size={20} color={colors.textSecondary} />
            <TextInput
              className="flex-1 ml-2 text-base"
              style={{ color: colors.text }}
              placeholder="Search products..."
              placeholderTextColor={colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={clearSearch}>
                <Ionicons name="close-circle" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Category Filter */}
        {products.length > 0 && (
          <ScrollView 
            horizontal 
            showsHorizontalScrollIndicator={false}
            className="mb-4"
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
        )}
      </View>

      {/* Results */}
      <ScrollView className="flex-1 px-6">
        {loading ? (
          <View className="flex-1 justify-center items-center py-20">
            <Text style={{ color: colors.textSecondary }}>Searching...</Text>
          </View>
        ) : filteredProducts.length > 0 ? (
          <>
            <Text 
              className="text-lg font-bold mb-4"
              style={{ color: colors.text }}
            >
              {searchQuery}
            </Text>
            
            {filteredProducts.map((product) => (
              <TouchableOpacity
                key={product.id}
                className="mb-4 rounded-lg overflow-hidden"
                style={{ backgroundColor: colors.card }}
              >
                {product.isSponsored && (
                  <View className="bg-orange-500 px-2 py-1">
                    <Text className="text-white text-xs font-medium">Sponsored</Text>
                  </View>
                )}
                
                <View className="flex-row p-4">
                  <Image
                    source={{ uri: product.image }}
                    className="w-20 h-20 rounded-lg mr-4"
                  />
                  
                  <View className="flex-1">
                    <Text 
                      className="font-bold text-lg mb-1"
                      style={{ color: colors.text }}
                    >
                      {product.name}
                    </Text>
                    
                    {product.discount && (
                      <Text className="text-green-600 font-bold text-sm mb-1">
                        {product.discount}
                      </Text>
                    )}
                    
                    <View className="flex-row items-center mb-2">
                      {product.originalPrice && (
                        <Text className="text-red-500 line-through mr-2 text-sm">
                          ${product.originalPrice.toFixed(2)}
                        </Text>
                      )}
                      <Text 
                        className="font-bold text-lg"
                        style={{ color: colors.text }}
                      >
                        ${product.price.toFixed(2)}
                      </Text>
                    </View>
                    
                    <View className="flex-row items-center justify-between">
                      <View 
                        className="bg-gray-200 rounded-full px-2 py-1"
                      >
                        <Text className="text-xs text-gray-600">
                          Aisle {product.aisle}
                        </Text>
                      </View>
                      
                      <TouchableOpacity className="bg-blue-600 rounded-lg px-4 py-2">
                        <Text className="text-white font-medium">Add to Cart</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : searchQuery.length > 2 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="search" size={64} color={colors.textSecondary} />
            <Text 
              className="text-lg font-medium mt-4 mb-2"
              style={{ color: colors.text }}
            >
              No results found
            </Text>
            <Text 
              className="text-center"
              style={{ color: colors.textSecondary }}
            >
              Try searching for something else
            </Text>
          </View>
        ) : (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="search" size={64} color={colors.textSecondary} />
            <Text 
              className="text-lg font-medium mt-4 mb-2"
              style={{ color: colors.text }}
            >
              Start searching
            </Text>
            <Text 
              className="text-center"
              style={{ color: colors.textSecondary }}
            >
              Enter at least 3 characters to search for products
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}