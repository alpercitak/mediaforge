<template>
  <div class="odometer">
    <div class="odometer__digit" v-for="(digit, index) in digits" :key="index">
      <div class="odometer__number" :style="{ transform: `translateY(-${digit}em)` }">
        <span v-for="n in 10" :key="n - 1">{{ n - 1 }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const DEFAULT_DIGITS = 1 as const;

const props = defineProps<{
  value: number;
  digits?: number;
}>();

const digits = computed<Array<number>>(() => {
  const str = String(props.value).padStart(props.digits ?? DEFAULT_DIGITS, '0');
  return str.split('').map(Number);
});
</script>

<style scoped>
.odometer {
  display: flex;
  overflow: hidden;
}
.odometer__digit {
  width: 1ch;
  height: 1em;
  overflow: hidden;
  position: relative;
}
.odometer__number {
  transition: transform 0.5s ease-in-out;
}
.odometer__number span {
  display: block;
  line-height: 1em;
  text-align: center;
}
</style>
