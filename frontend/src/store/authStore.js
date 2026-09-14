import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const STORAGE_KEY = 'bloodconnect-auth';

const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      loading: true,
      initialized: false,
      initializing: false,

      setAuth: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: Boolean(token),
          loading: false,
          initialized: true,
          initializing: false,
        });
      },

      login: async (credentials) => {
        const { login } = await import('../services/authService');
        const { data } = await login(credentials);
        get().setAuth(data.user, data.token);
        return data;
      },

      register: async (payload) => {
        const { register } = await import('../services/authService');
        const { data } = await register(payload);
        get().setAuth(data.user, data.token);
        return data;
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          loading: false,
          initialized: true,
          initializing: false,
        });
      },

      initializeAuth: async () => {
        if (get().initialized || get().initializing) return;

        set({ initializing: true });

        const token = get().token;
        if (!token) {
          set({ loading: false, initialized: true, initializing: false });
          return;
        }

        try {
          const { getMe } = await import('../services/authService');
          const { data } = await getMe();
          set({ user: data.user, token, isAuthenticated: true, loading: false, initialized: true, initializing: false });
        } catch {
          set({ user: null, token: null, isAuthenticated: false, loading: false, initialized: true, initializing: false });
        }
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

export default useAuthStore;
