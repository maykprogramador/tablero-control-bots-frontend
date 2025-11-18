<template>
  <div @click="cerrarModal" @keydown.esc="cerrarModal" tabindex="0" class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-gray-100 dark:bg-gray-900 w-full h-screen 
       sm:relative sm:rounded-2xl sm:shadow-2xl sm:max-w-8xl sm:max-h-[95vh] 
       overflow-hidden flex flex-col  <!-- ✅ Flex container -->
       transform transition-all duration-300"
       @click.stop
    >
       <!-- Header del modal -->
      <!-- Header - Fijo -->
      <div class="bg-gradient-to-r from-slate-800 to-[#80006A] dark:from-slate-900 px-6 py-4 flex-shrink-0 mb-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center">
            <span class="text-white text-lg">📄</span>
          </div>
          <div>
            <h2 class="font-bold text-xl text-white">Detalle Autorizacion</h2>
            <p class="text-blue-100 dark:text-purple-200 text-sm">Información completa de la autorizacion</p>
          </div>
        </div>
        <button
          @click="cerrarModal"
          class="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      <div class="space-y-6 m-5 flex-1 overflow-y-auto pr-2 custom-scrollbar min-h-0">
        <!-- Encabezado del Paciente -->
        <transition name="fade-slide">
          <div class="bg-blue-50 dark:bg-gray-800 rounded-xl shadow-md p-8 border border-blue-100 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 sm:gap-6">
              
              <!-- Información del paciente -->
              <div class="flex items-start gap-4 flex-1">
                <div class="bg-blue-100 dark:bg-blue-900/50 rounded-full p-4">
                  <User :size="32" class="text-blue-600 dark:text-blue-400" />
                </div>
                <div class="flex-1">
                  <h1 class="text-2xl font-bold text-slate-800 dark:text-gray-100">{{ autorizacion.nombrePaciente }}</h1>
                  <div class="mt-3 space-y-2">
                    <p class="text-sm text-gray-600 dark:text-gray-300">
                      <span class="font-semibold">Identificación:</span> {{ autorizacion.numero_identificacion }}
                    </p>
                    <p v-if="autorizacion.correo_electronico" class="text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
                      <Mail :size="16" class="text-gray-400 dark:text-gray-300" />
                      {{ autorizacion.correo_electronico }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Estado EPS -->
              <div class="text-right mt-4 sm:mt-0">
                <!-- Activo EPS -->
                <transition name="scale">
                  <span 
                    v-if="autorizacion.activoEPS"
                    class="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300"
                  >
                    ✓ Activo EPS
                  </span>
                </transition>
              </div>
            </div>
          </div>
        </transition>

        <!-- Grid de Tarjetas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Datos Administrativos -->
          <transition name="fade-slide" :style="{ transitionDelay: '0.1s' }">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-6">
                <FileText :size="24" class="text-indigo-600 dark:text-indigo-400" />
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Datos Administrativos</h2>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">
                    Cups
                  </p>

                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">
                    {{ autorizacion.cups }} 
                    <template v-if="autorizacion.desRelacionada && autorizacion.desRelacionada !== '0'">
                      / {{ autorizacion.desRelacionada }}
                    </template>
                  </p>
                </div>

                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">ID Orden</p>
                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.idOrden }}</p>
                </div>
              
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Cantidad</p>
                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.cantidad }}</p>
                </div>
                
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Ingreso</p>
                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.numIngreso }}</p>
                </div>
                
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Folio</p>
                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.numFolio }}</p>
                </div>
              </div>
            </div>
          </transition>

          <!-- Datos Clínicos -->
          <transition name="fade-slide" :style="{ transitionDelay: '0.2s' }">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-6">
                <Activity :size="24" class="text-emerald-600 dark:text-emerald-400" />
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Datos Clínicos</h2>
              </div>
              
              <div class="space-y-5">
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">Diagnóstico</p>
                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.diagnostico }}</p>
                </div>
                
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">Grupo de Atención</p>
                  <p class="text-sm text-slate-800 dark:text-gray-200">{{ autorizacion.grupoAtencion }}</p>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Empresa</p>
                    <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.empresa }}</p>
                  </div>
                  <div>
                    <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Sede</p>
                    <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.sede }}</p>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Radicación y Estado -->
          <transition name="fade-slide" :style="{ transitionDelay: '0.3s' }">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-6">
                <CheckCircle :size="24" class="text-blue-600 dark:text-blue-400" />
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Radicación y Estado</h2>
              </div>
              
              <div class="space-y-5">
                <div class="grid grid-cols-2 gap-4 items-center">
                  <div>
                    <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">Nro. Autorización</p>
                    <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.nroAutorizacionRadicado || 'Pendiente' }}</p>
                  </div>

                  <!-- Estado del Trámite -->
                  <div class="justify-self-start items-center">
                    <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">Estado del Trámite</p>
                    <transition name="scale">
                      <span 
                        :class="getStatusBadgeClass(autorizacion.estado_autorizacion)"
                        class="inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-medium"
                      >
                      <span :class="getStatusDotClass(autorizacion.estado_autorizacion)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                        {{ getStatusText(autorizacion.estado_autorizacion) }}
                      </span>
                    </transition>
                  </div>
                </div>
                
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha Autorización</p>
                    <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ formatDate(autorizacion.fechaAutorizacion) }}</p>
                  </div>
                  <div>
                    <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Vencimiento</p>
                    <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ formatDate(autorizacion.fechaVencimiento) }}</p>
                  </div>
                </div>
                
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-3">Estado Vigencia</p>
                  <div class="flex flex-wrap gap-2">
                    <transition name="scale">
                      <span v-if="estadoVigencia"
                        class="px-3 py-1 rounded-full text-xs font-semibold"
                        :class="{
                          'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300': estadoVigencia.color === 'blue',
                          'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300': estadoVigencia.color === 'red',
                          'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300': estadoVigencia.color === 'gray'
                        }"
                      >
                        {{ estadoVigencia.label }}
                      </span>
                    </transition>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <!-- Línea de Tiempo -->
          <transition name="fade-slide" :style="{ transitionDelay: '0.4s' }">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-6">
                <Clock :size="24" class="text-[#be18a3]" />
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Línea de Tiempo</h2>
              </div>
              
              <div class="space-y-6">
                <!-- Timeline visual -->
                <div class="flex items-center justify-between relative">
                  <div class="flex flex-col items-center">
                    <div class="w-4 h-4 rounded-full bg-[#d6a2cdc7] dark:bg-[#be18a3] z-10"></div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center whitespace-nowrap">{{ formatTime(autorizacion.inicio_proceso) }}</p>
                  </div>
                  
                  <div class="flex-1 h-1 bg-gradient-to-r from-[#d6a2cdc7] to-[#80006A] dark:from-[#be18a3] dark:to-[#80006A] mx-3 relative top-0"></div>
                  
                  <div class="flex flex-col items-center">
                    <div class="w-4 h-4 rounded-full bg-[#80006A] z-10"></div>
                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center whitespace-nowrap">{{ formatTime(autorizacion.fin_proceso) }}</p>
                  </div>
                </div>

                <!-- ✅ Duración total -->
                <div class="flex items-center gap-2 text-gray-700 dark:text-gray-400 px-3 py-2 rounded-lg">
                  <Clock :size="16" class="text-gray-700 dark:text-gray-300 flex-shrink-0" />
                  <span class="text-sm font- text-gray-700 dark:text-gray-300">
                    Duración total: 
                    <span class="font-semibold">
                      {{ calculateDuration(autorizacion.inicio_proceso, autorizacion.fin_proceso) }}
                    </span>
                  </span>
                </div>
                
                <!-- Información adicional -->
                <div class="bg-purple-50 dark:bg-[#80006A]/20 rounded-lg p-4 border border-purple-100 dark:border-[#80006A]">
                  <p class="text-xs font-medium text-[#80006A] dark:text-purple-300 mb-2">Solicitud Inicial</p>
                  <p class="text-sm text-[#80006A] dark:text-purple-200">{{ formatDateTime(autorizacion.fechaSolicitud) }}</p>
                </div>
              </div>
            </div>
          </transition>

          <!-- Información Complementaria -->
          <transition name="fade-slide" :style="{ transitionDelay: '0.5s' }">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow lg:col-span-2">
              <div class="flex items-center gap-3 mb-6">
                <Info :size="24" class="text-slate-600 dark:text-slate-400" />
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Información Complementaria</h2>
              </div>
              
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-2">Método Radicación</p>
                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ autorizacion.metodoRadicacion }}</p>
                </div>
              </div>
            </div>
          </transition>
        </div>
        <!-- Footer del modal -->
        <div class="flex justify-end space-x-4 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="cerrarModal"
            class="inline-flex items-center px-6 py-3 border border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>

  
