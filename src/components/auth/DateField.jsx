import DateTimePicker from '@react-native-community/datetimepicker';
import { useMemo, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

function formatDateValue(date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function DateField({ label, value, error, onChange }) {
  const [showPicker, setShowPicker] = useState(false);

  const selectedDate = useMemo(() => {
    if (!value) {
      return new Date(2000, 0, 1);
    }

    const parsedDate = new Date(`${value}T00:00:00`);
    return Number.isNaN(parsedDate.getTime()) ? new Date(2000, 0, 1) : parsedDate;
  }, [value]);

  function handleChange(event, nextDate) {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }

    if (event.type === 'dismissed' || !nextDate) {
      return;
    }

    onChange(formatDateValue(nextDate));
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        style={[styles.input, error ? styles.inputError : null]}
        onPress={() => setShowPicker(true)}>
        <Text style={[styles.value, !value && styles.placeholder]}>
          {value || '2000-05-10'}
        </Text>
      </Pressable>

      {showPicker ? (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          maximumDate={new Date()}
          onChange={handleChange}
        />
      ) : null}

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
    justifyContent: 'center',
    backgroundColor: '#FAFAFA',
  },
  inputError: {
    borderColor: '#D9534F',
  },
  value: {
    color: '#111111',
    fontSize: 14,
  },
  placeholder: {
    color: '#A0A0A0',
  },
  error: {
    color: '#D9534F',
    fontSize: 12,
    marginTop: 4,
  },
});
