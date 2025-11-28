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
    kpis: { totalBots: 0, totalRegistros: 0, totalErrores: 0, totalUsuarios: 0, },
    // Para gráficos futuros
    /*registrosPorBot: [],
    tortaEstados: [],
    actividadPorDia: [],*/
  }),

  actions: {
    async loadKpis() {
      try {
        this.isLoading = true
        const { data } = await axiosInstance.get(`kpis`)

        this.kpis = data
      } catch (err) {
        console.error("Error loading KPIs:", err)
      } finally {
        this.isLoading = false
      }
    },
  }
})