</template>

<script setup>
import { ref, defineEmits, computed} from 'vue'
import {  User,  FileText,  Activity,  CheckCircle,  Clock,  Info, Mail } from 'lucide-vue-next'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween'


dayjs.extend(isBetween)
const emit = defineEmits(['close'])

const { autorizacion } = defineProps(['autorizacion'])

// Mock data
/*const autorizacion = ref({
  id: 9,
  paciente_id: 19,
  bot_id: 10,
  idOrden: 987656,
  grupoAtencion: "NUEVA EPS REGIMEN SUBSIDIADO 2023",
  empresa: "ODO",
  sede: "SAN MARCEL",
  fechaSolicitud: "2025-11-11T13:00:00.000Z",
  CUPS: "101011",
  desRelacionada: "Consulta general",
  diagnostico: "A01",
  cantidad: 1,
  numIngreso: "ING12346",
  numFolio: "FOL67894",
  contratado: true,
  ordenDuplicada: false,
  anulada: false,
  activoEPS: true,
  gestionadoTramita: false,
  metodoRadicacion: "Web",
  nroAutorizacionRadicado: "AUT98716",
  fechaAutorizacion: "2025-11-11",
  fechaVencimiento: "2025-12-11",
  inicio_proceso: "2025-11-11T13:05:00.000Z",
  fin_proceso: "2025-11-11T13:06:00.000Z",
  numero_identificacion: "1234567791",
  nombrePaciente: "Juan Carlos",
  correo_electronico: "juan.carlos@email.com"
})*/

