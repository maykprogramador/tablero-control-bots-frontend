<template>
  <div v-if="user" class="min-h-screen bg-white">
    <div class="mx-auto rounded-2xl shadow-xl">
      <!-- Header -->
      <HeaderTablero :openModalOption="openModal" v-model:selectedTab="selectedTab"/>
      <!-- Main Content -->
      <div :class="[selectedTab !== 'notificaciones'? 'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_350px]': '']" class="bg-slate-50 gap-8 p-4 lg:p-10">
        <!-- Left Panel - Monitoring -->
        <div class="space-y-8">
          <!-- NAVBAR -->
          <NavVar v-model:selectedTab="selectedTab"/><!-- aqui se esta enviando el selectedTab a el hijo y con v-model recibe el evento de update que emite el hijo -->
          <!-- Panel de Monitoreo -->
          <div v-if="selectedTab === 'bots'" class="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100">
              <div class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white p-3 rounded-lg mr-4 text-xl">
                <Monitor/>
              </div>
              <h2 class="text-xl font-semibold text-slate-800">Panel de Monitoreo</h2>
            </div>
            
            
            <!-- Filters -->
            <div class="flex flex-wrap gap-4 mb-5">
              <div class="flex flex-col gap-1">
                <label class="text-sm text-gray-600 font-medium">Fecha</label>
                <input 
                  v-model="filters.date" 
                  type="date" 
                  class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm text-gray-600 font-medium">Estado</label>
                <select 
                  v-model="filters.estado" 
                  class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos</option>
                  <option value="exito">Éxito</option>
                  <option value="error">Error</option>
                  <option value="ejecucion">En Proceso</option>
                  <option value="pausado">En Pausa</option>
                </select>
              </div>
              <div class="flex flex-col gap-1">
                <label class="text-sm text-gray-600 font-medium">Nombre</label>
                <input 
                  v-model="filters.nombre" 
                  type="text" 
                  placeholder="Buscar bot..." 
                  class="px-3 py-2 border-2 border-gray-200 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
              </div>
            </div>

            <!-- Bot List -->
            <div class="space-y-4">
              <div 
                v-for="bot in filteredBots" 
                :key="bot.id"
                class="bg-gray-50 rounded-xl p-5 border-2 border-transparent transition-all duration-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50 hover:translate-x-1"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="font-semibold text-lg text-slate-800">{{ bot.nombre }}</h3>
                  <div class="flex items-center gap-2">
                    <p class="px-3 py-1 rounded-full text-sm font-semibold bg-gray-200 text-gray-800">{{ obtener_porcentaje(bot.procesados , bot.total_registros)}}%</p>
                    <span 
                      :class="getStatusClass(bot.estado)"
                      class="px-3 py-1 rounded-full text-xs font-semibold uppercase"
                    >
                      {{ getStatusText(bot.estado) }}
                    </span>
                  </div>
                  
                </div>
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray-600 font-medium">Última ejecución</span>
                    <span class="font-semibold text-slate-800">{{ formatDate(bot.updatedAt) }}</span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray-600 font-medium">Registros procesados</span>
                    <span class="font-semibold text-slate-800">{{ bot.procesados }} / {{ bot.total_registros}}</span>
                  </div>
                </div>
                
                <div class="flex gap-3">
                  <button @click="openModal(bot.id)" class="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    Ver detalles
                  </button>
                  <!-- Botón para abrir el modal (demo) -->
                  
                  <button @click="openModalLog(bot.id)" class="px-4 py-2 cursor-pointer bg-gray-200 text-slate-800 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
                    Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Registros Solicitados Section -->
          <div v-if="selectedTab === 'solicitudes'"> 
            <RegistrosSection />
          </div>

          <div v-if="selectedTab === 'notificaciones'"> 
            <NotificacionDashboard :openModalOption="openModal" v-model:selectedTab="selectedTab"/>
          </div>
          <!-- Registros Solicitados Section
          <div v-if="selectedTab === 'historias'"> 
            <DashboardHistoriaClinica />
          </div> -->
        </div>
        <!-- Right Panel -->
        <div v-if="selectedTab !== 'notificaciones'" class="space-y-8">
          <!-- Torre de Control -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100">
              <div class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white p-3 rounded-lg mr-4 text-xl">
                <Cog/> 
              </div>
              <h2 class="text-xl font-semibold text-slate-800">Torre de Control</h2>
            </div>
            
            <!-- Seleccionar Bot -->
            <div class="mb-6">
              <h3 class="text-lg text-slate-800 mb-3">Seleccionar Bot</h3>
              <select 
                v-model="control.selectedBot" 
                @change="resetControlSelected()"
                class="w-full px-3 py-2.5 border-2 border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Seleccionar...</option>
                <option v-for="bot in bots" :key="bot.id" :value="bot.id">{{ bot.nombre }}</option>
              </select>
            </div>

            <!-- Cargar Archivo -->
            <!-- Cargar Archivo  -->
            <div v-if="control.selectedBot === 4 || control.selectedBot === 5 || control.selectedBot === 6"  class="mb-6">
              <div class="mb-4">
                <button
                  @click="descargarFormato"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-200 hover:shadow-md"
                >
                  📥 Descargar formato de archivo
                </button>
              </div>
              <h3 class="text-lg text-slate-800 mb-3">Cargar Archivo</h3>
              <!-- Botón para descargar formato -->
              <!-- Funcionalidad de cargar archivo que arrastre y solte en el cuadro -->
              <div
                class="border-2 border-dashed border-blue-500 rounded-lg p-5 text-center bg-gray-50 transition-all duration-300 hover:bg-blue-50 hover:border-blue-600"
                @dragover.prevent="handleDragOver"
                @dragleave="handleDragLeave"
                @drop.prevent="handleDrop"
                :class="{ 'bg-blue-100 border-blue-700': isDragging }"
              >
                <div class="text-2xl mb-2">📁</div>

                <div class="text-gray-700 mb-3">
                  {{ control.fileName || 'Arrastrar archivo aquí o usar el botón' }}
                </div>

                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  class="hidden"
                  accept=".pdf,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />

                <button
                  type="button"
                  @click="triggerFileSelect"
                  class="px-4 py-2 bg-gray-200 text-slate-800 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                >
                  Seleccionar archivo
                </button>
              </div>
            </div>

            <!-- Parámetros -->
            <!-- Botón de Registro -->
            <div class="mb-6">
              <button
                v-if="botOptions.includes(control.selectedBot)"
                @click="openDeactivationModal"
                class="w-full cursor-pointer flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200"
              >
                <span class="text-lg mr-2">📝</span>
                Registrar personas a inactivar
              </button>
            </div>
            <!-- Execute Button -->
            <button
              @click="ejecutarBot()"
              :disabled="!executeBot"
              :class="[
                'w-full py-4 text-white rounded-xl text-lg font-semibold transition-all duration-300',
                executeBot
                  ? 'cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/30'
                  : 'cursor-not-allowed bg-gray-400'
              ]"
            >
              🚀 Ejecutar Bot
            </button>


            <!-- Status Summary -->
            <div class="bg-gray-50 rounded-lg p-4 mt-4">
              <h4 class="font-semibold text-slate-800 mb-2">Estado de Ejecución</h4>
              <p class="text-sm text-gray-700 mb-1">
                <span v-if="control.selectedBot">
                  ✅ {{ selectedBotData.nombre  }} listo para ejecutar
                </span>
                <span v-else>
                  ⏳ Ningún bot seleccionado
                </span>
              </p>
              <p class="text-sm text-gray-700 mb-1">📄 Archivo: {{ control.fileName || 'No seleccionado' }}</p>
            </div>
          </div>

          <!-- Control de Usuarios -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100">
              <div class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white p-3 rounded-lg mr-4 text-xl">
                <UserCog /> 
              </div>
              <h2 class="text-xl font-semibold text-slate-800">Control de Usuarios</h2>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-600 font-medium mb-1">Rol actual</label>
                <input 
                  type="text"
                  :value="formatearRol(user.rol)"
                  readonly
                  class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg bg-gray-100 text-gray-500 cursor-default"
                />
              </div>

              
              <!-- Botón para abrir modal de gestión -->
              <button
                v-if="user.rol === 'admin' || user.rol === 'supervisor'"
                @click="openUserManagementModal"
                class="w-full cursor-pointer flex items-center justify-center px-4 py-2.5 border-2 border-blue-200 text-blue-700 rounded-lg font-medium hover:bg-blue-50 hover:border-blue-300 transition-all duration-200 group"
              >
                <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Ver Usuarios
              </button>
            </div>
          </div>
          <!-- Configuración -->
          <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100">
              <div class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white p-3 rounded-lg mr-4 text-xl">
               <Bolt />
              </div>
              <h2 class="text-xl font-semibold text-slate-800">Configuración</h2>
            </div>
            
            <!-- Parámetros por Bot -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 class="font-semibold text-slate-800 mb-3">Parámetros por Bot</h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 font-medium mb-1">Timeout (segundos)</label>
                  <input 
                    v-model="config.timeout" 
                    type="number" 
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
                <div>
                  <label class="block text-sm text-gray-600 font-medium mb-1">Reintentos</label>
                  <input 
                    v-model="config.retries" 
                    type="number" 
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                </div>
              </div>
            </div>

            <!-- Reglas de Ejecución -->
            <div class="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 class="font-semibold text-slate-800 mb-3">Reglas de Ejecución</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-700">Ejecutar cada lunes</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="config.weeklyExecution" type="checkbox" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-700">Notificaciones por email</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="config.emailNotifications" type="checkbox" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-700">Auto-reiniciar en errores</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="config.autoRestart" type="checkbox" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <DashboardHistoriaClinica v-if="showModalHistoriaClinica" :bot="botSelected" :onclose="closeModalHistoriaCLinica"/>
    <DetailsModal v-if="isModalOpen" :bot="botSelected"/>
    <ControlUsersModal v-if="isModalControlUsersOpen" :onClose="closeModal"/>
    <FormDesactivationPerson v-if="showDeactivationModal" :onClose="closeModalForm" :botSelected="control.selectedBot"/>
    <LogModal v-if="isLogsModalOpen" :bot="botSelected" @close="isLogsModalOpen = false"/>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import DetailsModal from './Details-Modal.vue'
