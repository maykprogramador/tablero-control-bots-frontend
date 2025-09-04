import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import axios from 'axios'
import socket from '@/socket'
import { API_BASE_URL_BACK } from '@/config'
import { useAuthStore } from '@/stores/Autentificate/auth.js'
import { setupAxiosInterceptor } from '@/utils/axiosInterceptor' // ✅ Importar interceptor


const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL_BACK}/api/bots/`, // Asegúrate de que esta URL es correcta
  withCredentials: true, // ⚠️ IMPORTANTE: Permite enviar cookies y autenticación
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ✅ Aplicar el interceptor a ESTA instancia específica
setupAxiosInterceptor(axiosInstance);

export const useTableroFunctions = defineStore('tablero-functions',{

  state: () => ({
    isModalOpen: false,
    bots: [],
    registros: [],
    users: [],
    botsDisponibles: [],
    SolicitudInactivacion:[],
    solicitudes: [],
    formSolicitudes: [],
    executeBot: false,
  }),

  actions: {
    openModal() {
      this.isModalOpen = true
    },
    setFormInactivation(form){
      this.formInactivation = form
    },
    setSolicitudes(solicitudes){
      this.solicitudes = solicitudes
    },
    setSolicitudInactivacion(solicitud){
      this.SolicitudInactivacion = solicitud
    },
    setExecuteBot(value){
      this.executeBot = value
    },
    closeModal() {
      this.isModalOpen = false
    },
    async loadbots({ user_id, rol }) {
      try {
        const response = await axiosInstance.get('get', {
          params: {
            user_id,
            rol
          }
        });
        this.bots = response.data;
      } catch (error) {
        console.error('Error al cargar los bots:', error);
      }
    },
  
    async getUsers() {
      try {
        const response = await axiosInstance.get('get/users');
        console.log('usuarios cargados: ',response.data);
        
        this.users = response.data;
      } catch (error) {
        //console.error('Error al cargar los usuarios:', error);
        throw error;
      }
    },
    async getAllBots() {
      try {
        const response = await axiosInstance.get('get/bots');
        //console.log('bots disponibles: ',response.data);
        
        this.botsDisponibles = response.data;
      } catch (error) {
        console.error('Error al cargar los usuarios:', error);
      }
    },
    async addBotsToUser(userId, botsId) {
      try {
        console.log('UserId:', userId, ' botsId:', botsId);  

        const response = await axiosInstance.post('add/bots/user', {
          userId,
          botsId
        });

        const usuarioActualizado = response.data;

        // 🔹 Reemplazar usuario en el estado
        this.users = this.users.map(u => 
          u.id === usuarioActualizado.id ? usuarioActualizado : u
        );

        //console.log('Usuario actualizado con éxito:', usuarioActualizado);
      } catch (error) {
        console.error('Error al agregar bots al usuario:', error);
      }
    },


    async updateUserRole(user){
      try {
        const response = await axiosInstance.post('update/user/rol', user);
        //console.log('usuario actualizado: ', response.data);
        // Actualiza el usuario en el estado
        const index = this.users.findIndex(u => u.id === user.id);
        if (index !== -1) {
          this.users[index] = response.data;
        }
      } catch (error) {
        console.error('Error al cambiar el rol del usuario:', error);
      }
    },

    async loadRegistros({ bot_id }) {
      try {
        const yaExisten = this.registros.some(r => r.bot_id === bot_id)
        if (!yaExisten) {
          console.log('entro');
          const nuevosRegistros = await axiosInstance.get('get/registros', { params: { bot_id } });
          if (nuevosRegistros.data.length > 0) {
            this.registros.push(...nuevosRegistros.data)  // sin sobrescribir
            console.log('Registros cargados de db: ',this.registros);
            
          }
          return;
        }
        console.log('Registros cargados del estado: ',this.registros);
        /*const response = await axiosInstance.get('get/registros', { params: { bot_id } });
        this.registros = response.data;*/
      } catch (error) {
        console.error('Error al cargar los bots:', error);
      }
    },
    async createSolicitud(form, user_id, bot_id) {
      try {
        const response = await axiosInstance.post('create/solicitud', { formArray: form, user_id: user_id, bot_id: bot_id });
        console.log('solicitud creada: ',response.data);
        //console.log('formulario a enviar: ',form, 'user_id: ', user_id, 'bot_id: ', bot_id);
        if (this.solicitudes.length !== 0) {
          this.solicitudes = [...response.data, ...this.solicitudes];
        }
      } catch (error) {
        console.error('Error al crear la solicitud', error);
      }
    },
    async loadSolicitudes(user) {
      try {
          if (this.solicitudes.length === 0) {
              const response = await axiosInstance.get('get/solicitudes/usuario', {
                params: {
                  user_id: user.user_id,
                  rol: user.rol
                }
              });
              this.solicitudes = response.data;
            console.log('solicitudes cargadas de la DB: ',this.solicitudes);
          }
          else {
            console.log('solicitudes cargadas del estado: ',this.solicitudes);
          }
          
      } catch (error) {
        console.error('Error al cargar los bots:', error);
      }
    },

    iniciarSocket() { 
      socket.on('nuevo_registro', (registro, bot, solicitud) => {
        console.log('registro recibido desde el store: ', registro);

        // usuario actual desde el store de auth
        const authStore = useAuthStore()
        const user = authStore.user 
        console.log('usuario a comparar:', user);
        
    
        // verificar si la solicitud pertenece al usuario autenticado
        const perteneceASolicitud = solicitud.user_id === user.user_id  
        // Verificar si el registro pertenece a un bot en el estado y si ya tiene registros
        const perteneceABot = this.bots.some(bot => bot.id === registro.bot_id)
        //const yaExiste = this.registros.some(r => r.id === registro.id)
        const yaTieneRegistros = this.registros.some(r => r.bot_id === registro.bot_id)

        if (perteneceABot /*&& !yaExiste*/) {
          const indexBot = this.bots.findIndex(b => b.id === bot.id);
          if (indexBot !== -1) {
            this.bots[indexBot] = bot; // actualizamos datos del bot
            console.log('🔄 Bot actualizado desde socket:', bot);
          }
          if (yaTieneRegistros) {
            this.registros.unshift(registro)
            console.log('✅ Registro agregado desde socket:', registro)
          }
          // 👉 actualizar solicitudes si pertenece al usuario autenticado
          if (perteneceASolicitud) {
            const indexSolicitud = this.solicitudes.findIndex(s => s.id === solicitud.id);
            if (indexSolicitud !== -1) {
              this.solicitudes[indexSolicitud] = solicitud; // actualizamos datos del bot
              console.log('🔄 Solicitud actualizado desde socket:', solicitud);
            }
          }
          else{
            console.log('⚠️ Registro ignorado porque no existe historial para este bot:', registro.bot_id)
          }
        }
      })
    },

    descargarFormato() {
      window.open(`${API_BASE_URL_BACK}/bots/descargar-formato`, '_blank');
    },
    
    resetState() {
      this.isModalOpen = false;
      this.bots = [];
      this.registros = [];
      this.users = [];
      this.botsDisponibles = [];
      this.formInactivation = [];
      this.solicitudes = [];
      this.executeBot = false;  
    }

  }
})
