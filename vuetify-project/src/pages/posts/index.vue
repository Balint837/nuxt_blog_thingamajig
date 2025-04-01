<template>
  <section class="py-12">
    <v-container>
      <v-row class="text-center mb-8">
        <v-col cols="12" class="d-flex justify-space-between align-center">
          <h2 class="text-h3 font-weight-bold mb-2">All Posts</h2>
          <v-btn v-if="authStore.user?.role === 'admin'" color="primary" @click="goToNewPost">
            New Post
          </v-btn>
        </v-col>
      </v-row>

      <v-row>
        <v-col cols="12" md="3">
          <v-select
            v-model="selectedCategory"
            label="Filter by Category"
            :items="categoryOptions"
            clearable
            @update:modelValue="applyFiltersToQuery"
          />
          <v-select
            v-model="includedTags"
            label="Include Tags"
            :items="tagOptions"
            multiple
            clearable
            @update:modelValue="applyFiltersToQuery"
          />
          <v-select
            v-model="excludedTags"
            label="Exclude Tags"
            :items="tagOptions"
            multiple
            clearable
            @update:modelValue="applyFiltersToQuery"
          />
        </v-col>
        <v-col cols="12" md="9">
          <v-row>
            <v-col
              v-for="post in paginatedPosts"
              :key="post.id"
              cols="12"
              md="4"
              class="mb-6"
            >
              <v-card :to="`/posts/${post.id}`" class="d-flex flex-column post-card">
                <v-card-title>{{ post.title }}</v-card-title>
                <v-card-subtitle>{{ formatDate(post.createdAt) }}</v-card-subtitle>
                <v-card-text>
                  {{ getShortContent(post) }}
                </v-card-text>
                <v-card-actions>
                  <v-chip small class="mr-2" color="primary">
                    {{ getCategoryName(post.categoryId) }}
                  </v-chip>
                  <v-chip
                    v-for="tag in getTagNames(post.tagIds)"
                    :key="tag"
                    small
                    class="mr-2"
                    color="secondary"
                  >
                    {{ tag }}
                  </v-chip>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-pagination v-model="currentPage" :length="totalPages" class="mt-6" />
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { onMounted, ref, computed, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { PostService } from "@/services/post";
import { CategoryService } from "@/services/category";
import { TagService } from "@/services/tag";
import { useAuthStore } from "@/stores/auth";
import type { PostModel } from "@/models/post";
import type { CategoryModel } from "@/models/category";
import type { TagModel } from "@/models/tag";
import { utils } from "@/utils";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const posts = ref<PostModel[]>([]);
const categories = ref<CategoryModel[]>([]);
const tags = ref<TagModel[]>([]);
const selectedCategory = ref<CategoryModel | null>(null);

const includedTags = ref<TagModel[]>([]);
const excludedTags = ref<TagModel[]>([]);

const currentPage = ref(1);
const postsPerPage = 6;

onMounted(async () => {
  categories.value = await CategoryService.getAll();
  tags.value = await TagService.getAll();
  posts.value = await PostService.getAll();
  applyFiltersFromQuery();
});

const categoryOptions = computed(() => categories.value.map((c) => ({ title: c.name, value: c })));
const tagOptions = computed(() => tags.value.map((t) => ({ title: t.name, value: t })));

const filteredPosts = computed(() => {
  return posts.value.filter((post) => {
    const categoryMatch = !selectedCategory.value || post.categoryId === selectedCategory.value.id;
    const tagIncludeMatch = includedTags.value.length === 0 || includedTags.value.every((tagId) => post.tagIds.includes(tagId.id));
    const tagExcludeMatch = excludedTags.value.length === 0 || excludedTags.value.every((tagId) => !post.tagIds.includes(tagId.id));
    return categoryMatch && tagIncludeMatch && tagExcludeMatch;
  });
});

const totalPages = computed(() => Math.ceil(filteredPosts.value.length / postsPerPage));
const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage;
  return filteredPosts.value.slice(start, start + postsPerPage);
});

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

const applyFiltersToQuery = () => {
  const query = { category: "", tag: "" };
  if (selectedCategory.value) query.category = selectedCategory.value.id.toString();
  if (includedTags.value.length) query.tag += includedTags.value.map((x) => x.id).join("_");
  if (excludedTags.value.length) query.tag += "_" + excludedTags.value.map((x) => -x.id).join("_");
  router.push({ path: "/posts", query });
};

const applyFiltersFromQuery = () => {
  if (route.query.category) selectedCategory.value = categories.value.find(c => c.id === Number(route.query.category)) || null;
  if (route.query.tag) {
    includedTags.value = []; excludedTags.value = [];
    (route.query.tag as string).split("_").map(Number).forEach(id => {
      (id < 0 ? excludedTags.value : includedTags.value).push(tags.value.find(t => t.id === Math.abs(id))!);
    });
  }
};

watch(() => route.query, applyFiltersFromQuery);

const getShortContent = (post: PostModel) => {
  const maxChars = 100;
  const rawContent = utils.getTextFromHTML(post.content);
  return (
    rawContent.slice(0, maxChars) +
    (rawContent.length > maxChars ? "[...]" : "")
  );
};
const formatDate = (timestamp: number) => new Date(timestamp * 1000).toLocaleDateString();
const goToNewPost = () => router.push("/posts/new");
</script>

<style scoped>
.post-card {
  transition: transform 0.3s;
}
</style>