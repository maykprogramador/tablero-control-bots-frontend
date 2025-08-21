<template>
  <!-- Modal de Gestión de Usuarios -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4 overflow-auto"
      @click="closeModal"
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
          class="bg-white rounded-xl shadow-2xl w-full  sm:max-w-2xl md:max-w-4xl lg:max-w-6xl max-h-[95vh] sm:max-h-[100vh] overflow-hidden relative"
        >
          <!-- Close Button -->
          <button 
            @click="closeModal"
            class="absolute top-2 right-2 sm:top-4 sm:right-4 z-10 w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200 group"
          >
            <svg class="w-4 h-4 text-gray-600 group-hover:text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

          <!-- Modal Header -->
          <div class="bg-gradient-to-r from-slate-800 to-blue-600 text-white p-3 sm:p-6 pr-12 sm:pr-16">
            <div class="flex items-center gap-2 sm:gap-3">
              <div class="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <svg class="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"></path>
                </svg>
              </div>
              <div>
                <h2 class="text-lg sm:text-2xl font-bold">Gestión de Usuarios del Sistema</h2>
                <p class="text-blue-100 mt-1 text-sm sm:text-base">Administra roles y permisos de usuarios</p>
              </div>
            </div>
            
            <!-- Summary Stats -->
            <!-- Made grid responsive with better mobile layout -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6">
              <div class="bg-white/10 rounded-lg p-2 sm:p-3 text-center">
                <div class="text-lg sm:text-2xl font-bold">{{ users.length }}</div>
                <div class="text-xs sm:text-sm text-blue-100">Total Usuarios</div>
              </div>
              <div class="bg-green-500/20 rounded-lg p-2 sm:p-3 text-center">
                <div class="text-lg sm:text-2xl font-bold text-green-200">{{ getRoleCount('admin') }}</div>
                <div class="text-xs sm:text-sm text-green-100">Administradores</div>
              </div>
              <div class="bg-yellow-500/20 rounded-lg p-2 sm:p-3 text-center">
                <div class="text-lg sm:text-2xl font-bold text-yellow-200">{{ getRoleCount('usuario') }}</div>
                <div class="text-xs sm:text-sm text-yellow-100">Usuarios</div>
              </div>
              <div class="bg-blue-500/20 rounded-lg p-2 sm:p-3 text-center">
                <div class="text-lg sm:text-2xl font-bold text-blue-200">{{ getRoleCount('supervisor') }}</div>
                <div class="text-xs sm:text-sm text-blue-100">Supervisores</div>
              </div>
            </div>
          </div>

          <!-- Modal Body -->
          <div class="p-3 sm:p-6 max-h-[60vh] sm:max-h-[70vh] overflow-y-auto">
            <!-- Filters and Search -->
            <!-- Made filters stack vertically on mobile and improved spacing -->
            <div class="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 mb-4 sm:mb-6">
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label class="text-xs sm:text-sm font-medium text-gray-700">Filtrar por rol:</label>
                <select 
                  v-model="roleFilter" 
                  class="w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Todos los roles</option>
                  <option value="admin">Administrador</option>
                  <option value="usuario">Usuario</option>
                  <option value="supervisor">Supervisor</option>
                </select>
              </div>
              <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label class="text-xs sm:text-sm font-medium text-gray-700">Buscar:</label>
                <input 
                  v-model="searchQuery"
                  type="text" 
                  placeholder="Buscar por email..."
                  class="w-full sm:w-auto px-3 py-1.5 border border-gray-300 rounded-lg text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
            <!-- Improved table responsiveness with better mobile handling -->
            <div v-else-if="filteredUsers.length > 0" class="overflow-x-auto rounded-lg border border-gray-200">
              <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-gray-50">
                  <tr>
                    <th class="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">#</th>
                    <th class="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Usuario</th>
                    <th class="hidden sm:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                    <th class="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Rol</th>
                    <!-- Nueva columna para bots asignados -->
                    <th class="hidden md:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Bots</th>
                    <th class="hidden lg:table-cell px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Cambiar Rol</th>
                    <th class="px-2 sm:px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Acciones</th>
                  </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                  <tr 
                    v-for="(user, index) in paginatedUsers" 
                    :key="user.id"
                    class="hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-xs sm:text-sm font-medium text-gray-900">
                      {{ (currentPage - 1) * usersPerPage + index + 1 }}
                    </td>
                    <td class="px-2 sm:px-4 py-4 whitespace-nowrap">
                      <div class="flex items-center">
                        <div class="flex-shrink-0 h-6 w-6 sm:h-8 sm:w-8">
                          <div class="h-6 w-6 sm:h-8 sm:w-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
                            <span class="text-xs font-medium text-white">{{ getUserInitials('Nombre De Usuario') }}</span>
                          </div>
                        </div>
                        <div class="ml-2 sm:ml-3">
                          <div class="text-xs sm:text-sm font-medium text-gray-900">{{ capitalizarNombre(user.nombre)}}</div>
                          <!-- Show email on mobile in user cell when email column is hidden -->
                          <div class="sm:hidden text-xs text-gray-500 truncate max-w-[120px]">{{ user.email }}</div>
                        </div>
                      </div>
                    </td>
                    <td class="hidden sm:table-cell px-4 py-4 whitespace-nowrap text-sm text-gray-700">
                      {{ user.email }}
                    </td>
                    <td class="px-2 sm:px-4 py-4 whitespace-nowrap">
                      <span 
                        :class="getRoleBadgeClass(user.rol)"
                        class="inline-flex items-center px-1.5 sm:px-2.5 py-0.5 rounded-full text-xs font-medium"
                      >
                        <span :class="getRoleDotClass(user.rol)" class="w-1.5 h-1.5 rounded-full mr-1 sm:mr-1.5"></span>
                        <span class="hidden sm:inline">{{ getRoleText(user.rol) }}</span>
                        <!-- Show abbreviated role text on mobile -->
                        <span class="sm:hidden">{{ user.rol === 'admin' ? 'Adm' : user.rol === 'usuario' ? 'Usr' : 'Sup' }}</span>
                      </span>
                    </td>
                    <!-- Nueva celda para mostrar bots asignados y botón gestionar -->
                    <td class="hidden md:table-cell px-4 py-4 whitespace-nowrap">
                      <div class="flex items-center gap-1">
                        <span v-if="user.rol !== 'admin'" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {{ user.Bots?.length }}
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
                          <span class="hidden lg:inline">Gestionar</span>
                        </button>
                      </div>
                    </td>
                    <td class="hidden lg:table-cell px-4 py-4 whitespace-nowrap">
                      <select 
                        v-model="user.rol"
                        @change="ChangeRol(user)"
                        class="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      >
                        <option value="admin">Administrador</option>
                        <option value="usuario">Usuario</option>
                        <option value="supervisor">Supervisor</option>
                      </select>
                    </td>
                    <td class="px-2 sm:px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <!-- Made actions responsive with dropdown on mobile -->
                      <div class="flex items-center gap-1 sm:gap-2"> 
                        <button
                          @click="viewUserDetails(user)"
                          class="text-blue-600 hover:text-blue-800 transition-colors duration-200 p-1"
                          title="Ver detalles"
                        >
                          <svg class="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                          </svg>
                        </button>
                        <!-- Show bot management button on mobile in actions column -->
                        <button
                          @click="openBotManagement(user)"
                          class="md:hidden text-green-600 hover:text-green-800 transition-colors duration-200 p-1"
                          title="Gestionar bots"
                        >
                          <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                          </svg>
                        </button>
                        <!-- Show role selector on mobile in actions column -->
                        <select 
                          v-model="user.rol"
                          @change="ChangeRol(user)"
                          class="lg:hidden px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                          title="Cambiar rol"
                        >
                          <option value="admin">Admin</option>
                          <option value="usuario">Usuario</option>
                          <option value="supervisor">Supervisor</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Empty State -->
            <div v-else-if="!isLoading" class="text-center py-12">
              <div class="text-gray-400 text-6xl mb-4">👥</div>
              <h3 class="text-lg font-medium text-gray-900 mb-2">No hay usuarios disponibles</h3>
              <p class="text-gray-500">No se encontraron usuarios que coincidan con los filtros aplicados</p>
            </div>

            <!-- Pagination -->
            <!-- Made pagination more mobile-friendly -->
            <div v-if="totalPages > 1" class="flex flex-col sm:flex-row items-center justify-between mt-4 sm:mt-6 pt-4 border-t border-gray-200 gap-3 sm:gap-0">
              <div class="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                Mostrando {{ (currentPage - 1) * usersPerPage + 1 }} a {{ Math.min(currentPage * usersPerPage, filteredUsers.length) }} de {{ filteredUsers.length }} usuarios
              </div>
              <div class="flex items-center gap-1 sm:gap-2">
                <button 
                  @click="currentPage--"
                  :disabled="currentPage === 1"
                  class="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span class="hidden sm:inline">Anterior</span>
                  <span class="sm:hidden">‹</span>
                </button>
                <div class="flex gap-1">
                  <button 
                    v-for="page in visiblePages" 
                    :key="page"
                    @click="currentPage = page"
                    :class="[
                      'px-2 sm:px-3 py-1.5 text-xs sm:text-sm rounded-lg transition-colors duration-200',
                      page === currentPage 
                        ? 'bg-blue-600 text-white' 
                        : 'border border-gray-300 hover:bg-gray-50'
                    ]"
                  >
                    {{ page }}
                  </button>
                </div>
                <button 
                  @click="currentPage++"
                  :disabled="currentPage === totalPages"
                  class="px-2 sm:px-3 py-1.5 text-xs sm:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  <span class="hidden sm:inline">Siguiente</span>
                  <span class="sm:hidden">›</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Modal Footer -->
          <!-- Made footer responsive with better mobile layout -->
          <div class="bg-gray-50 px-3 sm:px-6 py-3 sm:py-4 flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
            <div class="flex items-center gap-2 text-xs sm:text-sm text-gray-600">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <span>{{ pendingChanges }} cambios pendientes</span>
            </div>
            <div class="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button 
                v-if="pendingChanges > 0"
                @click="saveAllChanges"
                class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span class="hidden sm:inline">Guardar Todo</span>
                <span class="sm:hidden">Guardar</span>
              </button>
              <button 
                @click="closeModal"
                class="flex-1 sm:flex-none px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors duration-200 text-sm"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      </Transition>
      <ManagmentBotsUser v-if="showBotManagement" :selectedUser="selectedUser" :onCloseManagment="closeModalBotManagment"/>
    </div>
  </Transition>
  <!-- Success Toast -->
  <!-- Made toast responsive -->
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-x-full"
    enter-to-class="opacity-100 translate-x-0"
    leave-active-class="transition-all duration-200 ease-in"
    leave-from-class="opacity-100 translate-x-0"
    leave-to-class="opacity-0 translate-x-full"
  >
    <div v-if="showSuccessToast" class="fixed top-4 right-2 sm:right-4 bg-green-500 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2 max-w-xs sm:max-w-none">
      <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
      </svg>
      <span class="text-sm sm:text-base">{{ successMessage }}</span>
    </div>
  </Transition>
