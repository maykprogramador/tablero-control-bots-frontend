<template>
  <div class="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-700">
    
    <header class="sticky top-0 z-30 bg-white/80 backdrop-blur-xl border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/30">
          <ActivityIcon class="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 class="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 bg-clip-text text-transparent">
            RPA Control Center
          </h1>
          <p class="text-xs text-slate-400 font-medium tracking-wide">MONITOREO EN TIEMPO REAL</p>
        </div>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg border border-slate-200">
          <CalendarIcon class="w-4 h-4 text-slate-500" />
          <span class="text-sm font-medium text-slate-600">{{ currentDate }}</span>
        </div>
        <button class="relative p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors">
          <BellIcon class="w-5 h-5" />
          <span class="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
        </button>
        <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 ring-2 ring-white shadow-md"></div>
      </div>
    </header>

    <main class="p-6 max-w-[1920px] mx-auto space-y-12">
      <!-- SECCIÓN 1: TARJETAS KPI   -->
      <section id="kpi-section" class="space-y-4">

        <!-- Loading Skeleton -->
        <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
          <div v-for="n in 4" :key="n" class="h-32 bg-slate-200 rounded-2xl"></div>
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
        <!-- Más adelante insertaremos:
          - Gráfica de barras
          - Gráfica de líneas
              - Donut de distribución
              - Comparativas
            -->
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
const activeTab = ref('registros')
const searchQuery = ref('')

// --- MOCK DATA GENERATION ---
const bots = [
  { id: 1, nombre: 'Bot Facturación', estado: 'activo' },
  { id: 2, nombre: 'Bot Citas Médicas', estado: 'ejecucion' },
  { id: 3, nombre: 'Bot Autorizaciones', estado: 'activo' },
  { id: 4, nombre: 'Bot Historias Clínicas', estado: 'error' },
]

const generateRegistros = (count) => Array.from({ length: count }).map((_, i) => ({
  id: `REG-${Math.floor(Math.random() * 100000)}`,
  bot_id: bots[i % 4].id,
  nombreBot: bots[i % 4].nombre,
  mensaje: ['Procesado correctamente', 'Error de timeout', 'Validación exitosa', 'Datos incompletos'][Math.floor(Math.random() * 4)],
  estado: ['exito', 'exito', 'exito', 'error', 'proceso'][Math.floor(Math.random() * 5)],
  fecha_ejecucion: new Date().toLocaleTimeString(),
  duracion: Math.floor(Math.random() * 5000) + 'ms'
}))

const generateLogs = (count) => Array.from({ length: count }).map((_, i) => ({
  id: `${Math.floor(Math.random() * 9999)}`,
  nombreBot: bots[i % 4].nombre,
  mensaje: 'NullReferenceException en modulo principal...',
  maquina_id: `SRV-0${Math.floor(Math.random() * 3) + 1}`,
  fecha_log: new Date().toLocaleTimeString()
}))

// Data Containers
const tableData = ref([])
const logsData = ref([])

// --- CHARTS CONFIG ---
const charts = ref({
  requestsTrend: {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    datasets: [{
      label: 'Solicitudes',
      data: [65, 59, 80, 81, 56, 55, 90],
      borderColor: '#6366f1',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      fill: true,
      tension: 0.4
    }]
  },
  statusDist: {
    labels: ['Éxito', 'Error', 'Proceso'],
    datasets: [{
      data: [300, 50, 100],
      backgroundColor: ['#10b981', '#f43f5e', '#3b82f6'],
      borderWidth: 0,
      hoverOffset: 10
    }]
  },
  logsByBot: {
    labels: ['Facturacion', 'Citas', 'Auth', 'HC', 'Pagos'],
    datasets: [{
      label: 'Registros',
      data: [1200, 1900, 300, 500, 200],
      backgroundColor: '#cbd5e1',
      hoverBackgroundColor: '#6366f1',
      borderRadius: 6
    }]
  },
  logsByMachine: {
    labels: ['SRV-01', 'SRV-02', 'SRV-03'],
    datasets: [{
      label: 'Carga',
      data: [85, 45, 60],
      backgroundColor: ['#3b82f6', '#8b5cf6', '#06b6d4'],
      borderRadius: 4
    }]
  },
  clinicalHistory: {
    labels: ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'],
    datasets: [{
      label: 'Envíos',
      data: [120, 200, 150, 320],
      borderColor: '#0ea5e9',
      backgroundColor: 'rgba(14, 165, 233, 0.2)',
      fill: true,
      tension: 0.4
    }]
  },
  authStacked: {
    labels: ['EPS Sanitas', 'Sura', 'Nueva EPS'],
    datasets: [
      { label: 'Aprobado', data: [60, 80, 40], backgroundColor: '#10b981' },
      { label: 'Rechazado', data: [10, 5, 20], backgroundColor: '#f43f5e' },
      { label: 'Pendiente', data: [30, 15, 40], backgroundColor: '#fbbf24' }
    ]
  }
})

