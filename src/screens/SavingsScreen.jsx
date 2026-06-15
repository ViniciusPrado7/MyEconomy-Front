import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import MonthYearPicker, { getCurrentYearMonth } from '../components/MonthYearPicker';
import { useAuth } from '../context/AuthContext';
import { getExpenses, getLimit } from '../services/api';

const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
});

function formatCurrency(value) {
  return currencyFormatter.format(Number(value) || 0).replace(/\s/g, '');
}

function getFirstName(name) {
  return name?.trim().split(/\s+/)[0] || 'Usuário';
}

export default function SavingsScreen({ navigation }) {
  const { session } = useAuth();
  const token = session?.token;
  const [month, setMonth] = useState(getCurrentYearMonth());
  const [limit, setLimit] = useState(null);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadSavings = useCallback(
    async (selectedMonth, refresh = false) => {
      if (!token) {
        return;
      }

      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError('');

      const [limitResult, expensesResult] = await Promise.allSettled([
        getLimit(selectedMonth, token),
        getExpenses(selectedMonth, token),
      ]);

      if (limitResult.status === 'fulfilled') {
        setLimit(limitResult.value);
      } else if (limitResult.reason?.status === 404) {
        setLimit(null);
      } else {
        setLimit(null);
        setError(limitResult.reason?.message || 'Não foi possível carregar o progresso.');
      }

      if (expensesResult.status === 'fulfilled') {
        const total = expensesResult.value.reduce(
          (sum, expense) => sum + Number(expense.value || 0),
          0
        );
        setTotalExpenses(total);
      } else {
        setTotalExpenses(0);
        setError((current) =>
          current || expensesResult.reason?.message || 'Não foi possível carregar as despesas.'
        );
      }

      setLoading(false);
      setRefreshing(false);
    },
    [token]
  );

  useFocusEffect(
    useCallback(() => {
      loadSavings(month);
    }, [loadSavings, month])
  );

  function handleMonthChange(selectedMonth) {
    setMonth(selectedMonth);
  }

  const limitValue = Number(limit?.value || 0);
  const savings = limitValue - totalExpenses;
  const expenseRatio = limitValue > 0 ? totalExpenses / limitValue : 0;
  const progress = Math.min(expenseRatio, 1);
  const isOverLimit = expenseRatio > 1;
  const shouldEncourage = expenseRatio > 0.5 && !isOverLimit;
  const isClosedMonth = month < getCurrentYearMonth();

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => loadSavings(month, true)}
            colors={['#4DB657']}
            tintColor="#4DB657"
          />
        }>
        <View style={styles.header}>
          <Text style={styles.greeting}>Olá {getFirstName(session?.name)} 👋</Text>
          <Text style={styles.subtitle}>É bom te ver por aqui!</Text>
        </View>

        <MonthYearPicker value={month} onChange={handleMonthChange} />

        {loading ? (
          <View style={styles.loadingBox}>
            <ActivityIndicator size="large" color="#4DB657" />
          </View>
        ) : error ? (
          <View style={styles.feedbackCard}>
            <Text style={styles.emoji}>😕</Text>
            <Text style={styles.feedbackText}>{error}</Text>
            <TouchableOpacity style={styles.actionButton} onPress={() => loadSavings(month)}>
              <Text style={styles.actionButtonText}>TENTAR NOVAMENTE</Text>
            </TouchableOpacity>
          </View>
        ) : !limit ? (
          <>
            <View style={styles.feedbackCard}>
              <Text style={styles.emoji}>😴</Text>
              <Text style={styles.feedbackText}>
                {totalExpenses > 0
                  ? 'Você já cadastrou despesas, mas ainda não definiu um limite'
                  : 'Nenhum limite foi registrado para este mês'}
              </Text>
            </View>
            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressText}>Progresso</Text>
                <Text style={styles.progressText}>{formatCurrency(totalExpenses)}/sem limite</Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: totalExpenses > 0 ? '100%' : '0%' }]} />
              </View>
            </View>
            <TouchableOpacity
              style={styles.startButton}
              onPress={() => navigation.navigate('Limits')}>
              <Text style={styles.startButtonText}>COMEÇAR</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <View style={styles.feedbackCard}>
              <Text style={styles.emoji}>
                {isClosedMonth ? (isOverLimit ? '😓' : '🥳') : shouldEncourage ? '🙂' : isOverLimit ? '😓' : '🤩'}
              </Text>
              <Text style={styles.feedbackText}>
                {isClosedMonth
                  ? isOverLimit
                    ? 'Objetivo não atingido'
                    : 'Parabéns, você economizou'
                  : isOverLimit
                    ? 'Você ultrapassou o limite atual'
                    : 'Continue assim!'}
              </Text>
              {isClosedMonth && (
                <Text style={styles.savingsValue}>{formatCurrency(savings)}</Text>
              )}
            </View>

            <View style={styles.progressSection}>
              <View style={styles.progressLabels}>
                <Text style={styles.progressText}>Progresso</Text>
                <Text style={styles.progressText}>
                  {formatCurrency(totalExpenses)}/{formatCurrency(limitValue)}
                </Text>
              </View>
              <View style={styles.progressTrack}>
                <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    flexGrow: 1,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 36,
  },
  header: {
    marginBottom: 68,
  },
  greeting: {
    color: '#111111',
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: '#222222',
    fontSize: 17,
    marginTop: 5,
  },
  loadingBox: {
    minHeight: 260,
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackCard: {
    minHeight: 200,
    marginTop: 22,
    borderRadius: 12,
    paddingHorizontal: 18,
    paddingVertical: 24,
    backgroundColor: '#7BC783',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 12,
  },
  feedbackText: {
    color: '#111111',
    fontSize: 19,
    textAlign: 'center',
  },
  savingsValue: {
    color: '#050505',
    fontSize: 32,
    fontWeight: '800',
    marginTop: 4,
  },
  progressSection: {
    marginTop: 28,
  },
  progressLabels: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressText: {
    color: '#222222',
    fontSize: 14,
  },
  progressTrack: {
    height: 35,
    borderRadius: 12,
    backgroundColor: '#D9D9D9',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#4DBE5B',
  },
  startButton: {
    width: '80%',
    minHeight: 52,
    marginTop: 22,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#4DBE5B',
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  actionButton: {
    marginTop: 18,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: 8,
    backgroundColor: '#3F9447',
  },
  actionButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
