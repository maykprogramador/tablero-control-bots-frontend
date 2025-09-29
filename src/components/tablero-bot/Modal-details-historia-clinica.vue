<template>
  <div
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    @click="cerrarModal"
  >
    <div
      class="fixed inset-0 bg-white w-screen h-screen 
           sm:relative sm:rounded-2xl sm:shadow-2xl sm:max-w-4xl sm:max-h-[90vh] 
           sm:w-full sm:h-auto 
           overflow-y-auto transform transition-all duration-300"
      @click.stop
    >
      <div class="p-8">
        <!-- Header del modal -->
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <div class="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
              </svg>
            </div>
            Detalles del Envío
          </h2>
          <button
            @click="cerrarModal"
            class="text-gray-400 hover:text-gray-600 transition-colors p-2 hover:bg-gray-100 rounded-lg"
          >
            <svg class="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <!-- Contenido del modal -->
        <div v-if="registroSeleccionado" class="space-y-8">
          <!-- Datos del paciente -->
          <div class="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 border border-blue-100">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              Datos del Paciente
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Nombre</label>
                <p class="text-gray-900 font-semibold text-lg">{{ registroSeleccionado.nombre }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Identificación</label>
                <p class="text-blue-600 font-mono font-bold text-lg">{{ registroSeleccionado.numero_identificacion }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Correo Electrónico</label>
                <p class="text-gray-700 font-medium">{{ registroSeleccionado.correo_electronico || 'No disponible' }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Empresa/IPS</label>
                <p class="text-gray-900 font-semibold">{{ registroSeleccionado.empresa }}</p>
              </div>
            </div>
          </div>

          <!-- Historia clínica -->
          <div class="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 border border-green-100">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
              Historia Clínica
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Ingreso</label>
                <p class="text-gray-900 font-mono font-bold">{{ registroSeleccionado.ingreso }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Folio</label>
                <p class="text-gray-900 font-mono font-bold">{{ registroSeleccionado.folio }}</p>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Fecha</label>
                <p class="text-gray-900 font-semibold">{{ formatDate(registroSeleccionado.fecha_historia) }}</p>
              </div>
            </div>
          </div>

          <!-- Trazabilidad -->
          <div class="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
            <h3 class="text-xl font-bold text-gray-900 mb-4 flex items-center">
              <svg class="h-6 w-6 mr-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              Trazabilidad del Envío
            </h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-2">Estado del Envío</label>
                <span :class="getBadgeClass(registroSeleccionado.estado_envio)" class="inline-block px-4 py-2 text-sm font-bold rounded-xl">
                  {{ getEstadoTexto(registroSeleccionado.estado_envio) }}
                </span>
              </div>
              <div>
                <label class="block text-sm font-semibold text-gray-600 mb-1">Bot Responsable</label>
                <p class="text-purple-600 font-mono font-bold">{{ registroSeleccionado.bot }}</p>
              </div>
              <div v-if="registroSeleccionado.motivo_fallo" class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-600 mb-2">Motivo de Fallo</label>
                <div class="bg-red-100 border-l-4 border-red-500 p-4 rounded-lg">
                  <p class="text-red-800 font-medium">{{ registroSeleccionado.motivo_fallo }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Footer del modal -->
        <div class="flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
          <button
            v-if="registroSeleccionado?.estado_envio === 'exito'"
            class="inline-flex items-center px-6 py-3 border border-transparent text-sm font-semibold rounded-xl text-green-700 bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
          >
            <svg class="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
            Descargar
          </button>
          <button
            @click="cerrarModal"
            class="inline-flex items-center px-6 py-3 border border-gray-300 text-sm font-semibold rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { formatDate } from '@/utils/FormatDate'
import { ref, computed, defineProps} from 'vue'

// Props
const props = defineProps(['close', 'registroSeleccionado'])

// Métodos

const cerrarModal = () => {
  props.close()
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
</script>