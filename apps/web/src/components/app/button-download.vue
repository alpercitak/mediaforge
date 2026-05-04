<template>
  <Button @click="onDownload">Download</Button>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import Button from '@/components/ui/button.vue';
import { useMediaStore } from '@/stores/media';

const { medias } = storeToRefs(useMediaStore());

const onDownload = (): void => {
  medias.value.forEach(({ file, processed }) => {
    if (!processed?.src) {
      return;
    }
    const a = document.createElement('a');
    a.href = String(processed?.src);
    a.download = `${file.name}.${processed?.extension}`;
    a.click();
  });
};
</script>
