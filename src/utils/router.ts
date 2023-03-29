import { createRouter, createWebHistory } from 'vue-router';
import { useCookies } from 'vue3-cookies';

import Home from '../views/Home.vue';
import Profile from '../views/Profile.vue';
import Login from '../views/Login.vue';
import Register from '../views/Register.vue';

const { cookies } = useCookies();

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/profile',
      component: Profile,
    },
    {
      path: '/login',
      component: Login,
    },
    {
      path: '/register',
      component: Register,
    },
  ],
});

router.beforeEach((to) => {
  const path = to.path;
  const authenticatedPath = ['/', '/profile'];
  const isAuthenticated = !cookies.isKey('accesstoken') ? false : true;

  if (authenticatedPath.includes(path) && !isAuthenticated) return '/login';
  if (!authenticatedPath.includes(path) && isAuthenticated) return '/';
});

export default router;
