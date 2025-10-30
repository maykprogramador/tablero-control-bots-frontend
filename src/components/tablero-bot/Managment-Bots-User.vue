<template>
  <!-- Backdrop con overlay -->
  <div 
    class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" 
    @click="closeBotManagement"
  >
    <!-- Panel lateral offcanvas -->
    <div 
      class="fixed inset-y-0 right-0 w-full bg-white dark:bg-black transform transition-transform duration-300 ease-in-out flex flex-col shadow-2xl" 
      @click.stop
    >
      <!-- Header -->
      <div class="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-slate-700 bg-white dark:bg-[#14181a] text-slate-800 dark:text-slate-200 flex-shrink-0">
        <div class="flex items-center justify-between">
          <div class="flex-1 min-w-0">
            <h3 class="text-base sm:text-lg font-semibold text-gray-900 dark:text-gray-100 truncate">{{ selectedUser?.nombre }}</h3>
            <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-300 ">Asignar bots a este usuario</p>
          </div>
          <button
            @click="closeBotManagement"
            class="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0 ml-2"
          >
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Bot List - Esta es la sección scrolleable -->
      <div class="flex-1 overflow-y-auto p-4 sm:p-6">
        <div class="space-y-2">
          <div
            v-for="bot in botsDisponibles"
            @click="toggleBotAssignment(bot.id)"
            :key="bot.id"
            class="flex items-center justify-between p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 dark:border-slate-700 dark:hover:bg-[#21292e] dark:bg-[#14181a] transition-colors duration-200 cursor-pointer"
          >
            <div class="flex-1 min-w-0 pr-3">
              <h4 class="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{{ bot.nombre }}</h4>
              <p class="text-xs text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">{{ bot.descripcion }}</p>
            </div>
            <div class="flex-shrink-0">
              <!-- Toggle switch moderno estilo iOS -->
              <label class="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  :checked="tempBotAssignments[bot.id]"
                  class="sr-only peer"
                >
                <div class="w-11 h-6 bg-gray-200 dark:bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>
      </div>

      <!-- Actions - Footer fijo -->
      <div class="bg-gray-50 px-4 sm:px-6 py-4 dark:bg-[#21292eae] border-t dark:border-slate-700 border-gray-200 flex-shrink-0">
        <div class="flex gap-2 sm:gap-3">
          <button
            @click="saveBotAssignments"
            class="flex-1 px-3 sm:px-4 py-2 bg-[#00B094] text-white rounded-lg hover:bg-[#0d947d] transition-colors duration-200 font-medium text-sm sm:text-base"
          >
            Guardar cambios
          </button>
          <button
            @click="closeBotManagement"
            class="px-3 sm:px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium text-sm sm:text-base"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watchEffect, defineProps} from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'

//const selectedUser = ref(null)
const tempBotAssignments = ref({})
const tableroFunctions = useTableroFunctions()
const botsDisponibles = computed(() => tableroFunctions.botsDisponibles)

// Computed properties
const { selectedUser, onCloseManagment } = defineProps(['selectedUser', 'onCloseManagment'])

watchEffect(() => {
  // Aquí podrías acceder a selectedRecord si más adelante lo necesitas
  selectedUser
})

// Métodos
const closeBotManagement = () => {
  //selectedUser.value = null
  tempBotAssignments.value = {}
  onCloseManagment()
}

const toggleBotAssignment = (botId) => {
  tempBotAssignments.value[botId] = !tempBotAssignments.value[botId]
}

const saveBotAssignments = async () => {
  if (selectedUser) {
    // Actualizar los bots asignados basado en el estado temporal
    const newAssignments = Object.keys(tempBotAssignments.value)
      .filter(botId => tempBotAssignments.value[botId])
    
    console.log('New assignaments: ', newAssignments);
    await tableroFunctions.addBotsToUser(selectedUser.id, newAssignments)
    onCloseManagment()
    // Simular guardado exitoso
  }
}
// Lifecycle
onMounted(async () => {
  tempBotAssignments.value = {}
  console.log('selectedUser: ', selectedUser)

  await tableroFunctions.getAllBots()
  console.log('botsDisponibles: ', botsDisponibles.value)

  botsDisponibles.value.forEach(bot => { tempBotAssignments.value[bot.id] = selectedUser.Bots?.some(b => b.id === bot.id) || false })
  console.log('tempBotAssignments: ', tempBotAssignments.value)
})


</script>
