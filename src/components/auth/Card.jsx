import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export function Card({
  title,
  subtitle,
  primaryLabel,
  primaryDisabled,
  onPrimaryPress,
  secondaryActionLabel,
  onSecondaryAction,
  footerText,
  footerActionLabel,
  onFooterAction,
  children,
}) {
  const { width } = useWindowDimensions();
  const cardWidth = width > 720 ? 460 : '100%';

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
          <View style={styles.wrapper}>
            <View style={[styles.card, { width: cardWidth }]}>
              <Text style={styles.title}>{title}</Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}

              <View style={styles.form}>{children}</View>

              <Pressable
                style={[styles.button, primaryDisabled && styles.buttonDisabled]}
                onPress={onPrimaryPress}
                disabled={primaryDisabled}>
                <Text style={styles.buttonText}>{primaryLabel}</Text>
              </Pressable>

              {secondaryActionLabel ? (
                <Pressable style={styles.secondaryAction} onPress={onSecondaryAction}>
                  <Text style={styles.secondaryActionText}>{secondaryActionLabel}</Text>
                </Pressable>
              ) : null}

              <View style={styles.footer}>
                <Text style={styles.footerText}>{footerText}</Text>
                <Pressable onPress={onFooterAction}>
                  <Text style={styles.footerAction}>{footerActionLabel}</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#FFFFFF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingHorizontal: 34,
    paddingTop: 48,
    paddingBottom: 32,
    minHeight: 620,
    borderWidth: 1,
    borderColor: '#E9E9E9',
  },
  title: {
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '900',
    color: '#111111',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#6B6B6B',
    textAlign: 'center',
    marginBottom: 20,
  },
  form: {
    gap: 14,
    marginTop: 10,
    marginBottom: 28,
  },
  button: {
    minHeight: 52,
    borderRadius: 10,
    backgroundColor: '#4DB657',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryAction: {
    alignItems: 'center',
    marginTop: 10,
  },
  secondaryActionText: {
    color: '#6B6B6B',
    fontSize: 12,
  },
  footer: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
  },
  footerText: {
    color: '#6B6B6B',
    fontSize: 13,
  },
  footerAction: {
    color: '#111111',
    fontSize: 13,
    fontWeight: '700',
  },
});