import ControlUsersModal from './Control-Users-Modal.vue';
import FormDesactivationPerson from './Form-Desactivation-Person.vue';
import RegistrosSection from './Registros-section.vue';
import NavVar from './Nav-var.vue';
import { LogOut, Monitor, Cog, UserCog, Bolt } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/Autentificate/auth';
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import DashboardHistoriaClinica from './Dashboard-Historia-Clinica.vue';
import HeaderTablero from './Header-tablero.vue';
import NotificacionDashboard from './Notificacion-Dashboard.vue';
import LogModal from './Log-Modal.vue';

const authStore = useAuthStore()
const router = useRouter()

const tableroFunctions = useTableroFunctions()
const user = computed(() => authStore.user)
const bots = computed(() => tableroFunctions.bots)
const isModalOpen = computed(() => tableroFunctions.isModalOpen)
const provider = computed(() => authStore.provider) 
const formInactivation = computed(() => tableroFunctions.SolicitudInactivacion)
const botSelected = ref(null)
const fileInput = ref(null)
const isDragging = ref(false)
const isModalControlUsersOpen = ref(false)
const showDeactivationModal = ref(false)
const executeBot = computed(() => tableroFunctions.executeBot)
const selectedTab = ref('bots')
const showModalHistoriaClinica = ref(false)
const isLogsModalOpen = ref(false)
const botOptions = [1, 2, 3, 7]


