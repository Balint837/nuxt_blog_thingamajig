<template>
  <div>
    <PostsSection />
    <Categories />
  </div>
</template>

<script setup lang="ts">
import PostsSection from '@/components/home/PostsSection.vue'
import Categories from '@/components/home/Categories.vue'

// Define route meta
defineOptions({
  layout: 'default'
})
</script>
