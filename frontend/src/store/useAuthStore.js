import { create } from 'zustand';
import { api } from '../api';

export const useAuthStore = create((set, get) => ({
  user: (() => {
    try {
      const saved = localStorage.getItem('fixnear_logged_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  })(),

  allUsers: [],
  loading: false,
  error: null,

  fetchUsers: async () => {
    set({ loading: true });
    try {
      const res = await api.auth.getUsers();
      if (res.success) {
        set({ allUsers: res.users, loading: false });
      }
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  loginByEmail: async (email, password = 'password123') => {
    set({ loading: true, error: null });
    try {
      const res = await api.auth.login(email, password);
      if (res.success) {
        set({ user: res.user, loading: false });
        localStorage.setItem('fixnear_logged_user', JSON.stringify(res.user));
        if (res.token) {
          localStorage.setItem('fixnear_auth_token', res.token);
        }
        return { success: true, user: res.user, token: res.token };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  register: async (userData) => {
    set({ loading: true, error: null });
    try {
      const res = await api.auth.register(userData);
      if (res.success) {
        set({ user: res.user, loading: false });
        localStorage.setItem('fixnear_logged_user', JSON.stringify(res.user));
        if (res.token) {
          localStorage.setItem('fixnear_auth_token', res.token);
        }
        return { success: true, user: res.user, token: res.token };
      }
    } catch (err) {
      set({ error: err.message, loading: false });
      return { success: false, error: err.message };
    }
  },

  switchUser: (userId) => {
    const found = get().allUsers.find(u => u.id === Number(userId));
    if (found) {
      set({ user: found });
      localStorage.setItem('fixnear_logged_user', JSON.stringify(found));
    }
  },

  logout: () => {
    set({ user: null });
    localStorage.removeItem('fixnear_logged_user');
    localStorage.removeItem('fixnear_auth_token');
  }
}));
