<template>
  <!-- Modal Overlay -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="showModal"
      class="fixed inset-0 z-50 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center sm:p-4"
      @click="closeModal"
      @keydown.esc="closeModal" tabindex="0"
    >
      <!-- Modal Container -->
      <Transition
        enter-active-class="transition-all duration-300 ease-out"
        enter-from-class="opacity-0 scale-95 translate-y-4"
        enter-to-class="opacity-100 scale-100 translate-y-0"
        leave-active-class="transition-all duration-200 ease-in"
        leave-from-class="opacity-100 scale-100 translate-y-0"
        leave-to-class="opacity-0 scale-95 translate-y-4"
      >
        <div
          v-if="showModal && selectedRecord"
          class="bg-white dark:bg-gray-900 sm:rounded-xl shadow-2xl w-full sm:max-w-4xl h-full sm:max-h-[90vh] flex flex-col relative overflow-hidden"
          @click.stop
        >
          <!-- Header - Fijo -->
          <div class="bg-gradient-to-r from-slate-800 to-[#80006A] dark:from-slate-900 dark:to-[#80006A] px-6 py-4 flex-shrink-0">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 bg-white/20 dark:bg-white/10 rounded-full flex items-center justify-center">
                <span class="text-white text-lg">📄</span>
              </div>
              <div>
                <h2 class="font-bold text-xl text-white">Detalle de la Solicitud</h2>
                <p class="text-blue-100 dark:text-purple-200 text-sm">Información completa del registro</p>
              </div>
            </div>
            <button
              @click="closeModal"
              class="absolute top-4 right-4 text-white/80 hover:text-white transition-colors duration-200"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>

          <!-- Contenido Principal - Scrolleable -->
          <div class="flex-1 overflow-y-auto min-h-0">
            <!-- Sección 1: Datos de la solicitud -->
            <div class="p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 class="font-semibold text-lg text-slate-800 dark:text-gray-100 mb-4">Datos de la Solicitud</h3>
              
              <!-- Contenedor scrolleable para los datos -->
              <div class="max-h-[35vh] overflow-y-auto pr-2 custom-scrollbar">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <!-- ID de la solicitud -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">ID de la solicitud</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ selectedRecord.id }}</div>
                  </div>

                  <!-- Solicitante -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Solicitante</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1 flex items-center gap-2">
                      {{ capitalizarNombre(selectedRecord.User?.nombre) || 'N/A' }}
                      <template v-if="selectedRecord.User?.cargo">
                        <span class="inline-block w-1.5 h-1.5 rounded-full bg-gray-500 dark:bg-gray-400"></span>
                        <span>{{ selectedRecord.User?.cargo }}</span>
                      </template>
                    </div>
                  </div>

                  <!-- Bot responsable -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Bot responsable</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ selectedRecord.Bot?.nombre || 'N/A' }}</div>
                  </div>

                  <!-- Nombre usuario a inactivar -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Usuario a inactivar</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ selectedRecord.nombre }}</div>
                  </div>

                  <!-- Identificación -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Identificación</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ selectedRecord.identificacion }}</div>
                  </div>

                  <!-- Cargo -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Cargo</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ selectedRecord.cargo }}</div>
                  </div>

                  <!-- Fecha de creación -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Fecha de creación</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ formatDate(selectedRecord.createdAt) }}</div>
                  </div>

                  <!-- Fecha de inactivación -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Fecha de inactivación</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ formatDate(selectedRecord.fecha_inactivacion) }}</div>
                  </div>

                  <!-- Estado -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Estado</label>
                    <div class="mt-1">
                      <span :class="getEstadoBadgeClass(selectedRecord.estado)" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium">
                        <span :class="getEstadoDotClass(selectedRecord.estado)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                        {{ getEstadoText(selectedRecord.estado) }} 
                      </span>
                    </div>
                  </div>

                  <!-- Buzón compartido -->
                  <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Buzón compartido</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ selectedRecord.buzon_compartido }}</div>
                  </div>

                  <!-- Cuenta a delegar (solo si tiene buzón compartido) -->
                  <div v-if="selectedRecord.buzon_compartido === 'si'" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Cuenta a delegar</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ selectedRecord.cuenta_delegar }}</div>
                  </div>
                  <!-- Sucursal (si existe) -->
                  <div v-if="selectedRecord.sucursal" class="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                    <label class="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400 font-medium">Sucursal</label>
                    <div class="font-semibold text-slate-800 dark:text-gray-100 mt-1">{{ selectedRecord.sucursal }}</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Sección 2: Contenido del registro -->
            <div class="p-6">
              <h3 class="font-semibold text-lg text-slate-800 dark:text-gray-100 mb-4">Detalle del registro</h3>
              
              <!-- Barra superior del contenido -->
              <div class="bg-gray-100 dark:bg-gray-800 rounded-t-lg px-4 py-2 flex items-center justify-between border border-gray-200 dark:border-gray-700">
                <div class="flex items-center gap-2">
                  <span class="text-sm font-medium text-gray-700 dark:text-gray-300">Texto</span>
                  <span v-if="hasAlert" class="text-yellow-500 dark:text-yellow-400">⚠️</span>
                </div>
                <div class="flex items-center gap-2">
                  <button
                    @click="copyToClipboard"
                    class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200 flex items-center gap-1"
                  >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
                    </svg>
                    Copiar
                  </button>
                  <button
                    @click="toggleWordWrap"
                    class="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                  >
                    {{ wordWrap ? 'Sin ajuste' : 'Ajuste de texto' }}
                  </button>
                </div>
              </div>

              <!-- Contenedor del mensaje - Scrolleable independiente -->
              <div class="bg-gray-50 dark:bg-gray-800 rounded-b-lg border border-t-0 border-gray-200 dark:border-gray-700 p-4 max-h-[35vh] overflow-y-auto custom-scrollbar">
                <pre 
                  :class="[
                    'font-mono text-sm text-gray-800 dark:text-gray-200',
                    wordWrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
                  ]"
                >{{ selectedRecord.Registro?.mensaje || 'Sin mensaje disponible' }}</pre>
              </div>
            </div>
          </div>

          <!-- Footer - Fijo -->
          <div class="border-t border-gray-200 dark:border-gray-700 px-6 py-4 flex-shrink-0 bg-white dark:bg-gray-900">
            <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                Visualizado el {{ formatDateTime(new Date()) }}
              </div>
              <div class="flex items-center gap-3">
                <button
                  @click="downloadRecord"
                  class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white px-4 py-2 rounded-lg text-sm font-medium hover:from-[#80006A] hover:to-[#80006A] transition-all duration-200 flex items-center gap-2"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                  </svg>
                  Descargar
                </button>
                <button
                  @click="closeModal"
                  class="bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-gray-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>

          <!-- Toast de confirmación -->
          <Transition
            enter-active-class="transition-all duration-300 ease-out"
            enter-from-class="opacity-0 translate-y-2"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition-all duration-200 ease-in"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-2"
          >
            <div
              v-if="showToast"
              class="absolute bottom-4 right-4 bg-green-500 dark:bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2 z-10"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
              </svg>
              {{ toastMessage }}
            </div>
          </Transition>
        </div>
      </Transition>
    </div>
  </Transition>
</template>

<script setup>
import { capitalizarNombre } from '@/utils/CapitalizarNombre'
import { ref, computed } from 'vue'

// Props
const props = defineProps({
  showModal: {
    type: Boolean,
    default: true
  },
  selectedRecord: {
    type: Object,
    default: null
  }
})

// Emits
const emit = defineEmits(['close'])

// Reactive data
const wordWrap = ref(false)
const showToast = ref(false)
const toastMessage = ref('')

// Computed
const hasAlert = computed(() => {
  if (!props.selectedRecord?.mensaje) return false
  const mensaje = props.selectedRecord.Registro?.mensaje.toLowerCase()
  return mensaje.includes('error') || mensaje.includes('alerta') || mensaje.includes('warning')
})

// Methods
const closeModal = () => {
  emit('close')
}

const formatDate = (dateString) => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  })
}

