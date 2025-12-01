<template>
  <div class="min-h-screen rounded-2xl bg-slate-50 dark:bg-[#21292eae] text-slate-800 dark:text-gray-100 font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 selection:text-indigo-700 dark:selection:text-indigo-300">
    <main class="p-6 max-w-[1920px] mx-auto space-y-12">
      <!-- SECCIÓN 1: TARJETAS KPI   -->
      <section id="kpi-section" class="space-y-4">

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          <div v-for="n in 4" :key="n" class="h-32 bg-slate-200 dark:bg-gray-800 rounded-2xl"></div>
        </div>
        <!-- KPI Cards -->
        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Aquí se insertarán nuestras KPI Cards -->
          <KpiCard title="Total Bots" icon="bot" color="blue" :value="kpis.totalBots" :trend="0" />

          <KpiCard title="Bots Activos" icon="activity" color="green" :value="kpis.botsActivos" :trend="0" />

          <KpiCard title="Bots Inactivos" icon="alert-circle" color="red" :value="kpis.botsInactivos" :trend="0" />

          <KpiCard title="Tasa de Éxito" icon="check-circle-2" color="green" :value="(kpis.tasasHoy.tasaExito)+'%'" :trend="0" />
          <KpiCard title="Tasa de Error" icon="alert-circle" color="red" :value="(kpis.tasasHoy.tasaError)+'%'" :trend="0" />

          <KpiCard title="Registros" icon="file-text" color="purple" :value="kpis.procesosHoy.registros" :trend="kpis.trends.registros" />
          <KpiCard title="Historias Enviadas" icon="pie-chart" color="orange" :value="kpis.procesosHoy.trazabilidades" :trend="kpis.trends.trazabilidades" />
          <KpiCard title="Autorizaciones" icon="check-circle-2" color="teal" :value="kpis.procesosHoy.autorizaciones" :trend="kpis.trends.autorizaciones" />
        </div>
      </section>
      <!-- SECCIÓN 2: GRÁFICOS       -->
      <section id="charts-section" class="space-y-4 ">
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <RegistrosPorBotChart />
          <RegistrosPorMaquinaChart />
          <HistoriasEnviosChart />
          <TiemposEjecucionChart class="col-span-2"/>
          <DistribucionEstadosChart />
        </div>
        
      </section>
      <!-- SECCIÓN 3: TABLAS         -->
      <section id="tables-section" class="space-y-6">
        <!-- Placeholder de futuras tablas -->
      </section>
    </main>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analitic-functions'
const analitycsStore = useAnalyticsStore()
const { kpis } = storeToRefs(analitycsStore)
import KpiCard from './componentes/KpiCard.vue'
import RegistrosPorBotChart from './componentes/RegistrosPorBotChart.vue'
import RegistrosPorMaquinaChart from './componentes/RegistrosPorMaquinaChart.vue'
import { 
  Activity as ActivityIcon, 
  Calendar as CalendarIcon, 
  Bell as BellIcon, 
  TrendingUp as TrendingUpIcon,
  PieChart as PieChartIcon,
  Search as SearchIcon,
  Filter as FilterIcon,
  Download as DownloadIcon,
  MoreHorizontal as MoreHorizontalIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Zap as ZapIcon,
  AlertOctagon as AlertIcon,
  CheckCircle2 as CheckIcon,
  Server as ServerIcon,
  Flame as FlameIcon,
  FileCheck as FileCheckIcon
} from 'lucide-vue-next'

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { Bar, Line, Doughnut } from 'vue-chartjs'
import HistoriasEnviosChart from './componentes/HistoriasEnviosChart.vue'
import TiemposEjecucionChart from './componentes/TiemposEjecucionChart.vue'
import DistribucionEstadosChart from './componentes/DistribucionEstadosChart.vue'

// --- CHART REGISTRATION ---
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

// --- STATE ---
const isLoading = ref(true)
const currentDate = new Date().toLocaleDateString('es-CO', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
// --- INIT ---
onMounted( async () => {
  // Simulate API fetch
  await analitycsStore.loadKpis()
  /*setTimeout(() => {
    isLoading.value = false
  }, 1000)*/
  isLoading.value = false
})
</script>

<style>
/* Custom Scrollbar for tables */
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-track {
  background: transparent; 
}
::-webkit-scrollbar-thumb {
  background: #cbd5e1; 
  border-radius: 3px;
}
::-webkit-scrollbar-thumb:hover {
  background: #94a3b8; 
}
</style>