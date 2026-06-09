import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

const MONTHS_SHORT = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
];

export function getCurrentYearMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

export function isPastMonth(yearMonth) {
  return yearMonth < getCurrentYearMonth();
}

export function formatMonthLabel(yearMonth) {
  const [year, month] = yearMonth.split('-');
  return `${MONTH_NAMES[parseInt(month, 10) - 1]}/${year}`;
}

function yearMonthToDate(yearMonth) {
  const [year, month] = yearMonth.split('-').map(Number);
  return new Date(year, month - 1, 1);
}

export default function MonthYearPicker({ value, onChange, placeholder = 'Selecione um mês' }) {
  const [open, setOpen] = useState(false);
  const [pickerYear, setPickerYear] = useState(
    value ? parseInt(value.split('-')[0], 10) : new Date().getFullYear()
  );

  function handleOpen() {
    const base = value ? yearMonthToDate(value) : new Date();
    setPickerYear(base.getFullYear());
    setOpen(true);
  }

  function handleMonthSelect(monthIndex) {
    const month = String(monthIndex + 1).padStart(2, '0');
    onChange(`${pickerYear}-${month}`);
    setOpen(false);
  }

  function renderMonthYearPicker() {
    const selectedYear = value ? parseInt(value.split('-')[0], 10) : null;
    const selectedMonth = value ? parseInt(value.split('-')[1], 10) : null;

    return (
      <TouchableOpacity style={styles.sheet} activeOpacity={1} onPress={() => {}}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Selecione o mês</Text>
        </View>

        <View style={styles.yearRow}>
          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => setPickerYear((year) => year - 1)}
            activeOpacity={0.7}>
            <Ionicons name="chevron-back" size={24} color="#333333" />
          </TouchableOpacity>

          <Text style={styles.yearText}>{pickerYear}</Text>

          <TouchableOpacity
            style={styles.arrowBtn}
            onPress={() => setPickerYear((year) => year + 1)}
            activeOpacity={0.7}>
            <Ionicons name="chevron-forward" size={24} color="#333333" />
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {MONTHS_SHORT.map((monthName, index) => {
            const isSelected =
              selectedYear === pickerYear && selectedMonth === index + 1;

            return (
              <TouchableOpacity
                key={monthName}
                style={[styles.cell, isSelected && styles.cellActive]}
                onPress={() => handleMonthSelect(index)}
                activeOpacity={0.7}>
                <Text style={[styles.cellText, isSelected && styles.cellTextActive]}>
                  {monthName}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <>
      <TouchableOpacity style={styles.button} onPress={handleOpen} activeOpacity={0.7}>
        <Text style={[styles.buttonText, !value && styles.placeholder]}>
          {value ? formatMonthLabel(value) : placeholder}
        </Text>
        <Ionicons name="calendar-outline" size={18} color="#555555" />
      </TouchableOpacity>

      <Modal visible={open} transparent animationType="fade" onRequestClose={() => setOpen(false)}>
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={() => setOpen(false)}>
          {renderMonthYearPicker()}
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#CCCCCC',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
  },
  buttonText: {
    fontSize: 15,
    color: '#111111',
  },
  placeholder: {
    color: '#A0A0A0',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    width: 300,
    overflow: 'hidden',
  },
  header: {
    backgroundColor: '#4DB657',
    paddingVertical: 16,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  arrowBtn: {
    padding: 6,
  },
  yearText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333333',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 12,
    paddingBottom: 16,
    gap: 8,
  },
  cell: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
  },
  cellActive: {
    backgroundColor: '#4DB657',
  },
  cellText: {
    fontSize: 14,
    color: '#333333',
    fontWeight: '600',
  },
  cellTextActive: {
    color: '#FFFFFF',
  },
});
