<template>
  <app-layout>
    <card>
      <template #header>Settings</template>
      <div class="settings__content">
        <toggle v-model="option.blur" label="Blur" />
        <toggle v-model="option.autoplay" label="Autoplay" />
        <toggle v-model="option.controls" label="Controls" />
        <toggle v-model="option.loop" label="Loop" />
      </div>
    </card>
  </app-layout>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useOptionStore } from '@/stores/option';
import AppLayout from '@/layouts/app-layout/app-layout.vue';
import Card from '@/components/card.vue';
import Toggle from '@/components/toggle.vue';

const { option } = storeToRefs(useOptionStore());
</script>

<style scoped>
.settings__content {
  display: grid;
  grid-template-columns: repeat(2, minmax(200px, 1fr));
  margin-top: 16px;
  gap: 24px;
}
</style>
