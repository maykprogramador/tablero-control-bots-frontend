<template>
  <div class="bg-white rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <div class="p-2 bg-blue-100 rounded-lg">
          <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
          </svg>
        </div>
        <div>
          <h3 class="text-lg font-semibold text-slate-800">Gestión de Usuarios</h3>
          <p class="text-sm text-gray-600">{{ users.length }} usuarios registrados</p>
        </div>
      </div>
      <button
        @click="showModal = true"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
      >
        Ver Usuarios
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      @click.self="closeModal"
    >
      <div class="bg-white rounded-xl shadow-2xl w-full max-w-7xl max-h-[90vh]">
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-xl font-bold text-gray-900">Gestión de Usuarios del Sistema</h2>
              <p class="text-sm text-gray-600 mt-1">Administra usuarios y sus bots asignados</p>
            </div>
            <button
              @click="closeModal"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <div class="p-6 max-h-[60vh] overflow-y-auto">
          <!-- Filters and Search -->
          <div class="flex flex-wrap gap-4 mb-6">
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">Filtrar por rol:</label>
              <select
                v-model="roleFilter"
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Todos los roles</option>
                <option value="admin">Administrador</option>
                <option value="usuario">Usuario</option>
                <option value="supervisor">Supervisor</option>
              </select>
            </div>
            <div class="flex items-center gap-2">
              <label class="text-sm font-medium text-gray-700">Buscar:</label>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Buscar por email..."
                class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="isLoading" class="flex items-center justify-center py-12">
            <div class="flex items-center gap-3">
              <svg class="animate-spin h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span class="text-gray-600">Cargando usuarios...</span>
            </div>
          </div>

          <!-- Users Table -->
          <div v-else-if="filteredUsers.length > 0" class="overflow-x-auto rounded-lg border border-gray-200">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol Actual</th>
                  <!-- Nueva columna para bots asignados -->
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bots Asignados</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cambiar Rol</th>
                  <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr
                  v-for="(user, index) in paginatedUsers"
                  :key="user.id"
                  class="hover:bg-gray-50 transition-colors duration-150"
                >
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {{ (currentPage - 1) * usersPerPage + index + 1 }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="flex-shrink-0 h-8 w-8">
                        <div class="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                          <span class="text-xs font-medium text-white">{{ getUserInitials(user.nombre) }}</span>
                        </div>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900">{{ capitalizarNombre(user.nombre) }}</div>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                    {{ user.email }}
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <span
                      :class="getRoleBadgeClass(user.rol)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <span :class="getRoleDotClass(user.rol)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                      {{ getRoleText(user.rol) }}
                    </span>
                  </td>
                  <!-- Nueva celda para mostrar bots asignados y botón gestionar -->
                  <td class="px-4 py-4 whitespace-nowrap">
                    <div class="flex items-center gap-2">
                      <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {{ user.Bots.length }} bots
                      </span>
                      <button
                        @click="openBotManagement(user)"
                        class="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors duration-200"
                        title="Gestionar bots asignados"
                      >
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                        </svg>
                        Gestionar
                      </button>
                    </div>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap">
                    <select
                      v-model="user.rol"
                      @change="changeRol(user)"
                      class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="admin">Administrador</option>
                      <option value="usuario">Usuario</option>
                      <option value="supervisor">Supervisor</option>
                    </select>
                  </td>
                  <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                    <div class="flex items-center gap-2">
                      <button
                        @click="viewUserDetails(user)"
                        class="text-blue-600 hover:text-blue-800 transition-colors duration-200"
                        title="Ver detalles"
                      >
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Empty State -->
          <div v-else class="text-center py-12">
            <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900">No hay usuarios</h3>
            <p class="mt-1 text-sm text-gray-500">No se encontraron usuarios con los filtros aplicados.</p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredUsers.length > usersPerPage" class="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div class="text-sm text-gray-700">
              Mostrando {{ (currentPage - 1) * usersPerPage + 1 }} a {{ Math.min(currentPage * usersPerPage, filteredUsers.length) }} de {{ filteredUsers.length }} usuarios
            </div>
            <div class="flex items-center gap-2">
              <button
                @click="currentPage--"
                :disabled="currentPage === 1"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Anterior
              </button>
              <span class="px-3 py-1 text-sm font-medium">{{ currentPage }} de {{ totalPages }}</span>
              <button
                @click="currentPage++"
                :disabled="currentPage === totalPages"
                class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Offcanvas modal para gestión de bots -->
    <!-- Bot Management Offcanvas -->
    <div
      v-if="showBotManagement"
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
      @click.self="closeBotManagement"
    >
      <div
        class="fixed inset-y-0 right-0 w-full bg-white shadow-xl transform transition-transform duration-300 ease-in-out"
        :class="showBotManagement ? 'translate-x-0' : 'translate-x-full'"
      >
        <!-- Header -->
        <div class="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div class="flex items-center justify-between">
            <div>
              <h3 class="text-lg font-semibold text-gray-900">{{ selectedUser?.nombre }}</h3>
              <p class="text-sm text-gray-600">Asignar bots a este usuario</p>
            </div>
            <button
              @click="closeBotManagement"
              class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            >
              <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Bot List -->
        <div class="flex-1 overflow-y-auto p-6">
          <div class="space-y-4">
            <div
              v-for="bot in botsDisponibles"
              :key="bot.id"
              class="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div class="flex-1">
                <h4 class="text-sm font-medium text-gray-900">{{ bot.nombre }}</h4>
                <p class="text-xs text-gray-600 mt-1">{{ bot.descripcion }}</p>
                <div class="flex items-center gap-2 mt-2">
                  <span class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                    {{ bot.tipo }}
                  </span>
                  <span class="text-xs text-gray-500">{{ bot.version }}</span>
                </div>
              </div>
              <div class="ml-4">
                <!-- Toggle switch moderno estilo iOS -->
                <label class="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    :checked="tempBotAssignments[bot.id]"
                    @change="toggleBotAssignment(bot.id)"
                    class="sr-only peer"
                  >
                  <div class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Actions -->
        <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div class="flex gap-3">
            <button
              @click="saveBotAssignments"
              class="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors duration-200 font-medium"
            >
              Guardar cambios
            </button>
            <button
              @click="closeBotManagement"
              class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

// Estado del componente
const showModal = ref(false)
const showBotManagement = ref(false)
const selectedUser = ref(null)
const tempBotAssignments = ref({})
const isLoading = ref(false)
const roleFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const usersPerPage = 10

const users = ref([
  {
    id: 1,
    nombre: 'Juan Pérez',
    email: 'juan.perez@empresa.com',
    rol: 'admin',
    Bots: ['bot-1', 'bot-2', 'bot-3']
  },
  {
    id: 2,
    nombre: 'María García',
    email: 'maria.garcia@empresa.com',
    rol: 'usuario',
    Bots: ['bot-1', 'bot-4']
  },
  {
    id: 3,
    nombre: 'Carlos López',
    email: 'carlos.lopez@empresa.com',
    rol: 'supervisor',
    Bots: ['bot-2', 'bot-5']
  },
  {
    id: 4,
    nombre: 'Ana Martínez',
    email: 'ana.martinez@empresa.com',
    rol: 'usuario',
    Bots: ['bot-3']
  },
  {
    id: 5,
    nombre: 'Luis Rodríguez',
    email: 'luis.rodriguez@empresa.com',
    rol: 'admin',
    Bots: ['bot-1', 'bot-2', 'bot-4', 'bot-5']
  }
])

const botsDisponibles = ref([
  {
    id: 'bot-1',
    nombre: 'Bot de Procesamiento de Datos',
    descripcion: 'Automatiza el procesamiento de archivos CSV y Excel',
    tipo: 'Procesamiento',
    version: 'v2.1.0'
  },
  {
    id: 'bot-2',
    nombre: 'Bot de Notificaciones',
    descripcion: 'Envía notificaciones automáticas por email',
    tipo: 'Comunicación',
    version: 'v1.5.2'
  },
  {
    id: 'bot-3',
    nombre: 'Bot de Reportes',
    descripcion: 'Genera reportes automáticos semanales',
    tipo: 'Reportes',
    version: 'v3.0.1'
  },
  {
    id: 'bot-4',
    nombre: 'Bot de Backup',
    descripcion: 'Realiza copias de seguridad automáticas',
    tipo: 'Mantenimiento',
    version: 'v1.8.0'
  },
  {
    id: 'bot-5',
    nombre: 'Bot de Monitoreo',
    descripcion: 'Monitorea el estado del sistema 24/7',
    tipo: 'Monitoreo',
    version: 'v2.3.1'
  }
])

// Computed properties
const filteredUsers = computed(() => {
  let filtered = users.value

  if (roleFilter.value) {
    filtered = filtered.filter(user => user.rol === roleFilter.value)
  }

  if (searchQuery.value) {
    filtered = filtered.filter(user =>
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.nombre.toLowerCase().includes(searchQuery.value.toLowerCase())
    )
  }

  return filtered
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  const end = start + usersPerPage
  return filteredUsers.value.slice(start, end)
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / usersPerPage)
})

