<template>
  <v-navigation-drawer
    :model-value="modelValue"
    app
    :color="themeStore.isDark ? 'rgb(25, 32, 39)' : 'grey-lighten-4'"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <v-list class="py-4">
      <v-list-item title="Filters">
        <template #prepend>
          <v-icon>mdi-filter</v-icon>
        </template>
      </v-list-item>
    </v-list>

    <v-divider />

    <!-- Project Type Filter -->
    <v-list>
      <v-list-subheader>Project Type</v-list-subheader>

      <v-list-item
        v-for="type in projectTypes"
        :key="type"
        :value="type"
        :active="selectedType === type"
        @click="toggleType(type)"
      >
        <template #prepend>
          <v-icon :color="selectedType === type ? 'primary' : undefined">
            {{ getTypeIcon(type) }}
          </v-icon>
        </template>

        <v-list-item-title>{{ formatType(type) }}</v-list-item-title>
      </v-list-item>
    </v-list>

    <v-divider />

    <!-- Completion Date Filter -->
    <v-list>
      <v-list-subheader>Completion Year</v-list-subheader>

      <v-list-item
        v-for="year in completionYears"
        :key="year"
        :value="year"
        :active="selectedYear === year"
        @click="toggleYear(year)"
      >
        <v-list-item-title>{{ year }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup lang="ts">
import { ref, watch, defineEmits } from "vue";
import { useThemeStore } from "@/stores/theme";
// import { useProjectsStore } from '@/stores/projects'

const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "filterChange"]);

// Store access
const themeStore = useThemeStore();
// const projectsStore = useProjectsStore()

// Filter states
const selectedType = ref<string | null>(null);
const selectedYear = ref<number | null>(null);

// Project types for filtering
const projectTypes = ["web", "mobile", "desktop"];

// Get completion years from projects (would be dynamically computed in real app)
const completionYears = [2023, 2024];

// Format project type for display
const formatType = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// Get icon for project type
const getTypeIcon = (type: string) => {
  switch (type) {
    case "web":
      return "mdi-web";
    case "mobile":
      return "mdi-cellphone";
    case "desktop":
      return "mdi-desktop-mac";
    default:
      return "mdi-code-tags";
  }
};

// Toggle type filter
const toggleType = (type: string) => {
  selectedType.value = selectedType.value === type ? null : type;
  emitFilters();
};

// Toggle year filter
const toggleYear = (year: number) => {
  selectedYear.value = selectedYear.value === year ? null : year;
  emitFilters();
};

// Emit filter changes
const emitFilters = () => {
  emit("filterChange", {
    type: selectedType.value,
    year: selectedYear.value,
  });
};

// Watch for model changes and emit update
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal !== props.modelValue) {
      emit("update:modelValue", newVal);
    }
  }
);
</script>
