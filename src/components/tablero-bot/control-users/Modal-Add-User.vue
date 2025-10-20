<template>
<!--  Modal -->
  <transition name="fade">
    <div @keydown.esc="closeModal" tabindex="0" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div class="bg-white rounded-xl shadow-lg w-11/12 sm:w-96 p-6 relative">
        <!-- Cerrar -->
        <button @click="closeModal" class="absolute top-3 right-3 text-gray-400 hover:text-gray-600" >
          ✕
        </button>

        <h2 class="text-lg font-semibold text-gray-800 mb-4">Agregar Usuario</h2>

        <!-- Formulario -->
        <form @submit.prevent="agregarUsuario">
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Correo electrónico</label>
            <input v-model="nuevoUsuario.email" type="email" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" >
          </div>

          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">Nombre completo</label>
            <input v-model="nuevoUsuario.nombre" type="text" pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$" minlength="7" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" >
          </div>

          <div class="mb-4">
            <label class="block text-sm font-medium text-gray-700 mb-1">Rol</label>
            <select v-model="nuevoUsuario.rol" required class="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" >
              <option value="">Seleccionar rol</option>
              <option value="admin">Administrador</option>
              <option value="usuario">Usuario</option>
              <option value="supervisor">Supervisor</option>
            </select>
          </div>

          <!-- Botones -->
          <div class="flex justify-end gap-2">
            <button type="button" @click="closeModal" class="px-3 py-1.5 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 text-sm">
              Cancelar
            </button>
            <button type="submit" class="px-4 py-1.5 text-white bg-gradient-to-r from-[#A65C99] to-[#80006A] rounded-lg hover:bg-blue-700 text-sm" >
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

const nuevoUsuario = ref({
  email: '',
  nombre: '',
  rol: ''
})


const closeModal = () => {
  emit('close')
  nuevoUsuario.value = { email: '', nombre: '', rol: '' }
}

const agregarUsuario = async() => {
  // Aquí iría tu lógica para guardar el usuario vía API o store
  try {
    await tableroFunctions.addNewUser(nuevoUsuario.value)
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
