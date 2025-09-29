import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import socket from '@/socket'
import { API_BASE_URL_BACK } from '@/config'
import { useAuthStore } from '@/stores/Autentificate/auth.js'
import { setupAxiosInterceptor } from '@/utils/axiosInterceptor' // ✅ Importar interceptor


const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL_BACK}/api/notificaciones`, // Asegúrate de que esta URL es correcta
  withCredentials: true, // ⚠️ IMPORTANTE: Permite enviar cookies y autenticación
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ✅ Aplicar el interceptor a ESTA instancia específica
setupAxiosInterceptor(axiosInstance);

export const useNotificacionesStore = defineStore('notificacion-functions',{

  state: () => ({
    notificaciones: []
  }),

  actions: {
    async fetchNotificaciones() {
      try {
        const response = await axiosInstance.get('/');

        if (response.data.status === 'ok') {
          this.notificaciones = response.data.data;
        }
      } catch (error) {
        throw error;
      }
    }
    

  }
})