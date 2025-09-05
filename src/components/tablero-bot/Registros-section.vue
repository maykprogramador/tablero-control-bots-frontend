<template>
  <div class="bg-white w-full rounded-xl shadow-md p-6  border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">        
    <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100">
      <div class="bg-gradient-to-r from-green-500 to-green-400 text-white p-3 rounded-lg mr-4 text-xl">
        🖥
      </div>
      <h2 class="text-xl font-semibold text-slate-800">Panel de Registros</h2>
    </div>
    
    <!-- Filtros -->
    <div>
      <div class="flex flex-wrap items-center gap-4 mb-2">
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600 font-medium">Filtrar por</label>
          <select
            v-model="registros.dateType"
            class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="createdAt">Fecha de creación</option>
            <option value="fecha_inactivacion">Fecha de inactivación</option>
          </select>
        </div>

        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600 font-medium">Fecha desde</label>
          <input 
            v-model="registros.dateFrom" 
            type="date" 
            class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
        <div class="flex flex-col gap-1">
          <label class="text-sm text-gray-600 font-medium">Fecha hasta</label>
          <input 
            v-model="registros.dateTo" 
            type="date" 
            class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
        <div class="flex flex-col gap-1 w-full xl:w-auto">
          <label class="text-sm text-gray-600 font-medium">Estado</label>
          <select 
            v-model="registros.statusFilter" 
            class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Todos</option>
            <option value="exito">Éxito</option>
            <option value="error">Error</option>
            <option value="proceso">En Proceso</option>
          </select>
        </div>
      </div>
      <div class="relative py-2 mb-1">
        <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
        <input 
          v-model="registros.searchQuery" 
          type="text" 
          placeholder="Buscar por nombre o ID o Sucursal..." 
          class="w-full pl-10 pr-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
      </div>
    </div>
    

    <!-- Tabla usando la MISMA estructura que funciona en tu formulario -->
    <div class="overflow-x-auto">
      
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ID</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Solicitante</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bot</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Creacion</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Fecha de Inactivacion</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Estado</th>
            <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</ th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="(record, index) in paginatedRecords" :key="index" class="hover:bg-gray-50 transition-colors duration-150">
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{{ index + 1 }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{{ capitalizarNombre(record.User.nombre) }}</td>
            <td class="px-4 py-4 text-sm text-gray-700">
              <div class="truncate max-w-[108px]" :title="record.Bot.nombre">
                {{ record.Bot.nombre }}
              </div>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(record.createdAt) }}</td>
            <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">{{ formatDate(record.fecha_inactivacion) }}</td>
            <td class="px-4 py-4 whitespace-nowrap" :title="record.estado">
              <span 
                :class="getStatusBadgeClass(record.estado)"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
              >
                <span :class="getStatusDotClass(record.estado)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                {{ getStatusText(record.estado) }}
              </span>
            </td>
            <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
              <button @click="viewRegistroDetails(record)" class="text-blue-600 cursor-pointer hover:text-blue-800 transition-colors duration-200">Ver detalles</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <!-- Loading State -->
    <div v-if="isLoading" class="flex items-center justify-center py-12">
      <div class="flex items-center gap-3">
        <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span class="text-gray-600">Cargando registros...</span>
      </div>
    </div>
    <!-- Empty State -->
    <div v-if="filteredRegistros.length === 0 && solicitudes.length > 0" class="text-center py-12">
      <div class="text-gray-400 text-6xl mb-4">🔍</div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">No se encontraron Solicitudes</h3>
      <p class="text-gray-500">Intenta ajustar los filtros de búsqueda</p>
    </div>
    <!-- Pagination -->
    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 pt-4 mb-4 border-t border-gray-200">
      
      <!-- Versión móvil simplificada (< 500px) -->
      <div class="flex sm:hidden items-center justify-between">
        <button 
          @click="currentPage--"
          :disabled="currentPage === 1"
          class="px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          ‹
        </button>
        
        <div class="text-sm text-gray-700 px-2">
          {{ currentPage }} / {{ totalPages }}
        </div>
        
        <button 
          @click="currentPage++"
          :disabled="currentPage === totalPages"
          class="px-2 py-1.5 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          ›
        </button>
      </div>
      <div class="flex items-center justify-between mt-4">
        <!-- Información de registros - Oculta en móviles muy pequeños -->
        <div class="hidden sm:flex justify-start text-sm text-gray-700 mb-4">
          Mostrando {{ (currentPage - 1) * recordsPerPage + 1 }} a {{ Math.min(currentPage * recordsPerPage, filteredRegistros.length) }} de {{ filteredRegistros.length }} registros
        </div>

        <!-- Versión tablet y desktop (≥ 500px) -->
        <div class="hidden sm:flex items-center gap-2">
          
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
                  ? 'bg-blue-600 text-white' 
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
    </div>
    
  </div>
  <!-- Aquí usamos tu modal -->
  <solicitudDetailsModal
    :showModal="showModal"
    :selectedRecord="selectedRecord"
    @close="showModal = false"
  />
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import { useAuthStore } from '@/stores/Autentificate/auth';
import { useRouter } from 'vue-router'
import solicitudDetailsModal from './solicitud-details-modal.vue'
import dayjs from 'dayjs'
import { capitalizarNombre } from '@/utils/CapitalizarNombre';
import { formatDate } from '@/utils/FormatDate';
import isBetween from 'dayjs/plugin/isBetween';
import * as XLSX from 'xlsx';
dayjs.extend(isBetween);


