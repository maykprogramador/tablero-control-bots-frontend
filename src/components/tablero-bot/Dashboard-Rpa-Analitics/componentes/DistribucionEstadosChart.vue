<template>
  <div class="bg-white dark:bg-slate-800 shadow rounded-xl p-6 border border-slate-200 dark:border-slate-700">
    <!-- TITULO + SELECT A LA DERECHA -->
    <div class="flex items-start justify-between mb-4">
      <!-- TÍTULO -->
      <h3 class="text-sm font-bold text-slate-600 dark:text-slate-300 flex items-center gap-2">
        <PieChartIcon class="text-purple-500" />
        Distribución de Estado
      </h3>

      <!-- SELECTOR DE BOT -->
      <div class="relative">
        <select
          v-model="botSeleccionado"
          @change="cargarDistribucion"
          class="w-36 appearance-none text-sm bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 
                rounded-lg pl-3 pr-10 py-2 text-slate-700 dark:text-slate-200 font-medium 
                focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent 
                transition-all duration-200 cursor-pointer hover:border-slate-400 dark:hover:border-slate-500 
                shadow-sm"
        >
          <option disabled value="">Seleccionar bot</option>
          <option v-for="bot in bots" :key="bot.id" :value="bot.id">
            {{ bot.nombre }}
          </option>
        </select>

        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-4 h-4 text-slate-400 dark:text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <!-- DONUT -->
    <div class="relative w-full flex justify-center items-center" style="height: 260px;">
      <Doughnut :data="chartData" :options="chartOptions" />

      <!-- TEXTO CENTRAL -->
      <div class="absolute flex flex-col items-center justify-center">
        <p class="text-4xl font-bold text-slate-700 dark:text-slate-200">
          {{ porcentajeEficiencia }}%
        </p>
        <p class="text-xs tracking-wide text-gray-400 dark:text-gray-500">EFICIENCIA</p>
      </div>
    </div>

    <!-- LEYENDA -->
    <div class="flex justify-center gap-6 mt-4 text-sm text-slate-700 dark:text-slate-200">
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-emerald-500 rounded-full"></span> Éxito
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-rose-500 rounded-full"></span> Error
      </div>
      <div class="flex items-center gap-2">
        <span class="w-3 h-3 bg-blue-500 rounded-full"></span> Pendiente
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analitic-functions'
import { useTableroFunctions } from '@/stores/tablero-functions'
import { Doughnut } from 'vue-chartjs'
import { PieChartIcon } from 'lucide-vue-next'
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

// ------------------------------
// STATE
// ------------------------------
const botSeleccionado = ref(1)
const estados = ref({ exito: 0, error: 0, pendiente: 0 })
const tableroFunctions = useTableroFunctions()
const analyticsStore = useAnalyticsStore()
const { botsDisponibles: bots } = storeToRefs(tableroFunctions)

// ------------------------------
// CARGAR DISTRIBUCIÓN POR BOT
// ------------------------------
const cargarDistribucion = async () => {
  if (!botSeleccionado.value) return
  estados.value = await analyticsStore.loadDistribucionEstados(botSeleccionado.value)
}

// ------------------------------
// EFICIENCIA
// ------------------------------
const porcentajeEficiencia = computed(() => {
  const total = estados.value.exito + estados.value.error + estados.value.pendiente
  if (total === 0) return 0
  return Math.round((estados.value.exito / total) * 100)
})

// ------------------------------
// CHART DATA
// ------------------------------
const chartData = computed(() => ({
  labels: ['Éxito', 'Error', 'Pendiente'],
  datasets: [
    {
      data: [
        estados.value.exito,
        estados.value.error,
        estados.value.pendiente
      ],
      backgroundColor: ['#10b981', '#ef4444', '#f59e0b'],
      borderWidth: 0,
      cutout: '72%'
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { display: false } }
}

// ------------------------------
// INIT
// ------------------------------
onMounted(async () => {
  await tableroFunctions.getAllBots()
  await cargarDistribucion()
})
</script>
