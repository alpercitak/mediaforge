<template>
  <div class="dropdown">
    <label v-if="label">{{ label }}</label>
    <select v-model="model">
      <option v-for="{ value, text } in options" :key="value" :value="value">
        {{ text }}
      </option>
    </select>
  </div>
</template>

<script setup lang="ts">
const model = defineModel<string>();

interface Option {
  value: string | number;
  text: string;
}

const props = defineProps<{
  options: Array<Option>;
  label?: string;
}>();
</script>

<style scoped>
.dropdown {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
select {
  padding: 4px 0;
  border-radius: 6px;
  border: 1px solid var(--color-accent);
  width: 200px;
}
</style>
