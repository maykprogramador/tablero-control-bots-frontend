<template>
  <div class="min-h-screen bg-gradient-to-br from-teal-400 via-cyan-500 to-blue-800 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
    <!-- Modal Fullscreen de Registro de Personas -->
    <Transition
      enter-active-class="transition-all duration-500 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-all duration-300 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div 
        class="fixed inset-0 z-50 bg-white dark:bg-gray-900 overflow-y-auto"
      >
        <!-- Top Bar -->
        <div class="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-sm">
          <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
            <div class="flex items-center gap-4">
              <div class="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <span class="text-white text-xl">📝</span>
              </div>
              <div>
                <h1 class="text-2xl font-bold text-slate-800 dark:text-gray-100">Registro de usuarios a inactivar</h1>
                <p class="text-gray-600 dark:text-gray-400">Gestiona el listado de usuarios para el proceso de inactivación</p>
              </div>
            </div>
            <button 
              @click="closeDeactivationModal"
              class="w-10 h-10 bg-gray-100 dark:bg-gray-800 hover:bg-red-100 dark:hover:bg-red-900/40 rounded-full flex items-center justify-center transition-all duration-200 group"
            >
              <svg class="w-5 h-5 text-gray-600 dark:text-gray-400 group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>

        <!-- Main Content -->
        <div class="max-w-7xl mx-auto px-6 py-8">
          <div class="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <!-- Formulario de Registro -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-8 h-8 bg-blue-100 dark:bg-blue-900/40 rounded-lg flex items-center justify-center">
                  <svg class="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                  </svg>
                </div>
                <h2 class="text-xl font-semibold text-slate-800 dark:text-gray-100">Agregar Nuevo Usuario</h2>
              </div>

              <!-- Error Messages -->
              <div v-if="formErrors.length > 0" class="mb-6 p-4 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 rounded-lg">
                <div class="flex items-center mb-2">
                  <svg class="w-5 h-5 text-red-500 dark:text-red-400 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <h3 class="text-sm font-medium text-red-800 dark:text-red-200">Por favor corrige los siguientes errores:</h3>
                </div>
                <ul class="list-disc list-inside text-sm text-red-700 dark:text-red-300 space-y-1">
                  <li v-for="error in formErrors" :key="error">{{ error }}</li>
                </ul>
              </div>

              <form @submit.prevent="addPerson" class="space-y-6">
                <!-- Nombre -->
                <div>
                  <label class="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                    Nombre completo *
                  </label>
                  <input
                    name="nombre"
                    v-model="form.nombre"
                    pattern="^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$"
                    ref="nombreInput"
                    type="text"
                    minlength="7"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': hasError('nombre') }"
                    placeholder="Ej: Juan Carlos Pérez García"
                  >
                  <p v-if="form.nombre && !$refs.nombreInput?.checkValidity()" class="text-sm text-red-500 dark:text-red-400 mt-1">
                    El nombre solo debe contener letras y espacios.
                  </p>
                </div>

                <!-- Identificación -->
                <div>
                  <label class="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                    Número de identificación *
                  </label>
                  <input
                    name="identificacion"
                    v-model="form.identificacion"
                    type="text"
                    ref="identificacionInput"
                    required
                    minlength="8"
                    pattern="^\d{8,12}$"
                    class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': hasError('identificacion') }"
                    placeholder="Ej: 12345678901"
                  >
                  <p v-if="form.identificacion && !$refs.identificacionInput?.checkValidity()" class="text-sm text-red-500 dark:text-red-400 mt-1">
                    La identificación debe contener solo números (8 a 12 dígitos).
                  </p>
                </div>

                <!-- Cargo -->
                <div>
                  <label class="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                    Cargo *
                  </label>
                  <input
                    name="cargo"
                    v-model="form.cargo"
                    type="text"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': hasError('cargo') }"
                    placeholder="Ej: Gerente de Ventas"
                  >
                </div>

                <!-- Buzón Compartido -->
                <div>
                  <label class="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                    ¿Tiene buzón compartido? *
                  </label>
                  <select
                    v-model="form.buzon_compartido"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': hasError('buzon_compartido') }"
                  >
                    <option value="">Seleccionar...</option>
                    <option value="si">Sí</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <!-- Cuenta a Delegar (condicional) -->
                <Transition
                  enter-active-class="transition-all duration-300 ease-out"
                  enter-from-class="opacity-0 -translate-y-2"
                  enter-to-class="opacity-100 translate-y-0"
                  leave-active-class="transition-all duration-200 ease-in"
                  leave-from-class="opacity-100 translate-y-0"
                  leave-to-class="opacity-0 -translate-y-2"
                >
                  <div v-if="form.buzon_compartido === 'si'">
                    <label class="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                      Cuenta a delegar *
                    </label>
                    <input
                      name="cuenta_delegar"
                      v-model="form.cuenta_delegar"
                      type="text"
                      :required="form.buzon_compartido === 'si'"
                      class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                      :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': hasError('cuenta_delegar') }"
                      placeholder="Ej: delegado@empresa.com"
                    >
                  </div>
                </Transition>
                <!-- Sucursal -->
                <div class="relative">
                  <label class="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                    Sucursal *
                  </label>

                  <!-- Botón del dropdown -->
                  <button
                    type="button"
                    @click="toggleSucursalDropdown"
                    class="w-full flex justify-between items-center px-4 py-3 border-2 border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 transition-all duration-200 bg-white dark:bg-gray-700 dark:text-gray-100"
                  >
                    <span>
                      {{ form.sucursal ? form.sucursal : 'Selecciona una sucursal...' }}
                    </span>
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"/>
                    </svg>
                  </button>

                  <!-- Dropdown -->
                  <div
                    v-if="showSucursalDropdown"
                    class="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                  >
                    <!-- Input búsqueda -->
                    <div class="p-2">
                      <input
                        v-model="searchSucursal"
                        type="text"
                        placeholder="Buscar sucursal..."
                        class="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-500"
                      />
                    </div>

                    <!-- Lista de sucursales -->
                    <ul class="max-h-48 overflow-y-auto">
                      <li
                        v-for="sucursal in filteredSucursales"
                        :key="sucursal.id"
                        @click="selectSucursal(sucursal.nombre)"
                        class="px-4 py-2 text-sm hover:bg-blue-100 dark:hover:bg-blue-900/40 dark:text-gray-200 cursor-pointer"
                      >
                        <span class="font-bold">{{ sucursal.id }}</span> - {{ sucursal.nombre }}
                      </li>
                      <li v-if="filteredSucursales.length === 0" class="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
                        No se encontraron resultados
                      </li>
                    </ul>
                  </div>
                </div>

                <!-- Fecha de Inactivación -->
                <div>
                  <label class="block text-sm font-semibold text-slate-800 dark:text-gray-200 mb-2">
                    Fecha de inactivación *
                  </label>
                  <input
                    v-model="form.fecha_inactivacion"
                    type="date"
                    required
                    class="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 dark:bg-gray-700 dark:text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200"
                    :class="{ 'border-red-500 focus:border-red-500 focus:ring-red-200': hasError('fecha_inactivacion') }"
                  >
                </div>
                <div v-if="botSelected !== 3" class="flex flex-col gap-3">
                  <!-- Botón para subir archivo -->
                  <label
                    for="file-upload"
                    class="flex items-center gap-3 px-6 py-3 bg-[#488aec] hover:bg-[#3a7dd9] text-white text-xs font-bold uppercase rounded-lg shadow-md shadow-[#488aec31] hover:shadow-lg hover:shadow-[#488aec4f] focus:opacity-85 active:opacity-85 transition-all duration-500 cursor-pointer"
                  >
                    <svg
                      aria-hidden="true"
                      stroke="currentColor"
                      stroke-width="2"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      class="w-5 h-5"
                    >
                      <path
                        stroke-width="2"
                        stroke="#ffffff"
                        d="M13.5 3H12H8C6.34315 3 5 4.34315 5 6V18C5 19.6569 6.34315 21 8 21H11M13.5 3L19 8.625M13.5 3V7.625C13.5 8.17728 13.9477 8.625 14.5 8.625H19M19 8.625V11.8125"
                        stroke-linejoin="round"
                        stroke-linecap="round"
                      ></path>
                      <path
                        stroke-linejoin="round"
                        stroke-linecap="round"
                        stroke-width="2"
                        stroke="#ffffff"
                        d="M17 15V18M17 21V18M17 18H14M17 18H20"
                      ></path>
                    </svg>
                    Cargar archivo
                  </label>

                  <!-- Input de archivo oculto -->
                  <input
                    id="file-upload"
                    type="file"
                    class="hidden"
                    ref="fileInputRef"
                    @change="handleFileChange"
                    accept=".pdf,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                  >

                  <!-- Nombre del archivo -->
                  <span v-if="form.archivo?.name" class="text-sm text-gray-600 dark:text-gray-400">
                    Archivo seleccionado: {{ form.archivo.name }}
                  </span>
                </div>
                <!-- Botón Agregar -->
                <button
                  type="submit"
                  class="w-full flex items-center justify-center px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900"
                >
                  <span class="text-lg mr-2">➕</span>
                  Agregar usuario al listado
                </button>
              </form>
            </div>

            <!-- Vista Previa / Lista de Personas -->
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
              <div class="flex items-center justify-between mb-6">
                <div class="flex items-center gap-3">
                  <div class="w-8 h-8 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                    <svg class="w-4 h-4 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path>
                    </svg>
                  </div>
                  <h2 class="text-xl font-semibold text-slate-800 dark:text-gray-100">Lista de Usuarios</h2>
                </div>
                <div class="bg-blue-100 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 px-3 py-1 rounded-full text-sm font-medium">
                  {{ personasInactivacion.length }} {{ personasInactivacion.length === 1 ? 'usuario' : 'usuarios' }}
                </div>
              </div>

              <!-- Lista vacía -->
              <div v-if="personasInactivacion.length === 0" class="text-center py-12">
                <div class="text-gray-400 dark:text-gray-600 text-6xl mb-4">👥</div>
                <h3 class="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">No hay usuarios registrados</h3>
                <p class="text-gray-500 dark:text-gray-400">Agrega usuarios usando el formulario de la izquierda</p>
              </div>

              <!-- Tabla de personas -->
              <div v-else class="overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead class="bg-gray-50 dark:bg-gray-900/50">
                    <tr>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Nombre</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Identificación</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Cargo</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Buzón</th>
                      <th class="px-4 py-3 text-center text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Cuenta</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Fecha</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Archivo</th>
                      <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    <tr 
                      v-for="(persona, index) in personasInactivacion" 
                      :key="index"
                      class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150"
                      :class="{ 'bg-blue-50 dark:bg-blue-900/20': editingIndex === index }"
                    >
                      <td class="px-4 py-4 whitespace-nowrap text-sm lowercase font-medium text-gray-900 dark:text-gray-100">
                        {{ persona.nombre }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {{ persona.identificacion }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {{ persona.cargo }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap">
                        <span 
                          :class="persona.buzon_compartido === 'si' ? 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'"
                          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        >
                          {{ persona.buzon_compartido === 'si' ? 'Sí' : 'No' }}
                        </span>
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                        {{ persona.cuenta_delegar || '-' }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                        {{ formatDate(persona.fecha_inactivacion) }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 text-center">
                        {{ persona.archivo?.name || '-' }}
                      </td>
                      <td class="px-4 py-4 whitespace-nowrap text-sm font-medium">
                        <div class="flex items-center gap-2">
                          <button
                            @click="editPerson(index)"
                            class="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors duration-200"
                            title="Editar"
                          >
                            <span class="text-base">🖊️</span>
                          </button>
                          <button
                            @click="deletePerson(index)"
                            class="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 transition-colors duration-200"
                            title="Eliminar"
                          >
                            <span class="text-base">🗑️</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <!-- Acciones Finales -->
          <div class="mt-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 p-6">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div class="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span class="text-sm">
                  {{ personasInactivacion.length }} {{ personasInactivacion.length === 1 ? 'usuario registrado' : 'usuarios registrados' }} para inactivación
                </span>
              </div>
              
              <div class="flex gap-3">
                <button 
                  @click="closeDeactivationModal"
                  class="px-6 py-3 bg-gray-600 hover:bg-gray-700 dark:bg-gray-700 dark:hover:bg-gray-600 text-white font-semibold rounded-lg transition-colors duration-200 flex items-center gap-2"
                >
                  Cancelar
                </button>
                <button 
                  @click="saveRecords"
                  :disabled="personasInactivacion.length === 0"
                  class="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold rounded-lg transition-all duration-200 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:from-blue-600 disabled:hover:to-blue-700"
                >
                  Guardar registros
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Success Toast -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 translate-x-full"
      enter-to-class="opacity-100 translate-x-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-x-0"
      leave-to-class="opacity-0 translate-x-full"
    >
      <div v-if="showToast" class="fixed top-4 right-4 bg-green-500 dark:bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive, computed, defineProps, onMounted } from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import { useAuthStore } from '@/stores/Autentificate/auth'
import dayjs from 'dayjs'
// UI State
const tableroFunctions = useTableroFunctions()
const authStore = useAuthStore()
const showDeactivationModal = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const editingIndex = ref(-1)
const { onClose, botSelected } = defineProps(['onClose','botSelected'])
//const personasInactivation2 = computed(() => tableroFunctions.formInactivation)
const errores = ref({})
const fileInputRef = ref(null)
// Control del dropdown
const showSucursalDropdown = ref(false);
const searchSucursal = ref("");

onMounted(async () => {
  //console.log(' bot seleccionado: ', botSelected);
  
});

// Form data
const form = reactive({
  nombre: '',
  identificacion: '',
  cargo: '',
  buzon_compartido: '',
  cuenta_delegar: '',
  fecha_inactivacion: '',
  archivo: null,
  sucursal: "" // 👈 aquí guardamos la sucursal seleccionada
})

// Ejemplo de sucursales (en tu caso vendrán del backend)

const sucursales = ref([
  { id: "CAM", nombre: "Clinica Avidanti Manizales" },
  { id: "CAI", nombre: "Clinica Avidanti Ibague" },
  { id: "CASM", nombre: "Clinica Avidanti Santa Marta" },
  { id: "ADC", nombre: "Angiografia de Colombia" },
  { id: "CACV", nombre: "Clinica Avidanti Ciudad Verde" }, // puedes manejar alias CACV si deseas
  { id: "DSZF", nombre: "Diacor Soacha Zona Franca" },
  { id: "CAA", nombre: "Clínica Avidanti Armenia" },
]);

// Filtrar sucursales según búsqueda
const filteredSucursales = computed(() => {
  if (!searchSucursal.value) return sucursales.value;
  return sucursales.value.filter(s =>
    s.nombre.toLowerCase().includes(searchSucursal.value.toLowerCase()) ||
    s.id.toLowerCase().includes(searchSucursal.value.toLowerCase())
  );
});

// Métodos
const toggleSucursalDropdown = () => {
  showSucursalDropdown.value = !showSucursalDropdown.value;
};

const selectSucursal = (sucursal) => {
  form.sucursal = sucursal;
  showSucursalDropdown.value = false; // cerrar al seleccionar
  searchSucursal.value = ""; // resetear búsqueda
};
// funcion para subir archivo 
const handleFileChange = (event) => {
  const file = event.target.files[0]
  if (file) {
    form.archivo = file
    console.log('archivo subido:', form.archivo);
    
    //fileName.value = file.name
  } else {
    form.archivo = null
  }
}

function validarNombre() {
  const nombre = form.nombre.trim()
  const regex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/;

  if (!regex.test(nombre)) {
    errores.value.nombre = 'El nombre solo debe contener letras y espacios';
  } else if (nombre.length < 7) {
    errores.value.nombre = 'El nombre debe tener al menos 7 caracteres';
  } else {
    errores.value.nombre = '';
  }
}

function hasError2(campo) {
  return !!errores.value[campo];
}

// Data arrays
const personasInactivacion = ref([])
const formErrors = ref([])

// Computed
const today = computed(() => {
  const fecha = new Date().toISOString().split('T')[0]
  return fecha
})

// Methods
const openDeactivationModal = () => {
  showDeactivationModal.value = true
  document.body.style.overflow = 'hidden'
}

const closeDeactivationModal = () => {
  // Reset form and errors
  resetForm()
  formErrors.value = []
  editingIndex.value = -1
  onClose()   
}

const resetForm = () => {
  form.nombre = ''
  form.identificacion = ''
  form.cargo = ''
  form.buzon_compartido = ''
  form.cuenta_delegar = ''
  form.fecha_inactivacion = ''
  form.archivo = null

  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const validateForm = () => {
  const errors = []
  
  if (!form.nombre.trim()) {
    errors.push('El nombre es obligatorio')
  }
  
  if (!form.identificacion.trim()) {
    errors.push('La identificación es obligatoria')
  }
  
  if (!form.cargo.trim()) {
    errors.push('El cargo es obligatorio')
  }
  
  if (!form.buzon_compartido) {
    errors.push('Debe seleccionar si tiene buzón compartido')
  }
  
  if (form.buzon_compartido === 'si' && !form.cuenta_delegar.trim()) {
    errors.push('La cuenta a delegar es obligatoria cuando tiene buzón compartido')
  }
  
  if (!form.fecha_inactivacion) {
    errors.push('La fecha de inactivación es obligatoria')
  }
  // validar si selecciono la sucursal
  if (!form.sucursal) {
    errors.push('Debe seleccionar una sucursal')
  }
  
  // funcion para validar si hay un archivo subido
  if (!form.archivo && botSelected !== 3) {
    errors.push('Debe subir un archivo antes de agregar el usuario')
  }

  
  return errors
}

const hasError = (field) => {
  return formErrors.value.some(error => error.toLowerCase().includes(field.replace('_', ' ')))
}

const addPerson = () => {
  const errors = validateForm()
  
  if (errors.length > 0) {
    formErrors.value = errors
    return
  }
  
  // Check for duplicate identification
  const isDuplicate = personasInactivacion.value.some((persona, index) => 
    persona.identificacion === form.identificacion && index !== editingIndex.value
  )
  
  if (isDuplicate) {
    formErrors.value = ['Ya existe una persona con esta identificación']
    return
  }
  
  const personData = {
    nombre: form.nombre.trim().toLowerCase(),
    identificacion: form.identificacion.trim(),
    cargo: form.cargo.trim().toLowerCase(),
    buzon_compartido: form.buzon_compartido,
    cuenta_delegar: form.buzon_compartido === 'si' 
      ? form.cuenta_delegar.trim().toLowerCase() 
      : '',
    fecha_inactivacion: form.fecha_inactivacion,
    archivo: form.archivo,
    sucursal: form.sucursal
  }
  
  if (editingIndex.value >= 0) {
    // Update existing person
    personasInactivacion.value[editingIndex.value] = personData
    showToastMessage('Persona actualizada correctamente')
    editingIndex.value = -1
  } else {
    // Add new person
    personasInactivacion.value.push(personData)
    showToastMessage('Persona agregada al listado')
  }
  
  resetForm()
  formErrors.value = []
}

const editPerson = (index) => {
  const persona = personasInactivacion.value[index]
  
  form.nombre = persona.nombre
  form.identificacion = persona.identificacion
  form.cargo = persona.cargo
  form.buzon_compartido = persona.buzon_compartido
  form.cuenta_delegar = persona.cuenta_delegar
  form.fecha_inactivacion = persona.fecha_inactivacion
  form.archivo = persona.archivo,
  form.sucursal = persona.sucursal
  
  editingIndex.value = index
  formErrors.value = []
  
  // Scroll to form
  document.querySelector('form').scrollIntoView({ behavior: 'smooth' })
}

const deletePerson = (index) => {
  if (confirm('¿Estás seguro de que deseas eliminar esta persona del listado?')) {
    personasInactivacion.value.splice(index, 1)
    showToastMessage('Persona eliminada del listado')
    
    // Reset editing if we were editing this person
    if (editingIndex.value === index) {
      resetForm()
      editingIndex.value = -1
      formErrors.value = []
    } else if (editingIndex.value > index) {
      editingIndex.value--
    }
  }
}

const saveRecords = async() => {
  if (personasInactivacion.value.length === 0) {
    return
  }
  tableroFunctions.setSolicitudInactivacion(personasInactivacion.value)
  console.log('registros guardados en el store: ',tableroFunctions.SolicitudInactivacion);

  //await tableroFunctions.createSolicitud( personasInactivacion.value, authStore.user.user_id, botSelected) // aqui llamamos al metodo del store que nos consumira la API para crear la solicitud
  showToastMessage(`${personasInactivacion.value.length} registros guardados exitosamente`)
  
  // Close modal after a delay
  /*setTimeout(() => {
    closeDeactivationModal()
    personasInactivacion.value = []
  }, 1000)*/
  closeDeactivationModal()
  personasInactivacion.value = []
  tableroFunctions.setExecuteBot(true)
}

function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY')
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}
</script>