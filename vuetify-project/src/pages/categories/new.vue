<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="8">
          <v-card class="pa-6">
            <h1 class="text-h4 font-weight-bold mb-4">Create New Category</h1>
  
            <v-text-field v-model="newCategory.name" label="Name" required />
            <v-textarea v-model="newCategory.description" label="Description" required />
  
            <v-btn color="success" class="mt-4" @click="createCategory">Create</v-btn>
            <v-btn color="secondary" class="mt-4 ml-2" @click="cancel">Cancel</v-btn>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from "vue";
  import { useRouter } from "vue-router";
  import { CategoryService } from "@/services/category";
  import { useAuthStore } from "@/stores/auth";
  import type { CategoryModel } from "@/models/category";
  
  const router = useRouter();
  const authStore = useAuthStore();
  
  const newCategory = ref<CategoryModel>({
    id: 0,
    name: "",
    description: "",
  });
  
  onMounted(() => {
    if (!authStore.isAdmin) {
      router.push("/login");
    }
  });
  
  const createCategory = async () => {
    if (!newCategory.value.name || !newCategory.value.description) return;
    await CategoryService.create(newCategory.value);
    router.push("/categories");
  };
  
  const cancel = () => {
    router.push("/categories");
  };
  </script>