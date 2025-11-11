<template>
  <div class="min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto space-y-6">
      <!-- Encabezado del Paciente -->
      <transition name="fade-slide">
        <div class="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl shadow-md p-8 border border-blue-100">
          <div class="flex items-start justify-between gap-6">
            <div class="flex items-start gap-4 flex-1">
              <div class="bg-blue-100 rounded-full p-4">
                <User :size="32" class="text-blue-600" />
              </div>
              <div class="flex-1">
                <h1 class="text-2xl font-bold text-slate-800">{{ autorizacion.Paciente.nombre }}</h1>
                <div class="mt-3 space-y-2">
                  <p class="text-sm text-gray-600">
                    <span class="font-semibold">Identificación:</span> {{ autorizacion.Paciente.numero_identificacion }}
                  </p>
                  <p class="text-sm text-gray-600 flex items-center gap-2">
                    <Mail :size="16" class="text-gray-400" />
                    {{ autorizacion.Paciente.correo_electronico }}
                  </p>
                </div>
              </div>
            </div>
            <div class="text-right">
              <transition name="scale">
                <span 
                  v-if="autorizacion.activoEPS"
                  class="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-green-100 text-green-700"
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
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-6">
              <FileText :size="24" class="text-indigo-600" />
              <h2 class="text-lg font-semibold text-slate-800">Datos Administrativos</h2>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-1">Orden CUPS</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.CUPS }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-1">ID Orden</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.idOrden }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-1">Descripción</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.desRelacionada }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-1">Cantidad</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.cantidad }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-1">Ingreso</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.numIngreso }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-1">Folio</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.numFolio }}</p>
              </div>
            </div>
          </div>
        </transition>

        <!-- Datos Clínicos -->
        <transition name="fade-slide" :style="{ transitionDelay: '0.2s' }">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-6">
              <Activity :size="24" class="text-emerald-600" />
              <h2 class="text-lg font-semibold text-slate-800">Datos Clínicos</h2>
            </div>
            
            <div class="space-y-5">
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-2">Diagnóstico</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.diagnostico }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-2">Grupo de Atención</p>
                <p class="text-sm text-slate-800">{{ autorizacion.grupoAtencion }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 mb-1">Empresa</p>
                  <p class="text-base font-semibold text-slate-800">{{ autorizacion.empresa }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 mb-1">Sede</p>
                  <p class="text-base font-semibold text-slate-800">{{ autorizacion.sede }}</p>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Radicación y Estado -->
        <transition name="fade-slide" :style="{ transitionDelay: '0.3s' }">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-6">
              <CheckCircle :size="24" class="text-blue-600" />
              <h2 class="text-lg font-semibold text-slate-800">Radicación y Estado</h2>
            </div>
            
            <div class="space-y-5">
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-2">Nro. Autorización</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.nroAutorizacionRadicado }}</p>
              </div>
              
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 mb-1">Fecha Autorización</p>
                  <p class="text-base font-semibold text-slate-800">{{ formatDate(autorizacion.fechaAutorizacion) }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 mb-1">Vencimiento</p>
                  <p class="text-base font-semibold text-slate-800">{{ formatDate(autorizacion.fechaVencimiento) }}</p>
                </div>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-3">Estado</p>
                <div class="flex flex-wrap gap-2">
                  <transition name="scale">
                    <span v-if="autorizacion.contratado" class="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                      Contratado
                    </span>
                  </transition>
                  <transition name="scale">
                    <span v-if="autorizacion.ordenDuplicada" class="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                      Orden Duplicada
                    </span>
                  </transition>
                  <transition name="scale">
                    <span v-if="autorizacion.anulada" class="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">
                      Anulada
                    </span>
                  </transition>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Línea de Tiempo -->
        <transition name="fade-slide" :style="{ transitionDelay: '0.4s' }">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div class="flex items-center gap-3 mb-6">
              <Clock :size="24" class="text-purple-600" />
              <h2 class="text-lg font-semibold text-slate-800">Línea de Tiempo</h2>
            </div>
            
            <div class="space-y-6">
              <!-- Timeline visual -->
              <div class="flex items-center justify-between relative">
                <div class="flex flex-col items-center">
                  <div class="w-4 h-4 rounded-full bg-purple-600 z-10"></div>
                  <p class="text-xs text-gray-500 mt-2 text-center whitespace-nowrap">{{ formatTime(autorizacion.inicio_proceso) }}</p>
                </div>
                
                <div class="flex-1 h-1 bg-gradient-to-r from-purple-600 to-purple-200 mx-3 relative top-0"></div>
                
                <div class="flex flex-col items-center">
                  <div class="w-4 h-4 rounded-full bg-purple-600 z-10"></div>
                  <p class="text-xs text-gray-500 mt-2 text-center whitespace-nowrap">{{ formatTime(autorizacion.fin_proceso) }}</p>
                </div>
              </div>
              
              <!-- Información adicional -->
              <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p class="text-xs font-medium text-purple-800 mb-2">Solicitud Inicial</p>
                <p class="text-sm text-purple-900">{{ formatDateTime(autorizacion.fechaSolicitud) }}</p>
              </div>
            </div>
          </div>
        </transition>

        <!-- Información Complementaria -->
        <transition name="fade-slide" :style="{ transitionDelay: '0.5s' }">
          <div class="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow lg:col-span-2">
            <div class="flex items-center gap-3 mb-6">
              <Info :size="24" class="text-slate-600" />
              <h2 class="text-lg font-semibold text-slate-800">Información Complementaria</h2>
            </div>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-2">Método Radicación</p>
                <p class="text-base font-semibold text-slate-800">{{ autorizacion.metodoRadicacion }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-2">Paciente ID</p>
                <p class="text-base font-semibold text-slate-800">#{{ autorizacion.paciente_id }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-2">BOT ID</p>
                <p class="text-base font-semibold text-slate-800">#{{ autorizacion.bot_id }}</p>
              </div>
              
              <div>
                <p class="text-xs uppercase font-medium text-gray-500 mb-2">Autorización ID</p>
                <p class="text-base font-semibold text-slate-800">#{{ autorizacion.id }}</p>
              </div>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { 
  User, 
  FileText, 
  Activity, 
  CheckCircle, 
  Clock, 
  Info,
  Mail
} from 'lucide-vue-next'

// Mock data
const autorizacion = ref({
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
  Paciente: {
    numero_identificacion: "1234567791",
    nombre: "Juan Carlos",
    correo_electronico: "juan.carlos@email.com"
  }
})

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
</style>