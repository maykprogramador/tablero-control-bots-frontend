import { defineStore } from 'pinia'
import axios from 'axios'
import socket from '@/socket'
import { API_BASE_URL_BACK } from '@/config'
import { setupAxiosInterceptor } from '@/utils/axiosInterceptor' // ✅ Importar interceptor


const axiosInstance = axios.create({
  baseURL: `${API_BASE_URL_BACK}/api/analytics/`, // Asegúrate de que esta URL es correcta
  withCredentials: true, // ⚠️ IMPORTANTE: Permite enviar cookies y autenticación
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// ✅ Aplicar el interceptor a ESTA instancia específica
setupAxiosInterceptor(axiosInstance);

export const useAnalyticsStore = defineStore('analytics-store', {
  state: () => ({
    isLoading: false,
    kpis: { totalBots: 0, botsActivos: 0, botsInactivos: 0, procesosHoy: { registros: 0, trazabilidades: 0, autorizaciones: 0 }, trends: { registros: 0, trazabilidades: 0, autorizaciones: 0 }, tasasHoy: {} },
    registrosPorBot: [],
    procesadosPorMaquina: [],
    enviosHistoriasClinicas: { semanal: [], mensual: [] },
    tiemposEjecucion: { semanal: [], mensual: [] },
    // Para gráficos futuros
    /*registrosPorBot: [],
    tortaEstados: [],
    actividadPorDia: [],*/
  }),

  actions: {
    async loadKpis() {
      try {
        const { data } = await axiosInstance.get(`kpis`)

        this.kpis = data
      } catch (err) {
        console.error("Error loading KPIs:", err)
      } 
    },
    async loadRegistrosBots() {
      try {
        const { data } = await axiosInstance.get(`registros-bots`)
        // Suponiendo que data es un array de objetos con 'bot' y 'registros'
        this.registrosPorBot = data
      } catch (err) {
        console.error("Error loading registros por bot:", err)
      } 
    },
    async loadProcesadosPorMaquina() {
      try {
        const { data } = await axiosInstance.get(`procesados-por-maquina`)
        this.procesadosPorMaquina = data
      } catch (err) {
        console.error("Error loading procesados por maquina:", err)
      }
    }
    ,
    async loadEnviosHistoriasClinicas() {
      try {
        const { data } = await axiosInstance.get(`envios-historias`)
        this.enviosHistoriasClinicas = data
      } catch (err) {
        console.error("Error loading envios de historias clinicas:", err)
      }
    },
    async loadTiemposEjecucion(modo, bot_id, maquina_id) {
      try {
        const { data } = await axiosInstance.get(`tiempos-ejecucion`, {
          params: { modo, bot_id, maquina_id }
        })
        this.tiemposEjecucion = data
        // Aquí puedes decidir cómo almacenar o procesar los datos recibidos
        console.log("Tiempos de ejecución:", data)
      } catch (err) {
        console.error("Error loading tiempos de ejecución:", err)
      }
    }
  }
})
