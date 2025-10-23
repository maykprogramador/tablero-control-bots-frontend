<template>
  <!-- Modal -->
  <transition name="fade">
    <div @keydown.esc="closeModal" tabindex="0" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" >
      <div class="bg-white rounded-xl shadow-lg w-11/12 sm:w-96 p-6 relative">
        <!-- Botón Cerrar -->
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600" > 
          ✕
        </button>
        <h2 class="text-lg font-semibold text-gray-800 mb-4">Agregar Bot</h2>
        <!-- Formulario -->
        <form @submit.prevent="agregarBot">
          <!-- Nombre -->
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Nombre completo
            </label>
            <input v-model="nuevoBot.nombre" type="text" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$" minlength="7" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>

          <!-- Descripción -->
          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              v-model="nuevoBot.descripcion"
              minlength="10"
              maxlength="200"
              placeholder="Describe brevemente el propósito del bot..."
              class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none overflow-auto max-h-[9rem]"
              style="field-sizing: content;"
              rows="2"
            ></textarea>

          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-2">
            <button type="button" @click="closeModal" class="px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm" >
              Cancelar
            </button>
            <button type="submit" class="px-4 py-1.5 text-white bg-gradient-to-r from-[#A65C99] to-[#80006A] rounded-lg hover:opacity-90 text-sm" >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  </transition>
</template>


<script setup>
import { useTableroFunctions } from '@/stores/tablero-functions'
import { ref, defineEmits } from 'vue'
const tableroFunctions = useTableroFunctions()

const emit = defineEmits(['close'])

const nuevoBot = ref({
  nombre: '',
})


const closeModal = () => {
  emit('close')
  nuevoBot.value = { nombre: '', descripcion: '' }
}

const agregarBot = async() => {
  // Aquí iría tu lógica para guardar el usuario vía API o store
  try {
    await tableroFunctions.addNewBot(nuevoBot.value)
    closeModal()
  } catch (err) {
    alert(err.response.data.error || 'Error al agregar usuario')
    console.error('Error al agregar usuario:', err)
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
