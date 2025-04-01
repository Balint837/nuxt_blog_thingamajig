<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="6">
        <v-card class="pa-6">
          <h2 class="text-h5 font-weight-bold mb-4 text-center">Register</h2>
          <v-form @submit.prevent="register">
            <v-text-field v-model="username" label="Username" required />
            <v-text-field
              v-model="password"
              label="Password"
              type="password"
              required
            />
            <v-btn type="submit" color="primary" block :loading="loading">
              Register
            </v-btn>
          </v-form>
          <v-alert v-if="error" type="error" class="mt-4">{{ error }}</v-alert>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { useAuthStore } from "@/stores/auth";
import { ref } from "vue";
import { useRouter } from "vue-router";

const authStore = useAuthStore();
const username = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");
const router = useRouter();

const register = async () => {
  loading.value = true;
  error.value = "";
  try {
    await authStore.register({
      name: username.value,
      password: password.value,
    });
    router.push("/");
  } catch (e) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error.value = (e as any).response?.data?.message || "Registration failed";
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  if (authStore.isAuthenticated) router.push("/");
});
</script>
