// Utilities
import { defineStore } from 'pinia'
import { useTheme } from 'vuetify'
import { ref, watch } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const vuetifyTheme = useTheme()
  
  // Check if theme preference is stored in localStorage
  const storedTheme = localStorage.getItem('selectedTheme')
  const isDark = ref(storedTheme ? storedTheme === 'dark' : false)
  
  // Watch for changes in isDark and update the theme
  watch(isDark, (newVal) => {
    vuetifyTheme.global.name.value = newVal ? 'dark' : 'light'
    localStorage.setItem('selectedTheme', newVal ? 'dark' : 'light')
  }, { immediate: true })
  
  // Toggle the theme
  function toggleTheme() {
    isDark.value = !isDark.value
  }
  
  return {
    isDark,
    toggleTheme
  }
})
