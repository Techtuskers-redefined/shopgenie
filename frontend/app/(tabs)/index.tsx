import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function HomeScreen() {
  const { user } = useAuth();
  const { colors, toggleTheme, isDark } = useTheme();

  const promotions = [
    { id: 1, title: '20% off Organic Produce', subtitle: 'Valid until tomorrow' },
    { id: 2, title: 'Buy 2 Get 1 Free Dairy', subtitle: 'Selected items only' },
    { id: 3, title: 'Fresh Bakery Items', subtitle: '15% off today' },
  ];

  return (
    <ScrollView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="px-6 pt-12 pb-6">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-6">
          <View>
            <Text 
              className="text-2xl font-bold"
              style={{ color: colors.text }}
            >
              Hello, {user?.name || 'Shopper'}!
            </Text>
            <Text 
              className="text-base"
              style={{ color: colors.textSecondary }}
            >
              Ready to start shopping?
            </Text>
          </View>
          <TouchableOpacity onPress={toggleTheme}>
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={24} 
              color={colors.text} 
            />
          </TouchableOpacity>
        </View>

        {/* Start Shopping Button */}
        <TouchableOpacity
          onPress={() => router.push('/assistant')}
          className="bg-blue-600 rounded-xl p-6 mb-6"
        >
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-xl font-bold mb-1">
                Start Shopping
              </Text>
              <Text className="text-white/80">
                Let our AI assistant help you
              </Text>
            </View>
            <Ionicons name="arrow-forward" size={24} color="white" />
          </View>
        </TouchableOpacity>

        {/* Promotions */}
        <View className="mb-6">
          <Text 
            className="text-xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Today&apos;s Deals
          </Text>
          {promotions.map((promo) => (
            <TouchableOpacity
              key={promo.id}
              className="rounded-lg p-4 mb-3"
              style={{ backgroundColor: colors.card }}
            >
              <Text 
                className="font-semibold text-base mb-1"
                style={{ color: colors.text }}
              >
                {promo.title}
              </Text>
              <Text style={{ color: colors.textSecondary }}>
                {promo.subtitle}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Quick Actions */}
        <View className="mb-6">
          <Text 
            className="text-xl font-bold mb-4"
            style={{ color: colors.text }}
          >
            Quick Actions
          </Text>
          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={() => router.push('/shopping-list')}
              className="flex-1 rounded-lg p-4 mr-2 items-center"
              style={{ backgroundColor: colors.card }}
            >
              <Ionicons name="list" size={32} color={colors.primary} />
              <Text 
                className="mt-2 font-medium text-center"
                style={{ color: colors.text }}
              >
                My Lists
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              onPress={() => router.push('/search')}
              className="flex-1 rounded-lg p-4 ml-2 items-center"
              style={{ backgroundColor: colors.card }}
            >
              <Ionicons name="search" size={32} color={colors.primary} />
              <Text 
                className="mt-2 font-medium text-center"
                style={{ color: colors.text }}
              >
                Search
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}