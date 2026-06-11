import { Platform } from 'react-native';

// Troque para o IP da sua maquina se testar em celular fisico, por exemplo:
// http://192.168.0.10:8080/api
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';

async function request(path, init = {}) {
  const { headers: extraHeaders, ...restInit } = init;
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(extraHeaders ?? {}),
      },
      ...restInit,
    });
  } catch (_error) {
    throw new Error(
      'Nao foi possivel conectar com o backend. Se estiver no navegador, verifique o CORS do Spring Boot.'
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ?? data?.error ?? 'Nao foi possivel concluir a requisicao agora.';
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

export function registerRequest(payload) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export function loginRequest(payload) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}


export function getExpenses(month, token) {
  return request(`/expenses?month=${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createExpense(payload, token) {
  return request('/expenses', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateExpense(id, payload, token) {
  return request(`/expenses/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteExpense(id, token) {
  return request(`/expenses/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}


export function getLimit(month, token) {
  return request(`/limits?month=${month}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function createLimit(payload, token) {
  return request('/limits', {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function updateLimit(id, payload, token) {
  return request(`/limits/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: { Authorization: `Bearer ${token}` },
  });
}

export function deleteLimit(id, token) {
  return request(`/limits/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });
}
