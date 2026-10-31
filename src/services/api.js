// API Service connecting React frontend to Python FastAPI + Motor + MongoDB

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fintech-backend-665x.onrender.com/api';

/**
 * Fetch backend health and database status
 */
export async function getBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/health`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend health check failed:", err.message);
    return null;
  }
}

/**
 * User Authentication: Login
 */
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed');
  }

  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem('aether_token', data.access_token);
    localStorage.setItem('aether_user', JSON.stringify(data.user));
  }
  return data;
}

/**
 * User Authentication: Register
 */
export async function registerUser({ email, password, name, handle, role }) {
  const res = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, name, handle, role }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Registration failed');
  }

  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem('aether_token', data.access_token);
    localStorage.setItem('aether_user', JSON.stringify(data.user));
  }
  return data;
}

/**
 * Get current authenticated user profile
 */
export async function getCurrentUser() {
  const token = localStorage.getItem('aether_token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) {
      if (res.status === 401) {
        localStorage.removeItem('aether_token');
        localStorage.removeItem('aether_user');
      }
      return null;
    }

    return await res.json();
  } catch (err) {
    console.warn("Error fetching current user:", err.message);
    return null;
  }
}

/**
 * Fetch transactions from FastAPI + MongoDB
 */
export async function fetchTransactions(type = 'ALL', search = '') {
  try {
    const params = new URLSearchParams();
    if (type && type !== 'ALL') params.append('type', type);
    if (search) params.append('search', search);

    const url = `${API_BASE_URL}/transactions?${params.toString()}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const data = await res.json();
    return data.transactions || [];
  } catch (err) {
    console.warn("Error fetching transactions from FastAPI:", err.message);
    throw err;
  }
}

/**
 * Create and record a new transaction in MongoDB
 */
export async function createTransaction(txData) {
  const token = localStorage.getItem('aether_token');
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers,
    body: JSON.stringify(txData),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create transaction');
  }

  return await res.json();
}

/**
 * Fetch dashboard balance summary
 */
export async function fetchDashboardSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/transactions/summary`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Error fetching summary:", err.message);
    return null;
  }
}
