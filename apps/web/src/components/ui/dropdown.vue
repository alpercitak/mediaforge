<template>
  <div class="dropdown">
    <label v-if="label" :for="id">{{ label }}</label>
    <select :id="id" class="dropdown__select" v-model="model">
      <option v-for="{ value, text } in options" :key="value" :value="value">
        {{ text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
import { useId } from 'vue';

const model = defineModel<string>();

interface Option {
  value: string | number;
  text: string;
}

const props = defineProps<{
  options: Array<Option>;
  label?: string;
}>();

const id = useId();
</script>

<style scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  gap: var(--spacer-sm);
}
.dropdown__select {
  padding: var(--spacer-sm) 0;
  border-radius: var(--border-radius-md);
  border: var(--border);
  width: 200px;
}
</style>
