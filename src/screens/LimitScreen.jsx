import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useAuth } from '../context/AuthContext';
import { createLimit, deleteLimit, getLimit, updateLimit } from '../services/api';
import MonthYearPicker, { formatMonthLabel, getCurrentYearMonth, isPastMonth } from '../components/MonthYearPicker';

function formatCurrency(value) {
  const num = Number(value);
  if (isNaN(num)) return 'R$0';
  const parts = num.toFixed(2).split('.');
  const intPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  const decPart = parts[1] === '00' ? '' : `,${parts[1]}`;
  return `R$${intPart}${decPart}`;
}

export default function LimitScreen() {
  const { session } = useAuth();
  const token = session?.token;

  const [value, setValue] = useState('');
  const [month, setMonth] = useState(getCurrentYearMonth());
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [queryMonth, setQueryMonth] = useState('');
  const [limit, setLimit] = useState(null);
  const [queryLoading, setQueryLoading] = useState(false);
  const queryMonthLocked = queryMonth && isPastMonth(queryMonth);

  async function loadLimit(m) {
    if (!m) return;
    setQueryLoading(true);
    setLimit(null);
    try {
      const data = await getLimit(m, token);
      setLimit(data ?? null);
    } catch (_error) {
      setLimit(null);
    } finally {
      setQueryLoading(false);
    }
  }

  function handleQueryMonthChange(m) {
    setQueryMonth(m);
    loadLimit(m);
  }

  async function handleSave() {
    setError('');
    setSuccess('');

    const numValue = Number(value.replace(',', '.'));
    if (!value.trim() || isNaN(numValue) || numValue <= 0) {
      setError('O valor deve ser um número positivo.');
      return;
    }

    if (isPastMonth(month)) {
      setError('NÃ£o Ã© permitido cadastrar ou editar limites de meses anteriores.');
      return;
    }

    setLoading(true);
    try {
      const payload = { value: numValue, referenceMonth: month };

      if (editingId) {
        await updateLimit(editingId, payload, token);
        setSuccess('Limite atualizado!');
        clearEdit();
      } else {
        await createLimit(payload, token);
        setSuccess('Limite cadastrado!');
        clearForm();
      }

      if (queryMonth) {
        await loadLimit(queryMonth);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }

  function clearForm() {
    setValue('');
    setMonth(getCurrentYearMonth());
  }

  function clearEdit() {
    setEditingId(null);
    clearForm();
  }

  function handleEdit() {
    if (!limit) return;
    setEditingId(limit.id);
    setValue(String(limit.value));
    setMonth(limit.referenceMonth);
    setError('');
    setSuccess('');
  }

  function handleDelete() {
    if (!limit) return;
    const execute = async () => {
      try {
        await deleteLimit(limit.id, token);
        setSuccess('Limite excluído.');
        setError('');
        setLimit(null);
      } catch (e) {
        setError(e.message);
      }
    };
    Alert.alert('Excluir limite', 'Deseja excluir este limite mensal?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: execute },
    ]);
  }

  const isLimitLocked = queryMonthLocked || (limit ? isPastMonth(limit.referenceMonth) : false);

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <Text style={styles.title}>Limite</Text>

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

          <Text style={styles.sectionTitle}>Consulta</Text>

          <MonthYearPicker
            value={queryMonth}
            onChange={handleQueryMonthChange}
            placeholder="Selecione um mês"
          />

          {queryLoading ? (
            <ActivityIndicator color="#4DB657" style={styles.loader} />
          ) : queryMonth && !limit ? (
            <Text style={styles.emptyText}>Nenhum limite encontrado.</Text>
          ) : limit ? (
            <View>
              <View style={styles.limitRow}>
                <Text style={styles.limitMonth}>{formatMonthLabel(limit.referenceMonth)}</Text>
                <Text style={styles.limitValue}>{formatCurrency(limit.value)}</Text>
              </View>
              {!isLimitLocked && (
                <View style={styles.limitActions}>
                  <TouchableOpacity style={styles.editButton} onPress={handleEdit}>
                    <Text style={styles.editButtonText}>EDITAR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
                    <Text style={styles.deleteButtonText}>EXCLUIR</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          ) : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

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
  limitRow: {
    backgroundColor: '#4DB657',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginTop: 12,
  },
  limitMonth: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  limitValue: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  limitActions: {
    flexDirection: 'row',
    marginTop: 12,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#4DB657',
    borderRadius: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },
  editButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
  deleteButton: {
    flex: 1,
    backgroundColor: '#4DB657',
    borderRadius: 8,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  deleteButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