// Métodos
const closeModal = () => {
  showModal.value = false
}

const openBotManagement = (user) => {
  selectedUser.value = user
  // Inicializar estado temporal de asignaciones
  tempBotAssignments.value = {}
  botsDisponibles.value.forEach(bot => {
    tempBotAssignments.value[bot.id] = user.Bots.includes(bot.id)
  })
  showBotManagement.value = true
}

const closeBotManagement = () => {
  showBotManagement.value = false
  selectedUser.value = null
  tempBotAssignments.value = {}
}

const toggleBotAssignment = (botId) => {
  tempBotAssignments.value[botId] = !tempBotAssignments.value[botId]
}

const saveBotAssignments = () => {
  if (selectedUser.value) {
    // Actualizar los bots asignados basado en el estado temporal
    const newAssignments = Object.keys(tempBotAssignments.value)
      .filter(botId => tempBotAssignments.value[botId])
    
    selectedUser.value.Bots = newAssignments
    
    // Simular guardado exitoso
    setTimeout(() => {
      closeBotManagement()
    }, 300)
  }
}

const changeRol = (user) => {
  // Simular cambio de rol
  console.log(`Cambiando rol de ${user.nombre} a ${user.rol}`)
}

const viewUserDetails = (user) => {
  console.log('Ver detalles de:', user)
}

// Utilidades
const getUserInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const capitalizarNombre = (nombre) => {
  return nombre.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ')
}

const getRoleBadgeClass = (rol) => {
  const classes = {
    admin: 'bg-red-100 text-red-800',
    usuario: 'bg-blue-100 text-blue-800',
    supervisor: 'bg-green-100 text-green-800'
  }
  return classes[rol] || 'bg-gray-100 text-gray-800'
}

const getRoleDotClass = (rol) => {
  const classes = {
    admin: 'bg-red-500',
    usuario: 'bg-blue-500',
    supervisor: 'bg-green-500'
  }
  return classes[rol] || 'bg-gray-500'
}

const getRoleText = (rol) => {
  const texts = {
    admin: 'Administrador',
    usuario: 'Usuario',
    supervisor: 'Supervisor'
  }
  return texts[rol] || rol
}

// Lifecycle
onMounted(() => {
  // Simular carga de datos
  isLoading.value = true
  setTimeout(() => {
    isLoading.value = false
  }, 1000)
})
</script>
