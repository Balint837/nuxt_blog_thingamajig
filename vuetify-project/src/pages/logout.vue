<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <h1 class="text-h4 font-weight-bold mb-4">Logging out...</h1>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth"; // Assuming you're using Pinia for store management

const router = useRouter();
const authStore = useAuthStore();

onMounted(async () => {
  if (!authStore.isAuthenticated) {
    router.push("/"); 
    return;
  }
  await authStore.logout();
  router.push("/");
});
</script>

<style scoped>
/* Add any styling you want for the logout page */
</style>
