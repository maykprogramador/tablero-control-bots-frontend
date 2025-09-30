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
    },
    async createNotificacion(titulo, mensaje, tipo) {
      try {
        const response = await axiosInstance.post('/',{ titulo: titulo, mensaje: mensaje, tipo: tipo });
        console.log('Respuesta al crear notificación:', response.data.data);
        
        if (response.data.status === 'ok') {
          if (this.notificaciones.lenght === 0) return;
          this.notificaciones.unshift(response.data.data);
        }
      } catch (error) {
        console.log('Error al crear notificación:', error.response?.data?.message || error.message);
      }
    },
    async marcarComoLeida(id) {
      try {
        const response = await axiosInstance.patch(`/${id}/leido`);
        if (response.data.status !== 'ok') {
          const index = this.notificaciones.findIndex(n => n.id === id);
          if (index !== -1) {
            this.notificaciones[index].leido = false;
          }
        }
      } catch (error) {
        console.log('Error al marcar como leida:', error.response?.data?.message || error.message);
      }
    },

    async marcarTodasComoLeidas() {
      try {
        const response = await axiosInstance.post('/mark-all-read');
        if (response.data.status === 'ok') {
          this.notificaciones.forEach(n => n.leido = true)
        }
      } catch (error) {
        console.log('Error al marcar todas como leidas:', error);
      }
    },

    async eliminarNotificaciones() {
      try {
        const response = await axiosInstance.delete('/delete-all');
        if (response.data.status === 'ok') {
          this.notificaciones = []
        }
      } catch (error) {
        console.log('Error al eliminar todas:', error);
      }
    },

    iniciarSocketNotificaciones() {
      socket.on('nueva_notificacion', (notificacion) => {
        console.log('Nueva notificación recibida por socket:', notificacion);
        
        this.createNotificacion(notificacion.titulo, notificacion.mensaje, notificacion.tipo);
      });


    },
    resetState(){
      this.notificaciones = []
    }
    
  }
})