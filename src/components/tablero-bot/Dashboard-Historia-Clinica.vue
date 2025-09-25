<template>
  <div class="bg-white w-full rounded-xl shadow-md p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100">
      <div class="bg-gradient-to-r from-green-500 to-green-400 text-white p-3 rounded-lg mr-4">
        <ClipboardDocumentListIcon class="h-7 w-7 text-white" />
      </div>
      <h2 class="text-xl font-semibold text-slate-800">Panel de Historias</h2>
    </div>
    <!-- Barra de búsqueda y filtros -->
    <div class="rounded-2xl shadow-lg border border-gray-100 p-6 mb-6 backdrop-blur-sm bg-white/80">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <!-- Campo de búsqueda -->
        <div class="md:col-span-2">
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Buscar por nombre o identificación
          </label>
          <div class="relative">
            <svg class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="filtros.busqueda"
              type="text"
              placeholder="Buscar..."
              class="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
            />
          </div>
        </div>

        <!-- Filtro por estado -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Estado
          </label>
          <select
            v-model="filtros.estado"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
          >
            <option value="">Todos los estados</option>
            <option value="exito">Éxito</option>
            <option value="error">Error</option>
            <option value="pendiente">Pendiente</option>
          </select>
        </div>

        <!-- Filtro por empresa -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-2">
            Empresa
          </label>
          <select
            v-model="filtros.empresa"
            class="w-full px-4 py-3 border border-gray-200 rounded-xl bg-gray-50 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-white"
          >
            <option value="">Todas las empresas</option>
            <option v-for="empresa in empresasUnicas" :key="empresa" :value="empresa">
              {{ empresa }}
            </option>
          </select>
        </div>
      </div>
    </div>

    <!-- Tabla principal -->
    <div class="rounded-2xl shadow-lg border border-gray-100 overflow-hidden backdrop-blur-sm bg-white/90">
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
                Correo Electrónico
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
                Motivo de Fallo
              </th>
              <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                Bot Responsable
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
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600 text-center">
                {{ registro.correo_electronico || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                {{ registro.ingreso }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700">
                {{ registro.folio }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                {{ formatearFecha(registro.fecha_historia) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span :class="getBadgeClass(registro.estado_envio)" class="px-3 py-1 text-xs font-bold rounded-full">
                  {{ getEstadoTexto(registro.estado_envio) }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                {{ registro.motivo_fallo || '—' }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-purple-600 font-medium">
                {{ registro.bot }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <button
                  @click="abrirModal(registro)"
                  class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-semibold rounded-lg text-blue-700 bg-blue-100 hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 group-hover:scale-105"
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ClipboardDocumentListIcon } from "@heroicons/vue/24/outline"
import ModalDetailsHistoriaClinica from './Modal-details-historia-clinica.vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import { useAuthStore } from '@/stores/Autentificate/auth';
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const tableroFunctions = useTableroFunctions()
const registrosTrazabilidad = computed(() => 
  tableroFunctions.historias_clinicas.map(t => ({
    empresa: t.HistoriaClinica.Paciente.empresa,
    numero_identificacion: t.HistoriaClinica.Paciente.numero_identificacion,
    nombre: t.HistoriaClinica.Paciente.nombre,
    correo_electronico: t.HistoriaClinica.Paciente.correo_electronico,
    ingreso: t.HistoriaClinica.ingreso,
    fecha_historia: t.HistoriaClinica.fecha_historia,
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
  empresa: ''
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

const registrosFiltrados = computed(() => {
  let registros = registrosTrazabilidad.value

  // Filtro por búsqueda
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase()
    registros = registros.filter(r => 
      r.nombre.toLowerCase().includes(busqueda) ||
      r.numero_identificacion.includes(busqueda)
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

  return registros
})

// Métodos
const abrirModal = (registro) => {
  registroSeleccionado.value = registro
  mostrarModal.value = true
  console.log('se abrio el modal');
  
}

const cerrarModal = () => {
  mostrarModal.value = false
  registroSeleccionado.value = null
}

const getBadgeClass = (estado) => {
  const clases = {
    exito: 'bg-green-100 text-green-800 border border-green-200',
    error: 'bg-red-100 text-red-800 border border-red-200',
    pendiente: 'bg-yellow-100 text-yellow-800 border border-yellow-200'
  }
  return clases[estado] || 'bg-gray-100 text-gray-800 border border-gray-200'
}

const getEstadoTexto = (estado) => {
  const textos = {
    exito: 'Éxito',
    error: 'Error',
    pendiente: 'Pendiente'
  }
  return textos[estado] || estado
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

// Cerrar modal con tecla Escape
const handleEscape = (e) => {
  if (e.key === 'Escape' && mostrarModal.value) {
    cerrarModal()
  }
}

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