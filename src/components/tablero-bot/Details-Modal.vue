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
        @keydown.esc="closeModal" tabindex="0"
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
            class="fixed inset-0 bg-white sm:relative sm:rounded-xl shadow-2xl sm:max-w-6xl sm:w-full sm:max-h-[95vh] sm:h-auto overflow-auto sm:overflow-hidden"
          >
            <!-- Close Button -->
            <button 
              @click="closeModal"
              class="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group"
            >
              <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-slate-800 to-[#80006A] text-white p-6 pr-16">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl">🤖</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">Detalles de Ejecución</h2>
                  <p class="text-blue-100 mt-1">{{ bot.nombre }}</p>
                </div>
              </div>
              
              <!-- Summary Stats -->
              <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div class="bg-white/10 rounded-lg p-3 text-center">
                  <div class="text-lg sm:text-2xl font-bold">{{ registrosDelBot.length}}</div>
                  <div class="text-sm text-blue-100">Total Registros</div>
                </div>
                <div class="bg-green-500/20 rounded-lg p-3 text-center">
                  <div class="text-lg sm:text-2xl font-bold text-green-200">{{ getStatusCount('exito') }}</div>
                  <div class="text-sm text-green-100">Exitosos</div>
                </div>
                <div class="bg-yellow-500/20 rounded-lg p-3 text-center">
                  <div class="text-lg sm:text-2xl font-bold text-yellow-200">{{ getStatusCount('proceso') }}</div>
                  <div class="text-sm text-yellow-100">En Proceso</div>
                </div>
                <div class="bg-red-500/20 rounded-lg p-3 text-center">
                  <div class="text-lg sm:text-2xl font-bold text-red-200">{{ getStatusCount('error') }}</div>
                  <div class="text-sm text-red-100">Con Error</div>
                </div>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 md:max-h-[60vh] sm:overflow-y-auto">
              <!-- Filters -->
              <div class="flex flex-wrap gap-4 mb-6">
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600 font-medium">Fecha Inicial</label>
                  <input 
                    v-model="dateFilterInitial" 
                    type="date" 
                    class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm text-gray-600 font-medium">Fecha Final</label>
                  <input 
                    v-model="dateFilterFinal" 
                    type="date" 
                    class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-medium text-gray-700">Filtrar por estado:</label>
                  <select 
                    v-model="statusFilter" 
                    class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">Todos</option>
                    <option value="exito">Éxito</option>
                    <option value="proceso">En Proceso</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <label class="text-sm font-medium text-gray-700">Buscar:</label>
                  <input 
                    v-model="searchQuery"
                    type="text" 
                    placeholder="Buscar en mensajes..."
                    class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
              </div>

              <!-- Table -->
              <div class="overflow-x-auto rounded-lg border border-gray-200">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Ejecución</th>
                      <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase tracking-wider">Mensaje</th>
                      <th v-if="bot.id === 1" class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Duración</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr 
                      v-for="(record, index) in paginatedRecords" 
                      :key="record.id"
                      class="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {{ (currentPage - 1) * recordsPerPage + index + 1 }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                        <div class="flex flex-col">
                          <span class="font-medium">{{ formatDate(record.fecha_ejecucion) }}</span>
                          <span class="text-xs text-gray-500">{{ formatTime(record.fecha_ejecucion) }}</span>
                        </div>
                      </td>
                      <td class="px-4 py-4 text-sm text-gray-700 max-w-xs">
                        <div class="flex items-center justify-between gap-2">
                          <!-- Mensaje truncado -->
                          <div class="truncate" :title="record.mensaje">
                            {{ record.mensaje }}
                          </div>

                          <!-- Botón de ver detalles -->
                          <button
                            @click="openMessageModal(record)"
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

                      <td v-if="bot.id === 1" class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                          <div class="flex items-center gap-1">
                            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            {{ formatDuration(record.duracion) }}
                          </div>
                        </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span 
                          :class="getStatusBadgeClass(record.estado)"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          <span :class="getStatusDotClass(record.estado)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                          {{ getStatusText(record.estado) }}
                        </span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Empty State -->
              <div v-if="filteredRecords.length === 0" class="text-center py-12">
                <div class="text-gray-400 text-6xl mb-4">🔍</div>
                <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron registros</h3>
                <p class="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
              </div>

              <!-- Pagination -->
              <div v-if="totalPages > 1" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
                <div class="text-sm text-gray-700">
                  Mostrando {{ (currentPage - 1) * recordsPerPage + 1 }} a {{ Math.min(currentPage * recordsPerPage, filteredRecords.length) }} de {{ filteredRecords.length }} registros
                </div>
                <div class="flex items-center gap-2">
                  <button 
                    @click="currentPage--"
                    :disabled="currentPage === 1"
                    class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
                          : 'border border-gray-300 hover:bg-gray-50'
                      ]"
                    >
                      {{ page }}
                    </button>
                  </div>
                  <button 
                    @click="currentPage++"
                    :disabled="currentPage === totalPages"
                    class="px-3 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Siguiente
                  </button>
                </div>
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-end gap-3">
              <button 
                @click="exportData"
                class="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center gap-2"
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
        <MessajeDetailsModal v-if="isMessageModalOpen" :selectedRecord="selectedRecord" :onClose="closeMessageModal"/>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineProps, watch } from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import MessajeDetailsModal from './Messaje-Details-Modal.vue'
