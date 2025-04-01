<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card v-if="category" class="pa-6">
          <div class="d-flex justify-space-between mb-4">
            <v-btn v-if="isAdmin" color="primary" @click="toggleEditMode">
              {{ editMode ? "Cancel" : "Edit" }}
            </v-btn>
            <v-btn v-if="isAdmin" color="error" @click="deleteCategory">
              Delete
            </v-btn>
          </div>

          <div v-if="!editMode">
            <h1 class="text-h4 font-weight-bold mb-4">{{ category.name }}</h1>
            <p class="text-body-1 text-medium-emphasis mb-4 html-content" v-html="utils.formatText(category.description)" />
          </div>

          <div v-else>
            <v-text-field v-model="editableCategory.name" label="Name" />
            <v-textarea
              v-model="editableCategory.description"
              label="Description"
            />
            <v-btn color="success" @click="saveChanges">Save</v-btn>
          </div>

          <v-divider class="my-4" />
          <v-btn color="secondary" :to="`/posts?category=${category.id}`"
            >View Posts</v-btn
          >
        </v-card>

        <v-alert v-else type="error">Category not found</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { CategoryService } from "@/services/category";
import { useAuthStore } from "@/stores/auth";
import type { CategoryModel } from "@/models/category";
import type { Dictionary } from "lodash";
import { utils } from "@/utils";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);

const category = ref<CategoryModel | null>(null);
const editMode = ref(false);
const editableCategory = ref<CategoryModel>({
  id: 0,
  name: "",
  description: "",
});

onMounted(async () => {
  const paramId = (route.params as Dictionary<string>).id;
  category.value = await CategoryService.getById(Number(paramId));
  if (category.value) editableCategory.value = { ...category.value };
});

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  if (category.value) editableCategory.value = { ...category.value };
};

const saveChanges = async () => {
  if (!editableCategory.value || !category.value) return;
  await CategoryService.put(category.value.id, editableCategory.value);
  category.value = { ...editableCategory.value };
  editMode.value = false;
};

const deleteCategory = async () => {
  if (!category.value) return;
  if (!confirm(`Are you sure you want to delete "${category.value.name}"?`))
    return;
  await CategoryService.delete(category.value.id);
  router.push("/categories");
};
</script>
