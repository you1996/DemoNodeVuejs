import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
//import Login from './views/Login.vue';
import Register from './views/Register.vue';
import Menu from './views/Menu.vue';

import Reset from './views/Reset.vue';

Vue.use(Router);

export const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      component: Menu
    },
    {
      path: '/home',
      component: Home
    },
    
    {
      path: '/register',
      component: Register
    },
    {
      path: '/reset',
      component: Reset
    },
    {
      path: '/reset/:token',
      component: Reset
    },
    {
      path: '/profile',
      name: 'profile',
      // lazy-loaded
      component: () => import('./views/Profile.vue')
    },
    {
      path: '/admin',
      name: 'admin',
      // lazy-loaded
      component: () => import('./views/BoardAdmin.vue')
    },
    {
      path: '/mod',
      name: 'moderator',
      // lazy-loaded
      component: () => import('./views/BoardModerator.vue')
    },
    {
      path: '/user',
      name: 'user',
      // lazy-loaded
      component: () => import('./views/BoardUser.vue')
    }
  ]
});


