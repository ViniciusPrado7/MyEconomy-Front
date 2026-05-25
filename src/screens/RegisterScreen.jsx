import { useState } from 'react';

import { Card } from '../components/auth/Card';
import { DateField } from '../components/auth/DateField';
import { Field } from '../components/auth/Field';
import { Feedback } from '../components/auth/Feedback';
import { useAuth } from '../context/AuthContext';

function isValidEmail(value) {
  return /\S+@\S+\.\S+/.test(value);
}

function isValidBirthDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const parsedDate = new Date(`${value}T00:00:00`);
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  if (Number.isNaN(parsedDate.getTime())) {
    return false;
  }

  return parsedDate < now;
}

export default function RegisterScreen({ onGoToLogin }) {
  const { signUp } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit() {
    const nextErrors = {
      name: name.trim() ? '' : 'Informe seu nome.',
      email: !email.trim()
        ? 'Informe seu email.'
        : !isValidEmail(email.trim())
          ? 'Informe um email valido.'
          : '',
      birthDate: !birthDate.trim()
        ? 'Informe sua data de nascimento.'
        : !isValidBirthDate(birthDate.trim())
          ? 'Use o formato YYYY-MM-DD com uma data anterior a hoje.'
          : '',
      password: password.trim().length >= 6 ? '' : 'A senha precisa ter pelo menos 6 caracteres.',
      confirmPassword: confirmPassword.trim() !== password.trim() ? 'As senhas precisam ser iguais.' : '',
    };

    setFieldErrors(nextErrors);
    setErrorMessage('');
    setSuccessMessage('');

    if (
      nextErrors.name ||
      nextErrors.email ||
      nextErrors.birthDate ||
      nextErrors.password ||
      nextErrors.confirmPassword
    ) {
      return;
    }

    try {
      setIsSubmitting(true);
      await signUp({
        name: name.trim(),
        email: email.trim(),
        birthDate: birthDate.trim(),
        password,
        confirmPassword,
      });
      setSuccessMessage('Cadastro realizado com sucesso.');
      setTimeout(() => {
        onGoToLogin();
      }, 1000);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Nao foi possivel criar a conta.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Card
      title="CRIAR"
      subtitle=""
      primaryLabel={isSubmitting ? 'Criando...' : 'Criar'}
      onPrimaryPress={handleSubmit}
      primaryDisabled={isSubmitting}
      secondaryActionLabel="Voltar"
      onSecondaryAction={onGoToLogin}
      footerText="Ja possui conta?"
      footerActionLabel="Entrar"
      onFooterAction={onGoToLogin}>
      <Feedback type="success" message={successMessage} />
      <Feedback type="error" message={errorMessage} />

      <Field
        label="Nome"
        value={name}
        onChangeText={setName}
        placeholder="Seu nome"
        error={fieldErrors.name}
      />

      <Field
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="voce@email.com"
        autoCapitalize="none"
        keyboardType="email-address"
        autoComplete="email"
        error={fieldErrors.email}
      />

      <DateField
        label="Data de nascimento"
        value={birthDate}
        onChange={setBirthDate}
        error={fieldErrors.birthDate}
      />

      <Field
        label="Senha"
        value={password}
        onChangeText={setPassword}
        placeholder="Minimo de 6 caracteres"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={fieldErrors.password}
      />

      <Field
        label="Confirmar senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="Repita sua senha"
        secureTextEntry
        autoCapitalize="none"
        autoComplete="new-password"
        error={fieldErrors.confirmPassword}
      />
    </Card>
  );
}
