<template>
  <section class="py-12 recent-categories-section">
    <v-container>
      <v-row class="text-center mb-8">
        <v-col cols="12">
          <h2 class="text-h3 font-weight-bold mb-2">Categories</h2>
          <p class="text-subtitle-1">Explore our content by category</p>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="category in categories"
          :key="category.id"
          cols="12"
          sm="6"
          lg="4"
          class="mb-6"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 8 : 2"
              :class="{ 'on-hover': isHovering }"
              height="100%"
              class="d-flex flex-column category-card"
            >
              <v-card-title class="text-h5 font-weight-bold">
                {{ category.name }}
              </v-card-title>

              <v-card-text>
                <p class="text-body-1">
                  {{ category.description }}
                </p>
              </v-card-text>

              <v-card-actions class="mt-auto">
                <v-spacer />
                <v-btn
                  variant="flat"
                  color="primary"
                  :to="`/categories/${category.id}`"
                >
                  View Posts
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" class="text-center mt-4">
          <v-btn color="primary" size="large" to="/categories" variant="flat">
            View All
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { CategoryService } from "@/services/category";
import { ref, onMounted } from "vue";

interface Category {
  id: number;
  name: string;
  description: string;
}
const categories = ref<Category[]>([]);
const maxRecentCount = 4;

// Load categories from API
onMounted(async () => {
  categories.value = (await CategoryService.getAll()).slice(0, maxRecentCount);
});
</script>

<style scoped lang="scss">
.category-card {
  transition: transform 0.3s;

  &.on-hover {
    transform: translateY(-8px);
  }
}
</style>
