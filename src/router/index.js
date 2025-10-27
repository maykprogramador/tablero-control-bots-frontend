import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/autentificate/Login.vue'
import register2 from '@/components/autentificate/register2.vue'
import Tablero from '@/components/tablero-bot/tablero.vue'
import Prueba from '@/components/tablero-bot/prueba.vue'
import Perfil from '@/components/tablero-bot/profile/perfil.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login,
    },
    {
      path: '/register',
      name: 'Register',
      component: register2,
    },
    {
      path: '/tablero',
      name: 'Tablero',
      component: Tablero,
    },
    {
      path: '/perfil',
      name: 'Perfil',
      component: Perfil,
    },
  ],
})

export default router
