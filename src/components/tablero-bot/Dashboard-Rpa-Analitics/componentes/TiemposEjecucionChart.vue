<template>
  <div
    class="rounded-2xl shadow-lg border p-6 transition-colors duration-300"
    :class="isDark ? 'dark:bg-slate-800 dark:border-slate-700' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/50'" >
    <div class="flex justify-between items-center mb-6">
      <h3
        class="text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-colors duration-300"
        :class="isDark ? 'text-slate-200' : 'text-slate-700'"
      >
        <svg class="w-4 h-4" :class="isDark ? 'text-emerald-400' : 'text-emerald-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>

        Tiempos de Ejecución Promedio
      </h3>

      <div class="flex items-center gap-3">
        <!-- Selector Semanal/Mensual -->
        <div
          class="flex rounded-lg p-1 gap-1 transition-colors duration-300"
          :class="isDark ? 'bg-slate-700' : 'bg-slate-100'"
        >
          <button 
            @click="modo = 'semanal'"
            @change="cargarTiempos"
            :class="[
              'px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
              modo === 'semanal'
                ? (isDark
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'bg-white text-emerald-600 shadow-sm')
                : (isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-800')
            ]"
          >
            Semanal
          </button>
          <button 
            @click="modo = 'mensual'"
            @change="cargarTiempos"
            :class="[
              'px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
              modo === 'mensual'
                ? (isDark
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'bg-white text-emerald-600 shadow-sm')
                : (isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-800')
            ]"
          >
            Mensual
          </button>
          <button 
            @click="modo = 'anual'"
            @change="cargarTiempos"
            :class="[
              'px-4 py-1.5 text-xs font-medium rounded-md transition-all duration-200',
              modo === 'anual'
                ? (isDark
                    ? 'bg-slate-800 text-emerald-400 shadow-sm'
                    : 'bg-white text-emerald-600 shadow-sm')
                : (isDark
                    ? 'text-slate-300 hover:text-white'
                    : 'text-slate-600 hover:text-slate-800')
            ]"
          >
            Anual
          </button>
        </div>
        <!-- Selector de Bot -->
        <div class="relative">
          <select
            v-model="botSeleccionado"
            class="w-36 appearance-none text-sm rounded-lg pl-3 pr-10 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-pointer shadow-sm"
            :class="isDark ? 'bg-slate-800 border border-slate-600 text-slate-200 hover:border-slate-500' : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'" >
            <option disabled value="">Seleccionar bot</option>
            <option v-for="b in botsDisponibles" :key="b.id" :value="b.id">
              {{ b.nombre }}
            </option>
          </select>

          <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
            <svg class="w-4 h-4" :class="isDark ? 'text-slate-400' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
        <!-- Selector de Máquina -->
        <transition enter-active-class="transition-all duration-300 ease-out" enter-from-class="opacity-0 transform scale-95" enter-to-class="opacity-100 transform scale-100" leave-active-class="transition-all duration-200 ease-in" leave-from-class="opacity-100 transform scale-100" leave-to-class="opacity-0 transform scale-95" >
          <div v-if="botSeleccionado" class="relative">
            <select
              v-model="maquinaSeleccionada"
              class="w-32 appearance-none text-sm rounded-lg pl-3 pr-10 py-2 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-200 cursor-pointer shadow-sm"
              :class="isDark ? 'bg-slate-800 border border-slate-600 text-slate-200 hover:border-slate-500' : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'" >
              <option disabled value="">Seleccionar máquina</option>
              <option v-for="m in maquinasDelBot" :key="m.id" :value="m.id">
                Máquina {{ m.id }}
              </option>
            </select>

            <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
              <svg class="w-4 h-4" :class="isDark ? 'text-slate-400' : 'text-slate-400'" fill="none" stroke="currentColor" viewBox="0 0 24 24" >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </transition>

      </div>
    </div>
    <!-- Contenedor gráfico -->
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

const { isDark } = storeToRefs(tableroFunctions)

const modo = ref('semanal')
const botSeleccionado = ref(1)
const maquinaSeleccionada = ref(1)

const { tiemposEjecucion } = storeToRefs(analitycsStore)
const { botsDisponibles } = storeToRefs(tableroFunctions)

const cargarTiempos = async () => {
  if (!botSeleccionado.value || !maquinaSeleccionada.value) return
  await analitycsStore.loadTiemposEjecucion( modo.value, botSeleccionado.value, maquinaSeleccionada.value)
}

const maquinasDelBot = computed(() => {
  if (!botSeleccionado.value) return []
  const bot = botsDisponibles.value.find(b => b.id === botSeleccionado.value)
  return bot?.Maquinas || []
})

watch([modo, botSeleccionado, maquinaSeleccionada], () => {
  if (!botSeleccionado.value || !maquinaSeleccionada.value) return
  analitycsStore.loadTiemposEjecucion( modo.value, botSeleccionado.value, maquinaSeleccionada.value )
})

onMounted(async () => {
  await tableroFunctions.getAllBots()
  cargarTiempos()
})

/* === Chart Options === */
const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      mode: 'index',
      intersect: false,
      callbacks: {
        label: (context) => {
          const segundos = context.raw
          const minutos = (segundos / 60).toFixed(2)
          return `${minutos} min`
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: isDark.value
          ? 'rgba(255,255,255,0.08)'
          : 'rgba(0,0,0,0.04)'
      },
      ticks: {
        callback: (value) => {
          const minutos = (value / 60).toFixed(1)
          return `${minutos} min`
        },
        color: isDark.value ? '#d1d5db' : '#374151'
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        color: isDark.value ? '#d1d5db' : '#374151'
      }
    }
  },
  elements: {
    point: {
      hoverRadius: 6
    }
  }
}))

/* === Chart Data === */
const chartData = computed(() => {
  const lista = tiemposEjecucion.value[modo.value] || []
  return {
    labels: lista.map(i => i.label),
    datasets: [
      {
        label: 'Tiempo Promedio (minutos)',
        data: lista.map(i => i.valor),
        fill: true,
        tension: 0.1,
        borderWidth: 2,

        borderColor: isDark.value ? '#34d399' : '#10b981',
        backgroundColor: isDark.value
          ? 'rgba(52,211,153,0.12)'
          : 'rgba(16,185,129,0.15)',

        pointBackgroundColor: isDark.value ? '#34d399' : '#10b981',
        pointRadius: 4,
        borderDash: [6, 6]
      }
    ]
  }
})

</script>
