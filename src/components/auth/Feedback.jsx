import { StyleSheet, Text, View } from 'react-native';

export function Feedback({ type, message }) {
  if (!message) {
    return null;
  }

  return (
    <View style={[styles.container, type === 'error' ? styles.errorBox : styles.successBox]}>
      <Text style={[styles.text, type === 'error' ? styles.errorText : styles.successText]}>
        {message}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorBox: {
    backgroundColor: '#FDECEC',
  },
  successBox: {
    backgroundColor: '#EAF8EC',
  },
  text: {
    fontSize: 13,
    lineHeight: 18,
  },
  errorText: {
    color: '#A63C38',
  },
  successText: {
    color: '#2E7D32',
  },
});
