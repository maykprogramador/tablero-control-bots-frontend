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
    iniciarSocketNotificaciones() {
      const authStore = useAuthStore();

      socket.on('nueva_notificacion', (notificacion) => {
        console.log('Nueva notificación recibida via Socket.IO:', notificacion);

        //  Solo agregar si corresponde al usuario logueado
        if (notificacion.user_id === authStore.user.user_id ) {
          
          this.notificaciones.unshift(notificacion);

          // 🔊 Sonidos
          if (notificacion.tipo === 'error' || notificacion.tipo === 'advertencia') {
            const audio = new Audio("https://cdn.jsdelivr.net/gh/maykprogramador/tablero-control-bots@main/dist/sounds/alert.mp3");
            audio.play().catch(err => console.log("No se pudo reproducir el sonido:", err));
            setTimeout(() => {
              audio.pause();
              audio.currentTime = 0;
            }, 8000);
          } else {
            const audio = new Audio("https://cdn.jsdelivr.net/gh/maykprogramador/tablero-control-bots@main/dist/sounds/notificacion.mp3");
            audio.play().catch(err => console.log("No se pudo reproducir el sonido:", err));
          }
        }
      });
    },

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
    async createNotificacion(titulo, mensaje, tipo, destino) {
      try {
        const response = await axiosInstance.post('/',{ titulo: titulo, mensaje: mensaje, tipo: tipo, destino: destino });
        console.log('Respuesta al crear notificación:', response.data.data);
        
        if (response.data.status === 'ok') {
          if (this.notificaciones.length === 0) return;

          const authStore = useAuthStore();
          const perteneceAlUsuario = response.data.data.user_id === authStore.user.user_id;

          if (perteneceAlUsuario || authStore.user.rol === 'admin' || authStore.user.rol === 'supervisor') {
            this.notificaciones.unshift(response.data.data);
            console.log('tipo: ',tipo);
            
            // 🔊 Emitir sonido si es notificación de error
            if (tipo === 'error' || tipo === 'advertencia') {
              const audio = new Audio("https://cdn.jsdelivr.net/gh/maykprogramador/tablero-control-bots@main/dist/sounds/alert.mp3");
              audio.play().catch(err => console.log("No se pudo reproducir el sonido:", err));
              // Opcional: detener después de X segundos
              setTimeout(() => {
                audio.pause();
                audio.currentTime = 0; // reinicia al inicio
              }, 8000); // 8 segundos
            }else{
              console.log("Reproduciendo sonido de notificación estándar");
              const audio = new Audio("https://cdn.jsdelivr.net/gh/maykprogramador/tablero-control-bots@main/dist/sounds/notificacion.mp3");
              audio.play().catch(err => console.log("No se pudo reproducir el sonido:", err));
            }
          }
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
    async eliminarNotificacion(id) {
      try {
        const response = await axiosInstance.delete(`/${id}`);
        if (response.data.status === 'ok') {
          const index = this.notificaciones.findIndex(n => n.id === id);
          if (index !== -1) {
            this.notificaciones.splice(index, 1);
          }
        }

      } catch (error) {
        console.log('Error al eliminar la notificacion:', error.response?.data?.message || error.message);
      }
    },

    async eliminarNotificaciones() {
      try {
        const response = await axiosInstance.delete('/all');
        if (response.data.status === 'ok') {
          console.log('notificaciones eliminadas', response);
          
          this.notificaciones = []
        }
      } catch (error) {
        console.log('Error al eliminar todas:', error);
      }
    },

    resetState(){
      this.notificaciones = []
    }
    
  }
})