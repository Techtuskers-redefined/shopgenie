import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import * as Google from 'expo-auth-session/providers/google';
import * as AppleAuthentication from 'expo-apple-authentication';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, googleLogin, appleLogin } = useAuth();
  const { colors } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', result.error);
    }
  };

  // Google sign-in
  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '675475797053-p114llja40ks797r6r1pq6pce3riv0ka.apps.googleusercontent.com',
    iosClientId: '675475797053-igk1s4ftcu44gk874q7eqkaarahq9dde.apps.googleusercontent.com',
    androidClientId: '675475797053-v56tjsri906ee4gb1ethn9sqoa2oa8pv.apps.googleusercontent.com',
    webClientId: '675475797053-48o2cg5661lfqhc5stlb0ejslfk361hu.apps.googleusercontent.com',
  });

  React.useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      if (id_token) {
        setLoading(true);
        googleLogin(id_token).then((result) => {
          setLoading(false);
          if (result.success) {
            router.replace('/(tabs)');
          } else {
            Alert.alert('Google Login Failed', result.error);
          }
        });
      }
    }
  }, [response]);

  const handleGoogleLogin = async () => {
    promptAsync();
  };

  const handleAppleLogin = async () => {
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      if (credential.identityToken) {
        setLoading(true);
        const result = await appleLogin(credential.identityToken);
        setLoading(false);
        if (result.success) {
          router.replace('/(tabs)');
        } else {
          Alert.alert('Apple Login Failed', result.error);
        }
      } else {
        Alert.alert('Apple Login Failed', 'No identity token received');
      }
    } catch (e: any) {
      if (e.code !== 'ERR_CANCELED') {
        Alert.alert('Apple Login Failed', e.message || 'Unknown error');
      }
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
            Welcome Back
          </Text>
          <Text 
            className="text-lg text-center"
            style={{ color: colors.textSecondary }}
          >
            Sign in to continue shopping
          </Text>
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
            placeholder="Enter your password"
            placeholderTextColor={colors.textSecondary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="bg-blue-600 rounded-lg py-4 mb-4"
        >
          <Text className="text-white text-center font-semibold text-lg">
            {loading ? 'Signing In...' : 'Sign In'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row items-center mb-4">
          <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
          <Text className="mx-4" style={{ color: colors.textSecondary }}>or</Text>
          <View className="flex-1 h-px" style={{ backgroundColor: colors.border }} />
        </View>

        <TouchableOpacity
          onPress={handleGoogleLogin}
          className="border rounded-lg py-4 mb-3 flex-row items-center justify-center"
          style={{ borderColor: colors.border }}
        >
          <Ionicons name="logo-google" size={20} color="#4285F4" />
          <Text className="ml-2 font-medium" style={{ color: colors.text }}>
            Continue with Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleAppleLogin}
          className="border rounded-lg py-4 mb-6 flex-row items-center justify-center"
          style={{ borderColor: colors.border }}
        >
          <Ionicons name="logo-apple" size={20} color={colors.text} />
          <Text className="ml-2 font-medium" style={{ color: colors.text }}>
            Continue with Apple
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center">
          <Text style={{ color: colors.textSecondary }}>
            Don&apos;t have an account?{' '}
          </Text>
          <Link href="/auth/register" asChild>
            <TouchableOpacity>
              <Text className="text-blue-600 font-medium">Sign Up</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}