<template>
  <div
    class="rounded-2xl shadow p-6 space-y-4 transition-colors duration-300"
    :class="isDarkMode ? 'dark:bg-slate-800 border border-slate-700' : 'bg-white'"
  >

    <div class="flex justify-between items-center">
      <h2
        class="text-sm font-bold uppercase transition-colors duration-300"
        :class="isDarkMode ? 'text-slate-300' : 'text-slate-600'"
      >
        Envíos Historias Clínicas
      </h2>

      <select
        v-model="modo"
        @change="cargarEnvios"
        class="px-2 py-1 border rounded-lg text-sm transition-colors duration-300"
        :class="isDarkMode
          ? 'bg-slate-800 border-slate-600 text-slate-200'
          : 'bg-white border-slate-300 text-slate-700'"
      >
        <option value="semanal">Semanal</option>
        <option value="mensual">Mensual</option>
        <option value="anual">Anual</option>
      </select>
    </div>

    <div class="h-[380px]">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analitic-functions'
import { Line } from "vue-chartjs"

// store del tablero para modo oscuro
import { useTableroFunctions } from '@/stores/tablero-functions'
const tableroFunctions = useTableroFunctions()
const { isDark: isDarkMode } = storeToRefs(tableroFunctions)

const analitycsStore = useAnalyticsStore()
const { enviosHistoriasClinicas } = storeToRefs(analitycsStore)

const modo = ref("semanal") // default

const cargarEnvios = async () => {
  await analitycsStore.loadEnviosHistoriasClinicas(modo.value)
} 

const chartData = computed(() => {
  const dataset = enviosHistoriasClinicas.value[modo.value] ?? []

  return {
    labels: dataset.map(d => d.label),
    datasets: [
      {
        label: "Envíos",
        data: dataset.map(d => d.valor),
        borderWidth: 3,
        tension: 0.4,
        fill: true,

        // 🎨 colores dependientes del modo oscuro
        borderColor: isDarkMode.value ? "#38bdf8" : "#0ea5e9",
        backgroundColor: isDarkMode.value
          ? "rgba(56,189,248,0.15)"
          : "rgba(14,165,233,0.2)",
        pointBackgroundColor: isDarkMode.value ? "#38bdf8" : "#0ea5e9",

        pointRadius: 5
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: "index",
    intersect: false
  },
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: {
        color: isDarkMode.value
          ? "rgba(255,255,255,0.08)"
          : "rgba(0,0,0,0.05)"
      },
      ticks: {
        padding: 8,
        color: isDarkMode.value ? "#d1d5db" : "#374151"
      }
    },
    x: {
      grid: { display: false },
      ticks: {
        color: isDarkMode.value ? "#d1d5db" : "#374151"
      }
    }
  }
}))


onMounted(async () => {
  cargarEnvios(modo.value)
})

</script>
