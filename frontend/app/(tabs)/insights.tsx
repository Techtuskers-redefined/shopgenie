import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
import { apiService } from '../../constants/api';

const { width } = Dimensions.get('window');

interface InsightData {
  totalSavings: number;
  caloriesSaved: number;
  healthScore: number;
  monthlyData: {
    month: string;
    savings: number;
    healthScore: number;
  }[];
}

export default function InsightsScreen() {
  const [insights, setInsights] = useState<InsightData | null>(null);
  const [loading, setLoading] = useState(true);
  const { colors } = useTheme();

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = async () => {
    try {
      setLoading(true);
      const response = await apiService.getInsights();
      setInsights(response.insights);
    } catch (error) {
      console.error('Failed to load insights:', error);
      // Mock data for demo
      setInsights({
        totalSavings: 123.45,
        caloriesSaved: 2450,
        healthScore: 8.2,
        monthlyData: [
          { month: 'Jan', savings: 45.20, healthScore: 7.5 },
          { month: 'Feb', savings: 52.30, healthScore: 7.8 },
          { month: 'Mar', savings: 38.90, healthScore: 8.1 },
          { month: 'Apr', savings: 67.80, healthScore: 8.0 },
          { month: 'May', savings: 55.40, healthScore: 8.3 },
          { month: 'Jun', savings: 73.20, healthScore: 8.2 },
        ]
      });
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, subtitle, icon, color }: any) => (
    <View 
      className="rounded-lg p-4 mb-4"
      style={{ backgroundColor: colors.card }}
    >
      <View className="flex-row items-center justify-between mb-2">
        <Text 
          className="text-base font-medium"
          style={{ color: colors.textSecondary }}
        >
          {title}
        </Text>
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <Text 
        className="text-2xl font-bold mb-1"
        style={{ color: colors.text }}
      >
        {value}
      </Text>
      {subtitle && (
        <Text 
          className="text-sm"
          style={{ color: colors.textSecondary }}
        >
          {subtitle}
        </Text>
      )}
    </View>
  );

  const SimpleBarChart = ({ data }: { data: any[] }) => (
    <View className="mt-4">
      <Text 
        className="text-lg font-bold mb-4"
        style={{ color: colors.text }}
      >
        Last 6 Months
      </Text>
      <View className="flex-row items-end justify-between h-32">
        {data.map((item, index) => (
          <View key={index} className="items-center flex-1">
            <View 
              className="bg-blue-500 rounded-t mb-2"
              style={{ 
                height: (item.healthScore / 10) * 80,
                width: 20
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
    </View>
  );

  if (loading) {
    return (
      <View 
        className="flex-1 justify-center items-center"
        style={{ backgroundColor: colors.background }}
      >
        <Text style={{ color: colors.textSecondary }}>Loading insights...</Text>
      </View>
    );
  }

  return (
    <ScrollView 
      className="flex-1"
      style={{ backgroundColor: colors.background }}
    >
      <View className="px-6 pt-12 pb-6">
        {/* Header */}
        <Text 
          className="text-2xl font-bold mb-2"
          style={{ color: colors.text }}
        >
          Your Insights
        </Text>
        <Text 
          className="text-base mb-6"
          style={{ color: colors.textSecondary }}
        >
          Track your savings and health progress
        </Text>

        {/* Stats Cards */}
        <StatCard
          title="Total Savings"
          value={`$${insights?.totalSavings.toFixed(2)}`}
          subtitle="This month"
          icon="wallet-outline"
          color="#10b981"
        />

        <StatCard
          title="Calories Saved"
          value={insights?.caloriesSaved.toLocaleString()}
          subtitle="Through healthy choices"
          icon="fitness-outline"
          color="#f59e0b"
        />

        <StatCard
          title="Health Score"
          value={`${insights?.healthScore}/10`}
          subtitle="Keep up the good work!"
          icon="heart-outline"
          color="#ef4444"
        />

        {/* Chart Section */}
        <View 
          className="rounded-lg p-4 mt-4"
          style={{ backgroundColor: colors.card }}
        >
          <Text 
            className="text-lg font-bold mb-2"
            style={{ color: colors.text }}
          >
            Health Score Progress
          </Text>
          <Text 
            className="text-sm mb-4"
            style={{ color: colors.textSecondary }}
          >
            Your healthy eating trend over time
          </Text>
          
          {insights?.monthlyData && (
            <SimpleBarChart data={insights.monthlyData} />
          )}
        </View>

        {/* Summary */}
        <View 
          className="rounded-lg p-4 mt-4"
          style={{ backgroundColor: colors.card }}
        >
          <Text 
            className="text-lg font-bold mb-2"
            style={{ color: colors.text }}
          >
            Summary
          </Text>
          <Text 
            className="text-sm leading-5"
            style={{ color: colors.textSecondary }}
          >
            You&apos;ve saved ${insights?.totalSavings.toFixed(2)} this month by making smart shopping choices. 
            Your health score of {insights?.healthScore}/10 shows you&apos;re making great progress towards 
            healthier eating habits. Keep it up!
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}