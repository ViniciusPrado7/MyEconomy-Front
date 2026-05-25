import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const STORAGE_KEY = 'myeconomy.session';
const BIRTH_DATE_KEY = 'myeconomy.birthDates';

export async function saveStoredSession(session) {
  const value = JSON.stringify(session);

  if (Platform.OS === 'web') {
    localStorage.setItem(STORAGE_KEY, value);
    return;
  }

  await SecureStore.setItemAsync(STORAGE_KEY, value);
}

export async function getStoredSession() {
  const value =
    Platform.OS === 'web'
      ? localStorage.getItem(STORAGE_KEY)
      : await SecureStore.getItemAsync(STORAGE_KEY);

  return value ? JSON.parse(value) : null;
}

export async function clearStoredSession() {
  if (Platform.OS === 'web') {
    localStorage.removeItem(STORAGE_KEY);
    return;
  }

  await SecureStore.deleteItemAsync(STORAGE_KEY);
}

export async function saveBirthDate(email, birthDate) {
  const currentBirthDates = await getBirthDatesMap();
  const nextBirthDates = {
    ...currentBirthDates,
    [email]: birthDate,
  };

  await setBirthDatesMap(nextBirthDates);
}

export async function getBirthDate(email) {
  const currentBirthDates = await getBirthDatesMap();
  return currentBirthDates[email] || '';
}

async function getBirthDatesMap() {
  const value =
    Platform.OS === 'web'
      ? localStorage.getItem(BIRTH_DATE_KEY)
      : await SecureStore.getItemAsync(BIRTH_DATE_KEY);

  return value ? JSON.parse(value) : {};
}

async function setBirthDatesMap(value) {
  const serializedValue = JSON.stringify(value);

  if (Platform.OS === 'web') {
    localStorage.setItem(BIRTH_DATE_KEY, serializedValue);
    return;
  }

  await SecureStore.setItemAsync(BIRTH_DATE_KEY, serializedValue);
}
