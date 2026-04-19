<template>
  <input type="file" multiple @change="onFileChange" />
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
