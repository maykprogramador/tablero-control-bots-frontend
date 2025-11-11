<template>
  <div @keydown.esc="cerrarModalDashboard" tabindex="0" @click="cerrarModalDashboard" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div @click.stop class="fixed inset-0 bg-white dark:bg-black rounded-none shadow-2xl 
         w-screen h-screen sm:relative sm:rounded-xl 
         sm:max-w-8xl sm:max-h-[95vh] sm:w-full sm:h-auto 
         overflow-auto sm:overflow-hidden">
      <!-- Close Button -->
      <button 
        @click="cerrarModalDashboard"
        class="absolute top-4 right-4 z-20 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group"
      >
        <svg class="w-4 h-4 text-gray-600 dark:text-gray-300 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </button>

      <!-- Modal Header -->
      <div class="bg-gradient-to-r from-slate-800 to-[#80006A] text-white p-6 pr-16 md:sticky md:top-0 md:z-10">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
            <span class="text-xl">📋</span>
          </div>
          <div>
            <h2 class="text-xl sm:text-2xl font-bold">Autorizaciones</h2>
            <p class="text-blue-100 mt-1">{{ bot.nombre }}</p>
          </div>
        </div>

        <!-- Summary Stats -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <div @click="filtros.estado = ''" class="bg-white/10 rounded-lg p-3 text-center cursor-pointer hover:bg-white/20 transition-colors">
            <div class="text-lg sm:text-2xl font-bold">{{ registrosAutorizaciones.length }}</div>
            <div class="text-xs sm:text-sm text-white">Total</div>
          </div>
          <div @click="filtros.estado = 'activo'" class="bg-green-500/60 rounded-lg p-3 cursor-pointer text-center hover:bg-green-500/80 transition-colors">
            <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('activo') }}</div>
            <div class="text-xs sm:text-sm text-white">Activas</div>
          </div>
          <div @click="filtros.estado = 'vencidas'" class="bg-yellow-500/60 rounded-lg p-3 cursor-pointer text-center hover:bg-yellow-500/80 transition-colors">
            <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('vencidas') }}</div>
            <div class="text-xs sm:text-sm text-white">Vencidas</div>
          </div>
          <div @click="filtros.estado = 'anuladas'" class="bg-red-500/20 rounded-lg p-3 cursor-pointer text-center hover:bg-red-500/30 transition-colors">
            <div class="text-lg sm:text-2xl font-bold text-white">{{ getStatusCount('anuladas') }}</div>
            <div class="text-xs sm:text-sm text-white">Anuladas</div>
          </div>
        </div>
      </div>

      <!-- Body -->
      <div class="sm:p-6 md:max-h-[65vh] md:overflow-y-auto">
        <!-- Barra de búsqueda adaptada para autorizaciones -->
        <div class="flex flex-wrap gap-3 items-end bg-white/70 dark:bg-[#14181a] backdrop-blur-sm px-3 py-4 rounded-xl shadow border border-gray-100 dark:border-slate-800 sm:mx-4">
          <!-- Campo de búsqueda -->
          <div class="flex-1 min-w-[200px]">
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              Buscar por paciente o número
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-200 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-4.35-4.35m1.35-5.65a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input v-model="filtros.busqueda" type="text" placeholder="Buscar..." class="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A] transition" />
            </div>
          </div>

          <!-- Rango de fechas -->
          <div class="relative" ref="datePickerRef">
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">
              Fechas
            </label>
            <div class="relative">
              <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <input type="text" readonly :value="rangoFechasTexto" @click="togglePopover" placeholder="Seleccionar rango" class="w-44 pl-9 pr-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 focus:ring-1 focus:ring-[#80006A] focus:border-[#80006A] transition-all duration-200"/>
            </div>

            <!-- Popover de selección de fechas -->
            <Teleport to="body">
              <Transition enter-active-class="transition ease-out duration-200" enter-from-class="opacity-0 scale-95" enter-to-class="opacity-100 scale-100" leave-active-class="transition ease-in duration-150" leave-from-class="opacity-100 scale-100" leave-to-class="opacity-0 scale-95">
                <div v-if="showDatePopover" ref="popoverEl" class="absolute top-full left-0 z-75 w-80 bg-white/95 dark:bg-black backdrop-blur-sm rounded-lg shadow-lg border border-gray-200 dark:border-slate-600 p-4"
                  :style="{ top: `${popoverPos.top}px`, left: `${popoverPos.left}px` }"
                >
                  <div class="space-y-3">
                    <!-- Tipo de fecha adaptado para autorizaciones -->
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">Filtrar por</label>
                      <select
                        v-model="filtros.tipoDato"
                        class="w-full px-3 py-2 border border-gray-200 rounded-md text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A] transition-colors"
                      >
                        <option value="fecha_solicitud">Fecha Solicitud</option>
                        <option value="fecha_autorizacion">Fecha Autorización</option>
                        <option value="fecha_vencimiento">Fecha Vencimiento</option>
                      </select>
                    </div>
                    <!-- Fecha inicial -->
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">
                        Fecha inicial
                      </label>
                      <input v-model="fechaInicioTemp" type="date" class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]" />
                    </div>

                    <!-- Fecha final -->
                    <div>
                      <label class="block text-xs font-semibold text-gray-700 dark:text-gray-400 mb-1">
                        Fecha final
                      </label>
                      <input v-model="fechaFinTemp" type="date" :min="fechaInicioTemp" class="w-full px-3 py-2 border border-gray-200 rounded-lg bg-white dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]" />
                    </div>
                    <!-- Botones -->
                    <div class="flex gap-2 pt-2">
                      <button @click="aplicarRangoFechas" :disabled="!fechaInicioTemp" class="flex-1 px-4 py-2 bg-[#80006A] text-white rounded-lg font-medium hover:bg-[#660055] disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 shadow-sm hover:shadow">
                        Aplicar
                      </button>
                      <button @click="limpiarRangoFechas" class="px-4 py-2 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-100 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-all duration-200">
                        Limpiar
                      </button>
                    </div>
                  </div>
                </div>
              </Transition>
            </Teleport>
          </div>

          <!-- Estado adaptado a autorizaciones -->
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Estado</label>
            <select v-model="filtros.estado"
              class="w-40 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]">
              <option value="">Todos</option>
              <option value="activo">Activas</option>
              <option value="vencidas">Vencidas</option>
              <option value="anuladas">Anuladas</option>
            </select>
          </div>

          <!-- EPS -->
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">EPS</label>
            <select v-model="filtros.eps"
              class="w-40 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]">
              <option value="">Todas</option>
              <option v-for="eps in epsUnicas" :key="eps" :value="eps">{{ eps }}</option>
            </select>
          </div>

          <!-- Sede -->
          <div>
            <label class="block text-xs font-bold text-gray-600 dark:text-gray-300 mb-1">Sede</label>
            <select v-model="filtros.sede"
              class="w-40 px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]">
              <option value="">Todas</option>
              <option v-for="sede in sedesUnicas" :key="sede" :value="sede">{{ sede }}</option>
            </select>
          </div>
        </div>

        <!-- Tabla adaptada para autorizaciones -->
        <div class="rounded-2xl md:m-4 shadow-lg border border-gray-100 dark:border-slate-800 overflow-hidden backdrop-blur-sm bg-white/90 dark:bg-black">
          <!-- Tabla principal -->
          <div class="overflow-x-auto">
            <table class="w-full">
              <thead class="bg-gray-100 dark:bg-slate-800">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Número Autorización
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Identificación
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Paciente
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    EPS
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Fecha Autorización
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Fecha Vencimiento
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                    Días Restantes
                  </th>
                  <th class="px-6 py-4 text-center text-xs font-bold text-gray-600 dark:text-gray-300 uppercase tracking-wider">
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
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-blue-600 dark:text-blue-200 font-semibold">
                    {{ registro.nroAutorizacionRadicado }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-700 dark:text-gray-300">
                    {{ registro.numero_identificacion }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100 font-medium">
                    {{ registro.nombrePaciente }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ truncarTexto(registro.grupoAtencion, 25) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ formatearFecha(registro.fechaAutorizacion) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                    {{ formatearFecha(registro.fechaVencimiento) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <span :class="getDiasRestantesClass(calcularDiasRestantes(registro.fechaVencimiento))">
                      {{ calcularDiasRestantes(registro.fechaVencimiento) }}d
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span 
                      :class="getStatusBadgeClass(getEstado(registro))"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <span :class="getStatusDotClass(getEstado(registro))" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                      {{ getStatusText(getEstado(registro)) }}
                    </span>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm">
                    <div class="flex justify-center gap-2">
                      <button @click="abrirModal(registro)" class="inline-flex items-center px-4 py-2 border border-transparent text-sm leading-4 font-semibold rounded-lg text-[#80006A] dark:text-purple-100 bg-[#F5E6F1] dark:bg-[#80006A] hover:bg-[#E6CCE4] dark:hover:bg-[#80006A] hover:text-[#A65C99] dark:hover:text-purple-200 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-[#A65C99] dark:focus:ring-purple-600 transition-all duration-200 group-hover:scale-105">
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

          <!-- Mensaje cuando no hay resultados -->
          <div v-if="registrosFiltrados.length === 0" class="text-center py-16 bg-gray-50 dark:bg-black">
            <div class="text-gray-500 dark:text-gray-100">
              <div class="text-gray-400 dark:text-gray-200 text-6xl mb-4">🔍</div>
              <p class="text-xl font-semibold text-gray-700 dark:text-gray-100 mb-2">No se encontraron autorizaciones</p>
              <p class="text-sm text-gray-500 dark:text-gray-300">Intenta ajustar los filtros de búsqueda</p>
            </div>
          </div>

          <!-- Pagination -->
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
                Mostrando {{ (currentPage - 1) * recordsPerPage + 1 }} a {{ Math.min(currentPage * recordsPerPage, registrosAutorizaciones.length) }} de {{ registrosAutorizaciones.length }} registros
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
          @click="cerrarModalDashboard"
          class="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
        >
          Cerrar
        </button>
      </div>
    </div>
  </div>
  <ModalAutorizacion v-if="mostrarModal" :registro="registroSeleccionado" @close="mostrarModal = false"/>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, defineProps, watch, nextTick, defineEmits } from 'vue'
import * as XLSX from 'xlsx'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'
import { useTableroFunctions } from '@/stores/tablero-functions'
import ModalAutorizacion from './Modal-Autorizacion.vue'
dayjs.extend(isBetween)

const { bot } = defineProps(['bot'])

const emit = defineEmits(['close'])

// computed -------------------------------------------------------------------------------------
const autorizaciones = computed(() => 
  tableroFunctions.autorizaciones.map(a => ({
    id: a.id,
    bot_id: a.bot_id,
    nombreBot: a.Bot.nombre,
    idOrden: a.idOrden,
    grupoAtencion: a.grupoAtencion,
    empresa: a.empresa,
    sede: a.sede,
    fechaSolicitud: a.fechaSolicitud,
    cups: a.CUPS,
    desRelacionada: a.desRelacionada,
    diagnostico: a.diagnostico,
    cantidad: a.cantidad,
    numIngresos: a.numIngreso,
    numFolio: a.numFolio,
    contratado: a.contratado,
    ordenDuplicada: a.ordenDuplicada,
    anulada: a.anulada,
    activoEPS: a.activoEPS,
    gestionadoTramita: a.gestionadoTramita,
    metodoRadicacion: a.metodoRadicacion,
    nroAutorizacionRadicado: a.nroAutorizacionRadicado,
    fechaAutorizacion: a.fechaAutorizacion,
    fechaVencimiento: a.fechaVencimiento,
    inicio_proceso: a.inicio_proceso,
    fin_proceso: a.fin_proceso,
    numero_identificacion: a.Paciente.numero_identificacion,
    nombrePaciente: a.Paciente.nombre,
  })))


// stores: ------------------------------------------------------------------------
const tableroFunctions = useTableroFunctions()
// ------------------------------------------------------------------------------


// VARIABLES REACTIVAS
const showDatePopover = ref(false)
const fechaInicioTemp = ref('')
const fechaFinTemp = ref('')
const datePickerRef = ref(null)
const popoverEl = ref(null)
const popoverPos = ref({ top: 0, left: 0 })
const mostrarModal = ref(false)
const registroSeleccionado = ref(null)
const currentPage = ref(1)
const recordsPerPage = 10

//mock
/*const autorizacionesMock = [
  {
    id: 1,
    nroAutorizacionRadicado: 'AUT98716',
    numero_identificacion: '1234567791',
    nombrePaciente: 'Juan Carlos Pérez',
    grupoAtencion: 'NUEVA EPS REGIMEN SUBSIDIADO',
    fechaAutorizacion: '2025-11-11',
    fechaVencimiento: '2025-12-11',
    anulada: false,
    activoEPS: true
  },
  {
    id: 2,
    nroAutorizacionRadicado: 'AUT98717',
    numero_identificacion: '1987654321',
    nombrePaciente: 'María González López',
    grupoAtencion: 'SALUD TOTAL REGIMEN CONTRIBUTIVO',
    fechaAutorizacion: '2025-10-20',
    fechaVencimiento: '2025-11-05',
    anulada: false,
    activoEPS: true
  },
  {
    id: 3,
    nroAutorizacionRadicado: 'AUT98718',
    numero_identificacion: '1555666777',
    nombrePaciente: 'Carlos Rodríguez Morales',
    grupoAtencion: 'COOMEVA REGIMEN CONTRIBUTIVO',
    fechaAutorizacion: '2025-09-15',
    fechaVencimiento: '2025-10-15',
    anulada: true,
    activoEPS: false
  },
  {
    id: 4,
    nroAutorizacionRadicado: 'AUT98719',
    numero_identificacion: '1111222333',
    nombrePaciente: 'Ana Patricia Silva Castro',
    grupoAtencion: 'NUEVA EPS REGIMEN SUBSIDIADO',
    fechaAutorizacion: '2025-11-05',
    fechaVencimiento: '2025-12-05',
    anulada: false,
    activoEPS: true
  },
  {
    id: 5,
    nroAutorizacionRadicado: 'AUT98720',
    numero_identificacion: '1333444555',
    nombrePaciente: 'Roberto Fernández Díaz',
    grupoAtencion: 'SANITAS REGIMEN CONTRIBUTIVO',
    fechaAutorizacion: '2025-08-10',
    fechaVencimiento: '2025-09-10',
    anulada: false,
    activoEPS: false
  }
]*/

const filtros = ref({
  busqueda: '',
  estado: '',
  eps: '',
  sede: '',
  fechaInicio: '',
  fechaFin: '',
  tipoDato: 'fecha_solicitud'
})

const registrosAutorizaciones = computed(() => autorizaciones.value)

// Empresas/EPS únicas
const epsUnicas = computed(() => {
  const eps = [...new Set(registrosAutorizaciones.value.map(r => r.grupoAtencion))]
  return eps.sort()
})

// Sedes únicas (simuladas)
const sedesUnicas = computed(() => {
  const sedes = [...new Set(registrosAutorizaciones.value.map(r => r.sede).filter(Boolean))]
  return sedes.sort()
})

// Rango de fechas texto
const rangoFechasTexto = computed(() => {
  const inicio = filtros.value.fechaInicio
  const fin = filtros.value.fechaFin
  if (!inicio) return 'Seleccionar rango'
  if (!fin) return inicio
  return `${inicio} - ${fin}`
})

const registrosFiltrados = computed(() => {
  let registros = registrosAutorizaciones.value

  if (filtros.value.busqueda) {
    const busqueda = filtros.value.busqueda.toLowerCase()
    registros = registros.filter(r =>
      r.nombrePaciente.toLowerCase().includes(busqueda) ||
      r.numero_identificacion.includes(busqueda) ||
      r.nroAutorizacionRadicado.includes(busqueda)
    )
  }

  if (filtros.value.estado === 'activo') {
    registros = registros.filter(r => !r.anulada && calcularDiasRestantes(r.fechaVencimiento) > 0)
  } else if (filtros.value.estado === 'vencidas') {
    registros = registros.filter(r => !r.anulada && calcularDiasRestantes(r.fechaVencimiento) <= 0)
  } else if (filtros.value.estado === 'anuladas') {
    registros = registros.filter(r => r.anulada)
  }

  if (filtros.value.eps) {
    registros = registros.filter(r => r.grupoAtencion === filtros.value.eps)
  }

  if (filtros.value.fechaInicio) {
    const startDate = dayjs(filtros.value.fechaInicio)
    const endDate = filtros.value.fechaFin ? dayjs(filtros.value.fechaFin) : null

    registros = registros.filter(record => {
      const recordDate = dayjs(record.fechaAutorizacion)
      if (endDate) {
        return recordDate.isBetween(startDate, endDate, 'day', '[]')
      } else {
        return recordDate.isSame(startDate, 'day')
      }
    })
  }

  return registros
})

// Paginación
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

// MÉTODOS
const calcularDiasRestantes = (fechaVencimiento) => {
  const hoy = dayjs()
  const vencimiento = dayjs(fechaVencimiento)
  return vencimiento.diff(hoy, 'day')
}

const getEstado = (registro) => {
  if (registro.anulada) return 'anuladas'
  const diasRestantes = calcularDiasRestantes(registro.fechaVencimiento)
  return diasRestantes > 0 ? 'activo' : 'vencidas'
}

const getDiasRestantesClass = (dias) => {
  if (dias > 30) return 'text-green-600 dark:text-green-400 font-semibold'
  if (dias > 0) return 'text-yellow-600 dark:text-yellow-400 font-semibold'
  return 'text-red-600 dark:text-red-400 font-semibold'
}

const formatearFecha = (fecha) => {
  if (!fecha) return '—'
  return dayjs(fecha).format('DD/MM/YYYY')
}

const truncarTexto = (texto, longitud) => {
  if (!texto) return '—'
  return texto.length > longitud ? texto.substring(0, longitud) + '...' : texto
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    activo: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    vencidas: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    anuladas: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
  }
  return classes[estado] || 'bg-gray-100 text-gray-700'
}

const getStatusDotClass = (estado) => {
  const classes = {
    activo: 'bg-green-500 dark:bg-green-400',
    vencidas: 'bg-yellow-500 dark:bg-yellow-400',
    anuladas: 'bg-red-500 dark:bg-red-400'
  }
  return classes[estado] || 'bg-gray-500'
}

const getStatusText = (estado) => {
  const texts = {
    activo: 'Activa',
    vencidas: 'Vencida',
    anuladas: 'Anulada'
  }
  return texts[estado] || 'Desconocido'
}

const getStatusCount = (estado) => {
  if (estado === 'activo') return registrosFiltrados.value.filter(r => !r.anulada && calcularDiasRestantes(r.fechaVencimiento) > 0).length
  if (estado === 'vencidas') return registrosFiltrados.value.filter(r => !r.anulada && calcularDiasRestantes(r.fechaVencimiento) <= 0).length
  if (estado === 'anuladas') return registrosFiltrados.value.filter(r => r.anulada).length
  return registrosFiltrados.value.length
}

const togglePopover = () => {
  showDatePopover.value = !showDatePopover.value
  if (showDatePopover.value) nextTick(updatePopoverPosition)
}

const updatePopoverPosition = () => {
  const input = datePickerRef.value?.querySelector('input')
  if (!input) return
  const rect = input.getBoundingClientRect()
  popoverPos.value = {
    top: rect.bottom + window.scrollY + 8,
    left: rect.left + window.scrollX,
  }
}

const handleClickOutside = (event) => {
  if (
    showDatePopover.value &&
    !datePickerRef.value?.contains(event.target) &&
    !popoverEl.value?.contains(event.target)
  ) {
    showDatePopover.value = false
  }
}

const aplicarRangoFechas = () => {
  if (fechaInicioTemp.value) {
    filtros.value.fechaInicio = fechaInicioTemp.value
    filtros.value.fechaFin = fechaFinTemp.value || ''
    showDatePopover.value = false
  }
}

const limpiarRangoFechas = () => {
  fechaInicioTemp.value = ''
  fechaFinTemp.value = ''
  filtros.value.fechaInicio = ''
  filtros.value.fechaFin = ''
  filtros.value.tipoDato = 'fecha_solicitud'
  showDatePopover.value = false
}

const abrirModal = (registro) => {
  registroSeleccionado.value = registro
  mostrarModal.value = true
  console.log('modal: ', mostrarModal.value);
  
}

const cerrarModal = () => {
  mostrarModal.value = false
  registroSeleccionado.value = null
}

const cerrarModalDashboard = () => {
  emit('close')
  mostrarModal.value = false
  registroSeleccionado.value = null
}

const exportData = () => {
  const data = registrosFiltrados.value.map(record => ({
    'Número Autorización': record.nroAutorizacionRadicado,
    'Identificación': record.numero_identificacion,
    'Paciente': record.nombrePaciente,
    'EPS': record.grupoAtencion,
    'Fecha Autorización': formatearFecha(record.fechaAutorizacion),
    'Fecha Vencimiento': formatearFecha(record.fechaVencimiento),
    'Días Restantes': calcularDiasRestantes(record.fechaVencimiento),
    'Estado': getStatusText(getEstado(record))
  }))

  const worksheet = XLSX.utils.json_to_sheet(data)
  const workbook = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(workbook, worksheet, "Autorizaciones")
  XLSX.writeFile(workbook, `autorizaciones-${dayjs().format('DD-MM-YYYY')}.xlsx`)
}

const handleEscape = (e) => {
  if (e.key === 'Escape' && mostrarModal.value) {
    cerrarModal()
  }
}

onMounted(async () => {

  await tableroFunctions.loadAutorizaciones()
  console.log('autorizaciones cargadas: ', autorizaciones.value);
  
  window.addEventListener('resize', updatePopoverPosition)
  window.addEventListener('scroll', updatePopoverPosition)
  window.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('resize', updatePopoverPosition)
  window.removeEventListener('scroll', updatePopoverPosition)
  window.removeEventListener('click', handleClickOutside)
})
</script>

<style scoped>
@keyframes fadeIn {
  from { opacity: 0; transform: scale(0.95); }
  to { opacity: 1; transform: scale(1); }
}

.modal-enter-active {
  animation: fadeIn 0.3s ease-out;
}
</style>
