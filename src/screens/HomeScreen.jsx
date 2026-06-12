import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';

function formatBirthDate(value) {
  if (!value) {
    return '-';
  }

  const [year, month, day] = value.split('-');

  if (!year || !month || !day) {
    return value;
  }

  return `${day}/${month}/${year}`;
}

export default function HomeScreen() {
  const { session, signOut } = useAuth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.title}>Meus Dados</Text>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Nome</Text>
            <Text style={styles.value}>{session ? session.name : '-'}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>E-mail</Text>
            <Text style={styles.value}>{session ? session.email : '-'}</Text>
          </View>

          <View style={styles.infoBlock}>
            <Text style={styles.label}>Data de nascimento</Text>
            <Text style={styles.value}>{formatBirthDate(session ? session.birthDate : '')}</Text>
          </View>

          <TouchableOpacity style={styles.button} onPress={signOut}>
            <Text style={styles.buttonText}>SAIR</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  content: {
    width: '60%',
    maxWidth: 280,
    minWidth: 228,
    marginTop: 142,
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#111111',
    marginBottom: 34,
    textAlign: 'center',
  },
  infoBlock: {
    marginBottom: 22,
  },
  label: {
    color: '#111111',
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 8,
  },
  value: {
    color: '#222222',
    fontSize: 16,
  },
  button: {
    marginTop: 8,
    backgroundColor: '#4DB657',
    borderRadius: 10,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '400',
  },
});
