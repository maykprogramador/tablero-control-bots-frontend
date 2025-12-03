<template>
  <div @click="cerrarModal" @keydown.esc="cerrarModal" tabindex="0" class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
    <div class="fixed inset-0 bg-gray-100 dark:bg-gray-900 w-full h-screen 
       sm:relative sm:rounded-2xl sm:shadow-2xl sm:max-w-6xl sm:max-h-[90vh] 
       overflow-hidden flex flex-col transform transition-all duration-300"
       @click.stop
    >
      <div class="bg-gradient-to-r from-slate-800 to-[#80006A] px-6 py-4 flex-shrink-0 mb-2">
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <span class="text-white text-lg">💳</span>
          </div>
          <div>
            <h2 class="font-bold text-xl text-white">Detalle Nota Crédito</h2>
            <p class="text-blue-100 text-sm">Información financiera y trazabilidad</p>
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
        
        <transition name="fade-slide">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border-l-4 border-l-[#80006A] border-y border-r border-gray-100 dark:border-gray-700">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
              
              <div class="flex items-center gap-4 flex-1">
                <div class="bg-purple-50 dark:bg-purple-900/30 rounded-full p-4 shrink-0">
                  <Building2 :size="32" class="text-[#80006A] dark:text-purple-300" />
                </div>
                <div>
                  <p class="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Sede / Entidad</p>
                  <h1 class="text-xl sm:text-2xl font-bold text-slate-800 dark:text-gray-100">{{ nota.sede }}</h1>
                  <div class="flex items-center gap-2 mt-1">
                    <span class="px-2 py-0.5 rounded text-xs font-mono bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-600">
                      NIT: {{ nota.nit }}
                    </span>
                  </div>
                </div>
              </div>

              <div class="text-left sm:text-right bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800/50 min-w-[200px]">
                <p class="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase mb-1">Valor Nota Crédito</p>
                <div class="text-2xl sm:text-3xl font-bold text-emerald-700 dark:text-emerald-300">
                  {{ formatearMoneda(nota.valor) }}
                </div>
              </div>
            </div>
          </div>
        </transition>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <transition name="fade-slide" :style="{ transitionDelay: '0.1s' }">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
                <FileText :size="20" class="text-blue-600 dark:text-blue-400" />
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Detalles de Facturación</h2>
              </div>
              
              <div class="grid grid-cols-2 gap-y-6 gap-x-4">
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Prefijo</p>
                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ nota.prefijo || '—' }}</p>
                </div>
                <div>
                  <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Tipo Doc.</p>
                  <p class="text-base font-semibold text-slate-800 dark:text-gray-100">{{ nota.tipo || '—' }}</p>
                </div>
                
                <div class="col-span-2 bg-blue-50/50 dark:bg-blue-900/10 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                  <p class="text-xs uppercase font-medium text-blue-600 dark:text-blue-400 mb-2">Números de Referencia</p>
                  <div class="flex flex-wrap gap-2">
                    <span class="inline-flex items-center px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-blue-200 dark:border-blue-900 text-sm font-mono text-gray-700 dark:text-gray-200 shadow-sm">
                      # {{ nota.numero_factura1 }}
                    </span>
                    <span v-if="nota.numero_factura2" class="inline-flex items-center px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-500 dark:text-gray-400">
                      {{ nota.numero_factura2 }}
                    </span>
                    <span v-if="nota.numero_factura3" class="inline-flex items-center px-2.5 py-1 rounded bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm font-mono text-gray-500 dark:text-gray-400">
                      {{ nota.numero_factura3 }}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </transition>

          <transition name="fade-slide" :style="{ transitionDelay: '0.2s' }">
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3 mb-5 pb-3 border-b border-gray-100 dark:border-gray-700">
                <Activity :size="20" class="text-orange-500 dark:text-orange-400" />
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Estado de Ejecución</h2>
              </div>
              
              <div class="space-y-5">
                <div class="flex items-center justify-between">
                   <div>
                      <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Estado Actual</p>
                      <span :class="getStatusBadgeClass(nota.estado)" class="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        <span :class="getStatusDotClass(nota.estado)" class="w-2 h-2 rounded-full mr-2 animate-pulse"></span>
                        {{ nota.estado }}
                      </span>
                   </div>
                   <div class="text-right">
                      <p class="text-xs uppercase font-medium text-gray-500 dark:text-gray-400 mb-1">Fecha Ejecución</p>
                      <p class="text-sm font-semibold text-slate-800 dark:text-gray-100">{{ formatearFecha(nota.fecha_ejecucion) }}</p>
                      <p class="text-xs text-gray-400 mt-0.5">{{ formatearHora(nota.fecha_ejecucion) }}</p>
                   </div>
                </div>

                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3 flex items-center gap-3 border border-gray-100 dark:border-gray-600">
                   <div class="p-2 bg-white dark:bg-gray-600 rounded shadow-sm">
                      <Bot :size="18" class="text-purple-600 dark:text-purple-300" />
                   </div>
                   <div class="flex-1">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Procesado por</p>
                      <p class="text-sm font-medium text-gray-800 dark:text-gray-200">{{ nota.bot || 'Bot Automatizado' }}</p>
                   </div>
                   <div class="text-right border-l border-gray-200 dark:border-gray-600 pl-3">
                      <p class="text-xs text-gray-500 dark:text-gray-400">Duración</p>
                      <p class="text-sm font-medium text-gray-800 dark:text-gray-200 flex items-center gap-1 justify-end">
                        <Clock :size="12" />
                        {{ formatDuration(nota.duracion) }}
                      </p>
                   </div>
                </div>
              </div>
            </div>
          </transition>
          
          <transition name="fade-slide" :style="{ transitionDelay: '0.3s' }">
            <div class="col-span-1 lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
               <div class="flex items-center gap-3 mb-4">
                <ScrollText :size="20" class="text-indigo-500 dark:text-indigo-400" />
                <h2 class="text-lg font-semibold text-slate-800 dark:text-gray-100">Justificación / Descripción</h2>
              </div>
              
              <div class="bg-indigo-50/50 dark:bg-indigo-900/10 rounded-lg p-4 border border-indigo-100 dark:border-indigo-800/30">
                <p class="text-sm leading-relaxed text-slate-700 dark:text-gray-300 whitespace-pre-line">
                  {{ nota.descripcion || 'Sin descripción disponible.' }}
                </p>
              </div>

              <div v-if="nota.cufe || nota.cude || nota.pdf" class="mt-6 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div v-if="nota.cufe">
                    <p class="text-xs uppercase font-bold text-gray-400 mb-1">CUFE</p>
                    <p class="text-xs font-mono text-gray-600 dark:text-gray-400 break-all bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 select-all">{{ nota.cufe }}</p>
                 </div>
                 <div v-if="nota.cude">
                    <p class="text-xs uppercase font-bold text-gray-400 mb-1">CUDE</p>
                    <p class="text-xs font-mono text-gray-600 dark:text-gray-400 break-all bg-gray-50 dark:bg-gray-900 p-2 rounded border border-gray-200 dark:border-gray-700 select-all">{{ nota.cude }}</p>
                 </div>
              </div>
            </div>
          </transition>

        </div>

        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700 mt-auto">
          <button
            @click="cerrarModal"
            class="px-6 py-2.5 border border-gray-300 dark:border-gray-600 text-sm font-semibold rounded-lg text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gray-200"
          >
            Cerrar
          </button>
          
          <button 
             v-if="nota.pdf"
             @click="descargarPdf()"
             class="px-6 py-2.5 bg-[#80006A] text-white text-sm font-semibold rounded-lg hover:bg-[#660055] transition-colors shadow-sm flex items-center gap-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            Descargar Factura
          </button>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { Building2, FileText, Activity, Clock, ScrollText, Bot } from 'lucide-vue-next'
