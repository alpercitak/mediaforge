import { createApp } from 'vue';
import { createPinia } from 'pinia';
import { createRouter, createWebHistory } from 'vue-router';
import app from './app.vue';
import './styles/global.css';

const pinia = createPinia();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: () => import('@/views/home/home.vue') },
    { path: '/convert', name: 'convert', component: () => import('@/views/convert/convert.vue') },
    { path: '/crop', name: 'crop', component: () => import('@/views/crop/crop.vue') },
    { path: '/concat', name: 'concat', component: () => import('@/views/concat/concat.vue') },
    { path: '/settings', name: 'settings', component: () => import('@/views/settings/settings.vue') },
  ],
  linkActiveClass: 'link-active',
});

createApp(app).use(pinia).use(router).mount('#app');
