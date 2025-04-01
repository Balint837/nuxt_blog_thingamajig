<template>
  <section class="py-12">
    <v-container>
      <v-row class="text-center mb-8">
        <v-col cols="12">
          <h2 class="text-h3 font-weight-bold mb-2">Recent Posts</h2>
        </v-col>
      </v-row>

      <v-row>
        <v-col
          v-for="post in posts"
          :key="post.title"
          cols="12"
          md="4"
          class="mb-6"
        >
          <v-hover v-slot="{ isHovering, props }">
            <v-card
              v-bind="props"
              :elevation="isHovering ? 8 : 2"
              :class="{ 'on-hover': isHovering }"
              height="100%"
              class="d-flex flex-column post-card"
              :to="`/posts/${post.id}`"
            >
              <div class="pa-6 text-center">
                <v-avatar color="primary" size="72" class="mb-4">
                  <v-icon icon="mdi-newspaper" size="36" color="white" />
                </v-avatar>

                <h3 class="text-h5 font-weight-bold mb-2">
                  {{ post.title }}
                </h3>
                <p class="text-body-1">
                  {{ getShortContent(post) }}
                </p>
                <v-row class="mt-4 text-left">
                  <v-col>
                    <v-icon class="mr-2">mdi-calendar</v-icon>
                    {{ formatDate(post.createdAt) }}
                  </v-col>
                  <v-col>
                    <v-icon class="mr-2">mdi-folder</v-icon>
                    {{ getCategoryName(post.categoryId) }}
                  </v-col>
                  <v-col>
                    <v-icon class="mr-2">mdi-tag</v-icon>
                    {{ getTagNames(post.tagIds).join(", ") }}
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-hover>
        </v-col>
      </v-row>

      <!-- View All Button -->
      <v-row justify="center" class="mt-6">
        <v-col cols="12" class="text-center">
          <v-btn color="primary" to="/posts" size="large">
            View All
          </v-btn>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>


<script setup lang="ts">
import { CategoryService } from "@/services/category";
import { PostService } from "@/services/post";
import { TagService } from "@/services/tag";
import type { CategoryModel } from "@/models/category";
import type { PostModel } from "@/models/post";
import type { TagModel } from "@/models/tag";
import { ref, onMounted } from "vue";
import { utils } from "@/utils";

const posts = ref<PostModel[]>([]);
const categories = ref<CategoryModel[]>([]);
const tags = ref<TagModel[]>([]);

const maxRecentCount = 3;

// Load posts, categories, and tags from API
onMounted(async () => {
  tags.value = await TagService.getAll();
  categories.value = await CategoryService.getAll();
  posts.value = (await PostService.getAll()).slice(0, maxRecentCount);
});

const getShortContent = (post: PostModel) => {
  const maxChars = 100;
  const rawContent = utils.getTextFromHTML(post.content);
  return (
    rawContent.slice(0, maxChars) +
    (rawContent.length > maxChars ? "[...]" : "")
  );
};

const formatDate = (timestamp: number) =>
  new Date(timestamp * 1000).toLocaleDateString();

const getCategoryName = (categoryId: number) => {
  const category = categories.value.find((c) => c.id == categoryId);
  if (!category) {
    console.log(
      `Category with ID ${categoryId} not found\n`,
      [...categories.value],
      categories
    );
  }
  return category ? category.name : "Category";
};

const getTagNames = (tagIds: number[]) => {
  return tagIds.map((id) => {
    const tag = tags.value.find((t) => t.id == id);
    if (!tag) {
      console.log(`Tag with ID ${id} not found\n`, [...tags.value], tags);
    }
    return tag ? tag.name : "Tag";
  });
};
</script>

<style scoped lang="scss">
.post-card {
  transition: transform 0.3s;

  &.on-hover {
    transform: translateY(-8px);
  }
}
</style>