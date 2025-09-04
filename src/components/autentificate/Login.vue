<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-800 flex items-center justify-center p-4">
    <!-- Background Decorative Elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      <div class="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl"></div>
      <div class="absolute top-1/2 left-1/4 w-64 h-64 bg-teal-300/10 rounded-full blur-2xl"></div>
    </div>

    <!-- Login Card -->
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
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path>
            </svg>
          </div>
          <h1 class="text-3xl font-bold text-blue-800 mb-2">Bienvenido al Sistema</h1>
          <p class="text-gray-600">Inicia sesión para continuar</p>
        </div>

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

        <!-- Login Form -->
        <form @submit.prevent="handleMicrosoftLogin" class="space-y-6">
          <!-- Email Field -->
          <div class="space-y-2">
            <label for="email" class="block text-sm font-semibold text-blue-800">
              Correo Electrónico
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                </svg>
              </div>
              <input
                id="email"
                v-model="loginForm.email"
                type="email"
                required
                class="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-200': emailError,
                  'border-teal-300': loginForm.email && !emailError 
                }"
                placeholder="usuario@empresa.com"
              >
            </div>
            <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
            <p v-if="errors.email" class="text-red-500 text-sm mt-2">{{ errors.email[0] }}</p>
          </div>

          <!-- Password Field 
          <div class="space-y-2">
            <label for="password" class="block text-sm font-semibold text-blue-800">
              Contraseña
            </label>
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <input
                id="password"
                v-model="loginForm.password"
                :type="showPassword ? 'text' : 'password'"
                required
                class="w-full pl-10 pr-12 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 transition-all duration-300"
                :class="{ 
                  'border-red-300 focus:border-red-500 focus:ring-red-200': passwordError,
                  'border-teal-300': loginForm.password && !passwordError 
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
          </div> -->

          <!-- Remember Me & Forgot Password 
          <div class="flex items-center justify-between">
            <label class="flex items-center">
              <input
                v-model="loginForm.rememberMe"
                type="checkbox"
                class="w-4 h-4 text-teal-600 bg-gray-100 border-gray-300 rounded focus:ring-teal-500 focus:ring-2"
              >
              <span class="ml-2 text-sm text-gray-600">Recordarme</span>
            </label>
            <button
              type="button"
              @click="showForgotPassword = true"
              class="text-sm text-teal-600 hover:text-blue-800 font-medium transition-colors duration-200"
            >
              ¿Olvidaste tu contraseña?
            </button>
          </div>-->

          <!-- Login Button 
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full py-3 px-4 cursor-pointer bg-gradient-to-r from-teal-500 to-teal-600 hover:from-blue-800 hover:to-blue-900 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-teal-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            <div v-if="isLoading" class="flex items-center justify-center">
              <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </div>
            <div v-else class="flex items-center justify-center">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"></path>
              </svg>
              Iniciar Sesión
            </div>
          </button>-->
          <button
            type="button"
            @click="handleMicrosoftLogin"
            class="w-full cursor-pointer flex items-center justify-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
          >
            <!-- Ícono de Microsoft -->
            <svg class="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path fill="#F25022" d="M1 1h10v10H1z" />
              <path fill="#7FBA00" d="M13 1h10v10H13z" />
              <path fill="#00A4EF" d="M1 13h10v10H1z" />
              <path fill="#FFB900" d="M13 13h10v10H13z" />
            </svg>
            Iniciar Sesión
          </button>
        </form>
      </div>

      <!-- Success Message -->
      <Transition
        enter-active-class="transition-all duration-500 ease-out"
        enter-from-class="opacity-0 translate-y-4"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-300 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 translate-y-4"
      >
        <div v-if="showSuccess" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
          <div class="flex items-center">
            <svg class="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-green-700 text-sm">¡Inicio de sesión exitoso! Redirigiendo...</p>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Forgot Password Modal -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div v-if="showForgotPassword" class="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div class="bg-white rounded-xl shadow-2xl max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-blue-800">Recuperar Contraseña</h3>
            <button @click="showForgotPassword = false" class="text-gray-400 hover:text-gray-600">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          <p class="text-gray-600 mb-4">Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña.</p>
          <form @submit.prevent="handleForgotPassword">
            <input
              v-model="forgotEmail"
              type="email"
              required
              class="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-200 mb-4"
              placeholder="tu@email.com"
            >
            <button
              type="submit"
              class="w-full py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-lg transition-colors duration-200"
            >
              Enviar Enlace
            </button>
          </form>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/Autentificate/auth'
import { API_BASE_URL_BACK } from '@/config'



const router = useRouter()
const authStore = useAuthStore()
// Form state
const loginForm = reactive({
  email: '',
  password: '',
  rememberMe: false
})

// UI state
const isLoading = ref(false)
const showPassword = ref(false)
const showForgotPassword = ref(false)
const showSignUp = ref(false)
const showSuccess = ref(false)
const errorMessage = ref('')
const forgotEmail = ref('')
const errors = ref([])

onMounted(() => {
  const params = new URLSearchParams(window.location.search)
  const error = params.get("error")

  if (error === "dominio") {
    errorMessage.value = "El usuario no pertenece a cuentas del dominio"
  } else if (error === "server") {
    errorMessage.value = "Error al autenticar con Microsoft. Intenta de nuevo."
  }
})

// Validation
const emailError = computed(() => {
  if (!loginForm.email) return ''
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return !emailRegex.test(loginForm.email) ? 'Ingresa un correo válido' : ''
})

const passwordError = computed(() => {
  if (!loginForm.password) return ''
  return loginForm.password.length < 6 ? 'La contraseña debe tener al menos 6 caracteres' : ''
})

// Methods
const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value
}

const handleMicrosoftLogin = () => {
  // 👉 aquí podrías pedir el correo al usuario (ejemplo: prompt)

  if (!loginForm.email) {
    //alert("Debes ingresar un correo para continuar.")
    errorMessage.value = 'Debes ingresar un correo para continuar.'
    return
  }

  // 👉 validar dominio
  if (loginForm.email.endsWith("@zentria.com.co")) {
    // Redirigir
    window.location.href = `${API_BASE_URL_BACK}/api/auth/microsoft`
  } else {
    //alert("El dominio o el correo no es válido.")
    errorMessage.value = 'El dominio o el correo no es válido.'
  }
}

const handleLogin = async () => {
  // Clear previous errors
  errorMessage.value = ''
  
  // Basic validation
  if (!loginForm.email || !loginForm.password) {
    errorMessage.value = 'Por favor completa todos los campos'
    return
  }
  
  if (emailError.value || passwordError.value) {
    errorMessage.value = 'Por favor corrige los errores en el formulario'
    return
  }
  // Simulate login process
  isLoading.value = true
  errors.value = [];
  
  try {
   const user = await authStore.loginUser({ email: loginForm.email, password: loginForm.password })

    if (user) {
      authStore.setProvider('local')
      router.push('/tablero')
    }

  } catch (error) {
    if (error.response?.data) {
      console.log("error del backend: ", error.response.data);
      
      errors.value = error.response.data
      errorMessage.value = 'Error al iniciar sesion'
    } else {
      //errors.value = ['Error al iniciar sesión']
      errorMessage.value = 'Error al iniciar sesion'
    }
  } finally {
    isLoading.value = false
  }
}


</script>