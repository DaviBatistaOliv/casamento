import { createRouter, createWebHistory } from 'vue-router';
import InviteView from '@/views/InviteView.vue';

export const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'invite',
      component: InviteView,
    },
    {
      path: '/presentes',
      name: 'gifts',
      component: () => import('@/views/GiftsView.vue'),
    },
  ],
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash, behavior: 'smooth' };
    }
    return { top: 0 };
  },
});
