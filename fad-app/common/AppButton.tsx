import { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  ViewStyle,
} from 'react-native';

type AppButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost';

type AppButtonProps = {
  title: string;
  onPress?: () => void;
  loading?: boolean;
  disabled?: boolean;
  variant?: AppButtonVariant;
  icon?: ReactNode;
  style?: ViewStyle;
};

export default function AppButton({
  title,
  onPress,
  loading = false,
  disabled = false,
  variant = 'primary',
  icon,
  style,
}: AppButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        styles[variant],
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
        style,
      ]}
    >
      {loading ? (
<ActivityIndicator color={variant === 'secondary' || variant === 'ghost' ? '#60a5fa' : '#ffffff'} />      ) : (
        <>
          {icon}
          <Text
            style={[
              styles.text,
              (variant === 'secondary' || variant === 'ghost') && styles.textSecondary,
              variant === 'danger' && styles.textDanger,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minHeight: 52,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  primary: {
    backgroundColor: '#2563eb',
  },
secondary: {
  borderWidth: 1,
  borderColor: 'rgba(96, 165, 250, 0.45)',
  backgroundColor: 'rgba(37, 99, 235, 0.16)',
},
  danger: {
    backgroundColor: '#dc2626',
  },
  ghost: {
    backgroundColor: 'transparent',
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
    color: '#ffffff',
  },
  textSecondary: {
    color: '#60a5fa',
  },
  textDanger: {
    color: '#ffffff',
  },
});