</template>

<script setup>
import { ref, reactive, computed, onMounted, defineProps } from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import { useAuthStore } from '@/stores/Autentificate/auth'
import ManagmentBotsUser from './Managment-Bots-User.vue' // se importa el componente de administracion de los bots
import { capitalizarNombre } from '@/utils/CapitalizarNombre'

// UI State
const isModalOpen = ref(false)
const isLoading = ref(false)
const showSuccessToast = ref(false)
const successMessage = ref('')
const props = defineProps(['onClose'])
const tableroFunctions = useTableroFunctions()
const showBotManagement = ref(false)
const authStore = useAuthStore()

// Filters and pagination
const roleFilter = ref('')
const searchQuery = ref('')
const currentPage = ref(1)
const usersPerPage = 8

// Users data
const users = computed(() => tableroFunctions.users)
const selectedUser = ref(null)

// functions -----------------------------------------------------------------------------------------------------------------------
const ChangeRol = async (user) => {
  // Establece updatedAt en formato ISO
  user.updatedAt = new Date().toISOString();
  console.log(' user: ', user);

  try {
    await tableroFunctions.updateUserRole(user)
  } catch (error) {
    console.error('Error updating user role:', error)
  } 
}

const openBotManagement = (user) => {
  selectedUser.value = user
  // Inicializar estado temporal de asignaciones
  showBotManagement.value = true
}

