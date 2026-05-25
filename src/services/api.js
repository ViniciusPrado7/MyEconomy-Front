import { Platform } from 'react-native';

// Troque para o IP da sua maquina se testar em celular fisico, por exemplo:
// http://192.168.0.10:8080/api
export const API_BASE_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8080/api' : 'http://localhost:8080/api';

async function request(path, init) {
  let response;

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(init.headers ?? {}),
      },
      ...init,
    });
  } catch (error) {
    throw new Error(
      'Nao foi possivel conectar com o backend. Se estiver no navegador, verifique o CORS do Spring Boot.'
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data?.message ?? data?.error ?? 'Nao foi possivel concluir a requisicao agora.';
    throw new Error(message);
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
