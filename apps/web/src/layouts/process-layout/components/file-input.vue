<template>
  <input type="file" multiple @change="onFileChange" class="file-input" />
</template>

<script setup lang="ts">
import { useFileInput } from '../composables/file-input';

const { processFiles } = useFileInput();

const onFileChange = (event: Event): void => {
  const input = event.target as HTMLInputElement;
  processFiles(input.files);
  input.value = '';
};
</script>

<style scoped>
.file-input {
  border: var(--border);
  padding: var(--spacer-xs);
  border-radius: var(--border-radius-md);
}
</style>
