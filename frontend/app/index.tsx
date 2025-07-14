import { useEffect } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useAuth } from '../hooks/useAuth';

export default function SplashScreen() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (user) {
          router.replace('/(tabs)');
        } else {
          router.replace('/auth/login');
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [user, loading]);

  const handleEnterStore = () => {
    if (user) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth/login');
    }
  };

  return (
    <LinearGradient
      colors={['#4f46e5', '#7c3aed']}
      className="flex-1 justify-center items-center px-6"
    >
      <View className="items-center mb-8">
        <Image
          source={require("../assets/images/icon.png")}
          className="w-64 h-80 mb-6"
          resizeMode="contain"
        />
        <Text className="text-white text-4xl font-bold mb-2">ShopGenie</Text>
        <Text className="text-white/80 text-lg text-center">
          Your personal shopping companion is here to help you find what you need, fast.
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleEnterStore}
        className="bg-white rounded-full px-12 py-4 mt-8"
      >
        <Text className="text-blue-600 font-semibold text-lg">Enter Store</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}