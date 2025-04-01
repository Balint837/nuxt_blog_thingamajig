<template>
  <v-container class="fill-height" fluid>
    <v-row align="center" justify="center">
      <v-col cols="12" sm="8" md="4">
        <v-card class="pa-6">
          <v-card-title class="text-h5 font-weight-bold text-center">
            Login
          </v-card-title>

          <v-card-text>
            <v-form @submit.prevent="login">
              <v-text-field
                v-model="username"
                label="Username"
                required
                :error-messages="errors.username"
              />

              <v-text-field
                v-model="password"
                label="Password"
                type="password"
                required
                :error-messages="errors.password"
              />

              <v-alert v-if="errorMessage" type="error" dense>
                {{ errorMessage }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                block
                class="mt-4"
                :loading="loading"
              >
                Login
              </v-btn>
            </v-form>
          </v-card-text>
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
const router = useRouter();
const username = ref("");
const password = ref("");
const loading = ref(false);
const errorMessage = ref("");
const errors = ref<{ username?: string; password?: string }>({});

const login = async () => {
  errors.value = {};
  errorMessage.value = "";

  if (!username.value) errors.value.username = "Username is required";
  if (!password.value) errors.value.password = "Password is required";
  if (Object.keys(errors.value).length > 0) return;

  loading.value = true;
  try {
    await authStore.login({
      name: username.value,
      password: password.value,
    });
    router.push("/");
  } catch (error) {
    errorMessage.value =
      (error as Error).message || "Invalid login credentials";
  } finally {
    loading.value = false;
  }
};
onMounted(() => {
  if (authStore.isAuthenticated) router.push("/");
});
</script>

<style scoped>
.v-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