import { formatDuration } from '@/utils/FormatSeconds.js'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import * as XLSX from 'xlsx';
// Activar el plugin
dayjs.extend(isBetween);



const tableroFunctions = useTableroFunctions()
const isModalOpen = computed(() => tableroFunctions.isModalOpen)
const registros = computed(() => tableroFunctions.registros)
const isMessageModalOpen = ref(false)
const selectedRecord = ref(null)
const props = defineProps(['bot'])
// Modal state
const statusFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const recordsPerPage = 10
const dateFilterInitial = ref('')
const dateFilterFinal = ref('')


watch(
  () => props.bot,        // lo que quiero observar
  async (nuevoBot) => {   // qué hacer cuando cambie
    if (nuevoBot && nuevoBot.id) {
      await tableroFunctions.loadRegistros({ bot_id: nuevoBot.id })
    }
  },
  { immediate: true }     // ejecuta la primera vez que se monte
)

const closeMessageModal = () => {
  isMessageModalOpen.value = false
}
const openMessageModal = (record) => {
  isMessageModalOpen.value = true
  selectedRecord.value = record
}

const registrosDelBot = computed(() => {
  return registros.value.filter(record => record.bot_id === props.bot.id)
})


const filteredRecords = computed(() => {
  return registrosDelBot.value.filter(record => {
    const belongsToBot = record.bot_id === props.bot.id;
    const matchesStatus = !statusFilter.value || record.estado === statusFilter.value;
    const matchesSearch = !searchQuery.value || record.mensaje.toLowerCase().includes(searchQuery.value.toLowerCase());

    let matchesDate = true; // Por defecto pasa el filtro

    if (dateFilterInitial.value) {
      const recordDate = dayjs(record.fecha_ejecucion);
      const startDate = dayjs(dateFilterInitial.value);
      const endDate = dateFilterFinal.value
        ? dayjs(dateFilterFinal.value)
        : dayjs(); // Si no hay fecha final, usar hoy

      matchesDate = recordDate.isBetween(startDate, endDate, 'day', '[]'); 
      // '[]' para incluir el inicio y final
    }

    return belongsToBot && matchesStatus && matchesSearch && matchesDate;
  });
});


const totalPages = computed(() => Math.ceil(filteredRecords.value.length / recordsPerPage))

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * recordsPerPage
  const end = start + recordsPerPage
  return filteredRecords.value.slice(start, end)
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
  console.log('isopnemodal: ', tableroFunctions.isModalOpen );
  tableroFunctions.closeModal()
  // Reset filters
  statusFilter.value = ''
  searchQuery.value = ''
  currentPage.value = 1
}

const getStatusCount = (estado) => {
  return registrosDelBot.value.filter(record => record.estado === estado).length
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    exito: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    proceso: 'bg-yellow-100 text-yellow-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
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

/*const exportDataJson = () => {
  // Simular exportación
  const dataStr = JSON.stringify(filteredRecords.value, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  const link = document.createElement('a')
  link.href = url
  link.download = `bot-execution-details-${props.bot.nombre.replace(/\s+/g, '-').toLowerCase()}.json`
  link.click()
  URL.revokeObjectURL(url)
}*/

const exportData = () => {
  // 1️⃣ Obtener los datos filtrados
  const data = filteredRecords.value.map(record => ({
    Bot: record.bot_id,
    Nombre_Bot: props.bot.nombre,
    Estado: record.estado,
    Fecha: record.fecha_ejecucion,
    Mensaje: record.mensaje,
    ...(record.bot_id !== 8 && { Duración: record.duracion }) // 👈 se agrega solo si bot_id ≠ 8
  }));


  // 2️⃣ Crear hoja de cálculo a partir de los datos
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3️⃣ Crear un nuevo libro de Excel y añadir la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Registros");

  // 4️⃣ Generar archivo Excel y descargar
  XLSX.writeFile(
    workbook, 
    `bot-execution-details-${props.bot.nombre.replace(/\s+/g, '-').toLowerCase()}.xlsx`
  );
};

</script>