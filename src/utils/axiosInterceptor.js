// src/utils/axiosInterceptor.js
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Autentificate/auth.js'

// Función para configurar el interceptor
export function setupAxiosInterceptor(axios = axiosInstance) {
  // Interceptor para respuestas
  axios.interceptors.response.use(
    // Si la respuesta es exitosa, simplemente la retornamos
    (response) => {
       //console.log('entrio al interceptor');
      return response
    },
    // Si hay un error, lo manejamos aquí
    async (error) => {
      //console.log('entrio al interceptor');
      
      // Verificamos si es un error 401 (No autorizado)
      if (error.response && error.response.status === 401) {
        console.warn('⚠️ Sesión expirada o no autenticado')
        
        // Obtenemos el router y auth store
        const router = useRouter()
        
        try {
          // 4️⃣ Resetear todos los stores
          const { resetAllStores } = await import('@/utils/resetStores')
          resetAllStores()
          
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.')
          // Redirigir al login
          await router.push('/')
          
        } catch (routerError) {
          console.error('Error al redirigir:', routerError)
          // Fallback: recargar la página si el router falla
          window.location.href = '/'
        }
      }
      
      // Re-lanzar el error para que los componentes puedan manejarlo si es necesario
      return Promise.reject(error)
    }
  )
}

// Función para remover el interceptor (opcional)
export function removeAxiosInterceptor(axiosInstance = axios) {
  // Esto remueve todos los interceptors de respuesta de la instancia especificada
  axiosInstance.interceptors.response.clear()
}