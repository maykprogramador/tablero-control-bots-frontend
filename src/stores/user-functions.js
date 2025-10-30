import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import socket from '@/socket'
import { API_BASE_URL_BACK } from '@/config'
import { useAuthStore } from '@/stores/Autentificate/auth.js'
import { setupAxiosInterceptor } from '@/utils/axiosInterceptor' // ✅ Importar interceptor


const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL_BACK}/api/user/`, // Asegúrate de que esta URL es correcta
  withCredentials: true, // ⚠️ IMPORTANTE: Permite enviar cookies y autenticación
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ✅ Aplicar el interceptor a ESTA instancia específica
setupAxiosInterceptor(axiosInstance);
export const useUserFunctions = defineStore('user-functions',{
  state: () => ({ 
    
   }),
  actions: {
     // aqui se va a manejar el action que actualiza el perfil del usuario y enviar los datos al servidor cargo, empresa y departamento
    async ActualizarPerfil( user ) {
      try { 
        //console.log('se recibio el usuario: ', user);
        await axiosInstance.put('profile', { id: user.user_id, cargo: user.cargo, departamento: user.departamento, empresa: user.empresa })

      } catch (error) {
        console.error('Error al actualizar el perfil:', error);
      }
    },
  }
})

  
