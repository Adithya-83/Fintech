// API Service connecting React frontend to Python FastAPI + Motor + MongoDB

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://fintech-backend-665x.onrender.com';

/**
 * Helper to get authorization headers with Bearer token from localStorage
 */
export function getAuthHeaders() {
  const token = localStorage.getItem('aether_token');
  const headers = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Check if user currently has a stored token
 */
export function isAuthenticated() {
  return !!localStorage.getItem('aether_token');
}

/**
 * Log out user by clearing credentials
 */
export function logoutUser() {
  localStorage.removeItem('aether_token');
  localStorage.removeItem('aether_user');
}

/**
 * Fetch backend health and database status
 */
export async function getBackendHealth() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/health`);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Backend health check failed:", err.message);
    return null;
  }
}

/**
 * User Authentication: Login (/login endpoint)
 */
export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Login failed. Please check your credentials.');
  }

  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem('aether_token', data.access_token);
    localStorage.setItem('aether_user', JSON.stringify(data.user));
  }
  return data;
}

/**
 * User Authentication: Signup (/signup endpoint)
 */
export async function signupUser({ email, password, name, handle, role }) {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ 
      email, 
      password, 
      name, 
      handle: handle || `@${email.split('@')[0]}`, 
      role: role || 'Lead Quant Trader' 
    }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Signup failed. Please try again.');
  }

  const data = await res.json();
  if (data.access_token) {
    localStorage.setItem('aether_token', data.access_token);
    localStorage.setItem('aether_user', JSON.stringify(data.user));
  }
  return data;
}

// Backward-compatibility alias
export const registerUser = signupUser;

/**
 * Get current authenticated user profile
 */
export async function getCurrentUser() {
  const token = localStorage.getItem('aether_token');
  if (!token) return null;

  try {
    const res = await fetch(`${API_BASE_URL}/api/me`, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        logoutUser();
      }
      return null;
    }

    const userData = await res.json();
    localStorage.setItem('aether_user', JSON.stringify(userData));
    return userData;
  } catch (err) {
    console.warn("Error fetching current user:", err.message);
    return null;
  }
}

/**
 * Fetch transactions from FastAPI + MongoDB (Protected with Bearer Token)
 */
export async function fetchTransactions(type = 'ALL', search = '') {
  try {
    const params = new URLSearchParams();
    if (type && type !== 'ALL') params.append('type', type);
    if (search) params.append('search', search);

    const query = params.toString() ? `?${params.toString()}` : '';
    const url = `${API_BASE_URL}/transactions${query}`;

    const res = await fetch(url, {
      headers: getAuthHeaders(),
    });

    if (!res.ok) {
      if (res.status === 401) {
        logoutUser();
        window.dispatchEvent(new Event('auth_required'));
        throw new Error("401 Unauthorized: Session expired or invalid token");
      }
      throw new Error(`HTTP error ${res.status}`);
    }

    const data = await res.json();
    return data.transactions || [];
  } catch (err) {
    console.warn("Error fetching transactions from FastAPI:", err.message);
    throw err;
  }
}

/**
 * Create and record a new transaction in MongoDB (Protected with Bearer Token)
 */
export async function createTransaction(txData) {
  const res = await fetch(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(txData),
  });

  if (!res.ok) {
    if (res.status === 401) {
      logoutUser();
      window.dispatchEvent(new Event('auth_required'));
      throw new Error("401 Unauthorized: Session expired or invalid token");
    }
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData.detail || 'Failed to create transaction');
  }

  return await res.json();
}

/**
 * Fetch dashboard balance summary (Protected with Bearer Token)
 */
export async function fetchDashboardSummary() {
  try {
    const res = await fetch(`${API_BASE_URL}/api/transactions/summary`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn("Error fetching summary:", err.message);
    return null;
  }
}