import { formatDuration } from '@/utils/FormatSeconds'; // Asumiendo que existe, sino usar función local

const emit = defineEmits(['close'])
// Recibimos "registroSeleccionado" como "nota" para ser semánticamente correctos, 
// o puedes mapearlo desde el padre. Aquí uso 'registroSeleccionado' y lo renombro a 'nota' para uso interno
const props = defineProps(['registroSeleccionado'])
const nota = props.registroSeleccionado
//console.log('nota: ',nota);

const cerrarModal = () => {
  emit('close')
}

// Helpers de Formato
const formatearMoneda = (valor) => {
  if (!valor) return '$ 0';
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
}

const formatearFecha = (fecha) => {
  if (!fecha) return '—';
  return new Date(fecha).toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

const formatearHora = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleTimeString('es-CO', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

const descargarPdf = () => {
  if (nota.pdf) {
    window.open(nota.pdf, '_blank')
  }
}

// Clases de Estado (Reutilizando la lógica visual)
const getStatusBadgeClass = (estado) => {
  const map = {
    exito: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border border-green-200 dark:border-green-800',
    pendiente: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800',
    error: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 border border-red-200 dark:border-red-800'
  }
  return map[estado] || 'bg-gray-100 text-gray-600'
}

const getStatusDotClass = (estado) => {
  const map = {
    exito: 'bg-green-500',
    pendiente: 'bg-yellow-500',
    error: 'bg-red-500'
  }
  return map[estado] || 'bg-gray-500'
}
</script>

<style scoped>
/* Scrollbar personalizada */
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 10px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Animaciones */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>