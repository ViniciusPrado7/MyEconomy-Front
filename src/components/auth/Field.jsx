import { StyleSheet, Text, TextInput, View } from 'react-native';

export function Field({ label, error, style, ...props }) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        placeholderTextColor="#A0A0A0"
        style={[styles.input, error ? styles.inputError : null, style]}
        {...props}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderWidth: 1,
    borderColor: '#B9B9B9',
    borderRadius: 8,
    paddingHorizontal: 14,
    color: '#111111',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#D9534F',
  },
  error: {
    color: '#D9534F',
    fontSize: 12,
    marginTop: 4,
  },
});
