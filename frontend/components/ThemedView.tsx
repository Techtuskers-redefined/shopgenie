import { View, type ViewProps } from 'react-native';
import { useTheme } from '../hooks/useTheme';

export type ThemedViewProps = ViewProps & {
  lightColor?: string;
  darkColor?: string;
};

export function ThemedView({ style, lightColor, darkColor, ...otherProps }: ThemedViewProps) {
  const { colors, isDark } = useTheme();
  const backgroundColor = isDark ? darkColor : lightColor;

  return <View style={[{ backgroundColor: backgroundColor ?? colors.background }, style]} {...otherProps} />;
}