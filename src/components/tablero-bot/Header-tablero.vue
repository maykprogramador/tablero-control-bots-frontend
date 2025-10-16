<template>
  <header class="bg-[#80006A] text-white sticky top-0 z-50">
    <div>
      <div class="flex items-center justify-between h-16 px-6">
        <!-- Sección Izquierda: Branding -->
        <div class="flex items-center space-x-3">
          <span class="text-2xl">🤖</span>
          <h1 class="text-xl font-bold text-white hidden sm:block">
            Tablero de Control de Bots
          </h1>
          <h1 class="text-lg font-bold text-white sm:hidden">
            Control Bots
          </h1>
        </div>

        <!-- Sección  Desktop -->
        <div class="hidden md:flex items-center space-x-4">
          <!-- Notificaciones -->
          <div class="relative">
            <!-- Botón de notificaciones -->
            <button
              @click="toggleNotifications"
              class="relative p-2 text-white hover:text-blue-200 transition-all duration-200 ease-in-out hover:bg-white/10 rounded-lg"
            >
              <Bell class="w-5 h-5" />
              <span
                v-if="NotificationCount > 0"
                class="absolute -top-1 -right-1 bg-[#FF5F3F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium"
              >
                {{ NotificationCount }}
              </span>
            </button>

            <!-- Dropdown de Notificaciones -->
            <div v-if="showNotifications && !showMobileMenu" class="absolute left-1/2 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 py-2 transition-all duration-200 ease-in-out transform -translate-x-1/2 z-50" >
              <!-- Header con título y menú -->
              <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
                <h3 class="text-sm font-semibold text-gray-900">Notificaciones</h3>

                <!-- Botón de opciones (...) -->
                <div class="relative">
                  <button @click="toggleMenuAcciones" class="p-1 rounded-full text-black font-bold cursor-pointer hover:bg-gray-300 transition" > 
                    ⋮ 
                  </button>

                  <!-- Menú desplegable -->
                  <div v-if="showMenuAcciones" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50" >
                    <button @click="marcarTodasLeidas" class="flex items-center cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150" >
                      <CheckCheck class="w-4 h-4 inline-block mr-2 text-green-600" />
                      Marcar como leídas
                    </button>
                    <button @click="eliminarTodas" class="flex items-center text-left cursor-pointer px-4 py-2 text-sm hover:bg-gray-50 text-red-600 transition-colors duration-150" >
                      <Trash class="w-4 h-4 inline-block mr-2 text-red-600" />
                      Eliminar todas
                    </button>
                  </div>
                </div>
              </div>
              <div class="max-h-64 overflow-y-auto">
                <div v-for="notificacion in notificaciones" :key="notificacion.id" class="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer" >
                  <div @click="handleNotificacionClick(notificacion)" class="flex items-start space-x-3">
                    <!-- Puntos o icono segun tipo -->
                    <div v-if="!notificacion.leido" class="flex-shrink-0">
                      <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                    </div>
                    <!-- Contenido -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900">{{ notificacion.titulo }}</p>
                      <p class="text-sm text-gray-600 mt-1" v-html="notificacion.mensaje"></p>
                      <p class="text-xs text-gray-400 mt-1">{{ timeAgo( notificacion.createdAt ) }}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="px-4 py-2 border-t border-gray-100">
                <button @click="$emit('update:selectedTab', 'notificaciones'),toggleNotifications()" class="text-sm cursor-pointer text-blue-600 hover:text-blue-800 font-medium">
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          </div>

          <!-- Avatar y Menú de Usuario -->
          <div class="relative">
            <!-- Avatar -->
            <button @click="toggleUserMenu" class="flex items-center space-x-2 text-white hover:text-blue-200 transition-all duration-200 ease-in-out hover:bg-white/10 rounded-lg p-2">
              <img class="h-8 w-8 rounded-full border-2 border-white/20" src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_640.png" alt="Avatar del usuario" />
              <span class="text-sm font-medium">{{ user.nombre }}</span>
              <svg class="w-4 h-4 transition-transform duration-200" :class="{ 'rotate-180': showUserMenu }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
              </svg>
            </button>

            <!-- Dropdown del Usuario -->
            <div v-if="showUserMenu" class="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-xl border border-gray-200 py-2 transition-all duration-200 ease-in-out">
              <div class="px-4 py-2 border-b border-gray-100">
                <p class="text-sm font-medium text-gray-900">{{ user.nombre  }}</p>
                <p class="text-sm text-gray-500">{{ user.email }}</p>
              </div>
              <div class="py-1">
                <a @click="handleMenuClick(item.action)" v-for="item in userMenuItems" :key="item.name" href="#"class="flex items-center cursor-pointer px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150">
                  <component :is="item.icon" class="w-4 h-4 mr-3 text-gray-400" />
                  {{ item.name }}
                </a>
              </div>
            </div>
          </div>
        </div>

        <!-- Menú Hamburguesa: Mobile -->
        <div class="md:hidden">
          <!-- icono tipo hamburguesa-->
          <button @click="toggleMobileMenu" class="text-white hover:text-blue-200 transition-all duration-200 ease-in-out p-2" >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path v-if="!showMobileMenu" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
              <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>
      </div>

      <!-- Menú Mobile -->
      <div v-if="showMobileMenu" class="md:hidden border-t border-white/20 py-4 transition-all duration-200 ease-in-out" >
        <!-- Avatar -->
        <div class="flex items-center space-x-3 px-4 py-2">
          <img class="h-10 w-10 rounded-full border-2 border-white/20" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="Avatar del usuario" />
          <div>
            <p class="text-white font-medium">{{ user.nombre }}</p>
            <p class="text-blue-200 text-sm">{{ user.email }}</p>
          </div>
        </div>
        
        <div class="mt-4 space-y-1">
          <!-- Icono notificaciones -->
          <button @click="toggleNotificationsMobile" class="flex items-center w-full px-4 py-2 text-white hover:bg-white/10 transition-colors duration-150" >
            <Bell class="w-5 h-5 mr-3" />
            Notificaciones
            <span v-if="NotificationCount > 0" class="ml-auto bg-[#FF5F3F] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {{ NotificationCount }}
            </span>
          </button>
          <!-- Notificaciones en Mobile -->
          <div v-if="showNotifications && showMobileMenu" class="mt-2 w-full bg-white rounded-lg shadow-md border border-gray-200 py-2 transition-all duration-200 ease-in-out" >
            <!-- Header con título y menú -->
            <div class="px-4 py-2 border-b border-gray-100 flex items-center justify-between">
              <h3 class="text-sm font-semibold text-gray-900">Notificaciones</h3>

              <!-- Botón de opciones (...) -->
              <div class="relative">
                <button @click="toggleMenuAcciones" class="p-1 rounded-full text-black font-bold cursor-pointer hover:bg-gray-300 transition" > 
                  ⋮ 
                </button>

                <!-- Menú desplegable -->
                <div v-if="showMenuAcciones" class="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-50" >
                  <button @click="marcarTodasLeidas" class="flex items-center cursor-pointer text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150" >
                    <CheckCheck class="w-4 h-4 inline-block mr-2 text-green-600" />
                    Marcar como leídas
                  </button>
                  <button @click="eliminarTodas" class="flex items-center text-left cursor-pointer px-4 py-2 text-sm hover:bg-gray-50 text-red-600 transition-colors duration-150" >
                    <Trash class="w-4 h-4 inline-block mr-2 text-red-600" />
                    Eliminar todas
                  </button>
                </div>
              </div>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <div v-for="notificacion in notificaciones" :key="notificacion.id" class="px-4 py-3 hover:bg-gray-50 transition-colors duration-150 cursor-pointer" >
                <div @click="handleNotificacionClick(notificacion)" class="flex items-start space-x-3">
                  <div v-if="!notificacion.leido" class="flex-shrink-0">
                    <div class="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-gray-900">{{ notificacion.titulo }}</p>
                    <p class="text-sm text-gray-600 mt-1" v-html="notificacion.mensaje"></p>
                    <p class="text-xs text-gray-400 mt-1">{{ timeAgo(notificacion.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="px-4 py-2 border-t border-gray-100">
              <button @click="$emit('update:selectedTab', 'notificaciones'),toggleNotifications()" class="text-sm text-blue-600 hover:text-blue-800 font-medium">
                Ver todas las notificaciones
              </button>
            </div>
          </div>
          <!-- Items o opciones en Mobile -->
          <a v-for="item in userMenuItems" :key="item.name" href="#" class="flex items-center w-full px-4 py-2 text-white hover:bg-white/10 transition-colors duration-150" @click="handleMenuClick(item.action)" >
            <component :is="item.icon" class="w-5 h-5 mr-3" />
            {{ item.name }}
          </a>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted, shallowRef, computed, defineProps, defineEmits} from 'vue'
import { storeToRefs } from 'pinia'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Autentificate/auth'
import { useNotificacionesStore } from '@/stores/notificacion-functions'

//props
const props = defineProps(['openModalOption', 'selectedTab'])
const emit = defineEmits(['update:selectedTab'])

// stores
const authStore = useAuthStore()
const router = useRouter()
const notificacionStore = useNotificacionesStore()
const { user } = storeToRefs(authStore)
const { notificaciones } = storeToRefs(notificacionStore)

//iconos de vue
import { Settings, LogOut, User, Bell, CircleCheck, CircleX, TriangleAlert, Info, Trash, CheckCheck } from 'lucide-vue-next'
import { timeAgo } from '@/utils/TimeAgo'

// Estados reactivo
const showNotifications = ref(false)
const showUserMenu = ref(false)
const showMobileMenu = ref(false)
const notificationCount = ref(0)
const showMenuAcciones = ref(false)

// Datos de notificaciones
/*
const notificaciones = ref([
  {
    id: 1,
    titulo: 'Bot de Ventas Activado',
    mensaje: 'El bot de ventas ha sido activado correctamente y está procesando consultas.',
    tiempo: 'Hace 5 minutos'
  },
  {
    id: 2,
    titulo: 'Actualización Completada',
    mensaje: 'La actualización del sistema se ha completado exitosamente.',
    tiempo: 'Hace 1 hora'
  },
  {
    id: 3,
    titulo: 'Nuevo Bot Configurado',
    mensaje: 'Se ha configurado un nuevo bot de soporte técnico.',
    tiempo: 'Hace 2 horas'
  }
])*/

// Iconos como componentes

// Elementos del menú de usuario

const userMenuItems = shallowRef([
  { name: 'Mi Perfil', action: 'profile', icon: User },
  { name: 'Configuración', action: 'settings', icon: Settings },
  { name: 'Cerrar Sesión', action: 'logout', icon: LogOut }
])

const notificationStyles = {
  exito: {
    icon: CircleCheck ,
    color: "text-green-700 border-green-200",
    dot: "bg-green-500"
  },
  error: {
    icon: CircleX ,
    color: "text-red-700 border-red-200",
    dot: "bg-[#FF5F3F]"
  },
  advertencia: {
    icon: TriangleAlert,
    color: " text-yellow-700 border-yellow-200",
    dot: "bg-yellow-500"
  },
  info: {
    icon: Info,
    color: "text-blue-700 border-blue-200",
    dot: "bg-blue-500"
  }
}

// Métodos
async function handleNotificacionClick(notificacion) {
  if (!notificacion.leido) {
    notificacion.leido = true
    notificacionStore.marcarComoLeida(notificacion.id)
  }
  if (notificacion.destino?.modal === 'HistoriaClinica') {
    props.openModalOption(notificacion.destino?.bot_id, 'detalles')
  }
  if (notificacion.destino?.modal === 'tablero-bot') {
    emit('update:selectedTab', 'bots')
  }
  if (notificacion.destino?.modal === 'solicitud_usuario') {
    emit('update:selectedTab', 'solicitudes')
  }
  if (notificacion.destino?.modal === 'registros-bot') {
    props.openModalOption(notificacion.destino?.bot_id, 'detalles')
  }
  if (notificacion.destino?.modal === 'logs-bot') {
    props.openModalOption(notificacion.destino?.bot_id, 'logs')
  }
  toggleNotifications()
  // luego decides qué acción tomar (redirigir, abrir modal, etc.)
}

function toggleMenuAcciones() {
  showMenuAcciones.value = !showMenuAcciones.value
}

function marcarTodasLeidas() {
  notificacionStore.marcarTodasComoLeidas()
  showMenuAcciones.value = false
  // opcional: llamada a API -> PATCH /notificaciones/leidas
}

const eliminarTodas = () => {
  if (confirm('¿Estás seguro de que deseas eliminar todas las notificaciones?')) {
    notificacionStore.eliminarNotificaciones()
  }
  showMenuAcciones.value = false
}

const NotificationCount = computed(() => {
 // contar las notificaciones no leidas
  let notificacionesNoLeidas = notificaciones.value.filter(n => !n.leido).length 
  //console.log('notificacionesNoLeidas', notificacionesNoLeidas);
  return notificacionesNoLeidas
})

const toggleNotifications = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
  showMobileMenu.value = false
}

const toggleNotificationsMobile = () => {
  showNotifications.value = !showNotifications.value
  showUserMenu.value = false
  showMobileMenu.value = true
}

const toggleUserMenu = () => {
  showUserMenu.value = !showUserMenu.value
  showNotifications.value = false
  showMobileMenu.value = false
}

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
  showNotifications.value = false
  showUserMenu.value = false
}

const closeAllDropdowns = () => {
  showNotifications.value = false
  showUserMenu.value = false
  showMobileMenu.value = false
}

const handleMenuClick = (action) => {
  console.log(`Acción ejecutada: ${action}`)
  closeAllDropdowns()
  
  switch (action) {
    case 'profile':
      alert('Navegando a Mi Perfil')
      break
    case 'settings':
      alert('Navegando a Configuración')
      break
    case 'logout':
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        logout()
      }
      break
  }
}

// funcion para cerrar la sesion
const logout = async () => {
  try {
    await authStore.logoutUser()
    await router.push('/')
  } catch (err) {
    console.error('Error al cerrar sesión:', err)
  }
}
// Cerrar dropdowns con Escape
const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    closeAllDropdowns()
  }
}

onMounted(async() => {
  try {
    await notificacionStore.fetchNotificaciones()
    console.log('notificaciones', notificaciones.value);
    
  } catch (error) {
    alert(error.response.data.message);
  }
  document.addEventListener('keydown', handleKeydown)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>