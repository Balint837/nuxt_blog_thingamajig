/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App
 */

// Plugins
import { registerPlugins } from '@/plugins'

// Components
import App from './App.vue'

// Composables
import { createApp } from 'vue'

// Styles
import './styles/main.scss'

// Create Vue app
const app = createApp(App)

// Register plugins
registerPlugins(app)

// Mount the app
app.mount('#app')
