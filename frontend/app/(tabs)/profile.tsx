import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert, Switch } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { colors, isDark, toggleTheme } = useTheme();

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          style: 'destructive',
          onPress: async () => {
            await logout();
            router.replace('/auth/login');
          }
        }
      ]
    );
  };

  const ProfileItem = ({ icon, title, subtitle, onPress, rightElement }: any) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center p-4 mb-2 rounded-lg"
      style={{ backgroundColor: colors.card }}
    >
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-4"
        style={{ backgroundColor: colors.primary + '20' }}
      >
        <Ionicons name={icon} size={20} color={colors.primary} />
      </View>
      
      <View className="flex-1">
        <Text 
          className="font-medium text-base"
          style={{ color: colors.text }}
        >
          {title}
        </Text>
        {subtitle && (
          <Text 
            className="text-sm mt-1"
            style={{ color: colors.textSecondary }}
          >
            {subtitle}
          </Text>
        )}
      </View>
      
      {rightElement || (
        <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
      )}
    </TouchableOpacity>
  );

  return (
    <ScrollView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="px-6 pt-12 pb-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View 
            className="w-20 h-20 rounded-full items-center justify-center mb-4"
            style={{ backgroundColor: colors.primary }}
          >
            <Text className="text-white text-2xl font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </Text>
          </View>
          <Text 
            className="text-xl font-bold"
            style={{ color: colors.text }}
          >
            {user?.name}
          </Text>
          <Text 
            className="text-base"
            style={{ color: colors.textSecondary }}
          >
            {user?.email}
          </Text>
        </View>

        {/* Settings */}
        <Text 
          className="text-lg font-bold mb-4"
          style={{ color: colors.text }}
        >
          Settings
        </Text>

        <ProfileItem
          icon="moon-outline"
          title="Dark Mode"
          subtitle={isDark ? 'Enabled' : 'Disabled'}
          rightElement={
            <Switch
              value={isDark}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={isDark ? '#ffffff' : '#f4f3f4'}
            />
          }
        />

        <ProfileItem
          icon="notifications-outline"
          title="Notifications"
          subtitle="Manage your notification preferences"
          onPress={() => Alert.alert('Coming Soon', 'Notification settings will be available soon')}
        />

        <ProfileItem
          icon="location-outline"
          title="Location Services"
          subtitle="For location-based deals"
          onPress={() => Alert.alert('Coming Soon', 'Location settings will be available soon')}
        />

        <ProfileItem
          icon="card-outline"
          title="Payment Methods"
          subtitle="Manage your payment options"
          onPress={() => Alert.alert('Coming Soon', 'Payment settings will be available soon')}
        />

        {/* Account */}
        <Text 
          className="text-lg font-bold mb-4 mt-6"
          style={{ color: colors.text }}
        >
          Account
        </Text>

        <ProfileItem
          icon="person-outline"
          title="Edit Profile"
          subtitle="Update your personal information"
          onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}
        />

        <ProfileItem
          icon="shield-outline"
          title="Privacy & Security"
          subtitle="Manage your privacy settings"
          onPress={() => Alert.alert('Coming Soon', 'Privacy settings will be available soon')}
        />

        <ProfileItem
          icon="help-circle-outline"
          title="Help & Support"
          subtitle="Get help or contact support"
          onPress={() => Alert.alert('Coming Soon', 'Help section will be available soon')}
        />

        <ProfileItem
          icon="information-circle-outline"
          title="About"
          subtitle="App version and information"
          onPress={() => Alert.alert('ShopGenie', 'Version 1.0.0\nYour personal shopping companion')}
        />

        {/* Logout */}
        <TouchableOpacity
          onPress={handleLogout}
          className="flex-row items-center justify-center p-4 mt-6 rounded-lg"
          style={{ backgroundColor: '#fee2e2' }}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text className="text-red-600 font-medium ml-2">Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}