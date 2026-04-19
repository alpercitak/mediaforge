import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import app from './app.vue';
import './styles/global.css';

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: [{ path: '/', name: 'home', component: () => import('@/views/home/home.vue') }],
  linkActiveClass: 'link-active',
});

createApp(app).use(pinia).use(router).mount('#app');
