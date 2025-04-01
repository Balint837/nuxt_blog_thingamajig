<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8">
        <v-card class="pa-6">
          <h1 class="text-h4 font-weight-bold mb-4">Create New Post</h1>

          <v-text-field v-model="newPost.title" label="Title" required />
          <v-textarea v-model="newPost.content" label="Content" required />

          <v-select
            v-model="newPost.categoryId"
            :items="categoryOptions"
            label="Category"
            required
          />

          <v-select
            v-model="newPost.tagIds"
            :items="tagOptions"
            label="Tags"
            multiple
            required
          />

          <v-btn color="success" class="mt-4" @click="createPost">Create</v-btn>
          <v-btn color="secondary" class="mt-4 ml-2" @click="cancel"
            >Cancel</v-btn
          >
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from "vue";
import { useRouter } from "vue-router";
import { PostService } from "@/services/post";
import { CategoryService } from "@/services/category";
import { TagService } from "@/services/tag";
import type { CategoryModel } from "@/models/category";
import type { TagModel } from "@/models/tag";
import { useAuthStore } from "@/stores/auth";
import type { PostModel } from "@/models/post";


const router = useRouter();
const authStore = useAuthStore();
const categories = ref<CategoryModel[]>([]);
const tags = ref<TagModel[]>([]);

const newPost = ref<PostModel>({
    // default value is only for the type checker
    id: 0,
    title: "",
    content: "",
    categoryId: 0,
    tagIds: [],
    createdAt: 0,
});

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push("/login");
    return;
  }
  categories.value = await CategoryService.getAll();
  newPost.value = {
    id: 0,
    title: "",
    content: "",
    categoryId: categories.value[0]?.id || 0,
    tagIds: [],
    createdAt: Math.floor(Date.now() / 1000),
  }
  tags.value = await TagService.getAll();
});

const categoryOptions = computed(() =>
  categories.value.map((c) => ({ title: c.name, value: c.id }))
);
const tagOptions = computed(() =>
  tags.value.map((t) => ({ title: t.name, value: t.id }))
);

const createPost = async () => {
  if (
    !newPost.value.title ||
    !newPost.value.content ||
    !newPost.value.categoryId
  )
    return;
  await PostService.create(newPost.value);
  router.push("/posts");
};

const cancel = () => {
  router.push("/posts");
};
</script>