const closeModalBotManagment = () => {
  showBotManagement.value = false
}

/*function capitalizarNombre(nombre) {  
  return capitalizarNombre(nombre)
}*/

// Computed properties
const filteredUsers = computed(() => {
  return users.value.filter(user => {
    const matchesRole = !roleFilter.value || user.rol === roleFilter.value
    const matchesSearch = !searchQuery.value || 
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase()) //|| user.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    return matchesRole && matchesSearch
  })
})

const totalPages = computed(() => Math.ceil(filteredUsers.value.length / usersPerPage))

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * usersPerPage
  const end = start + usersPerPage
  return filteredUsers.value.slice(start, end)
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

const pendingChanges = computed(() => {
  return users.value.filter(user => user.hasChanges).length
})

const closeModal = () => {
  roleFilter.value = ''
  searchQuery.value = ''
  currentPage.value = 1
  props.onClose()
}

const loadUsers = async () => {
  isLoading.value = true
  
  try {
    // Simulate API call GET /get/users
    await tableroFunctions.getUsers()
  } catch (error) {
    console.error('Error loading users:', error)
  } finally {
    isLoading.value = false
  }
}

const getRoleCount = (role) => {
  return users.value.filter(user => user.rol === role).length
}

const getRoleBadgeClass = (role) => {
  const classes = {
    admin: 'bg-red-100 text-red-700',
    usuario: 'bg-blue-100 text-blue-700',
    supervisor: 'bg-green-100 text-green-700'
  }
  return classes[role] || 'bg-gray-100 text-gray-700'
}

