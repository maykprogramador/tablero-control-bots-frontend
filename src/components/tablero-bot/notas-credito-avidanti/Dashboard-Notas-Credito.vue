<template>
  <div @keydown.esc="cerrarModalDashboard" tabindex="0" @click="cerrarModalDashboard" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div @click.stop class="fixed inset-0 bg-white dark:bg-black rounded-none shadow-2xl 
         w-screen h-screen sm:relative sm:rounded-xl 
         sm:max-w-8xl sm:max-h-[95vh] sm:w-full sm:h-auto 
         overflow-auto sm:overflow-hidden">
      <button 
        @click="cerrarModalDashboard"
        class="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group"
      >
        <svg class="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <div class="bg-gradient-to-r from-slate-800 to-[#80006A] text-white p-6 pr-16 md:sticky md:top-0 md:z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span class="text-xl">💰</span>
          </div>

          <div class="flex items-center gap-3">
            <div>
              <h2 class="text-xl sm:text-2xl font-bold">Detalles de Notas Crédito</h2>
              <p class="text-blue-100 mt-1 flex items-center gap-2">
                {{ bot.nombre }}
                <select v-model="filtros.maquina" class="bg-transparent border-none border-gray-200 rounded-md text-sm dark:border-slate-600 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A] transition-colors cursor-pointer w-8" >
                  <option value="0" class="text-gray-800"></option>
                  <option v-for="m in maquinasDisponibles" :key="m" :value="m" class="text-gray-800" >
                    {{ m }}
                  </option>
                </select>
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div @click="filtros.estado = ''" class="bg-white/10 rounded-lg p-3 text-center cursor-pointer">
            <div class="text-lg sm:text-2xl font-bold">{{ registrosFiltrados.length }}</div>
            <div class="text-xs sm:text-sm text-white">Total Registros</div>
          </div>
          <div @click="filtros.estado = 'exito'" class="bg-[#00B094]/70 rounded-lg p-3 cursor-pointer text-center">
            <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('exito') }}</div>
            <div class="text-xs sm:text-sm text-white">Exitosos</div>
          </div>
          <div @click="filtros.estado = 'pendiente'" class="bg-[#FF5F3F]/70 rounded-lg p-3 cursor-pointer text-center">
            <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('pendiente') }}</div>
            <div class="text-xs sm:text-sm text-white">Pendiente</div>
          </div>
          <div @click="filtros.estado = 'error'" class="bg-red-500/20 rounded-lg p-3 cursor-pointer text-center">
            <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('error') }}</div>
            <div class="text-xs sm:text-sm text-white">Con Error</div>
          </div>
        </div>
      </div>

      <div class="sm:p-6 md:max-h-[65vh] md:overflow-y-auto">
        <div class="flex flex-wrap gap-3 items-end bg-white/70 dark:bg-[#14181a] backdrop-blur-sm px-3 py-4 rounded-xl shadow border border-gray-100 dark:border-slate-800 sm:mx-4">
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              Buscar por NIT, Prefijo o Factura
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-200 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" >
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="filtros.busqueda" type="text" placeholder="Ej: 800130907 o ACI..." class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A] transition" />
            </div>
          </div>

          <div class="relative" ref="datePickerRef">
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              Fecha de Ejecución
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input type="text" readonly :value="rangoFechasTexto" @click="togglePopover" placeholder="Seleccionar rango" class="w-44 pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 focus:ring-1 focus:ring-[#80006A] focus:border-[#80006A] transition-all duration-200"/>
            </div>

            <Teleport to="body">
              <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95" >
                <div v-if="showDatePopover" ref="popoverEl" class="absolute top-full left-0 z-75 w-80 bg-white/95 dark:bg-black backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 p-4"
                  :style="{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }"
                >
                  <div class="space-y-3">
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">
                        Fecha inicial
                      </label>
                      <input  v-model="fechaInicioTemp" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]" />
                    </div>

                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">
                        Fecha final
                      </label>
                      <input v-model="fechaFinTemp" type="date" :min="fechaInicioTemp" class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]" />
                    </div>
                    <div class="flex gap-2 pt-2">
                      <button @click="aplicarRangoFechas" :disabled="!fechaInicioTemp" class="flex-1 px-4 py-2 bg-[#80006A] text-white rounded-lg font-medium hover:bg-[#660055] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow" >
                        Aplicar
                      </button>
                      <button @click="limpiarRangoFechas" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200" >
                        Limpiar
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </Teleport>

          </div>

          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Estado</label>
            <select v-model="filtros.estado"
              class="w-40 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]">
              <option value="">Todos</option>
              <option value="exito">Éxito</option>
              <option value="error">Error</option>
              <option value="pendiente">Pendiente</option>
            </select>
          </div>

          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Sede</label>
            <select v-model="filtros.sede"
              class="w-40 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]">
              <option value="">Todas</option>
              <option v-for="sede in sedesUnicas" :key="sede" :value="sede">{{ sede }}</option>
            </select>
          </div>
        </div>

        <div class="rounded-2xl md:m-4 shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-black">
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Sede
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    NIT
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Prefijo
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Factura
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Valor
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Fecha Ejecución
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Duracion
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Estado
                  </th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody v-if="paginatedRecords" class="bg-white divide-y divide-gray-100 dark:divide-slate-800">
                <tr
                  v-for="registro in paginatedRecords"
                  :key="registro.id"
                  class="hover:bg-blue-50/50 dark:hover:bg-[#21292e] dark:bg-[#14181a] transition-colors duration-200 group"
                >
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ registro.sede }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700 dark:text-gray-300">
                    {{ registro.nit }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-200 font-semibold">
                    {{ registro.prefijo }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-200 font-semibold">
                    {{ registro.numero_factura1 }} - {{ registro.numero_factura2 }} - {{ registro.numero_factura3 }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                    {{ formatearMoneda(registro.valor) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ formatearFechaHora(registro.fecha_ejecucion) }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    <div class="flex items-center gap-1">
                      <svg v-if="registro.duracion" class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {{ formatDuration(registro.duracion) }}
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusBadgeClass(registro.estado)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <span :class="getStatusDotClass(registro.estado)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                      {{ getStatusText(registro.estado) }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm">
                    <div class="flex justify-center gap-2">
                      <button @click="abrirModal(registro)" class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-semibold rounded-lg text-[#80006A] dark:text-purple-100 bg-[#F5E6F1] dark:bg-[#80006A] hover:bg-[#E6CCE4] dark:hover:bg-[#80006A] hover:text-[#A65C99] dark:hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-[#A65C99] dark:focus:ring-purple-600 transition-all duration-200 group-hover:scale-105" >
                        <svg class="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                        Ver detalles
                      </button>
                    </div>
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
              <span class="text-gray-600 dark:text-gray-300">Cargando Notas Crédito...</span>
            </div>
          </div>
          <div v-if="registrosFiltrados.length === 0 && isLoading === false" class="text-center py-16 bg-gray-50 dark:bg-black">
            <div class="text-gray-500 dark:text-gray-100">
              <div class="text-gray-400 dark:text-gray-200 text-6xl mb-4">🔍</div>
              <p class="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-2">No se encontraron registros</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>
          <div v-if="totalPages > 1" class="mt-6 pt-4 mb-4 border-t border-gray-200 dark:border-slate-600">
            
            <div class="flex sm:hidden items-center justify-between">
              <button 
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-2 py-1.5 text-sm border border-gray-300 dark:hover:bg-slate-800 dark:bg-slate-800 dark:text-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ‹
              </button>
              
              <div class="text-sm text-gray-700 dark:text-gray-300 px-2">
                {{ currentPage }} / {{ totalPages }}
              </div>
              
              <button 
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-2 py-1.5 text-sm border border-gray-300 dark:hover:bg-slate-800 dark:bg-slate-800 dark:text-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                ›
              </button>
            </div>
            <div class="flex items-center justify-between mt-4 ml-4">
              <div class="hidden sm:flex justify-start text-sm text-gray-700 dark:text-gray-300 mb-4">
                Mostrando {{ (currentPage - 1) * recordsPerPage + 1 }} a {{ Math.min(currentPage * recordsPerPage, registrosTrazabilidad.length) }} de {{ registrosTrazabilidad.length }} registros
              </div>

              <div class="hidden sm:flex items-center gap-2 mr-4">
                
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-3 py-1.5 text-sm border border-gray-300 dark:hover:bg-slate-800 dark:bg-slate-800 dark:text-gray-100 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
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
        </div>
      </div>
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
          @click="cerrarModalDashboard"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
        >
          Cerrar
        </button>
      </div>

    </div>
  </div>
  <ModalNotaCredito v-if="mostrarModal" :registroSeleccionado="registroSeleccionado" @close="mostrarModal = false" />
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineProps, watch, nextTick, defineEmits } from 'vue'
//import ModalDetailsHistoriaClinica from './Modal-details-historia-clinica.vue' // Ajustar si el nombre del modal cambia
import { useTableroFunctions } from '@/stores/tablero-functions'
import { useAuthStore } from '@/stores/Autentificate/auth';
import { useRouter } from 'vue-router'
import { formatearFechaHora } from '@/utils/FormatDate';
import * as XLSX from 'xlsx';
import { capitalizarPrimeraLetra } from '@/utils/CapitalizarPalabras';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import { formatDuration } from '@/utils/FormatSeconds';
import ModalNotaCredito from './Modal-nota-credito.vue';
dayjs.extend(isBetween);

// STORES Y ROUTER ----------------------------------------------------------------------
const authStore = useAuthStore()
const router = useRouter()
const tableroFunctions = useTableroFunctions()

// Props -----------------------------------------------------------------------------
const props = defineProps(['bot'])
const emit = defineEmits(['close'])

onMounted(async() => {
   window.addEventListener('resize', updatePopoverPosition)
   window.addEventListener('scroll', updatePopoverPosition)
   window.addEventListener('click', handleClickOutside)
   isLoading.value = true;
  try {
    await tableroFunctions.loadNotasCreditoAvidanti(); 
    console.log('notasCredito: ', registrosTrazabilidad.value);
    
  }
  catch(error){
    console.error(error);
    // Manejo de error silencioso o alerta según necesidad
    alert(error.response?.data?.error || "Error al cargar los datos");
  }
  
  isLoading.value = false;
  document.addEventListener('keydown', handleEscape)
})

// COMPUTED ------------------------------------------------------------------------
const registrosTrazabilidad = computed(() => {
    const data = tableroFunctions.notas_credito_avidanti || []; 

    return data.map(t => ({
        id: t.id,
        maquina_id: t.maquina_id,
        sede: t.sede,
        prefijo: t.prefijo,
        tipo: t.tipo,
        numero_factura1: t.numero_factura1,
        numero_factura2: t.numero_factura2,
        numero_factura3: t.numero_factura3,
        valor: t.valor,
        nit: t.nit,
        descripcion: t.descripcion,
        estado: t.estado, // Mapeado directo del JSON (pendiente, exito, etc)
        fecha_ejecucion: t.fecha_ejecucion,
        duracion: t.duracion,
        cufe: t.cufe,
        cude: t.cude,
        pdf: t.pdf,
        bot: t.Bot ? t.Bot.nombre : 'Bot Notas Credito'
    }))
});

// VARIABLES REACTIVAS---------------------------------------------------------
const showDatePopover = ref(false)
const fechaInicioTemp = ref('')
const fechaFinTemp = ref('')
const datePickerRef = ref(null)
// Estado reactivo
const mostrarModal = ref(false)
const registroSeleccionado = ref(null)
const filtros = ref({
  busqueda: '',
  estado: '',
  sede: '',
  fechaInicio: '',
  fechaFin: '',
  maquina: '0'
})
const isLoading = ref(false)
const currentPage = ref(1)
const recordsPerPage = 10

//paginacion -----------------------------------------------------------------------------------------
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

// DESPLIGUE DE LAS FECHAS ---------------------------------------------------------
const popoverPos = ref({ top: 0, left: 0 })
const popoverEl = ref(null)

function updatePopoverPosition() {
  const input = datePickerRef.value?.querySelector('input')
  if (!input) return
  const rect = input.getBoundingClientRect()
  popoverPos.value = {
    top: rect.bottom + window.scrollY + 8, // un pequeño margen
    left: rect.left + window.scrollX,
  }
}

// abrir / cerrar el popover
function togglePopover() {
  showDatePopover.value = !showDatePopover.value
  if (showDatePopover.value) {
    nextTick(updatePopoverPosition)
  }
}

// cerrar si se hace clic fuera
function handleClickOutside(event) {
  if (
    showDatePopover.value &&
    !datePickerRef.value?.contains(event.target) &&
    !popoverEl.value?.contains(event.target)
  ) {
    showDatePopover.value = false
  }
}

// Computed para mostrar el rango seleccionado
const rangoFechasTexto = computed(() => {
  const inicio = filtros.value.fechaInicio
  const fin = filtros.value.fechaFin

  if (!inicio) {
    return 'Seleccionar rango'
  }
  if (!fin) {
    return inicio
  }

  return `${inicio} - ${fin}`
})


// Función para aplicar el rango de fechas
const aplicarRangoFechas = () => {
  if (fechaInicioTemp.value) {
    filtros.value.fechaInicio = fechaInicioTemp.value
    filtros.value.fechaFin = fechaFinTemp.value || ''
    showDatePopover.value = false
  }
}

// Función para limpiar el rango de fechas
const limpiarRangoFechas = () => {
  fechaInicioTemp.value = ''
  fechaFinTemp.value = ''
  filtros.value.fechaInicio = ''
  filtros.value.fechaFin = ''
  showDatePopover.value = false
}

// Computed properties
// Sedes únicas
const sedesUnicas = computed(() => {
  const sedes = [...new Set(registrosTrazabilidad.value.map(r => r.sede).filter(Boolean))]
  return sedes.sort()
})

const maquinasDisponibles = computed(() => {
  const ids = registrosTrazabilidad.value
    .map(r => r.maquina_id)
    .filter(id => id !== null)

  return [...new Set(ids)].sort((a,b) => a - b)
})


const registrosFiltrados = computed(() => {
  let registros = registrosTrazabilidad.value

  // Filtro por búsqueda (NIT, Prefijo, Factura)
  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase()
    registros = registros.filter(r =>
      (r.nit && r.nit.toString().includes(busqueda)) ||
      (r.prefijo && r.prefijo.toLowerCase().includes(busqueda)) ||
      (r.numero_factura1 && r.numero_factura1.toString().includes(busqueda)) ||
      (r.valor && r.valor.toString().includes(busqueda))
    )
  }

  // Filtro por estado
  if (filtros.value.estado) {
    registros = registros.filter(r => r.estado === filtros.value.estado)
  }

  // Filtro por sede
  if (filtros.value.sede) {
    registros = registros.filter(r => r.sede === filtros.value.sede)
  }

  //  Filtrar por máquina (0 = mostrar todo)
  if (filtros.value.maquina !== "0") {
    registros = registros.filter(reg =>
      reg.maquina_id === Number(filtros.value.maquina)
    )
  }

  // Filtro por rango de fechas (Solo fecha_ejecucion)
  if (filtros.value.fechaInicio) {
    const startDate = dayjs(filtros.value.fechaInicio)
    const endDate = filtros.value.fechaFin
      ? dayjs(filtros.value.fechaFin)
      : null 

    registros = registros.filter(record => {
      // Usamos fecha_ejecucion
      const recordDate = record.fecha_ejecucion ? dayjs(record.fecha_ejecucion) : null

      if (!recordDate) return false 

      if (endDate) {
        return recordDate.isBetween(startDate, endDate, 'day', '[]')
      } else {
        return recordDate.isSame(startDate, 'day')
      }
    })

  }
  return registros
})

// Métodos

const cerrarModalDashboard = () => {
  emit('close')
}

const abrirModal = (registro) => {
  registroSeleccionado.value = registro
  mostrarModal.value = true
}

const cerrarModal = () => {
  mostrarModal.value = false
  registroSeleccionado.value = null
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    exito: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    error: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    pendiente: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700 dark:text-gray-300'
}

const getStatusDotClass = (estado) => {
  const classes = {
    exito: 'bg-green-500 dark:bg-green-400',
    error: 'bg-red-500 dark:bg-red-400',
    pendiente: 'bg-yellow-500 dark:bg-yellow-400'
  }
  return classes[estado] || 'bg-gray-500 dark:bg-gray-400'
}

const getStatusCount = (estado) => {
  return registrosFiltrados.value.filter(record => record.estado === estado).length
}

const getStatusText = (estado) => {
  const texts = {
    exito: 'Éxito',
    error: 'Error',
    pendiente: 'Pendiente'
  }
  return texts[estado] || capitalizarPrimeraLetra(estado)
}

const formatearMoneda = (valor) => {
  if (!valor) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
}


const exportData = () => {
  // 1️⃣ Obtener los datos filtrados
  const data = registrosFiltrados.value.map(record => ({
    Sede: record.sede || '—',
    NIT: record.nit,
    Prefijo: record.prefijo,
    Factura: record.numero_factura1,
    Valor: record.valor,
    Fecha_Ejecución: record.fecha_ejecucion || '—',
    Duración: record.duracion? formatDuration(record.duracion) : '—',
    Estado: capitalizarPrimeraLetra(record.estado),
    Descripción: record.descripcion,
    cufe: record.cufe,
    cude: record.cude,
    pdf: record.pdf,
    Bot: record.bot
  }));

  // 2️⃣ Crear hoja de cálculo a partir de los datos
  const worksheet = XLSX.utils.json_to_sheet(data);

  // 3️⃣ Crear un nuevo libro de Excel y añadir la hoja
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Notas Credito Masivas");// nombre de la hoja

  // 4️⃣ Generar archivo Excel y descargar
  XLSX.writeFile(
    workbook, 
    `notas-credito-${props.bot.nombre.replace(/\s+/g, '-').toLowerCase()}.xlsx`
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
  window.addEventListener('resize', updatePopoverPosition)
  window.addEventListener('scroll', updatePopoverPosition)
  window.addEventListener('click', handleClickOutside)
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