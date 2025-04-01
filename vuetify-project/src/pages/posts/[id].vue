<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card v-if="post" class="pa-6">
          <div class="d-flex justify-space-between mb-4">
            <v-btn v-if="isAdmin" color="primary" @click="toggleEditMode">
              {{ editMode ? "Cancel" : "Edit" }}
            </v-btn>
            <v-btn v-if="isAdmin" color="error" @click="deletePost">
              Delete
            </v-btn>
          </div>

          <div v-if="!editMode">
            <h1 class="text-h4 font-weight-bold mb-4">{{ post.title }}</h1>
            <p class="text-body-1 text-medium-emphasis mb-4">
              {{ formatDate(post.createdAt) }}
            </p>
            <v-divider class="my-4" />
            <div v-html="utils.formatText(post.content)" class="text-body-1 html-content" />
          </div>

          <div v-else>
            <v-text-field v-model="editablePost.title" label="Title" />
            <v-textarea v-model="editablePost.content" label="Content" />
            <v-select
              v-model="editablePost.categoryId"
              :items="categoryOptions"
              label="Category"
            />
            <v-select
              v-model="editablePost.tagIds"
              :items="tagOptions"
              label="Tags"
              multiple
            />
            <v-btn color="success" @click="saveChanges">Save</v-btn>
          </div>

          <v-divider class="my-4" />
          <v-chip class="mr-2" color="primary">{{ getCategoryName(post.categoryId) }}</v-chip>
          <v-chip v-for="tag in getTagNames(post.tagIds)" :key="tag" class="mr-2" color="secondary">
            {{ tag }}
          </v-chip>
        </v-card>

        <v-alert v-else type="error">Post not found</v-alert>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PostService } from "@/services/post";
import { CategoryService } from "@/services/category";
import { TagService } from "@/services/tag";
import type { PostModel } from "@/models/post";
import type { CategoryModel } from "@/models/category";
import type { TagModel } from "@/models/tag";
import type { Dictionary } from "lodash";
import { useAuthStore } from "@/stores/auth";
import { utils } from "@/utils";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const isAdmin = computed(() => authStore.isAdmin);

const post = ref<PostModel | null>(null);
const categories = ref<CategoryModel[]>([]);
const tags = ref<TagModel[]>([]);
const editMode = ref(false);
const editablePost = ref<PostModel>({
  id: 0,
  title: "",
  content: "",
  createdAt: 0,
  categoryId: 0,
  tagIds: [],
});

onMounted(async () => {
  categories.value = await CategoryService.getAll();
  tags.value = await TagService.getAll();
  const paramId = (route.params as Dictionary<string>).id;
  post.value = await PostService.getById(Number(paramId));
  if (post.value) editablePost.value = { ...post.value };
});

const toggleEditMode = () => {
  editMode.value = !editMode.value;
  if (post.value) editablePost.value = { ...post.value };
};

const saveChanges = async () => {
  if (!editablePost.value || !post.value) return;
  await PostService.put(post.value.id, editablePost.value);
  post.value = { ...editablePost.value };
  editMode.value = false;
};

const deletePost = async () => {
  if (!post.value) return;
  if (!confirm(`Are you sure you want to delete "${post.value.title}"?`)) return;
  await PostService.delete(post.value.id);
  router.push("/posts");
};

const categoryOptions = computed(() => categories.value.map(c => ({ title: c.name, value: c.id })));
const tagOptions = computed(() => tags.value.map(t => ({ title: t.name, value: t.id })));

const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString();

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find((c) => c.id === categoryId);
  return category ? category.name : "Unknown Category";
};

const getTagNames = (tagIds: number[]) => {
  return tagIds.map((id) => {
    const tag = tags.value.find((t) => t.id === id);
    return tag ? tag.name : "Unknown Tag";
  });
};
</script>