const getRoleDotClass = (role) => {
  const classes = {
    admin: 'bg-red-500',
    usuario: 'bg-blue-500',
    supervisor: 'bg-green-500'
  }
  return classes[role] || 'bg-gray-500'
}

const getRoleText = (role) => {
  const texts = {
    admin: 'Administrador',
    usuario: 'Usuario',
    supervisor: 'Supervisor'
  }
  return texts[role] || 'Desconocido'
}

const getUserInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

const getLastLogin = (date) => {
  const now = new Date()
  const diffTime = Math.abs(now - date)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  
  if (diffDays === 1) return 'Hace 1 día'
  if (diffDays < 7) return `Hace ${diffDays} días`
  return date.toLocaleDateString('es-ES')
}

const saveAllChanges = async () => {
  const changedUsers = users.value.filter(user => user.hasChanges)
  
  try {
    // Simulate API calls for all changed users
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    changedUsers.forEach(user => {
      user.rol = user.newRole
      user.hasChanges = false
    })
    
    showToast(`${changedUsers.length} usuarios actualizados correctamente`)
  } catch (error) {
    console.error('Error updating users:', error)
  }
}

const viewUserDetails = (user) => {
  // Simulate viewing user details
  showToast(`Viendo detalles de ${user.email}`)
}

const showToast = (message) => {
  successMessage.value = message
  showSuccessToast.value = true
  
  setTimeout(() => {
    showSuccessToast.value = false
  }, 3000)
}

// Lifecycle
onMounted(async () => {
  await loadUsers()
  // Component mounted, ready to load users when modal opens
})
</script>
