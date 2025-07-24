import { createRouter, createWebHistory } from 'vue-router';
import Login from '../components/Login-Home.vue';
import Admin from '../components/Admin-Display.vue';
import Recepcionista from '../components/Recepcionista-Display.vue';
import Tecnico from '../components/Tecnico-Display.vue';

const routes = [
  { path: '/', component: Login },
  { path: '/login', component: Login },
  { 
    path: '/admin', 
    component: Admin, 
    beforeEnter: (to, from, next) => {
      const rol = localStorage.getItem("rol");
      if (rol === "administrador") {
        next();
      } else {
        next('/login');
      }
    }
  },
  { 
    path: '/recepcionista', 
    component: Recepcionista, 
    beforeEnter: (to, from, next) => {
      const rol = localStorage.getItem("rol");
      if (rol === "recepcionista") {
        next();
      } else {
        next('/login');
      }
    }
  },
  { 
    path: '/tecnico', 
    component: Tecnico, 
    beforeEnter: (to, from, next) => {
      const rol = localStorage.getItem("rol");
      if (rol === "tecnico") {
        next();
      } else {
        next('/login');
      }
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