const estadoTramite = computed(() => {
  if (autorizacion.anulada) {
    return { label: 'Error', color: 'red' }
  }

  if (!autorizacion.nroAutorizacionRadicado || autorizacion.nroAutorizacionRadicado.trim() === '') {
    return { label: 'Pendiente', color: 'yellow' }
  }

  return { label: 'Éxito', color: 'green' }
})


const diasRestantes = computed(() => {
  return calcularDiasRestantes(autorizacion.fechaVencimiento);
});

const estadoVigencia = computed(() => {
  if (autorizacion.anulada) return null;

  // no existen días o fecha inválida
  if (diasRestantes.value === null) {
    return { label: "No disponible", color: "gray" };
  }

  return diasRestantes.value > 0
    ? { label: `Vigente • ${diasRestantes.value} días restantes`, color: "blue" }
    : { label: "Vencida", color: "red" };
});

const calcularDiasRestantes = (fechaVencimiento) => {
  if (!fechaVencimiento) return null;

  const hoy = dayjs();
  const vencimiento = dayjs(fechaVencimiento);

  if (!vencimiento.isValid()) return null;

  return vencimiento.diff(hoy, "day");
};

const cerrarModal = () => {
  emit('close')
}

const calculateDuration = (start, end) => {
  if (!start || !end) return '—';
  const startTime = new Date(start).getTime();
  const endTime = new Date(end).getTime();
  const diffMs = endTime - startTime;

  if (diffMs <= 0) return '0s';

  const seconds = Math.floor(diffMs / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  const secs = seconds % 60;
  const mins = minutes % 60;

  if (hours > 0) {
    return `${hours}h ${mins}m`;
  } else if (mins > 0) {
    return `${mins}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
};
// Utility functions
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })
}

const formatTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleTimeString('es-CO', { 
    hour: '2-digit', 
    minute: '2-digit' 
  })
}

const formatDateTime = (dateString) => {
  const date = new Date(dateString)
  return date.toLocaleString('es-CO', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const getStatusBadgeClass = (estado) => {
  const classes = {
    exito: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    autorizado: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    radicado: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
    pendiente: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    error: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
  }
  return classes[estado] || 'bg-gray-100 text-gray-700 dark:bg-slate-700 dark:text-gray-300'
}

const getStatusDotClass = (estado) => {
  const classes = {
    exito: 'bg-green-500 dark:bg-green-400',
    autorizado: 'bg-green-500 dark:bg-green-400',
    radicado: 'bg-blue-500 dark:bg-blue-400',
    pendiente: 'bg-yellow-500 dark:bg-yellow-400',
    error: 'bg-red-500 dark:bg-red-400',
  }
  return classes[estado] || 'bg-gray-500'
}

const getStatusText = (estado) => {
  const texts = {
    exito: 'Éxito',
    autorizado: 'Autorizado',
    radicado: 'Radicado',
    error: 'Error',
    pendiente: 'Pendiente'
  }
  return texts[estado] || 'No Radicado'
}
</script>

<style scoped>
/* Transiciones personalizadas */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.5s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.scale-enter-active,
.scale-leave-active {
  transition: all 0.3s ease;
}

.scale-enter-from,
.scale-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}

.custom-scrollbar::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Para Firefox */
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 #f1f5f9;
}
</style>