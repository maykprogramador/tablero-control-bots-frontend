import { createRouter, createWebHistory } from 'vue-router'
import Login from '@/components/autentificate/Login.vue'
import register2 from '@/components/autentificate/register2.vue'
import Tablero from '@/components/tablero-bot/tablero.vue'
import Prueba from '@/components/tablero-bot/prueba.vue'
import Perfil from '@/components/tablero-bot/profile/perfil.vue'
import AnaliticsRPA from '@/components/tablero-bot/Dashboard-Rpa-Analitics/Analitics-RPA.vue'
import AnaliticsRPA2 from '@/components/tablero-bot/Dashboard-Rpa-Analitics/Analitics-RPA2.vue'

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
    /*{
      path: '/prueba',
      name: 'prueba',
      component: AnaliticsRPA,
    },
    {
      path: '/prueba1',
      name: 'prueba1',
      component: AnaliticsRPA2,
    }*/
  ],
})

export default router
