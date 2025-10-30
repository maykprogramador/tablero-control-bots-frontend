<template>
  <!-- Modal -->
  <transition name="fade">
    <div @keydown.esc="closeModal" tabindex="0" class="fixed inset-0 bg-black/50 dark:bg-black/70 backdrop-blur-sm flex items-center justify-center z-50" >
      <div class="bg-white dark:bg-gray-900 rounded-xl shadow-lg w-11/12 sm:w-96 p-6 relative">
        <!-- Botón Cerrar -->
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300" > 
          ✕
        </button>
        <h2 class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
          {{ bot ? 'Editar Bot' : 'Agregar Bot' }}
        </h2>
        <!-- Formulario -->
        <form @submit.prevent="agregaroEditarBot">
          <!-- Nombre -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Nombre completo
            </label>
            <input 
              v-model="nuevoBot.nombre" 
              type="text" 
              pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$" 
              minlength="7" 
              required 
              class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]" 
            />
          </div>

          <!-- Descripción -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Descripción
            </label>
            <textarea
              v-model="nuevoBot.descripcion"
              minlength="10"
              maxlength="200"
              placeholder="Describe brevemente el propósito del bot..."
              class="w-full border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder-gray-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A] resize-none overflow-auto max-h-[9rem]"
              style="field-sizing: content;"
              rows="2"
            ></textarea>
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-2">
            <button 
              type="button" 
              @click="closeModal" 
              class="px-3 py-1.5 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 text-sm" 
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="px-4 py-1.5 text-white bg-gradient-to-r from-[#A65C99] to-[#80006A] rounded-lg hover:opacity-90 text-sm" 
            >
              {{ bot ? 'Actualizar' : 'Guardar' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { useTableroFunctions } from '@/stores/tablero-functions'
import { ref, defineEmits, defineProps, onMounted } from 'vue'

const tableroFunctions = useTableroFunctions()

const props = defineProps({
  bot: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['close'])

const nuevoBot = ref({
  nombre: '',
  descripcion: '',
})

// Inicializar los datos cuando el componente se monta
onMounted(() => {
  if (props.bot) {
    // Si existe bot, estamos en modo edición
    nuevoBot.value = {
      nombre: props.bot.nombre || '',
      descripcion: props.bot.descripcion || '',
    }
  }
})

const closeModal = () => {
  emit('close')
  nuevoBot.value = { nombre: '', descripcion: '' }
}

const agregaroEditarBot = async () => {
  try {
    if (props.bot) {
      // Modo edición: actualizar bot existente
      const botActualizado = {
        ...props.bot,
        nombre: nuevoBot.value.nombre,
        descripcion: nuevoBot.value.descripcion,
      }
      await tableroFunctions.updateBot(botActualizado)
    } else {
      // Modo agregar: crear nuevo bot
      await tableroFunctions.addNewBot(nuevoBot.value)
    }
    // reiniciamos el formulario
    nuevoBot.value = { nombre: '', descripcion: '' }
    // Cerramos el modal
    closeModal()
  } catch (err) {
    alert(err.response?.data?.error || `Error al ${props.bot ? 'actualizar' : 'agregar'} bot`)
    console.error(`Error al ${props.bot ? 'actualizar' : 'agregar'} bot:`, err)
  }
}
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>