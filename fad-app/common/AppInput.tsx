import { TextInput, TextInputProps, StyleSheet, Text, View } from 'react-native';

type AppInputProps = TextInputProps & {
  label?: string;
  error?: string;
};

export default function AppInput({ label, error, style, ...props }: AppInputProps) {
  return (
    <View style={styles.wrapper}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <TextInput
        {...props}
        placeholderTextColor="#94a3b8"
        style={[styles.input, error && styles.inputError, style]}
      />

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: '#d1d5db',
  },
  input: {
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#6b7280',
    backgroundColor: '#ffffff',
    fontSize: 16,
    color: '#0f172a',
  },
  inputError: {
    borderColor: '#dc2626',
  },
  error: {
    fontSize: 13,
    color: '#fca5a5',
  },
});