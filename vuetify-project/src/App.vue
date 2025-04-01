<template>
  <v-app>
    <router-view />
  </v-app>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useThemeStore } from '@/stores/theme'
import { useAuthStore } from './stores/auth'

// Store access
const themeStore = useThemeStore()
const authStore = useAuthStore();
// Initialize theme on app load
onMounted(() => {
  // Get stored theme from localStorage or use default
  const storedTheme = localStorage.getItem('selectedTheme')
  if (storedTheme) {
    themeStore.isDark = storedTheme === 'dark'
  }
  // checks if the token is still valid,
  // and removes it if not.
  authStore.validate();
})
</script>
