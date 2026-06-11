import { useState } from 'react';

import { Card } from '../components/auth/Card';
import { Field } from '../components/auth/Field';
import { Feedback } from '../components/auth/Feedback';
import { useAuth } from '../context/AuthContext';

function isValidEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

export default function LoginScreen({ onGoToRegister }) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const nextErrors = {
      email: !email.trim()
        ? 'Informe seu e-mail.'
        : !isValidEmail(email.trim())
          ? 'Informe um e-mail válido.'
          : '',
      password: password.trim().length >= 6 ? '' : 'A senha precisa ter pelo menos 6 caracteres.',
    };

    setFieldErrors(nextErrors);
    setErrorMessage('');
    setSuccessMessage('');

    if (nextErrors.email || nextErrors.password) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn({ email: email.trim(), password });
      setSuccessMessage('Login realizado com sucesso.');
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Não foi possível entrar.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      title="ENTRAR"
      subtitle=""
      primaryLabel={isSubmitting ? 'Entrando...' : 'Entrar'}
      onPrimaryPress={handleSubmit}
      primaryDisabled={isSubmitting}
      footerText="Não possui uma conta?"
      footerActionLabel="Criar aqui"
      onFooterAction={onGoToRegister}>
      <Feedback type="success" message={successMessage} />
      <Feedback type="error" message={errorMessage} />

      <Field
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@exemplo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        error={fieldErrors.email}
      />

      <Field
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Sua senha"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="password"
        error={fieldErrors.password}
      />
    </Card>
  );
}