// Reactive data
const filters = reactive({
  date: '2025-01-28',
  estado: '',
  nombre: ''
})


//verificar si el usuario esta autentificado
const checkSession = async () => { 
  try {
    await authStore.verifyAuthUser()
    if (user.value) {
      console.log('Sesión verificada:', user.value.user_id, 'provider: ',provider.value)
      loadBots()
    } else {
      //console.log('No hay usuario autenticado')
      alert('No estas autentificado o su sesion ha expirado.')
    }
  } catch (err) {
    console.error('Error al verificar la sesión:', err)
    router.push('/')
    alert('No estas autentificado o su sesion ha expirado.')
    
  }
}

onMounted(async () => {
  checkSession();
  /*await Promise.all(
    bots.value.map(bot => tableroFunctions.loadRegistros({ bot_id: bot.id }))
  );*/
});


// funcion para cargar los bots 
const loadBots = async() => { 
  try {
    await tableroFunctions.loadbots({ user_id: user.value.user_id, rol: user.value.rol })
    console.log('Bots cargados:', bots.value);
    
  } catch (err) {
    console.error('Error al cargar los bots:', err)
  }
}
const openModalHistoriaClinica = () => {
  showModalHistoriaClinica.value = true
}

// funcion para cerrar el modal de historia clinica
const closeModalHistoriaCLinica = () => {
  showModalHistoriaClinica.value = false
}

function descargarFormato() {
  tableroFunctions.descargarFormato()
}

