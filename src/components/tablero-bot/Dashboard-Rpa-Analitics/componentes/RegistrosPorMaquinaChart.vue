

<template>
  <div class="bg-white rounded-2xl shadow-lg p-6">
    
    <div class="flex justify-between items-start gap-3 mb-6">
      <!-- Div del título con límite de ancho -->
      <div class="max-w-[60%]">
        <h3 class="text-sm font-bold text-slate-500 uppercase mb-4">
          {{ botActual?.bot }}
        </h3>

        <p class="text-sm text-gray-500 mt-1">
          Total: 
          <span class="font-semibold text-gray-700">{{ totalProcesados }}</span> 
          registros procesados
        </p>
      </div>

      <!-- Botón que ya NO se deforma -->
      <button 
        @click="mostrarSelector = true"
        class="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all shadow-sm hover:shadow-md shrink-0"
      >
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8 9l4-4 4 4m0 6l-4 4-4-4"/>
        </svg>
        Cambiar Bot
      </button>

    </div>


    <!-- Gráfico -->
    <div class="h-[320px] rounded-xl p-4">
      <Bar 
        :data="formatear"
        :options="chartOptions"
      />
    </div>

    <!-- Modal Selector de Bot -->
    <transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95" >
      <div v-if="mostrarSelector" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
        <div class="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[70vh] flex flex-col">
          <!-- Header -->
          <div class="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h3 class="text-xl font-bold text-gray-900">Seleccionar Bot</h3>
              <p class="text-sm text-gray-500 mt-1">{{ procesadosPorMaquina.length }} bots disponibles</p>
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
              <input 
                v-model="busqueda"
                type="text" 
                placeholder="Buscar bot..."
                class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <svg class="w-5 h-5 text-gray-400 absolute left-3 top-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <!-- Lista de bots -->
          <div class="flex-1 overflow-y-auto p-4">
            <div class="space-y-2">
              <button
                v-for="bot in botsFiltrados"
                :key="bot.bot"
                @click="seleccionarBot(bot.bot)"
                class="w-full flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 rounded-xl cursor-pointer transition-all group"
                :class="{ 'bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-300': botSeleccionado === bot.bot }"
              >
                <div class="text-left">
                  <p class="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {{ bot.bot }}
                  </p>
                  <p class="text-xs text-gray-500">
                    {{ bot.maquinas.length }} máquina{{ bot.maquinas.length > 1 ? 's' : '' }}
                  </p>
                </div>
                <div class="flex items-center gap-2">
                  <span class="px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 text-sm font-bold rounded-full">
                    {{ bot.maquinas.reduce((sum, m) => sum + m.procesados, 0) }}
                  </span>
                  <svg 
                    v-if="botSeleccionado === bot.bot"
                    class="w-5 h-5 text-blue-600" 
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                  >
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
                  </svg>
                </div>
              </button>
            </div>
          </div>

        </div>
      </div>
    </transition>

  </div>
</template>
<script setup>
import { Bar } from 'vue-chartjs'
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analitic-functions'
const analyticsStore = useAnalyticsStore()
const { procesadosPorMaquina } = storeToRefs(analyticsStore)

onMounted(async () => {
  await analyticsStore.loadProcesadosPorMaquina()

  const primerBotValido = procesadosPorMaquina.value.find(
    b => b.maquinas.some(m => m.procesados > 1)
  )

  botSeleccionado.value = primerBotValido?.bot || procesadosPorMaquina.value[0]?.bot
})

/*const procesadosPorMaquina = ref([
  {
    bot: 'Bot Autorizaciones',
    maquinas: [
      { id: 1, procesados: 120 }
    ]
  },
  {
    bot: 'Bot Patologías',
    maquinas: [
      { id: 1, procesados: 110 },
      { id: 2, procesados: 56 }
    ]
  },
  {
    bot: 'Bot Historias Clínicas',
    maquinas: [
      { id: 1, procesados: 132 },
      { id: 2, procesados: 98 },
      { id: 3, procesados: 40 }
    ]
  },
  {
    bot: 'Bot Facturas',
    maquinas: [
      { id: 1, procesados: 145 },
      { id: 2, procesados: 89 }
    ]
  },
  {
    bot: 'Bot Oncólogos',
    maquinas: [
      { id: 1, procesados: 95 },
      { id: 2, procesados: 67 },
      { id: 3, procesados: 54 },
      { id: 4, procesados: 32 }
    ]
  }
])*/

// Bot seleccionado (por defecto el primero)
const botSeleccionado = ref(null)
const mostrarSelector = ref(false)
const busqueda = ref('')

// Obtener el bot actual
const botActual = computed(() => 
  procesadosPorMaquina.value.find(b => b.bot === botSeleccionado.value)
)

// Total de procesados del bot actual
const totalProcesados = computed(() => 
  botActual.value?.maquinas.reduce((sum, m) => sum + m.procesados, 0) || 0
)

// Colores degradados modernos
const coloresModernos = [
  'rgba(99, 102, 241, 0.8)',   // Indigo
  'rgba(168, 85, 247, 0.8)',   // Purple
  'rgba(236, 72, 153, 0.8)',   // Pink
  'rgba(239, 68, 68, 0.8)',    // Red
  'rgba(249, 115, 22, 0.8)',   // Orange
  'rgba(234, 179, 8, 0.8)'     // Yellow
]

const formatear = computed(() => ({
  labels: botActual.value?.maquinas.map(m => `Máquina ${m.id}`) || [],
  datasets: [
    {
      label: 'Registros Procesados',
      data: botActual.value?.maquinas.map(m => m.procesados) || [],
      backgroundColor: botActual.value?.maquinas.map((_, i) => coloresModernos[i % coloresModernos.length]) || [],
      borderRadius: 8,
      barThickness: 40
    }
  ]
}))

const chartOptions = {
  responsive: true,
  indexAxis: 'y',
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: 12,
      borderRadius: 8,
      titleFont: { size: 14, weight: 'bold' },
      bodyFont: { size: 13 },
      callbacks: {
        label: function(context) {
          return `${context.parsed.x} registros procesados`
        }
      }
    }
  },
  scales: {
    x: {
      ticks: { 
        color: '#6b7280',
        maxRotation: 45,
        minRotation: 0,
        font: { size: 12 }
      },
      display:false,
      grid: { display: false },
      border: { display: true, color: '#e5e7eb' } // Mantiene solo la línea sutil de abajo
    },
    y: {
      ticks: {
        color: '#374151',
        font: { size: 13, weight: '500' }
      },
      grid: { display: false }
    }
  }
}

// Búsqueda de bots
const botsFiltrados = computed(() => {
  if (!busqueda.value) return procesadosPorMaquina.value
  return procesadosPorMaquina.value.filter(bot => 
    bot.bot.toLowerCase().includes(busqueda.value.toLowerCase())
  )
})

const seleccionarBot = (nombreBot) => {
  botSeleccionado.value = nombreBot
  cerrarSelector()
}

const cerrarSelector = () => {
  mostrarSelector.value = false
  busqueda.value = ''
}
</script>