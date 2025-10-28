<template>
  <!-- Modal Overlay -->
  <transition name="fade">
    <div 
      @keydown.esc="closeModal" 
      tabindex="0" 
      class="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4"
    >
      <!-- Modal Container -->
      <div 
        class="bg-white rounded-2xl shadow-2xl w-full max-w-md transform transition-all"
        @click.stop
      >
        <!-- Header -->
        <div class="relative bg-[#80006A] px-8 py-6 rounded-t-2xl">
          <button 
            @click="closeModal" 
            class="absolute top-4 right-4 text-white/80 hover:text-white hover:bg-white/20 rounded-full p-2 transition-all duration-200"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          
          <div class="flex items-center gap-3">
            <div class="bg-white/20 backdrop-blur-sm rounded-xl p-3">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-white">Agregar Usuario</h2>
              <p class="text-white/80 text-sm mt-0.5">Complete los datos del nuevo usuario</p>
            </div>
          </div>
        </div>

        <!-- Form Content -->
        <form @submit.prevent="agregarUsuario" class="px-8 py-6 space-y-5">
          <!-- Email Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">
              Correo electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input 
                v-model="nuevoUsuario.email" 
                type="email" 
                required 
                placeholder="usuario@ejemplo.com"
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#80006A] focus:ring-4 focus:ring-[#80006A]/10 transition-all duration-200"
              >
            </div>
          </div>

          <!-- Nombre Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">
              Nombre completo
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input 
                v-model="nuevoUsuario.nombre" 
                type="text" 
                pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$" 
                minlength="7" 
                required 
                placeholder="Ingrese el nombre completo"
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#80006A] focus:ring-4 focus:ring-[#80006A]/10 transition-all duration-200"
              >
            </div>
          </div>
          <!-- Campo Cargo -->
          <div class="space-y-2">
            <label for="cargo" class="block text-sm font-semibold text-gray-700">
              Cargo
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                id="cargo"
                v-model="nuevoUsuario.cargo"
                type="text"
                required
                class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#80006A] focus:border-transparent transition-all duration-200 outline-none hover:border-gray-400"
                placeholder="Ej: Desarrollador, Gerente, etc."
              />
            </div>
          </div>

          <!-- Rol Field -->
          <div class="space-y-2">
            <label class="block text-sm font-semibold text-gray-700">
              Rol del usuario
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <select 
                v-model="nuevoUsuario.rol" 
                required 
                class="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#80006A] focus:ring-4 focus:ring-[#80006A]/10 transition-all duration-200 appearance-none bg-white cursor-pointer"
              >
                <option value="" disabled>Seleccionar rol</option>
                <option value="admin">Administrador</option>
                <option value="usuario">Usuario</option>
                <option value="supervisor">Supervisor</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3 pt-4">
            <button 
              type="button" 
              @click="closeModal" 
              class="flex-1 px-5 py-3 text-gray-700 bg-gray-100 rounded-xl hover:bg-gray-200 font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              class="flex-1 px-5 py-3 text-white bg-gradient-to-r from-[#80006A] to-[#A65C99] rounded-xl hover:shadow-lg hover:shadow-[#80006A]/30 font-medium text-sm transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
            >
              Guardar Usuario
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
  rol: '',
  cargo: ''
})


const closeModal = () => {
  emit('close')
  nuevoUsuario.value = { email: '', nombre: '', rol: '', cargo: '' }
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.fade-enter-active > div {
  animation: slideUp 0.3s ease;
}

@keyframes slideUp {
  from {
    transform: translateY(20px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
