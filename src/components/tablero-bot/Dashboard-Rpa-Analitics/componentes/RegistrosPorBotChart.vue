<template>
  <div class="bg-white shadow rounded-2xl p-6">
    <!-- Botón para abrir selector -->
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-sm font-bold text-slate-500 uppercase mb-4">Registros por Bot</h3>
      <button 
        @click="mostrarSelector = true"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
        </svg>
        Filtrar Bots ({{ botsSeleccionados.length }})
      </button>
    </div>

    <!-- Modal/Dropdown del Selector -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95" >
      <div v-if="mostrarSelector" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] flex flex-col">
          <!-- Header del modal -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Seleccionar Bots</h3>
              <p class="text-sm text-gray-500 mt-1">{{ botsTemporales.length }} de {{ registrosPorBot.length }} seleccionados</p>
            </div>
            <button 
              @click="cerrarSelector"
              class="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>

          <!-- Búsqueda -->
          <div class="p-6 border-b border-gray-100">
            <div class="relative">
              <input v-model="busqueda" type="text"  placeholder="Buscar bot..." class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Lista de bots con scroll -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-2">
              <label  v-for="bot in botsFiltrados"  :key="bot.bot" class="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors group" >
                <div class="flex items-center gap-3 flex-1">
                  <input type="checkbox"  :value="bot.bot" v-model="botsTemporales" class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500 cursor-pointer" />
                  <div>
                    <span class="text-gray-900 font-medium">{{ bot.bot }}</span>
                    <p class="text-xs text-gray-500">{{ bot.registros }} registros</p>
                  </div>
                </div>
                <div class="px-3 py-1 bg-blue-50 text-blue-700 text-sm font-semibold rounded-full">
                  {{ bot.registros }}
                </div>
              </label>
            </div>
          </div>

          <!-- Footer con acciones -->
          <div class="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
            <button @click="toggleTodos" class="text-sm text-blue-600 hover:text-blue-800 font-medium" >
              {{ todosMarcados ? 'Deseleccionar todos' : 'Seleccionar todos' }}
            </button>
            <div class="flex gap-3">
              <button  @click="cerrarSelector" class="px-5 py-2 text-gray-700 hover:bg-gray-200 rounded-lg transition-colors font-medium" >
                Cancelar
              </button>
              <button  @click="aplicarSeleccion" class="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md font-medium" >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <!-- Gráfico -->
    <div class="h-[380px] mt-2">
      <Bar :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analitic-functions'
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

const analitycsStore = useAnalyticsStore()
const { registrosPorBot } = storeToRefs(analitycsStore)

const botsSeleccionados = ref([])
const botsTemporales = ref([])
const mostrarSelector = ref(false)
const busqueda = ref('')

const LIMITE_INICIAL = 4

onMounted(async() => {
  await analitycsStore.loadRegistrosBots()
  //console.log(registrosPorBot.value)
  
  botsSeleccionados.value = registrosPorBot.value
    .slice(0, LIMITE_INICIAL)
    .map(b => b.bot)
})

const botsFiltrados = computed(() => {
  if (!busqueda.value) return registrosPorBot.value
  return registrosPorBot.value.filter(bot => 
    bot.bot.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

const todosMarcados = computed(() => 
  botsTemporales.value.length === registrosPorBot.value.length
)

const toggleTodos = () => {
  if (todosMarcados.value) {
    botsTemporales.value = []
  } else {
    botsTemporales.value = registrosPorBot.value.map(b => b.bot)
  }
}

const cerrarSelector = () => {
  mostrarSelector.value = false
  busqueda.value = ''
  botsTemporales.value = [...botsSeleccionados.value]
}

const aplicarSeleccion = () => {
  botsSeleccionados.value = [...botsTemporales.value]
  mostrarSelector.value = false
  busqueda.value = ''
}

// Abrir el selector y cargar la selección actual
const abrirSelector = () => {
  botsTemporales.value = [...botsSeleccionados.value]
  mostrarSelector.value = true
}

// Datos filtrados según la selección
const datosFiltrados = computed(() => 
  registrosPorBot.value.filter(bot => botsSeleccionados.value.includes(bot.bot))
)

const nombresReales = computed(() =>
  datosFiltrados.value.map(b => b.bot)
)

const chartData = computed(() => ({
  labels: datosFiltrados.value.map((_, index) => `Bot ${index + 1}`),
  datasets: [
    {
      label: 'Registros procesados hoy',
      data: datosFiltrados.value.map(b => b.registros),
      backgroundColor: 'rgba(209, 213, 219, 1)',
      borderWidth: 1,
      borderRadius: 8
    }
  ]
}))

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: { display: false, beginAtZero: true },
    x: { grid: { display: false }, ticks: { color: '#6b7280' } }
  },
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        title: (tooltipItems) => {
          const idx = tooltipItems[0].dataIndex
          return nombresReales.value[idx]  // NOMBRE REAL
        },
        label: (tooltipItem) => {
          return `Registros: ${tooltipItem.raw}`
        }
      }
    }
  }
}

</script>