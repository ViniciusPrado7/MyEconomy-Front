import { createContext, useContext, useEffect, useState } from 'react';

import { loginRequest, registerRequest } from '../services/api';
import {
  clearStoredSession,
  getBirthDate,
  getStoredSession,
  saveBirthDate,
  saveStoredSession,
} from '../services/authStorage';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      const storedSession = await getStoredSession();
      setSession(storedSession);
      setIsLoading(false);
    }

    loadSession();
  }, []);

  async function signIn(payload) {
    const response = await loginRequest(payload);
    const storedBirthDate = await getBirthDate(response.email);
    const nextSession = storedBirthDate ? { ...response, birthDate: storedBirthDate } : response;
    setSession(nextSession);
    await saveStoredSession(nextSession);
  }

  async function signUp(payload) {
    await registerRequest(payload);
    await saveBirthDate(payload.email, payload.birthDate);
  }

  async function signOut() {
    setSession(null);
    await clearStoredSession();
  }

  return (
    <AuthContext.Provider value={{ session, isLoading, signIn, signUp, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth precisa estar dentro de AuthProvider.');
  }

  return context;
}
