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
    logs: [],
    users: [],
    botsDisponibles: [],
    SolicitudInactivacion:[],
    solicitudes: [],
    historias_clinicas: [],
    formSolicitudes: [],
    executeBot: false,
  }),

  actions: {
    openModal() {
      this.isModalOpen = true
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

    async loadLogs({ bot_id }) {
      try {
        const yaExisten = this.logs.some(l => l.bot_id === bot_id)
        if (!yaExisten) {
          const logs = await axiosInstance.get('logs', { params: { bot_id } });
          if (logs.data.length > 0) {
            this.logs.push(...logs.data)  // sin sobrescribir
            console.log('Logs cargados de db: ',this.logs);
          }
          return;
        }
        console.log('Logs cargados del estado: ',this.logs);
      } catch (error) {
        console.error('Error al cargar los logs:', error);
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
    async deleteUser(userId) {
      try {
        console.log('Eliminando usuario con ID:', userId);
        await axiosInstance.delete(`delete/user`, { params: { userId: userId } });
        // Eliminar el usuario del estado local
        this.users = this.users.filter(u => u.id !== userId);
        console.log('Usuario eliminado con éxito:', userId);
      } catch (error) {
        console.error('Error al eliminar el usuario:', error);
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
    // agregar nuevo usuario 
    async addNewUser(nuevoUsuario) {
      try {
        const response = await axiosInstance.post('create/user', nuevoUsuario);
        console.log('Nuevo usuario creado:', response.data.user);
        // Agregar el nuevo usuario al estado
        this.users.push(response.data.user);
      } catch (error) {
        throw error;
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
        throw new Error('No se pudo crear la solicitud intente nuevamente');
      }
    }
    ,
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
    async loadHistoriasClinicas(user) {
      try {
          if (this.historias_clinicas.length === 0) {
              const response = await axiosInstance.get('get/historiasClinicas', { params: { user_id: user.user_id, } });
              this.historias_clinicas = response.data;
            console.log('historias cargadas de la DB: ',this.historias_clinicas);
          }
          else {
            console.log('historias_clinicas cargadas del estado: ',this.historias_clinicas);
          }
          
      } catch (error) {
        console.error('Error al cargar las historias clinicas:', error);
        throw error;
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
        const perteneceASolicitud = solicitud?.user_id === user.user_id  
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
          }else{
            console.log('⚠️ Registro ignorado porque no existe historial para este bot:', registro.bot_id)
          }
          // 👉 actualizar solicitudes si pertenece al usuario autenticado
          if (perteneceASolicitud) {
            const indexSolicitud = this.solicitudes.findIndex(s => s.id === solicitud.id);
            if (indexSolicitud !== -1) {
              this.solicitudes[indexSolicitud] = solicitud; // actualizamos datos del bot
              console.log('🔄 Solicitud actualizado desde socket:', solicitud);
            }
          }
        }
      });
      // Evento para logs generales del bot
      socket.on('nuevo_log', (log, bot) => {
        console.log('🆕 Log recibido desde socket:', log);
        // Verificar si el log pertenece a un bot que el usuario tiene en su lista
        const perteneceABot = this.bots.some(b => b.id === log.bot_id);
        const yaTieneLogs = this.logs.some(l => l.bot_id === log.bot_id);

        if (perteneceABot) {
          // ✅ Actualizar información del bot en el store si cambió algo
          const indexBot = this.bots.findIndex(b => b.id === bot.id);
          if (indexBot !== -1) {
            this.bots[indexBot] = bot;
            console.log('🔄 Bot actualizado desde socket:', bot);
          }

          // ✅ Agregar log al inicio de la lista si ya hay logs de ese bot
          if (yaTieneLogs) {
            this.logs.unshift(log);
            console.log('✅ Log agregado desde socket:', log);
          } else {
            console.log('⚠️ Log ignorado: no hay historial previo para este bot:', log.bot_id);
          }
        } else {
          console.log('⚠️ Log ignorado: no pertenece a un bot del usuario actual');
        }
      });

      // 👉 Evento para historias clínicas
      socket.on('nueva_historia', (trazabilidad, botActualizado) => {
        console.log('📩 Trazabilidad recibida desde socket:', trazabilidad, botActualizado);

        // Verificar si el bot está en el estado
        const perteneceABot = this.bots.some(b => b.id === trazabilidad.bot_id);
        const yaExiste = this.historias_clinicas.some(t => t.id === trazabilidad.id);

        if (perteneceABot) {
          // 🔄 Actualizar bot en la lista
          const indexBot = this.bots.findIndex(b => b.id === botActualizado.id);
          if (indexBot !== -1) {
            this.bots.splice(indexBot, 1, botActualizado);
            console.log('🔄 Bot actualizado desde socket:', botActualizado);
          }

          if (this.historias_clinicas.length > 0) {
            // 📄 Agregar o actualizar trazabilidad
            if (!yaExiste) {
              this.historias_clinicas.unshift(trazabilidad);
              console.log('✅ Trazabilidad agregada al state:', trazabilidad);
            } else {
              const index = this.historias_clinicas.findIndex(t => t.id === trazabilidad.id);
              this.historias_clinicas.splice(index, 1, trazabilidad);
              console.log('🔄 Trazabilidad actualizada en el state:', trazabilidad);
            }
          }
          
        } else {
          console.warn('⚠️ Trazabilidad recibida de un bot no registrado:', trazabilidad.bot_id);
        }
      });
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
      this.solicitudes = [];
      this.historias_clinicas = [];
      this.logs = [];
      this.SolicitudInactivacion = [],
      this.executeBot = false;  
    }

  }
})
