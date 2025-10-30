<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-slate-950 dark:to-[#21292eae] transition-colors duration-300">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-6">

      <!-- 🔍 Barra de búsqueda y filtros -->
      <div class="bg-white dark:bg-[#21292eae] rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 p-4 lg:p-6 mb-6 transition-colors duration-300">
        <!-- Búsqueda -->
        <div class="relative mb-4">
          <Search class="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-500" />
          <input
            v-model="busqueda"
            type="text"
            placeholder="Buscar notificaciones..."
            class="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-transparent transition-all"
          />
        </div>

        <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <!-- Filtros -->
          <div class="flex flex-wrap gap-2">
            <button
              v-for="filtro in filtros"
              :key="filtro.valor"
              @click="filtroActivo = filtro.valor"
              :class="[
                'px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 transform hover:scale-105',
                filtroActivo === filtro.valor
                  ? 'bg-gradient-to-r from-[#80006A] to-[#FF5F3F] text-white shadow-lg shadow-pink-500/20'
                  : 'bg-gray-50 dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
              ]"
            >
              <span class="flex items-center gap-2">
                {{ filtro.label }}
                <span
                  v-if="filtro.count > 0"
                  :class="[
                    'px-2 py-0.5 rounded-full text-xs font-bold',
                    filtroActivo === filtro.valor
                      ? 'bg-white/30 text-white'
                      : 'bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300'
                  ]"
                >
                  {{ filtro.count }}
                </span>
              </span>
            </button>
          </div>

          <!-- Acciones -->
          <div class="flex flex-wrap gap-2">
            <button
              v-if="notificacionesNoLeidas.length > 0"
              @click="marcarTodasLeidas"
              :disabled="notificacionesNoLeidas.length === 0"
              class="flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 rounded-xl hover:bg-emerald-100 dark:hover:bg-emerald-800/50 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-emerald-200 dark:border-emerald-800"
            >
              <Check class="w-4 h-4" />
              <span class="hidden sm:inline">Marcar leídas</span>
            </button>

            <button
              @click="eliminarTodas"
              :disabled="notificaciones.length === 0"
              class="flex items-center gap-2 px-4 py-2.5 bg-rose-50 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-800/50 transition-all duration-200 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed border border-rose-200 dark:border-rose-800"
            >
              <Trash2 class="w-4 h-4" />
              <span class="hidden sm:inline">Eliminar todas</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 🔔 Lista de Notificaciones -->
      <div class="space-y-4">
        <TransitionGroup name="notification">
          <div
            v-for="notificacion in notificacionesFiltradas"
            :key="notificacion.id"
            :class="[
              'relative bg-white dark:bg-[#21292eae] rounded-2xl shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 overflow-hidden',
              notificacion.leido ? 'border-gray-200 dark:border-slate-700' : getIconConfig(notificacion.tipo).borderColor
            ]"
          >
            <div
              v-if="!notificacion.leido"
              :class="['absolute left-0 top-0 bottom-0 w-1.5', getIconConfig(notificacion.tipo).color.replace('text-', 'bg-')]"
            ></div>

            <div class="p-5 lg:p-6">
              <div class="flex gap-4">
                <!-- Icono -->
                <div class="flex-shrink-0">
                  <div
                    :class="[
                      'p-3 rounded-xl border transition-all duration-300',
                      getIconConfig(notificacion.tipo).bgColor,
                      getIconConfig(notificacion.tipo).borderColor
                    ]"
                  >
                    <component
                      :is="getIconConfig(notificacion.tipo).icono"
                      :class="['w-6 h-6', getIconConfig(notificacion.tipo).color]"
                    />
                  </div>
                </div>

                <!-- Contenido -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-start justify-between gap-4 mb-2">
                    <div @click="handleNotificacionClick(notificacion)" class="flex-1 cursor-pointer">
                      <div class="flex items-center gap-2 mb-1">
                        <div
                          v-if="!notificacion.leido"
                          class="w-2 h-2 bg-blue-500 rounded-full animate-pulse"
                        ></div>
                        <h3 class="text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
                          {{ notificacion.titulo }}
                        </h3>
                      </div>
                      <span
                        :class="[
                          'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                          getTipoBadgeClass(notificacion.tipo)
                        ]"
                      >
                        {{ notificacion.tipo }}
                      </span>
                    </div>

                    <!-- Acciones -->
                    <div class="flex gap-1 flex-shrink-0">
                      <button
                        v-if="!notificacion.leido"
                        @click="handleNotificacionClick(notificacion)"
                        :class="[
                          'p-2 rounded-lg transition-all duration-200 hover:scale-110',
                          'text-blue-500 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/30'
                        ]"
                        :title="notificacion.leido ? 'Marcar como no leída' : 'Marcar como leída'"
                      >
                        <Check class="w-5 h-5" />
                      </button>
                      <button
                        @click="eliminarNotificacion(notificacion.id)"
                        class="p-2 rounded-lg text-rose-500 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-900/30 transition-all duration-200 hover:scale-110"
                        title="Eliminar"
                      >
                        <Trash2 class="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <p
                    @click="handleNotificacionClick(notificacion)"
                    class="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 text-sm lg:text-base cursor-pointer"
                    v-html="notificacion.mensaje"
                  ></p>

                  <div class="flex flex-wrap items-center gap-4 text-xs lg:text-sm text-gray-500 dark:text-gray-400">
                    <span class="flex items-center gap-1.5">
                      <Clock class="w-4 h-4" />
                      {{ timeAgo(notificacion.createdAt) }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TransitionGroup>

        <!-- 💤 Estado vacío -->
        <div
          v-if="notificacionesFiltradas.length === 0"
          class="bg-white dark:bg-[#21292eae] rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-12 lg:p-16 text-center transition-colors duration-300"
        >
          <div class="w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-slate-800 dark:to-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell class="w-10 h-10 lg:w-12 lg:h-12 text-gray-400 dark:text-gray-500" />
          </div>
          <h3 class="text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
            No hay notificaciones
          </h3>
          <p class="text-gray-500 dark:text-gray-400 text-sm lg:text-base">
            {{ mensajeVacio }}
          </p>
        </div>
      </div>

      <!-- 📊 Estadísticas -->
      <div
        v-if="notificaciones.length > 0"
        class="mt-8 bg-white dark:bg-[#21292eae] rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 transition-colors duration-300"
      >
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div class="text-center">
            <p class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              {{ notificaciones.length }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">Total</p>
          </div>
          <div class="text-center">
            <p class="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent dark:from-emerald-400 dark:to-teal-400">
              {{ notificacionesNoLeidas.length }}
            </p>
            <p class="text-sm text-gray-600 dark:text-gray-400 mt-1">No leídas</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup>
import { ref, computed, defineProps, defineEmits } from 'vue'
import { Bell, Check, Trash2, Clock, Info, AlertCircle, CheckCircle, XCircle, Settings, Search } from 'lucide-vue-next'
import { storeToRefs } from 'pinia'
import { useNotificacionesStore } from '@/stores/notificacion-functions'
import { timeAgo } from '@/utils/TimeAgo'

// props
const props = defineProps(['openModalOption', 'selectedTab'])
const emit = defineEmits(['update:selectedTab'])

// estados reactivos
const filtroActivo = ref('todas')
const busqueda = ref('')
const notificacionStore = useNotificacionesStore()
const { notificaciones } = storeToRefs(notificacionStore)
/*
const notificaciones = ref([
  {
    id: 1,
    titulo: 'Bot de Trading Activado',
    mensaje: 'Tu bot de trading <strong>BTC-Scalper</strong> ha sido activado exitosamente y está operando en el mercado.',
    tipo: 'exito',
    leido: false,
    createdAt: new Date(Date.now() - 5 * 60000)
  },
  {
    id: 2,
    titulo: 'advertencia de Precio',
    mensaje: 'El precio de <strong>Bitcoin</strong> ha alcanzado tu objetivo de $45,000 USD. Considera revisar tu estrategia.',
    tipo: 'advertencia',
    leido: false,
    createdAt: new Date(Date.now() - 30 * 60000)
  },
  {
    id: 3,
    titulo: 'error en Conexión API',
    mensaje: 'No se pudo conectar con la API de Binance. El bot <strong>ETH-Trader</strong> está en pausa. Verifica tu conexión.',
    tipo: 'error',
    leido: false,
    createdAt: new Date(Date.now() - 2 * 3600000)
  },
  {
    id: 4,
    titulo: 'Actualización Completada',
    mensaje: 'La actualización del sistema v2.5.0 se ha instalado correctamente. Nuevas funciones disponibles.',
    tipo: 'info',
    leido: true,
    createdAt: new Date(Date.now() - 24 * 3600000)
  },
  {
    id: 5,
    titulo: 'Ganancia Registrada',
    mensaje: 'Tu bot <strong>SOL-Momentum</strong> ha registrado una ganancia de +12.5% en las últimas 24 horas.',
    tipo: 'exito',
    leido: true,
    createdAt: new Date(Date.now() - 48 * 3600000)
  },
  {
    id: 6,
    titulo: 'Límite de Operaciones Alcanzado',
    mensaje: 'Has alcanzado el límite diario de 100 operaciones. El bot se reactivará mañana a las 00:00 UTC.',
    tipo: 'advertencia',
    leido: true,
    createdAt: new Date(Date.now() - 72 * 3600000)
  }
])*/

const notificacionesNoLeidas = computed(() => notificaciones.value.filter(n => !n.leido))

const filtros = computed(() => [
  { label: 'Todas', valor: 'todas', count: notificaciones.value.length },
  { label: 'No leídas', valor: 'no leídas', count: notificacionesNoLeidas.value.length },
])

const notificacionesFiltradas = computed(() => {
  let resultado = notificaciones.value

  if (filtroActivo.value === 'no leídas') {
    resultado = resultado.filter(n => !n.leido)
  }

  if (busqueda.value.trim()) {
    const query = busqueda.value.toLowerCase()
    resultado = resultado.filter(n =>
      n.titulo.toLowerCase().includes(query) ||
      n.mensaje.toLowerCase().includes(query) ||
      n.tipo.toLowerCase().includes(query)
    )
  }

  return resultado
})

const mensajeVacio = computed(() => {
  if (busqueda.value.trim()) {
    return 'No se encontraron notificaciones con ese criterio de búsqueda'
  }
  return filtroActivo.value === 'todas'
    ? 'No tienes notificaciones en este momento'
    : `No hay notificaciones ${filtroActivo.value}`
})

const toggleLeido = (notificacion) => {
  notificacion.leido = !notificacion.leido
}

// Métodos
async function handleNotificacionClick(notificacion) {
  if (!notificacion.leido) {
    notificacion.leido = true
    notificacionStore.marcarComoLeida(notificacion.id)
  }
  console.log('notificacion.destino', notificacion);
  
  if (notificacion.destino?.modal === 'HistoriaClinica') {
    props.openModalOption(notificacion.destino?.bot_id, 'detalles')
  }
  if (notificacion.destino?.modal === 'tablero-bot') {
    emit('update:selectedTab', 'bots')
  }
  if (notificacion.destino?.modal === 'solicitud_usuario') {
    emit('update:selectedTab', 'solicitudes')
  }
  if (notificacion.destino?.modal === 'registros-bot') {
    props.openModalOption(notificacion.destino?.bot_id, 'detalles')
  }
  if (notificacion.destino?.modal === 'logs-bot') {
    props.openModalOption(notificacion.destino?.bot_id, 'logs')
  }
  // luego decides qué acción tomar (redirigir, abrir modal, etc.)
}

const marcarTodasLeidas = () => {
  notificacionStore.marcarTodasComoLeidas()
}

const eliminarNotificacion = (id) => {
  notificacionStore.eliminarNotificacion(id)
}

const eliminarTodas = () => {
  if (confirm('¿Estás seguro de que deseas eliminar todas las notificaciones?')) {
    notificacionStore.eliminarNotificaciones()
  }
}

const getIconConfig = (tipo) => {
  const configs = {
    'exito': { icono: CheckCircle, color: 'text-emerald-600', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200' },
    'error': { icono: XCircle, color: 'text-rose-600', bgColor: 'bg-rose-50', borderColor: 'border-rose-200' },
    'advertencia': { icono: AlertCircle, color: 'text-amber-600', bgColor: 'bg-amber-50', borderColor: 'border-amber-200' },
    'info': { icono: Info, color: 'text-blue-600', bgColor: 'bg-blue-50', borderColor: 'border-blue-200' }
  }
  return configs[tipo] || configs['info']
}

const getTipoBadgeClass = (tipo) => {
  const classes = {
    'exito': 'bg-emerald-100 text-emerald-700 border border-emerald-200',
    'error': 'bg-rose-100 text-rose-700 border border-rose-200',
    'advertencia': 'bg-amber-100 text-amber-700 border border-amber-200',
    'info': 'bg-blue-100 text-blue-700 border border-blue-200'
  }
  return classes[tipo] || classes['info']
}

</script>

<style scoped>
.notification-enter-active,
.notification-leave-active {
  transition: all 0.4s ease;
}

.notification-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.notification-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.notification-move {
  transition: transform 0.4s ease;
}
</style>