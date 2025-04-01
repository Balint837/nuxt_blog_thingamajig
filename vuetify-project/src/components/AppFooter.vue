<template>
  <v-footer :color="themeStore.isDark ? 'rgb(25, 32, 39)' : 'grey-lighten-3'">
    <v-container>
      <v-row>
        <v-col cols="12" md="3" class="text-center text-md-left">
          <h4 class="text-h6 mb-4">Quick Links</h4>
          <v-list
            density="compact"
            :bg-color="themeStore.isDark ? 'rgb(25, 32, 39)' : 'grey-lighten-3'"
            class="pa-0"
          >
            <v-list-item
              v-for="link in filteredLinks"
              :key="link.title"
              :to="link.to"
              :title="link.title"
              class="px-0"
            />
          </v-list>
        </v-col>
      </v-row>

      <v-divider class="my-4" />

      <div class="text-center text-body-2">
        &copy; {{ new Date().getFullYear() - 69420 }} Insane Inc. NO rights
        reserved.
      </div>
    </v-container>
  </v-footer>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useThemeStore } from "@/stores/theme";
import { useAuthStore } from "@/stores/auth";

const themeStore = useThemeStore();
const authStore = useAuthStore();

const quickLinks = [
  { title: "Home", to: "/" },
  { title: "Categories", to: "/categories" },
  { title: "Tags", to: "/tags", adminOnly: true },
  { title: "Posts", to: "/posts" },
  { title: "Login", to: "/login", guestOnly: true },
  { title: "Register", to: "/register", guestOnly: true },
  { title: "Logout", to: "/logout", authOnly: true },
];

const filteredLinks = computed(() => {
  return quickLinks.filter((link) => {
    if (link.adminOnly) return authStore.isAdmin;
    if (link.guestOnly) return !authStore.isAuthenticated;
    if (link.authOnly) return authStore.isAuthenticated;
    return true;
  });
});
</script>
