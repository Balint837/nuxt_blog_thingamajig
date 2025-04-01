<template>
  <section class="py-12">
    <v-container>
      <v-row class="text-center mb-8">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h2 class="text-h3 font-weight-bold mb-2">All Categories</h2>
          <v-btn v-if="isAdmin" color="primary" @click="goToNewCategory">
            New Category
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col v-for="category in paginatedCategories" :key="category.id" cols="12" md="4" class="mb-6">
          <v-card :to="`/categories/${category.id}`" class="d-flex flex-column category-card">
            <v-card-title>{{ category.name }}</v-card-title>
            <v-card-text>
              {{ getShortDescription(category) }}
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>

      <v-pagination v-model="currentPage" :length="totalPages" class="mt-6" />
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { CategoryService } from "@/services/category";
import { useAuthStore } from "@/stores/auth";
import type { CategoryModel } from "@/models/category";
import { useRouter } from "vue-router";
import { utils } from "@/utils";

const categories = ref<CategoryModel[]>([]);
const currentPage = ref(1);
const categoriesPerPage = 6;
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.user?.role === 'admin');
const router = useRouter();

onMounted(async () => {
  categories.value = await CategoryService.getAll();
});

const totalPages = computed(() =>
  Math.ceil(categories.value.length / categoriesPerPage)
);
const paginatedCategories = computed(() => {
  const start = (currentPage.value - 1) * categoriesPerPage;
  return categories.value.slice(start, start + categoriesPerPage);
});

const getShortDescription = (category: CategoryModel) => {
  const maxChars = 100;
  const rawContent = utils.getTextFromHTML(category.description);
  return (
    rawContent.slice(0, maxChars) +
    (rawContent.length > maxChars ? "[...]" : "")
  );
};

const goToNewCategory = () => {
  router.push("/categories/new");
};
</script>

<style scoped>
.category-card {
  transition: transform 0.3s;
}

.category-card:hover {
  transform: scale(1.05);
}
</style>