// Custom Heatmap Data (Rows = Bots, Cols = Hours)
const heatmapData = ref([
  Array.from({length: 24}, () => Math.floor(Math.random() * 5)), // Bot Fact
  Array.from({length: 24}, () => Math.floor(Math.random() * 20)), // Bot Auth (High error)
  Array.from({length: 24}, () => Math.floor(Math.random() * 2)),  // Bot Citas
  Array.from({length: 24}, () => 0)                                // Bot HC
])

// --- OPTIONS ---
const commonOptions = { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } } }

const lineOptions = {
  ...commonOptions,
  scales: { x: { grid: { display: false } }, y: { border: { dash: [4, 4] }, grid: { color: '#f1f5f9' } } }
}

const doughnutOptions = { cutout: '75%', plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } } }

const barOptions = { ...commonOptions, scales: { x: { grid: { display: false } }, y: { display: false } } }
const horizontalBarOptions = { ...commonOptions, indexAxis: 'y', scales: { x: { display: false }, y: { grid: { display: false } } } }
const areaOptions = { ...lineOptions, plugins: { legend: { display: false } } }
const stackedBarOptions = { ...commonOptions, scales: { x: { stacked: true, grid: { display: false } }, y: { stacked: true, display: false } }, plugins: { legend: { position: 'bottom', labels: { usePointStyle: true, boxWidth: 8 } } } }

// --- LOGIC ---
const tabs = [
  { id: 'registros', label: 'Registros Recientes' },
  { id: 'logs', label: 'Logs de Error' },
  { id: 'auth', label: 'Autorizaciones' },
]

const currentTableHeaders = computed(() => {
  if (activeTab.value === 'registros') return ['ID', 'Bot', 'Mensaje', 'Estado', 'Fecha']
  if (activeTab.value === 'logs') return ['ID Error', 'Origen', 'Detalle', 'Máquina', 'Fecha']
  return ['ID', 'Paciente', 'Estado', 'Fecha']
})

const filteredTableData = computed(() => {
  let data = activeTab.value === 'logs' ? logsData.value : tableData.value
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    return data.filter(item => 
      item.nombreBot?.toLowerCase().includes(q) || 
      item.mensaje?.toLowerCase().includes(q) ||
      item.id?.toString().toLowerCase().includes(q)
    )
  }
  return data
})

const getStatusBadge = (status) => {
  const styles = {
    exito: 'bg-emerald-100 text-emerald-700',
    error: 'bg-rose-100 text-rose-700',
    proceso: 'bg-blue-100 text-blue-700'
  }
  return styles[status] || 'bg-slate-100 text-slate-700'
}

const getStatusDot = (status) => {
    const styles = {
    exito: 'bg-emerald-500',
    error: 'bg-rose-500',
    proceso: 'bg-blue-500 animate-pulse'
  }
  return styles[status] || 'bg-slate-300'
}

const getHeatmapColor = (value) => {
  if (value === 0) return 'bg-slate-100'
  if (value < 5) return 'bg-rose-200'
  if (value < 10) return 'bg-rose-300'
  if (value < 15) return 'bg-rose-400'
  return 'bg-rose-500 shadow-lg shadow-rose-500/50'
}

// --- INIT ---
onMounted( async () => {
  // Simulate API fetch
  await analitycsStore.loadKpis()
  /*setTimeout(() => {
    tableData.value = generateRegistros(50)
    logsData.value = generateLogs(20)
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