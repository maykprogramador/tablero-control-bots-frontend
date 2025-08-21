
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-900 text-white">
    <div class="max-w-md w-full bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 class="text-3xl font-bold text-center mb-8">Registrarse</h2>
      <form @submit.prevent="register">
        <div class="mb-4">
          <label for="username" class="block text-sm font-medium mb-1">
            Username <span class="text-red-500">*</span>
          </label>
          <input
            id="username"
            type="text"
            v-model="form.username"
            class="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <p v-if="errors.username" class="text-red-500 text-sm mt-2">{{ errors.username[0] }}</p>
        </div>

        <div class="mb-4">
          <label for="nombre_completo" class="block text-sm font-medium mb-1">
            Nombre Completo <span class="text-red-500">*</span>
          </label>
          <input
            id="nombre_completo"
            type="text"
            v-model="form.nombre_completo"
            class="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <p v-if="errors.nombre_completo" class="text-red-500 text-sm mt-2">{{ errors.nombre_completo[0] }}</p>
        </div>

        <div class="mb-4">
          <label for="tipo_identificacion" class="block text-sm font-medium mb-1">Tipo de Documento</label>
          <select id="tipo_identificacion" v-model="form.tipo_identificacion" class="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"  required>
            <option value="CC">Cédula de Ciudadanía</option>
            <option value="TI">Tarjeta de Identidad</option>
          </select>
          <p v-if="errors.tipo_identificacion" class="text-red-500 text-sm mt-2">{{ errors.tipo_identificacion[0] }}</p>
        </div>

        <div class="mb-4">
          <label for="numero_documento" class="block text-sm font-medium mb-1">
            Documento <span class="text-red-500">*</span>
          </label>
          <input
            id="numero_documento"
            type="text"
            pattern="\d{3,10}"
            title="El documento debe contener entre 3 y 10 dígitos."
            maxLength="10"
            v-model="form.numero_documento"
            class="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            required
          />
          <p v-if="errors.numero_documento" class="text-red-500 text-sm mt-2">
            {{ errors.numero_documento[0] }}
          </p>
        </div>


        <div class="mb-6 relative">
          <label for="password" class="block text-sm font-medium mb-1">
            Contraseña <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              :type="passwordVisible ? 'text' : 'password'"
              id="password"
              v-model="form.password"
              class="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              @click="togglePasswordVisibility"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password" class="text-red-500 text-sm mt-2">{{ errors.password[0] }}</p>
        </div>

        <div class="mb-6 relative">
          <label for="password_confirmation" class="block text-sm font-medium mb-1">
            Confirmar Contraseña <span class="text-red-500">*</span>
          </label>
          <div class="relative">
            <input
              :type="confirmPasswordVisible ? 'text' : 'password'"
              id="password_confirmation"
             
              class="w-full p-3 bg-gray-700 rounded-md border border-gray-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none pr-10"
              required
            />
            <button
              type="button"
              @click="toggleConfirmPasswordVisibility"
              class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-400"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
          <p v-if="errors.password_confirmation" class="text-red-500 text-sm mt-2">{{ errors.password_confirmation[0] }}</p>
        </div>

        <button type="submit" class="w-full py-3 bg-indigo-600 hover:bg-indigo-500 rounded-md text-lg font-semibold transition-colors">
          Registrarse
        </button>
      </form>
      <p class="mt-8 text-center text-gray-400">
        ¿Ya tienes una cuenta?
        <router-link :to="`/login`" class="text-indigo-500 hover:text-indigo-300">
          Inicia Sesión
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRouter } from 'vue-router';
import { useAuthStore } from '@/stores/auth'

const form = reactive({
  username: "",
  nombre_completo: "",
  numero_documento: "",
  tipo_identificacion: "CC",
  password: ""
});

const errors = ref({});
const passwordVisible = ref(false);
const confirmPasswordVisible = ref(false);
const router = useRouter();
const authStore = useAuthStore()

const togglePasswordVisibility = () => {
  passwordVisible.value = !passwordVisible.value;
};

const toggleConfirmPasswordVisibility = () => {
  confirmPasswordVisible.value = !confirmPasswordVisible.value;
};

const register = async () => {
  try {
    errors.value = {};
    console.log(form);
    // 🔥 Despachamos la acción desde el módulo autentificate
    await authStore.registerUser(form);
    //console.log('response vue', response.userId);
    alert('usuario registrado correctamente ');
    // Redirigir al usuario a la página de inicio de sesión
    router.push('/login');
  } catch (error) {
    console.log(error);
    //alert(error.response?.data?.error || 'Error desconocido');
    if (error.response?.data?.error) {
      errors.value = error.response.data.error;
    }
  }
};
</script>
