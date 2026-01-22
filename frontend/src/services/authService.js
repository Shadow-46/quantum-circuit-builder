const API_BASE_URL = 'http://localhost:8000/api';

class AuthService {
  constructor() {
    this.accessToken = localStorage.getItem('access_token');
    this.refreshToken = localStorage.getItem('refresh_token');
  }

  async register(email, username, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Registration failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async login(email, password) {
    try {
      const formData = new FormData();
      formData.append('username', email); // OAuth2 uses 'username' field
      formData.append('password', password);

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Login failed');
      }

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  async logout() {
    this.clearTokens();
  }

  async getCurrentUser() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Try to refresh token
          await this.refreshAccessToken();
          return this.getCurrentUser(); // Retry with new token
        }
        throw new Error('Failed to get user profile');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async updateProfile(updates) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.accessToken}`,
        },
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.detail || 'Profile update failed');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async refreshAccessToken() {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh_token: this.refreshToken }),
      });

      if (!response.ok) {
        this.clearTokens();
        throw new Error('Session expired. Please login again.');
      }

      const data = await response.json();
      this.setTokens(data.access_token, data.refresh_token);
      return data;
    } catch (error) {
      throw error;
    }
  }

  setTokens(accessToken, refreshToken) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
    localStorage.setItem('access_token', accessToken);
    localStorage.setItem('refresh_token', refreshToken);
  }

  clearTokens() {
    this.accessToken = null;
    this.refreshToken = null;
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  }

  isAuthenticated() {
    return !!this.accessToken;
  }

  getAuthHeader() {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
    };
  }
}

export const authService = new AuthService();