const authStore = useAuthStore()
const router = useRouter()

const tableroFunctions = useTableroFunctions()
const solicitudes = computed (() => tableroFunctions.solicitudes)

const isLoading = ref(false)
const showModal = ref(false)
const selectedRecord = ref(null)
const currentPage = ref(1)
const recordsPerPage = 10

onMounted(async () => {
  isLoading.value = true;
  //await new Promise(resolve => setTimeout(resolve, 5000)); // simula la carga de datos por un tiempo de 5 segundos
  await tableroFunctions.loadSolicitudes(authStore.user);
  isLoading.value = false;
});

const viewRegistroDetails = (record) => {
  selectedRecord.value = record;
  showModal.value = true;
}


// Registros data
const registros = ref({
  dateFrom: '',
  dateTo: '',
  statusFilter: '',
  searchQuery: '',
  dateType: 'createdAt'
})


const filteredRegistros = computed(() => {
  return solicitudes.value.filter(record => {
    // --- Filtro por búsqueda ---
    const matchesSearch = !registros.value.searchQuery || 
      record.User.nombre.toLowerCase().includes(registros.value.searchQuery.toLowerCase()) ||
      record.nombre.toLowerCase().includes(registros.value.searchQuery.toLowerCase()) ||
      record.sucursal?.toLowerCase().includes(registros.value.searchQuery.toLowerCase()) ||
      record.identificacion.includes(registros.value.searchQuery);

    // --- Filtro por estado ---
    const matchesStatus = !registros.value.statusFilter || record.estado === registros.value.statusFilter;

    // --- Filtro por fecha ---
    let matchesDate = true;
    if (registros.value.dateFrom) {
      const startDate = dayjs(registros.value.dateFrom);
      const endDate = registros.value.dateTo ? dayjs(registros.value.dateTo) : startDate;

      const selectedDate = record[registros.value.dateType] ? dayjs(record[registros.value.dateType]) : null;

      matchesDate = selectedDate 
        ? selectedDate.isBetween(startDate, endDate, 'day', '[]') 
        : false;
    }

    return matchesSearch && matchesStatus && matchesDate;
  });
});

//paginacion ----------------------------------------
const totalPages = computed(() => Math.ceil(filteredRegistros.value.length / recordsPerPage))

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * recordsPerPage
  const end = start + recordsPerPage
  return filteredRegistros.value.slice(start, end)
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

// Exportar a Excel ----------------------------------  
const exportData = () => {
  // 1️⃣ Obtener los datos filtrados
  const data = filteredRegistros.value.map(record => ({
    ID: record.id,
    Solicitante: record.User.nombre,
    Bot: record.Bot.nombre,
    Nombre: record.nombre,
    Identificación: record.identificacion,
    Cargo: record.cargo,
    Cuenta_Delegar: record.cuenta_delegar,
    Buzon_Compartido: record.buzon_compartido,
    Empresa: validarEmpresa(record.bot_id),
    Sucursal: record.sucursal || 'N/A',
    Estado: record.estado,
    Fecha_De_Creación: formatDate(record.createdAt),
    Fecha_De_Inactivación: formatDate(record.fecha_inactivacion)
  }));

  // 2️⃣ Crear hoja de cálculo a partir de los datos
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3️⃣ Crear un nuevo libro de Excel y añadir la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Solicitudes');

  // 4️⃣ Generar archivo Excel y descargar
  XLSX.writeFile(
    workbook, 
    `detalles de las solicitudes-${authStore.user.nombre.replace(/\s+/g, '-').toLowerCase()}.xlsx`
  );
};
//--------------------------------------------------
const getRegistroStatusClass = (estado) => {
  const classes = {
    proceso: 'bg-yellow-100 text-yellow-800',
    exito: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800'
  }
  return classes[estado] || 'bg-gray-100 text-gray-800'
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    exito: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    proceso: 'bg-yellow-100 text-yellow-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

const validarEmpresa = (botId) => {
  if (botId === 1 || botId === 4) return 'Avidanti'
  if (botId === 3 || botId === 5) return 'Oncologos'
  return 'Desconocida'
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


</script>