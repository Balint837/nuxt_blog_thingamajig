<template>
  <v-container>
    <v-row class="text-center mb-8">
      <v-col cols="12">
        <h2 class="text-h3 font-weight-bold mb-2">All Tags</h2>
        <v-btn color="primary" @click="enableCreatingTag" class="mb-4">
          Add New Tag
        </v-btn>
      </v-col>
    </v-row>

    <v-row>
      <v-col
        v-for="tag in editableTags"
        :key="tag.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card
          class="pa-4 text-center d-flex flex-column align-center"
          elevation="2"
        >
          <div
            v-if="!tag.editing"
            class="d-flex align-center justify-space-between w-100"
          >
            <span class="text-h5">{{ tag.name }}</span>
            <div>
              <v-btn icon small @click="enableEditing(tag)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="deleteTag(tag)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </div>
          </div>

          <div v-else class="d-flex align-center justify-space-between w-100">
            <v-text-field v-model="tag.editedName" dense hide-details />
            <div>
              <v-btn icon small color="success" @click="saveTag(tag)">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="cancelEditing(tag)">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- New tag creation form -->
      <v-col v-if="isCreatingTag" cols="12" sm="6" md="4" lg="3">
        <v-card class="pa-4 text-center" elevation="2">
          <div class="d-flex align-center justify-space-between w-100">
            <v-text-field
              v-model="newTagName"
              label="New Tag"
              dense
              hide-details
            />
            <div>
              <v-btn icon small color="success" @click="createNewTag">
                <v-icon>mdi-check</v-icon>
              </v-btn>
              <v-btn icon small color="error" @click="cancelCreatingTag">
                <v-icon>mdi-close</v-icon>
              </v-btn>
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { TagService } from "@/services/tag";
import type { TagModel } from "@/models/tag";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";

interface TagModelEditable extends TagModel {
  editing: boolean;
  editedName: string;
}

const router = useRouter();
const authStore = useAuthStore();
const tags = ref<TagModel[]>([]);
const editableTags = ref<TagModelEditable[]>([]);

const isCreatingTag = ref(false);
const newTagName = ref("");

onMounted(async () => {
  if (!authStore.isAdmin) {
    router.push("/login");
    return;
  }
  tags.value = await TagService.getAll();
  editableTags.value = tags.value.map((tag) => ({
    ...tag,
    editing: false,
    editedName: tag.name,
  }));
});

const enableEditing = (tag: TagModelEditable) => {
  tag.editing = true;
};

const saveTag = async (tag: TagModelEditable) => {
  tag.editedName = tag.editedName.trim();
  if (tag.editedName && tag.editedName !== tag.name) {
    const findOriginalTag = tags.value.find((t) => t.id === tag.id) as TagModel;
    await TagService.put(tag.id, { ...findOriginalTag, name: tag.editedName });
    tag.name = tag.editedName;
  }
  tag.editing = false;
};

const cancelEditing = (tag: TagModelEditable) => {
  tag.editedName = tag.name;
  tag.editing = false;
};

const deleteTag = async (tag: TagModelEditable) => {
  if (!confirm(`Are you sure you want to delete "${tag.name}"?`)) return;
  await TagService.delete(tag.id);
  tags.value = tags.value.filter((t) => t.id !== tag.id);
  editableTags.value = editableTags.value.filter((t) => t.id !== tag.id);
};

const enableCreatingTag = () => {
  isCreatingTag.value = true;
};

const cancelCreatingTag = () => {
  isCreatingTag.value = false;
  newTagName.value = "";
};

const createNewTag = async () => {
  const name = newTagName.value.trim();
  if (name) {
    const newTag = await TagService.create({ name, id: 0 });
    tags.value.push(newTag);
    editableTags.value.push({
      ...newTag,
      editing: false,
      editedName: newTag.name,
    });
  }
  isCreatingTag.value = false;
  newTagName.value = "";
};
</script>

<style scoped>
.v-card {
  transition: transform 0.2s;
  cursor: pointer;
}
.v-card:hover {
  transform: scale(1.05);
}
</style>
