<template>
  <div @keydown.esc="cerrarModalDashboard" tabindex="0" @click="cerrarModalDashboard" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div @click.stop class="fixed inset-0 bg-white rounded-none shadow-2xl 
         w-screen h-screen sm:relative sm:rounded-xl 
         sm:max-w-7xl sm:max-h-[95vh] sm:w-full sm:h-auto 
         overflow-auto sm:overflow-hidden">
      <!-- Close Button -->
      <button 
        @click="cerrarModalDashboard"
        class="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group"
      >
        <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-slate-800 to-[#80006A] text-white p-6 pr-16 md:sticky md:top-0 md:z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span class="text-xl">🤖</span>
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-bold">Detalles de Ejecución</h2>
            <p class="text-blue-100 mt-1">{{ bot.nombre }}</p>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div class="bg-white/10 rounded-lg p-3 text-center">
            <div class="text-lg sm:text-2xl font-bold">{{ registrosTrazabilidad.length }}</div>
            <div class="text-xs sm:text-sm text-blue-100">Total Registros</div>
          </div>
          <div class="bg-green-500/20 rounded-lg p-3 text-center">
            <div class="text-lg sm:text-2xl font-bold text-green-200">{{ getStatusCount('exito') }}</div>
            <div class="text-xs sm:text-sm text-green-100">Exitosos</div>
          </div>
          <div class="bg-yellow-500/20 rounded-lg p-3 text-center">
            <div class="text-lg sm:text-2xl font-bold text-yellow-200">{{ getStatusCount('pendiente') }}</div>
            <div class="text-xs sm:text-sm text-yellow-100">Pendiente</div>
          </div>
          <div class="bg-red-500/20 rounded-lg p-3 text-center">
            <div class="text-lg sm:text-2xl font-bold text-red-200">{{ getStatusCount('error') }}</div>
            <div class="text-xs sm:text-sm text-red-100">Con Error</div>
          </div>
        </div>
      </div>

      <!-- Cuerpo del dashboard -->
      <div class="p-6 md:max-h-[65vh] md:overflow-y-auto">
        <!-- Barra de búsqueda y filtros (versión compacta) -->
        <div class="flex flex-wrap gap-3 items-end bg-white/70 backdrop-blur-sm px-3 py-4 rounded-xl shadow border border-gray-100 mx-4">
          <!-- Campo de búsqueda -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-bold text-gray-600 mb-1">
              Buscar por nombre o identificación
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="filtros.busqueda" type="text" placeholder="Buscar..." class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:ring-1 focus:ring-blue-500 focus:border-blue-400 transition" />
            </div>
          </div>

          <!-- Estado -->
          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">Estado</label>
            <select v-model="filtros.estado"
              class="w-40 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:ring-1 focus:ring-blue-500">
              <option value="">Todos</option>
              <option value="exito">Éxito</option>
              <option value="error">Error</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          <!-- Empresa -->
          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">Empresa</label>
            <select v-model="filtros.empresa"
              class="w-40 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:ring-1 focus:ring-blue-500">
              <option value="">Todas</option>
              <option v-for="empresa in empresasUnicas" :key="empresa" :value="empresa">{{ empresa }}</option>
            </select>
          </div>

          <!-- Sede -->
          <div>
            <label class="block text-xs font-bold text-gray-600 mb-1">Sede</label>
            <select v-model="filtros.sede"
              class="w-40 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900 focus:ring-1 focus:ring-blue-500">
              <option value="">Todas</option>
              <option v-for="sede in sedesUnicas" :key="sede" :value="sede">{{ sede }}</option>
            </select>
          </div>
        </div>

        <div class="rounded-2xl md:m-4 shadow-lg border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/90">
          <!-- Tabla principal -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Empresa / IPS
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Identificación
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Nombre del Paciente
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Ingreso
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Folio
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Fecha Historia
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody v-if="paginatedRecords" class="bg-white divide-y divide-gray-100">
                <tr
                  v-for="registro in paginatedRecords"
                  :key="`${registro.numero_identificacion}-${registro.ingreso}`"
                  class="hover:bg-blue-50/50 transition-all duration-200 group"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ registro.empresa }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 font-semibold">
                    {{ registro.numero_identificacion }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
                    {{ registro.nombre }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                    {{ registro.ingreso }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                    {{ registro.folio }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ formatearFechaHora(registro.fecha_historia) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusBadgeClass(registro.estado_envio)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <span :class="getStatusDotClass(registro.estado_envio)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                      {{ getStatusText(registro.estado_envio) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <button
                      @click="abrirModal(registro)"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-semibold rounded-lg text-[#80006A] bg-[#F5E6F1] hover:bg-[#E6CCE4] hover:text-[#A65C99] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#A65C99] transition-all duration-200 group-hover:scale-105"
                      >
                      <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                      </svg>
                      Ver detalles
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <!-- Indicador de carga -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="flex items-center gap-3">
              <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Cargando Historias...</span>
            </div>
          </div>
          <!-- Mensaje cuando no hay resultados -->
          <div v-if="registrosFiltrados.length === 0 && isLoading === false" class="text-center py-16 bg-gradient-to-b from-gray-50 to-white">
            <div class="text-gray-500">
              <div class="text-gray-400 text-6xl mb-4">🔍</div>
              <p class="text-xl font-semibold text-gray-700 mb-2">No se encontraron registros</p>
              <p class="text-sm text-gray-500">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
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
            <div class="flex items-center justify-between mt-4 ml-4">
              <!-- Información de registros - Oculta en móviles muy pequeños -->
              <div class="hidden sm:flex justify-start text-sm text-gray-700 mb-4">
                Mostrando {{ (currentPage - 1) * recordsPerPage + 1 }} a {{ Math.min(currentPage * recordsPerPage, registrosTrazabilidad.length) }} de {{ registrosTrazabilidad.length }} registros
              </div>

              <!-- Versión tablet y desktop (≥ 500px) -->
              <div class="hidden sm:flex items-center gap-2 mr-4">
                
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
          @click="cerrarModalDashboard"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
        >
          Cerrar
        </button>
      </div>

    </div>
  </div>
  
  <!-- Modal de detalles -->
  <Modal-details-historia-clinica
    v-if="mostrarModal"
    :registroSeleccionado="registroSeleccionado"
    :close="cerrarModal"  
  />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineProps } from 'vue'
import ModalDetailsHistoriaClinica from './Modal-details-historia-clinica.vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import { useAuthStore } from '@/stores/Autentificate/auth';
import { useRouter } from 'vue-router'
import { formatDate, formatearFechaHora } from '@/utils/FormatDate';
import * as XLSX from 'xlsx';

const authStore = useAuthStore()
const router = useRouter()
// Props
const props = defineProps(['onclose','bot'])

const tableroFunctions = useTableroFunctions()

onMounted(async() => {
   isLoading.value = true;
  //await new Promise(resolve => setTimeout(resolve, 5000)); // simula la carga de datos por un tiempo de 5 segundos
  try {
    await tableroFunctions.loadHistoriasClinicas(authStore.user);
  }
  catch(error){
    alert(error.response.data.error);
  }
  
  isLoading.value = false;
  document.addEventListener('keydown', handleEscape)
})

const registrosTrazabilidad = computed(() => 
  tableroFunctions.historias_clinicas.map(t => ({
    empresa: t.HistoriaClinica.empresa,
    numero_identificacion: t.HistoriaClinica.Paciente.numero_identificacion,
    nombre: t.HistoriaClinica.Paciente.nombre,
    correo_electronico: t.HistoriaClinica.Paciente.correo_electronico,
    ingreso: t.HistoriaClinica.ingreso,
    fecha_historia: t.HistoriaClinica.fecha_historia,
    fecha_envio: t.fecha_envio,
    folio: t.HistoriaClinica.folio,
    estado_envio: t.estado_envio,
    motivo_fallo: t.motivo_fallo,
    bot: t.Bot.nombre
  }))
);

// Estado reactivo
const mostrarModal = ref(false)
const registroSeleccionado = ref(null)
const filtros = ref({
  busqueda: '',
  estado: '',
  empresa: '',
  sede: ''
})
const isLoading = ref(false)
const currentPage = ref(1)
const recordsPerPage = 10
/*
// Datos mock
const registrosTrazabilidad2 = ref([
  {
    empresa: "Clínica San José",
    numero_identificacion: "1006295130",
    nombre: "Juan Carlos Pérez",
    correo_electronico: "juan.perez@mail.com",
    ingreso: "2025-09-22-01",
    fecha_historia: "2025-09-22",
    folio: "F12345",
    estado_envio: "exito",
    motivo_fallo: null,
    bot: "Bot_Historias_Clinicas"
  },
  {
    empresa: "Hospital Central",
    numero_identificacion: "1234567890",
    nombre: "María González López",
    correo_electronico: "maria.gonzalez@email.com",
    ingreso: "2025-09-21-03",
    fecha_historia: "2025-09-21",
    folio: "F12346",
    estado_envio: "error",
    motivo_fallo: "Correo electrónico inválido",
    bot: "Bot_Historias_Clinicas"
  },
  {
    empresa: "Clínica San José",
    numero_identificacion: "9876543210",
    nombre: "Carlos Rodríguez",
    correo_electronico: null,
    ingreso: "2025-09-20-02",
    fecha_historia: "2025-09-20",
    folio: "F12347",
    estado_envio: "pendiente",
    motivo_fallo: null,
    bot: "Bot_Historias_Clinicas_V2"
  },
  {
    empresa: "IPS Salud Total",
    numero_identificacion: "5555666777",
    nombre: "Ana Patricia Morales",
    correo_electronico: "ana.morales@correo.co",
    ingreso: "2025-09-19-01",
    fecha_historia: "2025-09-19",
    folio: "F12348",
    estado_envio: "exito",
    motivo_fallo: null,
    bot: "Bot_Historias_Clinicas"
  },
  {
    empresa: "Hospital Central",
    numero_identificacion: "1111222333",
    nombre: "Roberto Silva Martínez",
    correo_electronico: "roberto.silva@invalid",
    ingreso: "2025-09-18-04",
    fecha_historia: "2025-09-18",
    folio: "F12349",
    estado_envio: "error",
    motivo_fallo: "Formato de correo electrónico inválido",
    bot: "Bot_Historias_Clinicas"
  },
  {
    empresa: "Clínica San José",
    numero_identificacion: "4444555666",
    nombre: "Lucía Fernández Castro",
    correo_electronico: "lucia.fernandez@gmail.com",
    ingreso: "2025-09-17-01",
    fecha_historia: "2025-09-17",
    folio: "F12350",
    estado_envio: "exito",
    motivo_fallo: null,
    bot: "Bot_Historias_Clinicas_V2"
  }
])
*/

//paginacion ----------------------------------------
const totalPages = computed(() => Math.ceil(registrosFiltrados.value.length / recordsPerPage))

const paginatedRecords = computed(() => {
  const start = (currentPage.value - 1) * recordsPerPage
  const end = start + recordsPerPage
  return registrosFiltrados.value.slice(start, end)
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

// Computed properties
const empresasUnicas = computed(() => {
  const empresas = [...new Set(registrosTrazabilidad.value.map(r => r.empresa))]
  return empresas.sort()
})

const sedesUnicas = computed(() => {
  const sedes = [...new Set(registrosTrazabilidad.value.map(r => r.sede).filter(Boolean))]
  return sedes.sort()
})


const registrosFiltrados = computed(() => {
  let registros = registrosTrazabilidad.value

  // Filtro por búsqueda
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase()
    registros = registros.filter(r => 
      r.nombre.toLowerCase().includes(busqueda) ||
      r.numero_identificacion.includes(busqueda)||
      r.ingreso.toLowerCase().includes(busqueda)
    )
  }

  // Filtro por estado
  if (filtros.value.estado) {
    registros = registros.filter(r => r.estado_envio === filtros.value.estado)
  }

  // Filtro por empresa
  if (filtros.value.empresa) {
    registros = registros.filter(r => r.empresa === filtros.value.empresa)
  }

  // Filtro por sede
  if (filtros.value.sede) {
    registros = registros.filter(r => r.sede === filtros.value.sede)
  }

  return registros
})

// Métodos
const cerrarModalDashboard = () => {
  props.onclose()
}

const abrirModal = (registro) => {
  registroSeleccionado.value = registro
  mostrarModal.value = true
  //console.log('se abrio el modal', registroSeleccionado.value);
  
}

const cerrarModal = () => {
  mostrarModal.value = false
  registroSeleccionado.value = null
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    exito: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    pendiente: 'bg-yellow-100 text-yellow-700'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

const getStatusDotClass = (estado) => {
  const classes = {
    exito: 'bg-green-500',
    error: 'bg-red-500',
    pendiente: 'bg-yellow-500'
  }
  return classes[estado] || 'bg-gray-500'
}

const getStatusCount = (estado) => {
  return registrosTrazabilidad.value.filter(record => record.estado_envio === estado).length
}

const getStatusText = (estado) => {
  const texts = {
    exito: 'Éxito',
    error: 'Error',
    pendiente: 'pendiente'
  }
  return texts[estado] || 'Desconocido'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '—'
  const fechaObj = new Date(fecha)
  return fechaObj.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const exportData = () => {
  // 1️⃣ Obtener los datos filtrados
  const data = registrosFiltrados.value.map(record => ({
    Empresa: record.empresa,
    Identificación: record.numero_identificacion,
    Nombre: record.nombre,
    Correo_Electrónico: record.correo_electronico || '—',
    Ingreso: record.ingreso,
    Folio: record.folio,
    Fecha_Historia: record.fecha_historia,
    fecha_envio: record.fecha_envio || '—',
    Estado: record.estado_envio,
    Motivo_Fallo: record.motivo_fallo || '—',
    Bot: record.bot
  }));

  // 2️⃣ Crear hoja de cálculo a partir de los datos
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3️⃣ Crear un nuevo libro de Excel y añadir la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Trazabilidad Correos Envidos");// nombre de la hoja

  // 4️⃣ Generar archivo Excel y descargar
  XLSX.writeFile(
    workbook, 
    `lista-correos-enviados-${props.bot.nombre.replace(/\s+/g, '-').toLowerCase()}.xlsx`
  );
};

// Cerrar modal con tecla Escape
const handleEscape = (e) => {
  if (e.key === 'Escape' && mostrarModal.value) {
    cerrarModal()
  }
}


onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
})
</script>

<style scoped>
/* Animaciones personalizadas */
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-enter-active {
  animation: fadeIn 0.3s ease-out;
}
</style>