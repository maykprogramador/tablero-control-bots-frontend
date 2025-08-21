// src/stores/Autentificate/auth.js
import { defineStore } from 'pinia'
import axios from 'axios'
import { API_BASE_URL_BACK } from '@/config'
import { API_BASE_URL_FRONT } from '@/config';
import { useRouter } from 'vue-router';

const router = useRouter();


const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL_BACK}/api/auth/`, // Asegúrate de que esta URL es correcta
  withCredentials: true, // ⚠️ IMPORTANTE: Permite enviar cookies y autenticación
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    provider: localStorage.getItem('provider') || null,
  }),

  actions: {
    setProvider(provider) {
      this.provider = provider
      localStorage.setItem('provider', provider)
    },
    async loginUser({ email, password }) {
      try {
        const response = await axiosInstance.post('login', { email, password })
        console.log('Login response:', response.data);
        
        this.user = response.data // ejemplo: { UserID: ..., email: ... }
        return response.data

      } catch (error) {

        console.log('Login error:', error.response.data ? error.response.data : error.response.data.message);

        throw error
      }
    },
    
    async verifyAuthUser() {
      try {
        const response = await axiosInstance.get('getUser')
       
        console.log('Verificación de usuario autenticado:', response.data);
        this.user = response.data.user // ejemplo: { UserID: ..., username: ... }
        return response.data.user

      } catch (error) {
        console.log('⚠️ No autenticado o sesión expirada', error.response ? error.response.data : error.message);
        throw error
      }
    },
    async registerUser(form) {
      try {
        const response = await axiosInstance.post('register', form)
        console.log("Registro exitoso:", response.data);
        return response.data;
        //console.log('Formulario de registro:', form);
        
      } catch (error) {
        console.error("Error al registrarse:", error);
        throw error;
      }
    },
    async logoutUser() {
      try {
        // Guardamos el provider antes de resetear el estado
        const currentProvider = this.provider
        //console.log('currentProvider:', currentProvider);
        
        // 1️⃣ Notificar al backend para cerrar sesión (cookies / token)
        await axiosInstance.post('logout')

        // 2️⃣ Limpiar datos locales
        localStorage.removeItem('access_token')
        localStorage.removeItem('user_data')
        localStorage.removeItem('provider')

        // 3️⃣ Resetear Pinia (primero este store)
        this.resetState()

        // 4️⃣ Resetear todos los stores
        const { resetAllStores } = await import('@/utils/resetStores')
        resetAllStores()

        // 5️⃣ Si no es local, redirigir al logout externo
        if (currentProvider !== 'local' || currentProvider === null) {
          const microsoftLogoutUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/logout?post_logout_redirect_uri=${API_BASE_URL_FRONT}/`
          window.location.href = microsoftLogoutUrl
        }

      } catch (error) {
        console.error('Error al cerrar sesión:', error)
      }
    },

    resetState() {
      this.user = null;
    }

  }
})
