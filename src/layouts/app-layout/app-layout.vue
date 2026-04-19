<template>
  <header class="app-layout__header">
    <ul class="app-layout__navigation">
      <li v-for="{ name } in routes" :key="name">
        <router-link :to="{ name }">{{ name }}</router-link>
      </li>
    </ul>
  </header>
  <main class="app-layout__main">
    <slot></slot>
  </main>
  <footer class="app-layout__footer">
    <div class="app-layout__footer-left">
      <span class="app-layout__name">mediaforge</span>
      <slot name="footer-left"></slot>
    </div>
    <div class="app-layout__footer-right">
      <slot name="footer-right"></slot>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const routes = computed(() => router.getRoutes());
</script>

<style scoped>
.app-layout__navigation {
  list-style: none;
  display: inline-flex;
  gap: 12px;
}
.app-layout__main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  flex: 1;
  overflow-y: auto;
  margin: -40px 0;
  padding: 48px 8px;
}
.app-layout__name {
  color: var(--color-accent);
}
.app-layout__header,
.app-layout__footer {
  height: 48px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  position: sticky;
  z-index: 10;
}
.app-layout__header {
  top: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}
.app-layout__footer {
  bottom: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  justify-content: space-between;
  padding: 0 2rem;
}
.app-layout__footer-left,
.app-layout__footer-right {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}
.app-layout__footer-right {
  margin-left: auto;
}
</style>
