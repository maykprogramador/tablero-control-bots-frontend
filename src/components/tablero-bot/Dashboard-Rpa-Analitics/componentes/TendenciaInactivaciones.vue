<template>
  <div
    class="rounded-2xl shadow-lg border p-6 transition-colors duration-300"
    :class="isDark ? 'dark:bg-slate-800 dark:border-slate-700' : 'bg-gradient-to-br from-white to-slate-50 border-slate-200/50'"
  >
    <div class="flex justify-between items-center mb-6">
      <h3
        class="text-sm font-bold uppercase tracking-wide flex items-center gap-2 transition-colors duration-300"
        :class="isDark ? 'text-slate-200' : 'text-slate-700'"
      >
        <svg class="w-4 h-4" :class="isDark ? 'text-violet-400' : 'text-violet-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
        Tendencia de Solicitudes
      </h3>

      <div class="relative">
        <select v-model="modo" @change="cargarSolicitudes()" class="appearance-none text-sm rounded-lg pl-4 pr-10 py-1.5 font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all duration-200 cursor-pointer shadow-sm" :class="isDark ? 'bg-slate-700 border border-slate-600 text-slate-200 hover:border-slate-500' : 'bg-white border border-slate-300 text-slate-700 hover:border-slate-400'" >
          <option value="semanal">Última semana</option>
          <option value="mensual">Último mes</option>
          <option value="anual">Último año</option>
        </select>
        
        <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg class="w-4 h-4" :class="isDark ? 'text-slate-400' : 'text-slate-500'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>

    <div class="h-[300px] w-full">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analitic-functions'
import { useTableroFunctions } from '@/stores/tablero-functions' // Asumiendo que esta ruta existe
import { Line } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
} from 'chart.js'

// Registro de componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
)

// Store para modo oscuro
const tableroFunctions = useTableroFunctions()
const analitycsStore = useAnalyticsStore()
const { isDark } = storeToRefs(tableroFunctions)
const { solicitudesInactivacion } = storeToRefs(analitycsStore)

// Estado local
const modo = ref('semanal') // 'semanal' o 'mensual'

// --- DATOS MOCK ---
const mockData = {
  semanal: {
    labels: ['Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab', 'Dom'],
    values: [65, 58, 80, 81, 56, 55, 90]
  },
  mensual: {
    labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
    values: [120, 190, 150, 240]
  }
}

// --- CONFIGURACIÓN DEL GRÁFICO ---

const chartData = computed(() => {
  const currentData = solicitudesInactivacion.value[modo.value] || [];

  return {
    labels: currentData.labels,
    datasets: [
      {
        label: 'Solicitudes de Inactivación',
        data: currentData.values,
        fill: true, // Relleno activado para simular la imagen
        tension: 0.4, // Curvatura suave (Bezier curve)
        borderWidth: 3,
        pointRadius: 4,
        pointHoverRadius: 6,
        
        // Colores dinámicos (Violeta/Indigo como la imagen)
        borderColor: isDark.value ? '#a78bfa' : '#8b5cf6', // violet-400 : violet-500
        backgroundColor: isDark.value 
          ? 'rgba(167, 139, 250, 0.1)' // violeta muy transparente oscuro
          : 'rgba(139, 92, 246, 0.1)', // violeta muy transparente claro
        pointBackgroundColor: isDark.value ? '#a78bfa' : '#8b5cf6',
        pointBorderColor: isDark.value ? '#1e293b' : '#ffffff', // Borde del punto para contraste
        pointBorderWidth: 2,
      }
    ]
  }
})

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false // Ocultar leyenda como en la imagen
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: isDark.value ? '#1e293b' : '#ffffff',
      titleColor: isDark.value ? '#f3f4f6' : '#1f2937',
      bodyColor: isDark.value ? '#cbd5e1' : '#4b5563',
      borderColor: isDark.value ? '#334155' : '#e5e7eb',
      borderWidth: 1,
      padding: 10,
      displayColors: false, // Ocultar el cuadrito de color en el tooltip
      callbacks: {
        label: (context) => `Solicitudes: ${context.parsed.y}`
      }
    }
  },
  scales: {
    x: {
      grid: {
        display: false, // Sin grilla vertical
        drawBorder: false
      },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280', // slate-400 : gray-500
        font: {
          size: 11
        }
      }
    },
    y: {
      beginAtZero: false, // Para que la curva se vea más pronunciada como en la imagen
      border: {
        display: false // Ocultar línea del eje Y
      },
      grid: {
        color: isDark.value ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)',
        drawBorder: false,
        borderDash: [5, 5] // Líneas punteadas horizontales
      },
      ticks: {
        color: isDark.value ? '#9ca3af' : '#6b7280',
        padding: 10,
        font: {
          size: 11
        }
      }
    }
  },
  interaction: {
    mode: 'nearest',
    axis: 'x',
    intersect: false
  }
}))

const cargarSolicitudes = async () => {
  await analitycsStore.loadSolicitudesInactivacion(modo.value)
} 

onMounted(() => {
  cargarSolicitudes()
})
</script>