<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-800 flex items-center justify-center p-4">
    <!-- Background Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl"></div>
    </div>

    <!-- Register Card -->
    <div class="relative z-10 w-full max-w-md">
      <!-- Animated Card Container -->
      <div 
        class="bg-white rounded-2xl shadow-2xl p-8"
        :class="{ 'animate-pulse': isLoading }"
      >
        <!-- Logo/Icon Section -->
        <div class="text-center mb-8">
          <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-teal-500 to-blue-800 rounded-full mb-4 shadow-lg">
            <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-blue-800 mb-2">Crear Cuenta</h1>
          <p class="text-gray-600">Únete a nuestro sistema administrativo</p>
        </div>

        <!-- Success Message -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="successMessage" class="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-green-700 text-sm">{{ successMessage }}</p>
            </div>
          </div>
        </Transition>

        <!-- Error Message -->
        <Transition
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="errorMessage" class="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div class="flex items-center">
              <svg class="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-red-700 text-sm">{{ errorMessage }}</p>
            </div>
          </div>
        </Transition>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-semibold text-blue-800">
              Correo Electrónico *
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path>
                </svg>
              </div>
              <input
                id="email"
                v-model="registerForm.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-200': emailError,
                  'border-teal-300': registerForm.email && !emailError 
                }"
                placeholder="usuario@empresa.com"
              >
              <!-- Email validation icon -->
              <div v-if="registerForm.email" class="absolute inset-y-0 right-0 pr-3 flex items-center">
                <svg v-if="!emailError" class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
            </div>
            <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
            <p v-if="errors.email" class="text-red-500 text-sm mt-2">{{ errors.email[0] }}</p>
          </div>

          <!-- Password Field -->
          <div class="space-y-2">
            <label for="password" class="block text-sm font-semibold text-blue-800">
              Contraseña *
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="registerForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-200': passwordError,
                  'border-teal-300': registerForm.password && !passwordError 
                }"
                placeholder="••••••••"
              >
              <button
                type="button"
                @click="togglePasswordVisibility"
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <svg v-if="!showPassword" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                </svg>
              </button>
            </div>
            <p v-if="passwordError" class="text-red-500 text-xs mt-1">{{ passwordError }}</p>
            <p v-if="errors.password" class="text-red-500 text-sm mt-2">{{ errors.password[0] }}</p>
            
            <!-- Password Strength Indicator -->
            <div v-if="registerForm.password" class="mt-2">
              <div class="flex justify-between items-center mb-1">
                <span class="text-xs text-gray-600">Fortaleza de contraseña:</span>
                <span :class="passwordStrengthColor" class="text-xs font-medium">{{ passwordStrengthText }}</span>
              </div>
              <div class="w-full bg-gray-200 rounded-full h-2">
                <div 
                  :class="passwordStrengthColor.replace('text-', 'bg-')" 
                  class="h-2 rounded-full transition-all duration-300"
                  :style="{ width: passwordStrengthWidth }"
                ></div>
              </div>
            </div>
          </div>

          <!-- Rol Field -->
          <div class="space-y-2">
            <label for="rol" class="block text-sm font-semibold text-blue-800">
              Rol en el Sistema *
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                </svg>
              </div>
              <select
                id="rol"
                v-model="registerForm.rol"
                required
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300 appearance-none bg-white"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-200': rolError,
                  'border-teal-300': registerForm.rol && !rolError 
                }"
              >
                <option value="">Selecciona tu rol</option>
                <option value="admin">Administrador</option>
                <option value="usuario">Usuario</option>
                <option value="operator">Operador</option>
                <option value="analyst">Analista</option>
                <option value="supervisor">Supervisor</option>
              </select>
              <!-- Custom dropdown arrow -->
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                </svg>
              </div>
            </div>
            <p v-if="rolError" class="text-red-500 text-xs mt-1">{{ rolError }}</p>
            
        
          </div>
          <!-- Register Button -->
          <button
            type="submit"
            :disabled="isLoading || !isFormValid"
            class="w-full py-3 px-4 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-blue-800 hover:to-blue-900 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creando cuenta...
            </div>
            <div v-else class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
              </svg>
              Crear Cuenta
            </div>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/Autentificate/auth'


const router = useRouter();
const authStore = useAuthStore()
// Form state
const registerForm = reactive({
  email: '',
  password: '',
  rol: '',
})

// UI state
const isLoading = ref(false)
const showPassword = ref(false)
const showTerms = ref(false)
const showPrivacy = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const errors = ref({});

// Validation
const emailError = computed(() => {
  if (!registerForm.email) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !emailRegex.test(registerForm.email) ? 'Ingresa un correo válido' : ''
})

const passwordError = computed(() => {
  if (!registerForm.password) return ''
  if (registerForm.password.length < 8) return 'La contraseña debe tener al menos 8 caracteres'
  if (!/(?=.*[a-z])/.test(registerForm.password)) return 'Debe contener al menos una letra minúscula'
  if (!/(?=.*[A-Z])/.test(registerForm.password)) return 'Debe contener al menos una letra mayúscula'
  if (!/(?=.*\d)/.test(registerForm.password)) return 'Debe contener al menos un número'
  return ''
})

const rolError = computed(() => {
  return !registerForm.rol ? 'Selecciona un rol' : ''
})

const isFormValid = computed(() => {
  return registerForm.email && 
         registerForm.password && 
         registerForm.rol && 
         !emailError.value && 
         !passwordError.value && 
         !rolError.value
})

// Password strength
const passwordStrength = computed(() => {
  if (!registerForm.password) return 0
  
  let strength = 0
  if (registerForm.password.length >= 8) strength++
  if (/(?=.*[a-z])/.test(registerForm.password)) strength++
  if (/(?=.*[A-Z])/.test(registerForm.password)) strength++
  if (/(?=.*\d)/.test(registerForm.password)) strength++
  if (/(?=.*[@$!%*?&])/.test(registerForm.password)) strength++
  
  return strength
})

const passwordStrengthText = computed(() => {
  const texts = ['Muy débil', 'Débil', 'Regular', 'Fuerte', 'Muy fuerte']
  return texts[passwordStrength.value - 1] || 'Muy débil'
})

const passwordStrengthColor = computed(() => {
  const colors = ['text-red-500', 'text-orange-500', 'text-yellow-500', 'text-green-500', 'text-green-600']
  return colors[passwordStrength.value - 1] || 'text-red-500'
})

const passwordStrengthWidth = computed(() => {
  return `${(passwordStrength.value / 5) * 100}%`
})

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleRegister = async () => {
  // Clear previous messages
  errorMessage.value = ''
  successMessage.value = ''
  
  // Basic validation
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor completa todos los campos correctamente'
    return
  }
  // Simulate registration process
  isLoading.value = true
  
  try {
    // Simulate API call
    errors.value = {};
    console.log(registerForm);

    // 🔥 Despachamos la acción desde el módulo autentificate
    await authStore.registerUser(registerForm);
    //console.log('response vue', response.userId);
    alert('usuario registrado correctamente ');
    // Redirigir al usuario a la página de inicio de sesión
    router.push('/');
    
  } catch (error) {
    console.log(error);
    if (error.response?.data?.error) {
      errors.value = error.response.data.error;
    }
  } finally {
    isLoading.value = false
  }
}

</script>