import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Link, router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { colors } = useTheme();

  const handleRegister = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await register(name, email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Registration Failed', result.error);
    }
  };

  return (
    <ScrollView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="flex-1 px-6 pt-16">
        <View className="items-center mb-8">
          <Text 
            className="text-3xl font-bold mb-2"
            style={{ color: colors.text }}
          >
            Create Account
          </Text>
          <Text 
            className="text-lg text-center"
            style={{ color: colors.textSecondary }}
          >
            Join ShopGenie today
          </Text>
        </View>

        <View className="mb-6">
          <Text 
            className="text-sm font-medium mb-2"
            style={{ color: colors.text }}
          >
            Full Name
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3 text-base"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.card,
              color: colors.text 
            }}
            placeholder="Enter your full name"
            placeholderTextColor={colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="mb-6">
          <Text 
            className="text-sm font-medium mb-2"
            style={{ color: colors.text }}
          >
            Email
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3 text-base"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.card,
              color: colors.text 
            }}
            placeholder="Enter your email"
            placeholderTextColor={colors.textSecondary}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        <View className="mb-6">
          <Text 
            className="text-sm font-medium mb-2"
            style={{ color: colors.text }}
          >
            Password
          </Text>
          <TextInput
            className="border rounded-lg px-4 py-3 text-base"
            style={{ 
              borderColor: colors.border,
              backgroundColor: colors.card,
              color: colors.text 
            }}
            placeholder="Create a password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="bg-blue-600 rounded-lg py-4 mb-6"
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text style={{ color: colors.textSecondary }}>
            Already have an account?{' '}
          </Text>
          <Link href="/auth/login" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}