/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Composables
import { createVuetify } from 'vuetify'

// Define our custom theme
export default createVuetify({
  theme: {
    defaultTheme: 'light',
    themes: {
      light: {
        dark: false,
        colors: {
          primary: '#f05a21',
          secondary: '#5A6A6F',
          accent: '#8c9eff',
          error: '#b71c1c',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#FFFFFF',
        }
      },
      dark: {
        dark: true,
        colors: {
          primary: '#f05a21',
          secondary: '#90A4AE',
          accent: '#8c9eff',
          error: '#FF5252',
          info: '#2196F3',
          success: '#4CAF50',
          warning: '#FB8C00',
          background: '#121212',
        }
      }
    }
  }
})
