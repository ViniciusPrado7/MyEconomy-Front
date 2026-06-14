import { Ionicons } from '@expo/vector-icons';
import React, { memo, useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { createExpense, deleteExpense, getExpenses, updateExpense } from '../services/api';
import MonthYearPicker, { getCurrentYearMonth, isPastMonth } from '../components/MonthYearPicker';

function formatCurrency(value) {
  const num = Number(value);
  if (isNaN(num)) return 'R$0';
  const parts = num.toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decPart = parts[1] === '00' ? '' : `,${parts[1]}`;
  return `R$${intPart}${decPart}`;
}

export default function ExpenseScreen() {
  const { session } = useAuth();
  const token = session?.token;

  const [description, setDescription] = useState('');
  const [value, setValue] = useState('');
  const [month, setMonth] = useState(getCurrentYearMonth());
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [queryMonth, setQueryMonth] = useState('');
  const [expenses, setExpenses] = useState([]);
  const [queryLoading, setQueryLoading] = useState(false);
  const queryMonthLocked = queryMonth && isPastMonth(queryMonth);

  const loadExpenses = useCallback(
    async (m) => {
      if (!m) return;
      setQueryLoading(true);
      try {
        const data = await getExpenses(m, token);
        setExpenses(Array.isArray(data) ? data : []);
      } catch {
        setExpenses([]);
      } finally {
        setQueryLoading(false);
      }
    },
    [token]
  );

  function handleQueryMonthChange(m) {
    setQueryMonth(m);
    loadExpenses(m);
  }

  async function handleSave() {
    setError('');
    setSuccess('');

    if (!description.trim()) {
      setError('A descrição é obrigatória.');
      return;
    }
    const numValue = Number(value.replace(',', '.'));
    if (!value.trim() || isNaN(numValue) || numValue <= 0) {
      setError('O valor deve ser um número positivo.');
      return;
    }

    if (isPastMonth(month)) {
      setError('NÃ£o Ã© permitido cadastrar ou editar despesas de meses anteriores.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        description: description.trim(),
        value: numValue,
        referenceMonth: month,
      };

      if (editingId) {
        await updateExpense(editingId, payload, token);
        setSuccess('Despesa atualizada!');
        clearEdit();
      } else {
        await createExpense(payload, token);
        setSuccess('Despesa cadastrada!');
        clearForm();
      }

      if (queryMonth) {
        await loadExpenses(queryMonth);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setDescription('');
    setValue('');
    setMonth(getCurrentYearMonth());
  }

  function clearEdit() {
    setEditingId(null);
    clearForm();
  }

  const handleEdit = useCallback((expense) => {
    setEditingId(expense.id);
    setDescription(expense.description);
    setValue(String(expense.value));
    setMonth(expense.referenceMonth);
    setError('');
    setSuccess('');
  }, []);

  const handleDelete = useCallback(
    (expense) => {
      const execute = async () => {
        try {
          await deleteExpense(expense.id, token);
          setSuccess('Despesa excluída.');
          setError('');
          loadExpenses(queryMonth);
        } catch (e) {
          setError(e.message);
        }
      };
      Alert.alert('Excluir despesa', `Deseja excluir "${expense.description}"?`, [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Excluir', style: 'destructive', onPress: execute },
      ]);
    },
    [queryMonth, token, loadExpenses]
  );

  const renderExpense = useCallback(
    ({ item }) => {
      const locked = queryMonthLocked || isPastMonth(item.referenceMonth);
      return (
        <ExpenseItem
          expense={item}
          locked={locked}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      );
    },
    [handleDelete, handleEdit, queryMonthLocked]
  );

  const renderHeader = () => (
    <>
      <Text style={styles.title}>Despesa</Text>

      <Text style={styles.label}>Descrição</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />

      <Text style={styles.label}>Valor</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={setValue}
        keyboardType="decimal-pad"
      />

      <Text style={styles.label}>Mês</Text>
      <MonthYearPicker value={month} onChange={setMonth} />

      {!!error && <Text style={styles.errorText}>{error}</Text>}
      {!!success && <Text style={styles.successText}>{success}</Text>}

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
        <Text style={styles.saveButtonText}>{loading ? 'SALVANDO...' : 'SALVAR'}</Text>
      </TouchableOpacity>

      {!!editingId && (
        <TouchableOpacity style={styles.cancelLink} onPress={clearEdit}>
          <Text style={styles.cancelLinkText}>Cancelar edição</Text>
        </TouchableOpacity>
      )}

      <Text style={styles.sectionTitle}>Histórico</Text>

      <MonthYearPicker
        value={queryMonth}
        onChange={handleQueryMonthChange}
        placeholder="Selecione um mês"
      />

      {queryLoading && <ActivityIndicator color="#4DB657" style={styles.loader} />}
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={expenses}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderExpense}
          ListHeaderComponent={renderHeader}
          ListEmptyComponent={
            !queryLoading && queryMonth !== '' ? (
              <Text style={styles.emptyText}>Nenhuma despesa encontrada.</Text>
            ) : null
          }
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const ExpenseItem = memo(function ExpenseItem({ expense, locked, onEdit, onDelete }) {
  return (
    <View style={styles.expenseRow}>
      <View style={styles.expenseLeft}>
        <Text style={styles.expenseName} numberOfLines={1}>
          {expense.description}
        </Text>
        <Text style={styles.expenseValue}>{formatCurrency(expense.value)}</Text>
      </View>
      {!locked && (
        <View style={styles.rowActions}>
          <TouchableOpacity style={styles.actionBtn} onPress={() => onEdit(expense)}>
            <Ionicons name="pencil" size={16} color="#FFFFFF" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, styles.actionBtnRight]}
            onPress={() => onDelete(expense)}>
            <Ionicons name="trash" size={16} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
});

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 24,
  },
  label: {
    color: '#111111',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 6,
    marginTop: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111111',
    backgroundColor: '#FFFFFF',
  },
  saveButton: {
    backgroundColor: '#4DB657',
    borderRadius: 10,
    minHeight: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  cancelLink: {
    alignItems: 'center',
    marginTop: 10,
  },
  cancelLinkText: {
    color: '#6B6B6B',
    fontSize: 14,
  },
  errorText: {
    color: '#D9534F',
    fontSize: 13,
    marginTop: 8,
  },
  successText: {
    color: '#2E7D32',
    fontSize: 13,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111111',
    textAlign: 'center',
    marginTop: 32,
    marginBottom: 12,
  },
  loader: {
    marginTop: 20,
  },
  emptyText: {
    color: '#6B6B6B',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
  },
  expenseRow: {
    backgroundColor: '#4DB657',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 8,
  },
  expenseLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  expenseName: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  expenseValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  rowActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  actionBtn: {
    backgroundColor: 'rgba(0,0,0,0.18)',
    borderRadius: 6,
    padding: 8,
  },
  actionBtnRight: {
    marginLeft: 6,
  },
});
