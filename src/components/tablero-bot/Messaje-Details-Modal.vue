<template>
  <div class="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-violet-600 p-5 overflow-auto">
    <!-- Modal de Detalle del Mensaje -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
      
        class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        @click="closeMessageModal"
      >
        <!-- Modal Content -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 scale-95 translate-y-4"
          enter-to-class="opacity-100 scale-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 scale-100 translate-y-0"
          leave-to-class="opacity-0 scale-95 translate-y-4"
        >
          <div 
      
            @click.stop
            class="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden relative"
          >
            <!-- Close Button -->
            <button 
              @click="closeMessageModal"
              class="absolute top-4 right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-red-100 rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <svg class="w-4 h-4 text-gray-600 group-hover:text-red-600 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>

            <!-- Modal Header -->
            <div class="bg-gradient-to-r from-slate-800 to-blue-600 text-white p-6 pr-16">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <span class="text-xl">📋</span>
                </div>
                <div>
                  <h2 class="text-2xl font-bold">Detalle del Mensaje</h2>
                  <p class="text-blue-100 mt-1">
                    Registro #{{ selectedRecord?.id }} - {{ selectedRecord ? formatDate(selectedRecord.fecha_ejecucion) : '' }}
                  </p>
                </div>
              </div>
              
              <!-- Message Info Summary -->
              <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
                <div class="bg-white/10 rounded-lg p-3">
                  <div class="text-sm text-blue-100">Estado</div>
                  <div class="text-lg font-semibold">{{ selectedRecord ? getStatusText(selectedRecord.estado) : '' }}</div>
                </div>
                <div class="bg-white/10 rounded-lg p-3">
                  <div class="text-sm text-blue-100">Longitud</div>
                  <div class="text-lg font-semibold">{{ selectedRecord ? selectedRecord.mensaje.length : 0 }} caracteres</div>
                </div>
                <div class="bg-white/10 rounded-lg p-3">
                  <div class="text-sm text-blue-100">Líneas</div>
                  <div class="text-lg font-semibold">{{ selectedRecord ? countLines(selectedRecord.mensaje) : 0 }}</div>
                </div>
              </div>
            </div>

            <!-- Modal Body -->
            <div class="p-6 max-h-[60vh] overflow-y-auto">
              <!-- Message Content -->
              <div class="space-y-4">
                <!-- Message Type Detection -->
                <div class="flex items-center gap-2 mb-4">
                  <span class="text-sm font-medium text-gray-700">Tipo de contenido:</span>
                  <span 
                    :class="getMessageTypeClass(selectedRecord?.mensaje)"
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  >
                    {{ getMessageType(selectedRecord?.mensaje) }}
                  </span>
                </div>

                <!-- Message Container -->
                <div class="bg-gray-50 rounded-lg border border-gray-200 shadow-inner">
                  <div class="bg-gray-100 px-4 py-2 rounded-t-lg border-b border-gray-200">
                    <div class="flex items-center justify-between">
                      <span class="text-sm font-medium text-gray-700">Contenido del mensaje</span>
                      <div class="flex items-center gap-2">
                        <button
                          @click="copyToClipboard"
                          class="text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                          title="Copiar al portapapeles"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                          </svg>
                          Copiar
                        </button>
                        <button
                          @click="toggleWordWrap"
                          class="text-xs text-gray-600 hover:text-blue-600 transition-colors duration-200 flex items-center gap-1"
                          :title="wordWrap ? 'Desactivar ajuste de línea' : 'Activar ajuste de línea'"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7"></path>
                          </svg>
                          {{ wordWrap ? 'Sin ajuste' : 'Ajustar' }}
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Message Text -->
                  <div class="p-4">
                    <pre 
                      :class="[
                        'text-sm text-gray-800 font-mono leading-relaxed',
                        wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre overflow-x-auto',
                        isJsonMessage(selectedRecord?.mensaje) ? 'text-xs' : ''
                      ]"
                    >{{ selectedRecord?.mensaje || '' }}</pre>
                  </div>
                </div>

                <!-- Additional Information -->
                 <!--
                <div v-if="selectedRecord" class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  <div class="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <h4 class="font-semibold text-blue-800 mb-2 flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Información del Registro
                    </h4>
                    <div class="space-y-2 text-sm">
                      <div class="flex justify-between">
                        <span class="text-blue-700">ID:</span>
                        <span class="font-medium text-blue-900">#{{ selectedRecord.id }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-blue-700">Fecha:</span>
                        <span class="font-medium text-blue-900">{{ formatFullDate(selectedRecord.fecha_ejecucion) }}</span>
                      </div>
                      <div class="flex justify-between">
                        <span class="text-blue-700">Estado:</span>
                        <span 
                          :class="getStatusBadgeClass(selectedRecord.estado)"
                          class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
                        >
                          {{ getStatusText(selectedRecord.estado) }}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>-->
              </div>
            </div>

            <!-- Modal Footer -->
            <div class="bg-gray-50 px-6 py-4 flex justify-between items-center border-t border-gray-200">
              <div class="flex items-center gap-2 text-sm text-gray-600">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Visualizado el {{ new Date().toLocaleString('es-ES') }}</span>
              </div>
              <div class="flex gap-3">
                <button 
                  @click="downloadMessage"
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Descargar
                </button>
                <button 
                  @click="closeMessageModal"
                  class="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div v-if="showToast" class="fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, defineProps, watch, watchEffect} from 'vue'