const formatDateTime = (date) => {
  return date.toLocaleString('es-ES', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  })
}

const getEstadoBadgeClass = (estado) => {
  const classes = {
    'exito': 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    'error': 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    'proceso': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300',
    'pendiente': 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
  }
  return classes[estado] || classes.pendiente
}

const getEstadoDotClass = (estado) => {
  const classes = {
    'exito': 'bg-green-500 dark:bg-green-400',
    'error': 'bg-red-500 dark:bg-red-400',
    'proceso': 'bg-yellow-500 dark:bg-yellow-400',
    'pendiente': 'bg-yellow-500 dark:bg-yellow-400'
  }
  return classes[estado] || classes.pendiente
}

const getEstadoText = (estado) => {
  const texts = {
    'exito': 'Completado',
    'error': 'Error',
    'proceso': 'En proceso',
    'pendiente': 'Pendiente'
  }
  return texts[estado] || 'Desconocido'
}

const toggleWordWrap = () => {
  wordWrap.value = !wordWrap.value
}

const copyToClipboard = async () => {
  if (!props.selectedRecord?.Registro?.mensaje) return
  
  try {
    await navigator.clipboard.writeText(props.selectedRecord.Registro?.mensaje)
    showToastMessage('Contenido copiado al portapapeles')
  } catch (err) {
    console.error('Error al copiar:', err)
    showToastMessage('Error al copiar el contenido')
  }
}

const downloadRecord = () => {
  if (!props.selectedRecord) return
  
  const content = `Detalle de la Solicitud
ID: ${props.selectedRecord.id}
Solicitante: ${props.selectedRecord.User?.nombre || 'N/A'}
Bot responsable: ${props.selectedRecord.Bot?.nombre || 'N/A'}
Usuario a inactivar: ${props.selectedRecord.nombre}
Identificación: ${props.selectedRecord.identificacion}
Cargo: ${props.selectedRecord.cargo}
Fecha de creación: ${formatDate(props.selectedRecord.createdAt)}
Fecha de inactivación: ${formatDate(props.selectedRecord.fecha_inactivacion)}
Estado: ${getEstadoText(props.selectedRecord.estado)}
Buzón compartido: ${props.selectedRecord.buzon_compartido ? 'Sí' : 'No'}
${props.selectedRecord.cuenta_delegar ? `Cuenta a delegar: ${props.selectedRecord.cuenta_delegar}` : ''}

Mensaje:
${props.selectedRecord.Registro?.mensaje || 'Sin mensaje disponible'}`

  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `solicitud_${props.selectedRecord.id}_${new Date().toISOString().split('T')[0]}.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  
  showToastMessage('Archivo descargado exitosamente')
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>
<style scoped>
/* Scrollbar personalizado */
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