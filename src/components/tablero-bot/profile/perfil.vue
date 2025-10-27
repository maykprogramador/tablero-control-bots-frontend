<template>
  <div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
    <div class="max-w-5xl mx-auto space-y-6">
      <!-- Alerta informativa -->
      <div v-if="showUpdateAlert" class="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-md">
        <div class="flex">
          <div class="flex-shrink-0">
            <svg class="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd" />
            </svg>
          </div>
          <div class="ml-3">
            <p class="text-sm text-blue-700">
              Mantén tu información actualizada para una mejor experiencia en la plataforma.
            </p>
          </div>
          <div class="ml-auto pl-3">
            <button @click="showUpdateAlert = false" class="inline-flex rounded-md p-1.5 text-blue-500 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500  transition-colors">
              <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Sección de foto de perfil -->
        <div class="bg-white  rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800  mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Foto de perfil
          </h3>
          
          <div class="flex flex-col lg:flex-row items-center gap-8">
            <div class="relative group">
              <div class="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-orange-400 to-rose-400 p-1 shadow-2xl">
                <div class="w-full h-full rounded-full overflow-hidden bg-white">
                  <img 
                    :src="previewImage || user.foto_perfil" 
                    alt="Foto de perfil" 
                    class="w-full h-full object-cover"
                  />
                </div>
              </div>
              <button
                type="button"
                @click="triggerFileInput"
                class="absolute bottom-2 right-2 p-3 bg-gradient-to-r from-orange-500 to-rose-500 rounded-full text-white shadow-lg hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-4 focus:ring-orange-300 transition-all transform hover:scale-110"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
              <input 
                type="file" 
                ref="fileInput" 
                class="hidden" 
                accept="image/*" 
                @change="handleImageUpload"
              />
            </div>
            
            <div class="flex-1 space-y-4 text-center lg:text-left">
              <div>
                <h4 class="text-xl font-semibold text-gray-800 ">{{ user.nombre }}</h4>
                <p class="text-gray-600  mt-1">{{ capitalizarPrimeraLetra(user.rol) }}</p>
              </div>
              
              <!-- Boton de cambiar foto
              <div class="flex flex-wrap gap-3 justify-center lg:justify-start">
                <button 
                  type="button" 
                  @click="triggerFileInput"
                  class="px-4 py-2 text-sm font-medium border border-gray-300  rounded-lg shadow-sm text-gray-700  bg-white hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500  transition-all"
                >
                  🖼️ Cambiar foto
                </button>
                <button 
                  v-if="previewImage" 
                  type="button" 
                  @click="cancelImageUpload"
                  class="px-4 py-2 text-sm font-medium border border-red-300 dark:border-red-600 rounded-lg shadow-sm text-red-700 dark:text-red-300 bg-white hover:bg-red-50 dark:hover:bg-red-900/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500  transition-all"
                >
                  ❌ Cancelar
                </button>
              </div>-->
            </div>
          </div>
        </div>

        <!-- Información de cuenta (solo lectura) -->
        <div class="bg-white  rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800  mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            Información de cuenta
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre completo -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700  flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Nombre completo
              </label>
              <div class="relative">
                <input
                  type="text"
                  :value="user.nombre"
                  disabled
                  class="block w-full px-4 py-3 border border-gray-200  rounded-lg bg-gray-50  text-gray-600  cursor-not-allowed"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>

            <!-- Email -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700  flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Correo electrónico
              </label>
              <div class="relative">
                <input
                  type="email"
                  :value="user.email"
                  disabled
                  class="block w-full px-4 py-3 border border-gray-200  rounded-lg bg-gray-50  text-gray-600  cursor-not-allowed"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>


            <!-- Rol -->
            <div class="space-y-2">
              <label class="block text-sm font-medium text-gray-700  flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Rol del sistema
              </label>
              <div class="relative">
                <input
                  type="text"
                  :value="user.rol"
                  disabled
                  class="block w-full px-4 py-3 border border-gray-200  rounded-lg bg-gray-50  text-gray-600  cursor-not-allowed"
                />
                <div class="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                  <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Información profesional (editable) -->
        <div class="bg-white  rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 class="text-lg font-semibold text-gray-800  mb-6 flex items-center gap-2">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Información profesional
            <span class="ml-2 text-xs bg-green-100 text-green-700  px-2 py-1 rounded-full">Editable</span>
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Cargo -->
            <div class="space-y-2 md:col-span-2">
              <label for="cargo" class="block text-sm font-medium text-gray-700  flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Cargo
                <span class="text-red-500 ">*</span>
              </label>
              <input
                id="cargo"
                type="text"
                v-model="editableData.cargo"
                class="block w-full px-4 py-3 border border-gray-300  rounded-lg shadow-sm placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500   bg-white text-gray-900  transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500 ': errors.cargo }"
                placeholder="Ej: Gerente de Tecnología"
              />
              <p v-if="errors.cargo" class="mt-1 text-sm text-red-600 ">{{ errors.cargo }}</p>
            </div>

            <!-- Empresa -->
            <div class="space-y-2">
              <label for="empresa" class="block text-sm font-medium text-gray-700  flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Empresa
                <span class="text-red-500 ">*</span>
              </label>
              <input
                id="empresa"
                type="text"
                v-model="editableData.empresa"
                class="block w-full px-4 py-3 border border-gray-300  rounded-lg shadow-sm placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500   bg-white text-gray-900  transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500 ': errors.empresa }"
                placeholder="Ej: TechCorp Solutions"
              />
              <p v-if="errors.empresa" class="mt-1 text-sm text-red-600 ">{{ errors.empresa }}</p>
            </div>

            <!-- Departamento -->
            <div class="space-y-2">
              <label for="departamento" class="block text-sm font-medium text-gray-700  flex items-center gap-2">
                <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Departamento
                <span class="text-red-500 ">*</span>
              </label>
              <input
                id="departamento"
                type="text"
                v-model="editableData.departamento"
                class="block w-full px-4 py-3 border border-gray-300  rounded-lg shadow-sm placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500   bg-white text-gray-900  transition-colors"
                :class="{ 'border-red-500 focus:ring-red-500 focus:border-red-500 ': errors.departamento }"
                placeholder="Ej: Tecnología e Innovación"
              />
              <p v-if="errors.departamento" class="mt-1 text-sm text-red-600 ">{{ errors.departamento }}</p>
            </div>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex flex-col sm:flex-row gap-3 justify-end">
          <button
            type="button"
            @click="resetForm"
            class="px-6 py-3 border border-gray-300  rounded-lg shadow-sm text-sm font-medium text-gray-700  bg-white hover:bg-gray-50  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500  transition-all"
          >
            ↩️ Cancelar cambios
          </button>
          <button
            type="submit"
            class="px-6 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-orange-500 to-rose-500 hover:from-orange-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500  transition-all transform hover:-translate-y-0.5"
          >
            💾 Guardar cambios
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/Autentificate/auth';
import { capitalizarPrimeraLetra } from '@/utils/CapitalizarPalabras';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore)