import dayjs from 'dayjs'

// UI State
const isMessageModalOpen = ref(false)
const wordWrap = ref(true)
const showToast = ref(false)
const toastMessage = ref('')
const { selectedRecord, onClose } = defineProps(['selectedRecord', 'onClose'])

watchEffect(() => {
  // Aquí podrías acceder a selectedRecord si más adelante lo necesitas
  selectedRecord
})
const closeMessageModal = () => {
  onClose()
}

function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY')
}

const formatFullDate = (date) => {
  return dayjs(date).format('DD/MM/YYYY, HH:mm:ss')
}

const getStatusBadgeClass = (status) => {
  const classes = {
    exito: 'bg-green-100 text-green-700',
    error: 'bg-red-100 text-red-700',
    proceso: 'bg-yellow-100 text-yellow-700'
  }
  return classes[status] || 'bg-gray-100 text-gray-700'
}

const getStatusText = (status) => {
  const texts = {
    exito: 'Éxito',
    error: 'Error',
    proceso: 'En Proceso'
  }
  return texts[status] || 'Desconocido'
}

const countLines = (text) => {
  if (!text) return 0
  return text.split('\n').length
}

const countWords = (text) => {
  if (!text) return 0
  return text.trim().split(/\s+/).length
}

const isJsonMessage = (message) => {
  if (!message) return false
  try {
    JSON.parse(message)
    return true
  } catch {
    return false
  }
}

const getMessageType = (message) => {
  if (!message) return 'Texto'
  
  if (isJsonMessage(message)) return 'JSON'
  if (message.includes('Error') || message.includes('error')) return 'Error'
  if (message.includes('Stack trace') || message.includes('at ')) return 'Stack Trace'
  if (message.includes('completado') || message.includes('exitoso')) return 'Éxito'
  if (message.includes('procesando') || message.includes('processing')) return 'Proceso'
  
  return 'Texto'
}

const getMessageTypeClass = (message) => {
  const type = getMessageType(message)
  const classes = {
    'JSON': 'bg-purple-100 text-purple-700',
    'Error': 'bg-red-100 text-red-700',
    'Stack Trace': 'bg-orange-100 text-orange-700',
    'Éxito': 'bg-green-100 text-green-700',
    'Proceso': 'bg-blue-100 text-blue-700',
    'Texto': 'bg-gray-100 text-gray-700'
  }
  return classes[type] || 'bg-gray-100 text-gray-700'
}

const toggleWordWrap = () => {
  wordWrap.value = !wordWrap.value
}

const copyToClipboard = async () => {
  if (!selectedRecord?.mensaje) return
  
  try {
    await navigator.clipboard.writeText(selectedRecord.mensaje)
    showToastMessage('Mensaje copiado al portapapeles')
  } catch (error) {
    console.error('Error copying to clipboard:', error)
    showToastMessage('Error al copiar el mensaje')
  }
}

const downloadMessage = () => {
  if (!selectedRecord) return
  
  const content = `Registro #${selectedRecord.id}
Fecha: ${formatFullDate(selectedRecord.fecha_ejecucion)}
Estado: ${getStatusText(selectedRecord.estado)}

Mensaje:
${selectedRecord.mensaje}`
  
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `mensaje-${selectedRecord.id}-${formatDate(selectedRecord.fecha_ejecucion).replace(/\//g, '-')}.txt`
  link.click()
  URL.revokeObjectURL(url)
  
  showToastMessage('Mensaje descargado correctamente')
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>