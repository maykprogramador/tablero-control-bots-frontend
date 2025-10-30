<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 p-5 flex items-center justify-center overflow-auto">
    <!-- Modal Overlay -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeModal"
        @keydown.esc="closeModal" 
        tabindex="0"
      >
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
            @click.stop
            class="fixed inset-0 bg-white dark:bg-black sm:relative sm:rounded-xl shadow-2xl sm:max-w-6xl sm:w-full sm:max-h-[95vh] sm:h-auto overflow-auto sm:overflow-hidden"
          >
            <!-- Close Button -->
            <button 
              @click="closeModal"
              class="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group"
            >
              <svg class="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-slate-800 to-[#80006A] text-white p-6 pr-16">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10  /20 rounded-lg flex items-center justify-center">
                  <span class="text-xl">📋</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">Historial de Logs</h2>
                  <p class="text-blue-100 mt-1">{{ bot.nombre }}</p>
                </div>
              </div>
              
              <!-- Summary Stats -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div class=" bg-white/10 rounded-lg p-3 text-center">
                  <div class="text-lg sm:text-2xl font-bold">{{ logsDelBot.length }}</div>
                  <div class="text-sm text-white">Total Logs</div>
                </div>
                <div class="bg-[#00B094]/70 rounded-lg p-3 text-center">
                  <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('exito') }}</div>
                  <div class="text-sm text-green-100">Exitosos</div>
                </div>
                <div class="bg-[#FF5F3F]/70 rounded-lg p-3 text-center">
                  <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('proceso') }}</div>
                  <div class="text-sm text-yellow-100">En Proceso</div>
                </div>
                <div class="bg-red-500/20 rounded-lg p-3 text-center">
                  <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('error') }}</div>
                  <div class="text-sm text-white">Con Error</div>
                </div>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 md:max-h-[60vh] sm:overflow-y-auto">
              <!-- Filters -->
              <div class="flex flex-wrap gap-4 mb-6">
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600 dark:text-gray-400 font-medium">Fecha Inicial</label>
                  <input 
                    v-model="dateFilterInitial" 
                    type="date" 
                    class="px-3 py-2 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]"
                  >
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600 dark:text-gray-400 font-medium">Fecha Final</label>
                  <input 
                    v-model="dateFilterFinal" 
                    type="date" 
                    class="px-3 py-2 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]"
                  >
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-400">Filtrar por estado:</label>
                  <select 
                    v-model="statusFilter" 
                    class="px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]"
                  >
                    <option value="">Todos</option>
                    <option value="exito">Éxito</option>
                    <option value="proceso">En Proceso</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-medium text-gray-700 dark:text-gray-400">Buscar:</label>
                  <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Buscar en mensajes..."
                    class="px-3 py-1.5 border border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]"
                  >
                </div>
              </div>

              <!-- Table -->
              <div class="overflow-x-auto rounded-lg border border-gray-200 dark:border-slate-700">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
                  <thead class="bg-gray-50 dark:bg-slate-800">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">#</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Fecha de Log</th>
                      <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Mensaje</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Duración</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white  divide-y divide-gray-200 dark:divide-slate-800">
                    <tr 
                      v-for="(log, index) in paginatedLogs" 
                      :key="log.id"
                      class="hover:bg-gray-50 dark:hover:bg-[#21292e] dark:bg-[#14181a] transition-colors duration-200"
                    >
                      <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {{ (currentPage - 1) * logsPerPage + index + 1 }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div class="flex flex-col">
                          <span class="font-medium text-gray-900 dark:text-gray-100">{{ formatDate(log.fecha_log) }}</span>
                          <span class="text-xs text-gray-500 dark:text-gray-300">{{ formatTime(log.fecha_log) }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm text-gray-700 dark:text-gray-300 max-w-xs">
                        <div class="flex items-center justify-between gap-2">
                          <!-- Mensaje truncado -->
                          <div class="truncate" :title="log.mensaje">
                            {{ log.mensaje }}
                          </div>

                          <!-- Botón de ver detalles -->
                          <button
                            @click="openMessageModal(log)"
                            class="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200 flex-shrink-0"
                            title="Ver detalles"
                          >
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                            </svg>
                          </button>
                        </div>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        <div class="flex items-center gap-1">
                          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          {{ log.duracion }}
                        </div>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span 
                          :class="getStatusBadgeClass(log.estado)"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          <span :class="getStatusDotClass(log.estado)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                          {{ getStatusText(log.estado) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Empty State -->
              <div v-if="filteredLogs.length === 0" class="text-center py-12">
                <div class="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No se encontraron logs</h3>
                <p class="text-gray-500 dark:text-gray-100">Intenta ajustar los filtros de búsqueda</p>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-slate-600">
                <div class="text-sm text-gray-700 dark:text-gray-400">
                  Mostrando {{ (currentPage - 1) * logsPerPage + 1 }} a {{ Math.min(currentPage * logsPerPage, filteredLogs.length) }} de {{ filteredLogs.length }} logs
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Anterior
                  </button>
                  <div class="flex gap-1">
                    <button 
                      v-for="page in visiblePages" 
                      :key="page"
                      @click="currentPage = page"
                      :class="[
                        'px-3 py-1.5 text-sm rounded-lg transition-colors duration-200',
                        page === currentPage 
                          ? 'bg-[#80006A] text-white' 
                          : 'border border-gray-300 hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:text-gray-100'
                      ]"
                    >
                      {{ page }}
                    </button>
                  </div>
                  <button 
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 dark:bg-slate-800 dark:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 dark:bg-[#21292eae] border-t border-gray-200 dark:border-slate-700 px-6 py-4 flex justify-end gap-3">
              <button 
                @click="exportData"
                class="px-4 py-2 bg-[#00B094] text-white rounded-lg font-medium hover:bg-[#0e8571] transition-colors duration-200 flex items-center gap-2"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                Exportar
              </button>
              <button 
                @click="closeModal"
                class="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </Transition>
        <MessageDetailsModal v-if="isMessageModalOpen" :selectedRecord="selectedLog" :onClose="closeMessageModal"/>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, computed, defineProps, defineEmits, watch } from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import MessageDetailsModal from './Messaje-Details-Modal.vue'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import * as XLSX from 'xlsx'

// Activar el plugin
dayjs.extend(isBetween)

const tableroFunctions = useTableroFunctions()
const logs = computed(() => tableroFunctions.logs)
const isMessageModalOpen = ref(false)
const selectedLog = ref(null)
const props = defineProps(['bot'])
const emit = defineEmits(['close'])

// Modal state
const statusFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const logsPerPage = 10
const dateFilterInitial = ref('')
const dateFilterFinal = ref('')

// Watch para cargar logs cuando cambie el bot
watch(
  () => props.bot,
  async (nuevoBot) => {
    if (nuevoBot && nuevoBot.id) {
      // Aquí puedes llamar a una función para cargar los logs
      await tableroFunctions.loadLogs({ bot_id: nuevoBot.id })
    }
  },
  { immediate: true }
)

const closeMessageModal = () => {
  isMessageModalOpen.value = false
}

const openMessageModal = (log) => {
  isMessageModalOpen.value = true
  selectedLog.value = log
}

// Filtrar logs del bot actual
const logsDelBot = computed(() => {
  return logs.value.filter(log => log.bot_id === props.bot.id)
})

// Aplicar filtros
const filteredLogs = computed(() => {
  return logsDelBot.value.filter(log => {
    const belongsToBot = log.bot_id === props.bot.id
    const matchesStatus = !statusFilter.value || log.estado === statusFilter.value
    const matchesSearch = !searchQuery.value || log.mensaje.toLowerCase().includes(searchQuery.value.toLowerCase())

    let matchesDate = true

    if (dateFilterInitial.value) {
      const logDate = dayjs(log.fecha_log)
      const startDate = dayjs(dateFilterInitial.value)
      const endDate = dateFilterFinal.value ? dayjs(dateFilterFinal.value) : dayjs()

      matchesDate = logDate.isBetween(startDate, endDate, 'day', '[]')
    }

    return belongsToBot && matchesStatus && matchesSearch && matchesDate
  })
})

const totalPages = computed(() => Math.ceil(filteredLogs.value.length / logsPerPage))

const paginatedLogs = computed(() => {
  const start = (currentPage.value - 1) * logsPerPage
  const end = start + logsPerPage
  return filteredLogs.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const start = Math.max(1, currentPage.value - 2)
  const end = Math.min(totalPages.value, start + 4)
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  return pages
})

const closeModal = () => {
  // Emitir evento para cerrar el modal
  emit('close')
  // Reset filters
  statusFilter.value = ''
  searchQuery.value = ''
  currentPage.value = 1
  dateFilterInitial.value = ''
  dateFilterFinal.value = ''
}

const getStatusCount = (estado) => {
  return logsDelBot.value.filter(log => log.estado === estado).length
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    exito: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    proceso: 'bg-yellow-100 text-yellow-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700 dark:text-gray-400'
}

const getStatusDotClass = (estado) => {
  const classes = {
    exito: 'bg-green-500',
    error: 'bg-red-500',
    proceso: 'bg-yellow-500'
  }
  return classes[estado] || 'bg-gray-500'
}

const getStatusText = (estado) => {
  const texts = {
    exito: 'Éxito',
    error: 'Error',
    proceso: 'En Proceso'
  }
  return texts[estado] || 'Desconocido'
}

function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY')
}

const formatTime = (date) => {
  return dayjs(date).format('HH:mm:ss')
}

const exportData = () => {
  const data = filteredLogs.value.map(log => ({
    Bot: log.bot_id,
    Nombre_Bot: log.nombreBot || props.bot.nombre,
    Estado: log.estado,
    Fecha: log.fecha_log,
    Hora: log.fecha_log,
    Duración: log.duracion,
    Mensaje: log.mensaje
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Logs")

  XLSX.writeFile(
    workbook, 
    `logs-${props.bot.nombre.replace(/\s+/g, '-').toLowerCase()}-${dayjs().format('YYYY-MM-DD')}.xlsx`
  )
}
</script>