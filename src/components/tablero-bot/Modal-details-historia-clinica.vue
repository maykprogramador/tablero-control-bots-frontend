<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click="cerrarModal"
    @keydown.esc="cerrarModal" tabindex="0"
  >
    <div
      class="fixed inset-0 bg-white dark:bg-black w-screen h-screen 
           sm:relative sm:rounded-2xl sm:shadow-2xl sm:max-w-4xl sm:max-h-[90vh] 
           sm:w-full sm:h-auto 
           overflow-y-auto transform transition-all duration-300"
      @click.stop
    >
      <div class="p-8">
        <!-- Header del modal -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            Detalles del Envío
          </h2>
          <button
            @click="cerrarModal"
            class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Contenido del modal -->
        <div v-if="registroSeleccionado" class="space-y-8">
          <!-- Datos del paciente -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 rounded-2xl p-6 border border-blue-100 dark:border-blue-800">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-3 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Datos del Paciente
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Nombre</label>
                <p class="text-gray-900 dark:text-gray-100 font-semibold text-lg">{{ registroSeleccionado.nombre }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Identificación</label>
                <p class="text-blue-600 dark:text-blue-400 font-mono font-bold text-lg">{{ registroSeleccionado.numero_identificacion }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Correo Electrónico</label>
                <p class="text-gray-700 dark:text-gray-300 font-medium">{{ registroSeleccionado.correo_electronico || 'No disponible' }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Empresa/IPS</label>
                <p class="text-gray-900 dark:text-gray-100 font-semibold">{{ registroSeleccionado.empresa }}</p>
              </div>
            </div>
          </div>

          <!-- Historia clínica -->
          <div class="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-900/30 dark:to-teal-900/30 rounded-2xl p-6 border border-green-100 dark:border-green-800">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-3 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Historia Clínica
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Ingreso</label>
                <p class="text-gray-900 dark:text-gray-100 font-mono font-bold">{{ registroSeleccionado.ingreso }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Folio</label>
                <p class="text-gray-900 dark:text-gray-100 font-mono font-bold">{{ registroSeleccionado.folio }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Fecha</label>
                <p class="text-gray-900 dark:text-gray-100 font-semibold">{{ formatearFechaHora(registroSeleccionado.fecha_historia) }}</p>
              </div>
            </div>
          </div>

          <!-- Trazabilidad -->
          <div class="bg-gradient-to-r from-orange-50 to-red-50 dark:from-orange-900/30 dark:to-red-900/30 rounded-2xl p-6 border border-orange-100 dark:border-orange-800">
            <h3 class="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-3 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Trazabilidad del Envío
            </h3>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">

              <!-- Estado del envío -->
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Estado del Envío</label>
                <span :class="getBadgeClass(registroSeleccionado.estado_envio)"
                  class="inline-block px-4 py-2 text-sm font-bold rounded-xl">
                  {{ getEstadoTexto(registroSeleccionado.estado_envio) }}
                </span>
              </div>

              <!-- Bot responsable -->
              <div>
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Bot Responsable</label>
                <p class="text-purple-600 dark:text-purple-400 font-mono font-bold">{{ registroSeleccionado.bot }}</p>
              </div>

              <!-- Fecha de envío -->
              <div
                v-if="registroSeleccionado.fecha_envio || registroSeleccionado.estado_envio !== 'pendiente'">
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Fecha de Envío</label>
                <p class="text-gray-800 dark:text-gray-200 font-medium">
                  {{ formatearFechaHora(registroSeleccionado.fecha_envio) }}
                </p>
              </div>

              <!-- Duración del envío -->
              <div v-if="registroSeleccionado.duracion">
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1">Duración de Envío</label>
                <p class="text-gray-800 dark:text-gray-200 font-medium">
                  {{ formatDuration(registroSeleccionado.duracion) }}
                </p>
              </div>

              <!-- Motivo de fallo -->
              <div v-if="registroSeleccionado.motivo_fallo" class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">Motivo de Fallo</label>
                <div class="bg-red-100 dark:bg-red-900/30 border-l-4 border-red-500 dark:border-red-400 p-4 rounded-lg">
                  <p class="text-red-800 dark:text-red-200 font-medium">{{ registroSeleccionado.motivo_fallo }}</p>
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- Footer del modal -->
        <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
          <button
            v-if="registroSeleccionado?.estado_envio === 'exito'"
            class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-900/60 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:ring-offset-gray-800 focus:ring-green-500 dark:focus:ring-green-600 transition-all duration-200"
          >
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Descargar
          </button>
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
import { formatDate, formatearFechaHora, mostrarFecha } from '@/utils/FormatDate'
import { formatDuration } from '@/utils/FormatSeconds'
import { ref, computed, defineProps} from 'vue'

// Props
const props = defineProps(['close', 'registroSeleccionado'])

// Métodos

const cerrarModal = () => {
  props.close()
}


const getBadgeClass = (estado) => {
  const classes = {
    exito: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    error: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    pendiente: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
  }
  return classes[estado] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
}

const getEstadoTexto = (estado) => {
  const textos = {
    exito: 'Éxito',
    error: 'Error',
    pendiente: 'Pendiente'
  }
  return textos[estado] || estado
}
</script>