const ejecutarBot = async () => { 
  console.log('ejecutar bot: ', formInactivation.value);

  if (formInactivation.value !== null && formInactivation.value.length > 0) {
    console.log('registros a inactivar: ', formInactivation.value);
    try {
      await tableroFunctions.createSolicitud(formInactivation.value, authStore.user.user_id, control.selectedBot);
      tableroFunctions.setSolicitudInactivacion([]);
      alert('Registro guardado satisfactoriamente');
      executeBot.value = false;
    } catch (error) {
      //console.log(error.message); // 👈 aquí capturas el mensaje
      alert(error.message);       // 👈 y lo muestras en el alert
    }
  }

  if (control.archivo != null) {
    console.log('archivo a procesar: ', control.archivo);
  }
};

// Methods
const openDeactivationModal = () => {
  showDeactivationModal.value = true

}

const openUserManagementModal = async () => {
  isModalControlUsersOpen.value = true
}

const closeModal = () => {
  isModalControlUsersOpen.value = false
}

const closeModalForm = () => {
  showDeactivationModal.value = false
}

function resetControlSelected () {
  control.fileName = ''
  control.archivo = null // reiniciar archivo
  tableroFunctions.setFormInactivation([])
  tableroFunctions.setExecuteBot(false)
}

const obtener_porcentaje = (procesados, total) => {
  if (total === 0) return 0
  return Math.round((procesados / total) * 100)
}

//funcion para formatear la fecha en formato 'DD/MM/YYYY HH:mm'
function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}

const selectedBotData = computed(() => {
  return bots.value.find(bot => bot.id === control.selectedBot) || null
})

function triggerFileSelect() {
  fileInput.value.click()
}

// Cuando arrastramos encima
function handleDragOver() {
  isDragging.value = true
}

// Cuando salimos sin soltar
function handleDragLeave() {
  isDragging.value = false
}

// Cuando soltamos el archivo
function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  console.log('Archivo soltado:', file);
  
  validateAndSetFile(file)
}

// Cuando seleccionamos desde el botón
function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

// Validación del archivo
function validateAndSetFile(file) {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  if (!allowedTypes.includes(file.type)) {
    alert('Archivo no válido. Solo se aceptan PDF o Excel (.xlsx)')
    control.value.fileName = ''
    control.value.archivo = null
    return
  }
  console.log('archivo en validateandserfile: ',file);
  
  control.fileName = file.name
  control.archivo = file
  tableroFunctions.setExecuteBot(true)
}

const control = reactive({
  selectedBot: '',
  processingMode: 'normal',
  fileName: '',
  archivo: null // aquí se guarda el archivo
})

const config = reactive({
  timeout: 300,
  retries: 3,
  weeklyExecution: true,
  emailNotifications: false,
  autoRestart: true,
  userRole: 'admin'
})


// funcion para filtrar los bots 
const filteredBots = computed(() => {
  return bots.value.filter(bot => {
    const matchesStatus = !filters.estado || bot.estado === filters.estado
    const matchesName = !filters.nombre || bot.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
    return matchesStatus && matchesName
  })
})

const openModal = (bot_id) => {
  
  botSelected.value = bots.value.find(bot => bot.id === bot_id)
  if (botSelected.value.id === 7) {
    openModalHistoriaClinica()
    return 
  }
  tableroFunctions.openModal()
  console.log('isopnemodal: ', tableroFunctions.isModalOpen );
}

// funcion para abrir el modal de logs
const openModalLog = (bot_id) => {
  botSelected.value = bots.value.find(bot => bot.id === bot_id)
  isLogsModalOpen.value = true
}

const formatearRol = (rol) => {
  switch (rol) {
    case 'admin': return 'Administrador';
    case 'usuario': return 'Usuario';
    case 'supervisor': return 'Supervisor';
    default: return rol;
  }
};

// Helper functions
const getStatusClass = (status) => {
  const classes = {
    exito: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    ejecucion: 'bg-yellow-100 text-yellow-800',
    pausado: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    exito: 'Éxito',
    error: 'Error',
    ejecucion: 'En proceso',
    pausado: 'En pausa'
  }
  return texts[status] || 'Desconocido'
}
</script>
<!-- CSS adicional para asegurar que funcione -->
<style>
/* Asegurar que el contenedor principal no desborde */
.main-container {
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

/* Estilo para el layout principal si usas grid */
.layout-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  max-width: 100vw;
  overflow-x: hidden;
}

/* En pantallas pequeñas */
@media (max-width: 1024px) {
  .layout-container {
    grid-template-columns: 1fr;
  }
}

/* Scrollbar personalizada */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background-color: #f9fafb;
}
</style>