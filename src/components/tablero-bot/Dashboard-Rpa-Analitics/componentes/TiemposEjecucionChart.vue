<template>
  <div class="bg-gradient-to-br from-white to-slate-50 rounded-2xl shadow-lg border border-slate-200/50 p-6">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-sm font-bold text-slate-700 uppercase tracking-wide flex items-center gap-2">
        <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        Tiempos de Ejecución Promedio
      </h3>

      <div class="flex items-center gap-3">
        <!-- Selector Semanal/Mensual con pills modernos -->
        <div class="flex bg-slate-100 rounded-lg p-1 gap-1">
          <button 
            @click="modo = 'semanal'"
            :class="['px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200', modo === 'semanal'  ? 'bg-white text-emerald-600 shadow-sm'  : 'text-slate-600 hover:text-slate-800' ]" >
            Semanal
          </button>
          <button 
            @click="modo = 'mensual'"
            :class="['px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200', modo === 'mensual'  ? 'bg-white text-emerald-600 shadow-sm'  : 'text-slate-600 hover:text-slate-800' ]">
            Mensual
          </button>
        </div>

        <!-- Selector de Bot -->
        <div class="relative">
          <select v-model="botSeleccionado"  class="w-36 appearance-none text-sm bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-slate-400 shadow-sm" >
            <option disabled value="">Seleccionar bot</option>
            <option v-for="b in botsDisponibles" :key="b.id" :value="b.id">
              {{ b.nombre }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <!-- Selector de Máquina con animación de entrada -->
        <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 transform scale-95" enter-to-class="opacity-100 transform scale-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 transform scale-100" leave-to-class="opacity-0 transform scale-95" >
          <div v-if="botSeleccionado" class="relative">
            <select v-model="maquinaSeleccionada" class="w-32 appearance-none text-sm bg-white border border-slate-300 rounded-lg pl-3 pr-10 py-2 text-slate-700 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-pointer hover:border-slate-400 shadow-sm" >
              <option disabled value="">Seleccionar máquina</option>
              <option v-for="m in maquinasDelBot" :key="m.id" :value="m.id">
                Máquina {{ m.id }}
              </option>
            </select>
            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg class="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <!-- contenedor con altura fija para evitar bucles de resize -->
    <div class="h-[260px]">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analitic-functions'
import { useTableroFunctions } from '@/stores/tablero-functions'
import { Line } from 'vue-chartjs'
import {
  Chart,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Filler
} from 'chart.js'

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Filler)
const analitycsStore = useAnalyticsStore()
const tableroFunctions = useTableroFunctions()
// ======================
// DATOS MOCK
// ======================
/*const dataMock = {
  semanal: [
    { label: 'Sem 1', valor: 13.2 },
    { label: 'Sem 2', valor: 12.8 },
    { label: 'Sem 3', valor: 15.1 },
    { label: 'Sem 4', valor: 11.9 },
  ],
  mensual: [
    { label: 'Oct', valor: 14.6 },
    { label: 'Nov', valor: 12.3 },
    { label: 'Dic', valor: 13.8 },
  ]
}*/

const modo = ref('semanal')
const botSeleccionado = ref('')
const maquinaSeleccionada = ref('')

const { tiemposEjecucion } = storeToRefs(analitycsStore)
const { botsDisponibles } = storeToRefs(tableroFunctions)

const maquinasDelBot = computed(() => {
  if (!botSeleccionado.value) return []
  const bot = botsDisponibles.value.find(b => b.id === botSeleccionado.value)
  return bot?.Maquinas || []
})

watch([modo, botSeleccionado, maquinaSeleccionada], () => {
  if (!botSeleccionado.value || !maquinaSeleccionada.value) return
  analitycsStore.loadTiemposEjecucion(
    modo.value,
    botSeleccionado.value,
    maquinaSeleccionada.value
  )
})

onMounted(async () => {
  await tableroFunctions.getAllBots()
  console.log('bots: ', botsDisponibles.value);
  
})

// chartOptions declarado como objeto estable
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: { color: 'rgba(0,0,0,0.04)' },
      ticks: {
        // <-- CORRECTO: backticks en template string
        callback: (value) => `${value}s`
      }
    },
    x: {
      grid: { display: false }
    }
  },
  elements: {
    point: {
      hoverRadius: 6
    }
  }
}

const chartData = computed(() => {
  const lista = tiemposEjecucion.value[modo.value] || []
  return {
    labels: lista.map(i => i.label),
    datasets: [
      {
        label: 'Tiempo Promedio (segundos)',
        data: lista.map(i => i.valor),
        fill: true,
        tension: 0.1,
        borderWidth: 2,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        pointBackgroundColor: '#10b981',
        pointRadius: 4
      }
    ]
  }
})

</script>
