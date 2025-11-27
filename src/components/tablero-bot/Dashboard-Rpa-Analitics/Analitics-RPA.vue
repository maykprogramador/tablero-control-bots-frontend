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

    <main class="p-6 max-w-[1920px] mx-auto space-y-8">
      
      <div v-if="isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        <div v-for="n in 4" :key="n" class="h-32 bg-slate-200 rounded-2xl"></div>
      </div>

      <section v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div 
          v-for="(kpi, index) in kpis" 
          :key="index"
          class="group relative bg-white rounded-2xl p-6 border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <div class="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <component :is="kpi.icon" class="w-16 h-16" :class="kpi.colorText" />
          </div>
          <div class="relative z-10 flex flex-col justify-between h-full">
            <div class="flex items-center gap-3 mb-2">
              <div class="p-2 rounded-lg bg-opacity-10" :class="[kpi.colorBg, kpi.colorText]">
                <component :is="kpi.icon" class="w-5 h-5" />
              </div>
              <span class="text-sm font-semibold text-slate-500 uppercase tracking-wider">{{ kpi.label }}</span>
            </div>
            <div class="flex items-end gap-2">
              <span class="text-3xl font-bold text-slate-800">{{ kpi.value }}</span>
              <span v-if="kpi.trend" class="text-xs font-bold mb-1" :class="kpi.trend > 0 ? 'text-emerald-500' : 'text-rose-500'">
                {{ kpi.trend > 0 ? '+' : '' }}{{ kpi.trend }}%
              </span>
            </div>
            <div class="w-full bg-slate-100 h-1.5 rounded-full mt-4 overflow-hidden">
              <div class="h-full rounded-full transition-all duration-1000" :class="kpi.colorBgSolid" :style="{ width: kpi.progress + '%' }"></div>
            </div>
          </div>
        </div>
      </section>

      <section v-if="!isLoading" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div class="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40">
          <div class="flex justify-between items-center mb-6">
            <h3 class="text-lg font-bold text-slate-800 flex items-center gap-2">
              <TrendingUpIcon class="w-5 h-5 text-indigo-500" />
              Tendencia de Solicitudes
            </h3>
            <select class="bg-slate-50 border border-slate-200 text-sm rounded-lg px-3 py-1 outline-none focus:ring-2 focus:ring-indigo-500/20">
              <option>Últimos 7 días</option>
              <option>Último mes</option>
            </select>
          </div>
          <div class="h-[300px] w-full relative">
            <Line :data="charts.requestsTrend" :options="lineOptions" />
          </div>
        </div>

        <div class="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40 flex flex-col">
          <h3 class="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
            <PieChartIcon class="w-5 h-5 text-purple-500" />
            Distribución de Estado
          </h3>
          <div class="flex-1 flex items-center justify-center relative">
            <Doughnut :data="charts.statusDist" :options="doughnutOptions" />
            <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span class="text-3xl font-bold text-slate-800">98%</span>
              <span class="text-xs text-slate-400 uppercase">Eficiencia</span>
            </div>
          </div>
        </div>
      </section>

      <section v-if="!isLoading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40">
          <h3 class="text-sm font-bold text-slate-500 uppercase mb-4">Registros por Bot</h3>
          <div class="h-[200px]">
            <Bar :data="charts.logsByBot" :options="barOptions" />
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40">
          <h3 class="text-sm font-bold text-slate-500 uppercase mb-4">Carga por Máquina</h3>
          <div class="h-[200px]">
            <Bar :data="charts.logsByMachine" :options="horizontalBarOptions" />
          </div>
        </div>

        <div class="bg-white rounded-2xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40">
          <h3 class="text-sm font-bold text-slate-500 uppercase mb-4">Envíos Historias Clínicas</h3>
          <div class="h-[200px]">
            <Line :data="charts.clinicalHistory" :options="areaOptions" />
          </div>
        </div>
      </section>

      <section v-if="!isLoading" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div class="lg:col-span-7 bg-white rounded-2xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40">
           <h3 class="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
            <FlameIcon class="w-5 h-5 text-rose-500" />
            Mapa de Calor: Errores Críticos
          </h3>
          <p class="text-xs text-slate-400 mb-6">Intensidad de fallos por hora del día (24h)</p>
          
          <div class="grid grid-cols-[auto_1fr] gap-4">
             <div class="flex flex-col justify-between text-xs text-slate-400 font-mono py-1">
                <span>Bot Fact.</span>
                <span>Bot Auth.</span>
                <span>Bot Citas</span>
                <span>Bot HC</span>
             </div>
             <div class="grid grid-cols-24 gap-1">
                <template v-for="(row, rIndex) in heatmapData" :key="rIndex">
                  <div 
                    v-for="(val, cIndex) in row" 
                    :key="cIndex"
                    class="h-8 rounded-sm transition-all hover:scale-125 cursor-pointer relative group"
                    :class="getHeatmapColor(val)"
                  >
                     <div class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap z-20">
                        {{ cIndex }}:00 hrs - {{ val }} Errores
                     </div>
                  </div>
                </template>
             </div>
             <div></div>
             <div class="flex justify-between text-[10px] text-slate-300 font-mono px-1">
                <span>00:00</span>
                <span>06:00</span>
                <span>12:00</span>
                <span>18:00</span>
                <span>23:59</span>
             </div>
          </div>
        </div>

        <div class="lg:col-span-5 bg-white rounded-2xl p-6 border border-slate-100 shadow-lg shadow-slate-200/40">
           <h3 class="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <FileCheckIcon class="w-5 h-5 text-emerald-500" />
            Estado Autorizaciones
          </h3>
          <div class="h-[250px]">
            <Bar :data="charts.authStacked" :options="stackedBarOptions" />
          </div>
        </div>
      </section>

      <section v-if="!isLoading" class="bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/40 overflow-hidden">
        
        <div class="flex border-b border-slate-100">
           <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            class="px-6 py-4 text-sm font-medium transition-all relative"
            :class="activeTab === tab.id ? 'text-indigo-600' : 'text-slate-500 hover:text-slate-700'"
           >
            {{ tab.label }}
            <span v-if="activeTab === tab.id" class="absolute bottom-0 left-0 w-full h-1 bg-indigo-600 rounded-t-full"></span>
           </button>
        </div>

        <div class="p-4 flex flex-col md:flex-row justify-between gap-4 bg-slate-50/50">
          <div class="relative w-full md:w-96">
            <SearchIcon class="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Buscar por ID, nombre o mensaje..." 
              class="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            />
          </div>
          <div class="flex gap-2">
             <button class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <FilterIcon class="w-4 h-4" /> Filtros
             </button>
             <button class="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 flex items-center gap-2">
                <DownloadIcon class="w-4 h-4" /> Exportar
             </button>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
                 <th v-for="header in currentTableHeaders" :key="header" class="px-6 py-3 font-semibold">{{ header }}</th>
                 <th class="px-6 py-3 font-semibold text-right">Acciones</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              <tr 
                v-for="row in filteredTableData" 
                :key="row.id" 
                class="hover:bg-slate-50/80 transition-colors group"
              >
                <template v-if="activeTab === 'registros'">
                  <td class="px-6 py-4">
                    <span class="font-mono text-xs text-slate-400">#{{ row.id.substring(0,6) }}</span>
                  </td>
                  <td class="px-6 py-4">
                    <div class="flex items-center gap-2">
                      <div class="w-2 h-2 rounded-full" :class="getStatusDot(row.estado)"></div>
                      <span class="text-sm font-medium text-slate-700">{{ row.nombreBot }}</span>
                    </div>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500 truncate max-w-[200px]">{{ row.mensaje }}</td>
                  <td class="px-6 py-4">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="getStatusBadge(row.estado)">
                      {{ row.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-sm text-slate-500">{{ row.fecha_ejecucion }}</td>
                </template>

                <template v-if="activeTab === 'logs'">
                  <td class="px-6 py-4 font-mono text-xs text-rose-500">Error #{{ row.id }}</td>
                  <td class="px-6 py-4 text-sm font-bold text-slate-700">{{ row.nombreBot }}</td>
                  <td class="px-6 py-4 text-sm text-rose-600 bg-rose-50 p-1 rounded max-w-xs truncate">{{ row.mensaje }}</td>
                  <td class="px-6 py-4 text-sm text-slate-500">{{ row.maquina_id }}</td>
                  <td class="px-6 py-4 text-sm text-slate-500">{{ row.fecha_log }}</td>
                </template>
                
                 <td class="px-6 py-4 text-right">
                    <button class="text-slate-400 hover:text-indigo-600 transition-colors">
                       <MoreHorizontalIcon class="w-5 h-5" />
                    </button>
                 </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="px-6 py-4 border-t border-slate-100 flex items-center justify-between">
           <span class="text-xs text-slate-400">Mostrando <strong>1-10</strong> de <strong>{{ tableData.length }}</strong> resultados</span>
           <div class="flex gap-1">
              <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-50">
                 <ChevronLeftIcon class="w-4 h-4" />
              </button>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg bg-indigo-600 text-white shadow-md shadow-indigo-500/20">1</button>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">2</button>
              <button class="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 text-slate-500 hover:bg-slate-50">
                 <ChevronRightIcon class="w-4 h-4" />
              </button>
           </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
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

// --- KPIs ---
const kpis = ref([
  { 
    label: 'Total Bots Activos', 
    value: 12, 
    trend: 0, 
    progress: 100,
    icon: ZapIcon, 
    colorBg: 'bg-indigo-500', 
    colorBgSolid: 'bg-indigo-500',
    colorText: 'text-indigo-600' 
  },
  { 
    label: 'Tasa de Éxito', 
    value: '98.5%', 
    trend: 2.4, 
    progress: 98.5,
    icon: CheckIcon, 
    colorBg: 'bg-emerald-500',
    colorBgSolid: 'bg-emerald-500', 
    colorText: 'text-emerald-600' 
  },
  { 
    label: 'Bots en Error', 
    value: 1, 
    trend: -10, 
    progress: 8,
    icon: AlertIcon, 
    colorBg: 'bg-rose-500',
    colorBgSolid: 'bg-rose-500', 
    colorText: 'text-rose-600' 
  },
  { 
    label: 'Volumen Hoy', 
    value: '14.2k', 
    trend: 12, 
    progress: 65,
    icon: ServerIcon, 
    colorBg: 'bg-blue-500',
    colorBgSolid: 'bg-blue-500', 
    colorText: 'text-blue-600' 
  }
])

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
onMounted(() => {
  // Simulate API fetch
  setTimeout(() => {
    tableData.value = generateRegistros(50)
    logsData.value = generateLogs(20)
    isLoading.value = false
  }, 1500)
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