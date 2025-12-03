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
    metricasBots: [],
    historias_clinicas: [],
    autorizaciones: [],
    notas_credito_avidanti: [],
    formSolicitudes: [],
    executeBot: false,
    isDark: false,
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
    async loadbots({ user_id }) {
      try {
        const response = await axiosInstance.get('get');
        this.bots = response.data;
        this.inicializarMetricas(this.bots);
        //carga las métricas desde la API
        this.loadMetricasIniciales(user_id);
      } catch (error) {
        console.error('Error al cargar los bots:', error);
      }
    },
    
    async loadRegistros({ bot_id }) {
      try {
        const yaExisten = this.registros.some(r => r.bot_id === bot_id)
        if (!yaExisten) {
          //console.log('entro');
          const nuevosRegistros = await axiosInstance.get('get/registros', { params: { bot_id } });
          if (nuevosRegistros.data.length > 0) {
            this.registros.push(...nuevosRegistros.data)  // sin sobrescribir
            //console.log('Registros cargados de db: ',this.registros);
            
          }
          return;
        }
        //console.log('Registros cargados del estado: ',this.registros);
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
            //console.log('Logs cargados de db: ',this.logs);
          }
          return;
        }
        //console.log('Logs cargados del estado: ',this.logs);
      } catch (error) {
        console.error('Error al cargar los logs:', error);
      }
    },
  
    async getUsers() {
      try {
        const response = await axiosInstance.get('get/users');
        //console.log('usuarios cargados: ',response.data);
        
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
    async addNewBot(nuevoBot) {
      try {
        const response = await axiosInstance.post('/', nuevoBot);
        console.log('Nuevo bot creado:', response.data.bot);
        // Agregar el nuevo bot al estado
        this.bots.unshift(response.data.bot);
      } catch (error) {
        throw error;
      }
    },
    async updateBot(bot) {
      try {
        const response = await axiosInstance.put('/', bot);
        console.log('Bot actualizado:', response.data.bot);
        //
        const index = this.bots.findIndex(b => b.id === bot.id);
        if (index !== -1) {
          this.bots[index] = response.data.bot;
        }
      } catch (error) {
        throw error;
      }
    },
    async deleteBot(botId) {
      try {
        await axiosInstance.delete('/', { params: { botId } });
        console.log('Bot eliminado:', botId);
        // Eliminar el bot del estado
        this.bots = this.bots.filter(b => b.id !== botId);
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
            //console.log('solicitudes cargadas de la DB: ',this.solicitudes);
          }
          else {
            //console.log('solicitudes cargadas del estado: ',this.solicitudes);
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
            //console.log('historias cargadas de la DB: ',this.historias_clinicas);
          }
          else {
            //console.log('historias_clinicas cargadas del estado: ',this.historias_clinicas);
          }
          
      } catch (error) {
        console.error('Error al cargar las historias clinicas:', error);
        throw error;
      }
    }, 
    async loadAutorizaciones() {
      try {
        if (this.autorizaciones.length === 0) {
          const response = await axiosInstance.get('autorizaciones');
          this.autorizaciones = response.data;
        }
        //console.log('autorizaciones cargadas: ',this.autorizaciones);
      } catch (error) {
        console.error('Error al cargar las autorizaciones:', error);
        throw error;
      }
    },
    
    // cargar las fechas de soporte patologia con error  o listo
    async LoadFechasSoportePatologia() {
      try {
        const { data } = await axiosInstance.get('logs/fechas', { params: { estado: 'error', bot_id: 8} });
        return data;
      } catch (error) {
        console.error('Error al cargar las fechas de soporte patologia:', error);
        throw error;
      }
    },
    // activar el bot de soporte patologia para una fecha
    async activateSoportePatologiaBot(id_log,fecha) {
      console.log('fechaSelected: ',fecha, ' id_log: ',id_log);
      
      try {
        const { data } = await axiosInstance.post('activar-bot-patologia', { id: id_log, fecha: fecha });
        //console.log('data: ',data.log);
        // actualizar el log en el estado
        const index = this.logs.findIndex(l => l.id === data.log.id);
        if (index !== -1) {
          this.logs[index] = data.log;
          console.log('Log actualizado en el estado:', data.log);
        }
        return data;
        
      } catch (error) {
        console.error('Error al activar el bot de soporte patologia:', error);
        throw error;
      }
    },
    inicializarMetricas(bots) {
      this.metricasBots = bots.map(bot => ({
        bot_id: bot.id,
        exito: 0,
        error: 0,
        pendiente: 0,
        proceso: 0,
        procesados: bot.procesados || 0,
        total_registros: bot.total_registros || 0
      }));
    },
    async loadMetricasIniciales(userId) {
      try {
        const response = await axiosInstance.get('allmetricas', { params: { userId} }); // ajusta el endpoint real
        const metricasData = response.data;

        // Sincronizamos las métricas reales con las que ya existen
        this.metricasBots = this.metricasBots.map(botMetricas => {
          const nuevasMetricas = metricasData.find(m => m.bot_id === botMetricas.bot_id);
          return nuevasMetricas
            ? { ...botMetricas, ...nuevasMetricas } // actualizamos los valores reales
            : botMetricas; // dejamos los que no tengan datos
        });

        console.log('✅ Métricas iniciales cargadas:', this.metricasBots);
      } catch (error) {
        console.error('❌ Error al cargar métricas iniciales:', error);
      }
    },

    actualizarMetricasIncremental(botId, registro) {
      const botMetricas = this.metricasBots.find(m => m.bot_id === botId);
      if (!botMetricas) return;
      // Incrementamos total_registros
      botMetricas.total_registros++;
      // Determinar estado
      const estado = registro.estado || registro.estado_envio;
      // 2. Si NO es pendiente → restamos un pendiente (sin bajar de 0)
      if (estado !== "pendiente" && botMetricas.pendiente > 0) {
        botMetricas.pendiente--;
      }

      switch (estado) {
        case 'exito':
          botMetricas.exito++;
          break;
        case 'error':
          botMetricas.error++;
          break;
        case 'pendiente':
          botMetricas.pendiente++;
          break;
        case 'proceso':
          botMetricas.proceso++;
          break;
        default:
          break;
      }
    },
    async actualizarMetricaBot(botId) {
      try {
        const response = await axiosInstance.get('metricas/bot', { params: { botId } });
        const nuevasMetricas = response.data;

        const botMetricas = this.metricasBots.find(m => m.bot_id === botId);
        if (botMetricas) {
          Object.assign(botMetricas, nuevasMetricas);
          console.log(`Métricas actualizadas para bot ${botId}:`, botMetricas);
        }
      } catch (error) {
        console.error(`Error al actualizar métricas para bot ${botId}:`, error);
      } 
    },
    async reprocesarHistoriaClinica(id) {
      try {
        const response = await axiosInstance.put(`reprocesar/historia-clinica/${id}`);
        // Puedes actualizar el estado local sin recargar:
        const registro = this.historias_clinicas.find(r => r.id === id);
        if (registro) {
          registro.estado_envio = 'pendiente';
          registro.motivo_fallo = null;
          registro.fecha_envio = null;
          console.log('trazabilidad actualizada correctamente');
        }
        else {
          console.log('⚠️ Ocurrió un error al reprocesar la trazabilidad.');    
        }
      } catch (error) {
        console.error('Error al reprocesar trazabilidad:', error);
        alert('❌ No se pudo reprocesar la trazabilidad.');
      }
    },

    async cargarNotasCredito(bot_id, file, sede) {
      try {
        console.log('bot_id: ', bot_id, 'archivo: ', file, 'sede: ', sede);

        const formData = new FormData();
        formData.append('archivo', file);
        formData.append('sede', sede); 

        const response = await axiosInstance.post('cargar/notas-credito', formData, 
          { params: { bot_id }, headers: { 'Content-Type': 'multipart/form-data' } });
        return response.data.message;
      } catch (error) {
        console.error('Error al cargar las notas crédito:', error);
        throw error;
      }
    },
    async loadNotasCreditoAvidanti() {
      try {
          if (this.notas_credito_avidanti.length === 0) {
            const response = await axiosInstance.get('notas-credito-avidanti');
            this.notas_credito_avidanti = response.data;
            console.log('notas credito avidanti cargadas de la DB: ',this.notas_credito_avidanti);
          }
          else {
            //console.log('notas credito avidanti cargadas del estado: ',this.notas_credito_avidanti);
          } 
      } catch (error) {
        console.error('Error al cargar las notas credito avidanti:', error);
        throw error;
      }
    },


    iniciarSocket() { 
      socket.on('nuevo_registro', (registro, bot, solicitud) => {
        //console.log('registro recibido desde el store: ', registro);

        // usuario actual desde el store de auth
        const authStore = useAuthStore()
        const user = authStore.user 
        // verificar si la solicitud pertenece al usuario autenticado o si el usuario es admin o supervisor
        const perteneceASolicitud =  solicitud?.user_id === user.user_id ||  user.rol === 'admin' ||  user.rol === 'supervisor';  
        // Verificar si el registro pertenece a un bot en el estado y si ya tiene registros
        const perteneceABot = this.bots.some(bot => bot.id === registro.bot_id)
        //const yaExiste = this.registros.some(r => r.id === registro.id)
        const yaTieneRegistros = this.registros.some(r => r.bot_id === registro.bot_id)

        if (perteneceABot /*&& !yaExiste*/) {
          const indexBot = this.bots.findIndex(b => b.id === bot.id);
          if (indexBot !== -1) {
            this.bots[indexBot] = bot; // actualizamos datos del bot
            //console.log('Bot actualizado desde socket:', bot);
            this.actualizarMetricasIncremental(bot.id, registro);
          }
          if (yaTieneRegistros) {
            this.registros.unshift(registro)
            //console.log('Registro agregado desde socket:', registro)
          }else{
            console.log('Registro ignorado porque no existe historial para este bot:', registro.bot_id)
          }
          //actualizar solicitudes si pertenece al usuario
          if (perteneceASolicitud && solicitud) {
            const indexSolicitud = this.solicitudes.findIndex(s => s.id === solicitud.id);
            if (indexSolicitud !== -1) {
              // eliminar la solicitud antigua
              this.solicitudes.splice(indexSolicitud, 1);
              // insertar la solicitud actualizada al inicio
              this.solicitudes.unshift(solicitud);// actualizamos datos de la solicitud
              //console.log('Solicitud actualizado desde socket:', solicitud);
            }
          }
        }
      });
      // evento para agregar nueva solicituden tiempo real
      socket.on('nueva_solicitud', (solicitudes, user_id) => {
        const authStore = useAuthStore()
        const user = authStore.user 
        //console.log('Solicitudes recibida desde socket:', solicitudes);
        if (user.user_id === user_id) return;
        // validar si la socicitud es un array y si no convertirlo a uno para recorrerlo
        for (const solicitud of solicitudes) {
          //validar si la solicitud ya existe
          const yaExiste = this.solicitudes.some(s => s.id === solicitud.id);
          //validar si la solicitud pertenece al usuario actual
          const perteneceABot = this.bots.some(bot => bot.id === solicitud.bot_id)
          const yaTieneSolicitudes = this.solicitudes.some(s => s.bot_id === solicitud.bot_id)

          if (perteneceABot) {
            if (user.rol === 'admin' || user.rol === 'supervisor') {
              if (yaTieneSolicitudes) {
                if (!yaExiste) {
                  this.solicitudes.unshift(solicitud);
                  //console.log('Solicitud agregada desde socket (admin):', solicitud);
                }
              }
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
            //console.log('🔄 Bot actualizado desde socket:', bot);
          }

          // ✅ Agregar log al inicio de la lista si ya hay logs de ese bot
          if (yaTieneLogs) {
            this.logs.unshift(log);
            //console.log('✅ Log agregado desde socket:', log);
          } else {
            console.log('⚠️ Log ignorado: no hay historial previo para este bot:', log.bot_id);
          }
        } else {
          console.log('⚠️ Log ignorado: no pertenece a un bot del usuario actual');
        }
      });

      // Evento para historias clínicas
      socket.on('nueva_historia', (trazabilidad, botActualizado) => {
        //console.log('Trazabilidad recibida desde socket:', trazabilidad, botActualizado);

        // Verificar si el bot está en el estado
        const perteneceABot = this.bots.some(b => b.id === trazabilidad.bot_id);
        const yaExiste = this.historias_clinicas.some(t => t.id === trazabilidad.id);

        if (perteneceABot) {
          // 🔄 Actualizar bot en la lista
          const indexBot = this.bots.findIndex(b => b.id === botActualizado.id);
          if (indexBot !== -1) {
            this.bots.splice(indexBot, 1, botActualizado);
            //console.log('Bot actualizado desde socket:', botActualizado);
          }
          this.actualizarMetricaBot(botActualizado.id);

          if (this.historias_clinicas.length > 0) {
            // 📄 Agregar o actualizar trazabilidad
            if (!yaExiste) {
              this.historias_clinicas.unshift(trazabilidad);
              //console.log('✅ Trazabilidad agregada al state:', trazabilidad);
            } else {
              const index = this.historias_clinicas.findIndex(t => t.id === trazabilidad.id);
              if (index !== -1) {
                // Eliminar la historia antigua
                this.historias_clinicas.splice(index, 1);
              }
              // Insertar la historia actualizada al inicio
              this.historias_clinicas.unshift(trazabilidad);
              //console.log('🔄 Trazabilidad actualizada y movida al inicio del state:', trazabilidad);
            }
          }
          
        } else {
          console.warn('⚠️ Trazabilidad recibida de un bot no registrado:', trazabilidad.bot_id);
        }
      });
      // Evento para nuevas autorizaciones
      socket.on('nueva_autorizacion', (autorizacion, botActualizado) => {
        //console.log(' Autorización recibida desde socket:', autorizacion);

        // 1 Verificar si el bot pertenece al usuario actual
        const perteneceABot = this.bots.some(b => b.id === autorizacion.bot_id);
        if (!perteneceABot) {
          //console.warn('⚠️ Autorización ignorada: bot no pertenece al usuario actual');
          return;
        }

        // 2 Actualizar información del bot si cambió
        const indexBot = this.bots.findIndex(b => b.id === botActualizado.id);
        if (indexBot !== -1) {
          this.bots.splice(indexBot, 1, botActualizado);
          //console.log(' Bot actualizado desde socket (autorizaciones):', botActualizado);
        }

        // 3 Verificar si ya existe la autorización en el estado
        const yaExiste = this.autorizaciones.some(a => a.id === autorizacion.id);

        if (this.autorizaciones.length > 0) {
          if (!yaExiste) {
            //  Insertar al inicio
            this.autorizaciones.unshift(autorizacion);
            //console.log(' Nueva autorización agregada al state:', autorizacion);
          } else {
            //  Si ya existe, reemplazarla para mantener la más reciente
            const index = this.autorizaciones.findIndex(a => a.id === autorizacion.id);
            if (index !== -1) {
              this.autorizaciones.splice(index, 1);
            }
            this.autorizaciones.unshift(autorizacion);
            //console.log(' Autorización actualizada en el state:', autorizacion);
          }
        }

        // 4 (Opcional) Actualizar métricas o contadores del bot
        //this.actualizarMetricaBot(botActualizado.id);
        this.actualizarMetricasIncremental(botActualizado.id, autorizacion);

        // 5 (Opcional) Mostrar notificación al usuario
        // this.mostrarToast(`Nueva autorización registrada para ${autorizacion.Paciente?.nombre || 'paciente desconocido'}`);
      });

    },

    descargarFormato() {
      window.open(`${API_BASE_URL_BACK}/api/bots/descargar-formato`, '_blank');
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