// Referencias
const fileInput = ref(null);
const previewImage = ref(null);
const showUpdateAlert = ref(true);

// Datos del usuario
// Datos editables
const editableData = reactive({
  cargo: user.value.cargo || '',
  empresa: user.value.empresa || '',
  departamento: user.value.departamento || ''
});

// Copia de los datos originales
const originalEditableData = {
  cargo: user.value.cargo || '',
  empresa: user.value.empresa || '',
  departamento: user.value.departamento || ''
};

// Errores de validación
const errors = reactive({
  cargo: '',
  empresa: '',
  departamento: ''
});

// Función para activar el input de archivo
const triggerFileInput = () => {
  fileInput.value.click();
};

// Función para manejar la subida de imagen
const handleImageUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    // Validar tipo y tamaño de archivo
    const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
      alert('Por favor sube una imagen en formato JPG o PNG.');
      return;
    }
    
    if (file.size > maxSize) {
      alert('La imagen no debe superar los 2MB.');
      return;
    }
    
    // Crear URL para previsualización
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.value = e.target.result;
    };
    reader.readAsDataURL(file);
  }
};

// Función para cancelar la subida de imagen
const cancelImageUpload = () => {
  previewImage.value = null;
  fileInput.value.value = '';
};

// Función para validar el formulario
const validateForm = () => {
  let isValid = true;
  
  // Resetear errores
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // Validar cargo
  if (!editableData.cargo.trim()) {
    errors.cargo = 'El cargo es requerido';
    isValid = false;
  } else if (editableData.cargo.trim().length < 3) {
    errors.cargo = 'El cargo debe tener al menos 3 caracteres';
    isValid = false;
  }
  
  // Validar empresa
  if (!editableData.empresa.trim()) {
    errors.empresa = 'La empresa es requerida';
    isValid = false;
  } else if (editableData.empresa.trim().length < 3) {
    errors.empresa = 'La empresa debe tener al menos 3 caracteres';
    isValid = false;
  }
  
  // Validar departamento
  if (!editableData.departamento.trim()) {
    errors.departamento = 'El departamento es requerido';
    isValid = false;
  } else if (editableData.departamento.trim().length < 3) {
    errors.departamento = 'El departamento debe tener al menos 3 caracteres';
    isValid = false;
  }
  
  return isValid;
};

// Función para manejar el envío del formulario
const handleSubmit = () => {
  if (validateForm()) {
    // Actualizar los datos del usuario con los datos editables
    user.value.cargo = editableData.cargo;
    user.value.empresa = editableData.empresa;
    user.value.departamento = editableData.departamento;
    
    // Si hay una nueva imagen, actualizarla
    if (previewImage.value) {
      user.value.foto_perfil = previewImage.value;
      previewImage.value = null;
    }
    
    // Aquí iría la lógica para enviar los datos al servidor
    console.log('Datos a enviar:', {
      cargo: user.value.cargo,
      empresa: user.value.empresa,
      departamento: user.value.departamento,
      foto_perfil: user.value.foto_perfil
    });
    
    // Simulación de éxito
    alert('✅ ¡Información actualizada correctamente!');
    
    // Actualizar datos originales
    originalEditableData.cargo = editableData.cargo;
    originalEditableData.empresa = editableData.empresa;
    originalEditableData.departamento = editableData.departamento;
  } else {
    alert('⚠️ Por favor corrige los errores en el formulario');
  }
};

// Función para resetear el formulario
const resetForm = () => {
  // Restaurar datos originales
  editableData.cargo = originalEditableData.cargo;
  editableData.empresa = originalEditableData.empresa;
  editableData.departamento = originalEditableData.departamento;
  
  // Resetear errores
  Object.keys(errors).forEach(key => {
    errors[key] = '';
  });
  
  // Cancelar cualquier previsualización de imagen
  cancelImageUpload();
};

// Inicialización
onMounted(() => {
  console.log('Dashboard de perfil cargado correctamente');
});
</script>

<style scoped>
/* Estilos adicionales si son necesarios */
</style>