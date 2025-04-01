<template>
  <v-app>
    <AppHeader
      :show-sidebar="true"
      @toggle-sidebar="drawer = !drawer"
    />
      
    <AppSidebar
      v-model="drawer"
      @filter-change="handleFilterChange"
    />
      
    <v-main>
      <router-view :filters="filters" />
    </v-main>
      
    <AppFooter />
  </v-app>
</template>
  
  <script setup lang="ts">
  import { ref } from 'vue'
  import AppHeader from '@/components/AppHeader.vue'
  import AppFooter from '@/components/AppFooter.vue'
  import AppSidebar from '@/components/AppSidebar.vue'
  
  // Sidebar state
  const drawer = ref(true)
  
  // Filters state
  const filters = ref({
    type: null,
    year: null
  })
  
  // Handle filter changes from sidebar
  const handleFilterChange = (newFilters: { type: null, year: null }) => {
    filters.value = newFilters
  }
  </script>
  