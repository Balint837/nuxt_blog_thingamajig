import { defineStore } from 'pinia';
import type { AuthModel } from '@/models/auth';
import { AuthService } from '@/services/authService';

export const useAuthStore = defineStore({
  id: 'auth',
  state: () => ({
    token: AuthService.token,
    user: AuthService.getCurrentUser(),
  }),
  actions: {
    async login(authModel: AuthModel) {
      const response = await AuthService.login(authModel);
      this.token = response.jwt;
      this.user = AuthService.getCurrentUser();
    },
    async register(authModel: AuthModel) {
      const response = await AuthService.register(authModel);
      this.token = response.jwt;
      this.user = AuthService.getCurrentUser();
    },
    async logout() {
      await AuthService.logout();
      this.token = null;
      this.user = null;
    },
    async validate() {
      const isValid = await AuthService.validate();
      if (!isValid) {
        this.token = null;
        this.user = null;
      }
    },
  },
  getters: {
    isAuthenticated: (state) => !!state.token,
    isAdmin: (state) => state.user && state.user.role === 'admin',
  },
});
