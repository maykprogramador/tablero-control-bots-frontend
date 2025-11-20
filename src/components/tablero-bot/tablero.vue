<template>
  <div v-if="user" class="min-h-screen bg-white dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300 ">
    <div class="mx-auto rounded-2xl shadow-xl">
      <!-- Header -->
      <HeaderTablero :openModalOption="openModal" v-model:selectedTab="selectedTab"/>
      <!-- Main Content -->
      <perfil v-if="selectedTab === 'perfil'"/>
      <div v-else :class="[selectedTab !== 'notificaciones'? 'grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_350px]': '']" class="bg-slate-50 dark:bg-black transition-colors duration-300 gap-8 sm:p-4 lg:p-10">
        <!-- Left Panel - Monitoring -->
        <div class="space-y-8">
          <!-- NAVBAR -->
          <NavVar v-model:selectedTab="selectedTab"/><!-- aqui se esta enviando el selectedTab a el hijo y con v-model recibe el evento de update que emite el hijo -->
          <!-- Panel de Monitoreo -->
          <div v-if="selectedTab === 'bots'" class="bg-white dark:bg-[#21292eae] dark:border-slate-800 rounded-xl shadow-md p-2 sm:p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100 dark:border-slate-600">
              <div class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white p-3 rounded-lg mr-4 text-xl">
                <Monitor/>
              </div>
              <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">Panel de Monitoreo</h2>
            </div>
            
            
            <!-- Filters -->
            <div class="flex flex-wrap items-end gap-4 mb-5">
              <!-- Filtro Estado -->
              <div class="flex flex-col gap-1 w-full sm:w-auto">
                <label class="text-sm text-gray-600 dark:text-gray-400 font-medium">Estado</label>
                <select 
                  v-model="filters.estado" 
                  class="px-3 py-2 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 duration-300 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]"
                >
                  <option value="">Todos</option>
                  <option value="activo">En línea</option>
                  <option value="error">Error</option>
                  <option value="ejecucion">En Ejecución</option>
                  <option value="pausado">En Pausa</option>
                </select>
              </div>

              <!-- Filtro Nombre -->
              <div class="flex flex-col gap-1 w-full sm:w-56">
                <label class="text-sm text-gray-600 dark:text-gray-400 font-medium">Nombre</label>
                <input 
                  v-model="filters.nombre" 
                  type="text" 
                  placeholder="Buscar bot..." 
                  class="px-3 py-2 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 duration-300 rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A] w-full"
                >
              </div>

              <!-- Botón Nuevo Bot -->
              <div v-if="user.rol === 'admin'" class="w-full sm:w-auto sm:ml-auto">
                <button @click="NuevoBot()" class="w-full sm:w-auto cursor-pointer flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200" >
                  <span class="text-sm mr-2">+</span>
                  Nuevo Bot
                </button>
              </div>
            </div>

            <!-- Bot List -->
            <div class="space-y-4">
              <div v-for="bot in filteredBots" :key="bot.id" class="bg-gray-50 dark:bg-[#21292eae] dark:border-slate-800  rounded-xl p-2 sm:p-5 border-2 border-transparent  transition-all duration-300 cursor-pointer hover:border-[#80006A] hover:bg-blue-50 dark:hover:bg-slate-800  hover:shadow-lg hover:-translate-y-1" >
                <div class="flex justify-between items-center mb-4">
                  <!-- Nombre editable -->
                  <!-- Modo visualización -->
                  <div class="flex items-center gap-2 group">
                    <h3 class="font-semibold text-lg text-slate-800 dark:text-slate-200 group-hover:text-[#80006A] dark:group-hover:text-purple-400 transition-colors duration-200">
                      {{ bot.nombre }}
                    </h3>
                    <div v-if="user.rol === 'admin'" class="space-x-2">
                      <button v-if="user.rol === 'admin'" @click="EditarBot(bot)" class="text-[#80006A] dark:text-purple-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95" title="Editar Bot" >
                        <SquarePen class="w-4 h-4" />
                      </button>
                      <button v-if="user.rol === 'admin'" @click="EliminarBot(bot)" class="text-red-700 dark:text-red-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95" title="Eliminar Bot" >
                        <Trash class="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div class="flex flex-wrap sm:flex-nowrap items-center sm:justify-between gap-2 sm:gap-3">
                    <!-- Procesados / Total -->
                    <div class="flex items-center gap-2 relative group">
                      <!-- DOT que indica cuántas máquinas tiene el bot -->
                      <span v-if="bot.Maquinas.length > 1" class="absolute -top-2 -right-2 bg-[#80006A] text-white font-bold text-[10px] px-1.5 py-0.5 rounded-full shadow" >
                        {{ bot.Maquinas.length - 1 }}
                      </span>

                      <!-- Procesados / Total -->
                      <div class="px-3 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-700">
                        <span class="text-xs sm:text-sm font-semibold text-blue-800 dark:text-blue-300">
                          {{ getMaquinaPrincipal(bot)?.procesados }} /
                          {{ getMaquinaPrincipal(bot)?.total_registros }}
                        </span>
                      </div>

                      <!-- Porcentaje -->
                      <p class="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                        {{ obtener_porcentaje( getMaquinaPrincipal(bot)?.procesados, getMaquinaPrincipal(bot)?.total_registros ) }}%
                      </p>
                      <!-- MENU DESPLEGABLE DE OTRAS MÁQUINAS -->
                      <!-- MENU DESPLEGABLE DE OTRAS MÁQUINAS -->
                      <div v-if="getOtrasMaquinas(bot).length > 0" class="absolute hidden group-hover:block left-0 bottom-full mb-2 bg-white dark:bg-slate-800 shadow-lg rounded-xl p-3 w-64 z-50 border border-gray-200 dark:border-slate-700" >
                        <p class="font-semibold text-sm mb-3 text-slate-700 dark:text-slate-300">Otras máquinas</p>
                        <div v-for="m in getOtrasMaquinas(bot)"  :key="m.id" class="flex flex-col gap-2 bg-gray-50 dark:bg-slate-700/30 p-3 rounded-xl mb-2 last:mb-0" >
                          <!-- TOP: ID + ESTADO -->
                          <div class="flex items-center justify-between">
                            <p class="text-xs font-semibold text-slate-600 dark:text-slate-300">
                              Máquina {{ m.id }}
                            </p>

                            <span
                              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold"
                              :class="getStatusBadgeClass(m.estado)"
                            >
                              <span :class="getStatusDotClass(m.estado)" class="w-1.5 h-1.5 rounded-full mr-1.5"></span>
                              {{ getStatusText(m.estado) }}
                            </span>
                          </div>

                          <!-- MIDDLE: PROCESADOS / TOTAL -->
                          <div class="flex items-center justify-between">
                            <div class="px-3 py-0.5 rounded-full text-xs bg-blue-100 dark:bg-blue-900/40">
                              <span class="text-xs font-semibold text-blue-800 dark:text-blue-300">
                                {{ m.procesados }} / {{ m.total_registros }}
                              </span>
                            </div>

                            <p class="px-3 py-0.5 rounded-full text-xs font-semibold bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">
                              {{ obtener_porcentaje( m.procesados, m.total_registros ) }}%
                            </p>
                          </div>

                          <!-- NEW: ULTIMA EJECUCIÓN -->
                          <div class="flex flex-col mt-1">
                            <span class="text-[10px] text-gray-600 dark:text-gray-400 font-medium">Última ejecución</span>
                            <span class="text-xs font-semibold text-slate-800 dark:text-slate-200">
                              {{ formatDate(m.updatedAt) }}
                            </span>
                          </div>
                        </div>
                      </div>


                    </div>
                    <!-- Estado -->
                    <span 
                      :class="getStatusBadgeClass(getMaquinaPrincipal(bot)?.estado)"
                      class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    >
                      <span 
                        :class="getStatusDotClass(getMaquinaPrincipal(bot)?.estado)" 
                        class="w-1.5 h-1.5 rounded-full mr-1.5"
                      ></span>
                      {{ getStatusText(getMaquinaPrincipal(bot)?.estado) }}
                    </span>
                  </div>
                </div>

                <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div class="flex flex-col gap-1">
                    <span class="text-xs text-gray-600 dark:text-gray-400 font-medium">Última ejecución</span>
                    <span class="font-semibold text-slate-800 dark:text-slate-200">{{ formatDate(getMaquinaPrincipal(bot).updatedAt) }}</span>
                  </div>
                  <div class="flex flex-col gap-1 ml-auto">
                    <div class="flex items-center gap-2 flex-wrap">
                      <!-- Total registros -->
                      <div class="px-3 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 border-gray-200 dark:border-gray-600">
                        <span class="text-xs font-medium text-gray-600 dark:text-gray-300">Total: </span>
                        <span class="text-xs font-semibold text-gray-800 dark:text-gray-100">{{ getMetricas(bot.id).total_registros }}</span>
                      </div>
                      
                      <!-- Exitosos -->
                      <div class="px-3 py-0.5 rounded-full bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-700">
                        <span class="text-xs font-medium text-green-600 dark:text-green-400">Exitosos: </span>
                        <span class="text-xs font-semibold text-green-800 dark:text-green-300">{{ getMetricas(bot.id).exito }}</span>
                      </div>
                      
                      <!-- Pendientes -->
                      <div v-if="!BOTS_SIN_PENDIENTES.includes(BOT_MAP[bot.id])" class="px-3 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 border-amber-200 dark:border-amber-700">
                        <span class="text-xs font-medium text-amber-600 dark:text-amber-400">Pendientes: </span>
                        <span class="text-xs font-semibold text-amber-800 dark:text-amber-300">{{ getMetricas(bot.id).pendiente ||  getMetricas(bot.id).proceso}}</span>
                      </div>
                      
                      <!-- Error -->
                      <div class="px-3 py-0.5 rounded-full bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-700">
                        <span class="text-xs font-medium text-red-600 dark:text-red-400">Error: </span>
                        <span class="text-xs font-semibold text-red-800 dark:text-red-300">{{ getMetricas(bot.id).error }}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div class="flex gap-3">
                  <button
                    @click="openModal(bot.id, 'detalles')"
                    class="px-4 py-2 cursor-pointer bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
                  >
                    Ver detalles
                  </button>
                  <button
                    @click="openModal(bot.id, 'logs')"
                    class="px-4 py-2 cursor-pointer bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg dark:hover:bg-slate-700"
                  >
                    Logs
                  </button>
                </div>
              </div>
            </div>
          </div>
          <!-- Registros Solicitados Section -->
          <div v-if="selectedTab === 'solicitudes'"> 
            <RegistrosSection />
          </div>

          <div v-if="selectedTab === 'notificaciones'"> 
            <NotificacionDashboard :openModalOption="openModal" v-model:selectedTab="selectedTab"/>
          </div>
          <!-- Registros Solicitados Section
          <div v-if="selectedTab === 'historias'"> 
            <DashboardHistoriaClinica />
          </div> -->
        </div>
        <!-- Right Panel -->
        <div v-if="selectedTab !== 'notificaciones'" class="space-y-8">
          <!-- Torre de Control -->
          <div class="bg-white dark:bg-[#21292eae] dark:border-slate-800 rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100 dark:border-slate-600">
              <div class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white p-3 rounded-lg mr-4 text-xl">
                <Cog/> 
              </div>
              <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">Torre de Control</h2>
            </div>
            
            <!-- Seleccionar Bot -->
            <div class="mb-6">
              <h3 class="text-lg text-slate-800 dark:text-slate-200 mb-3">Seleccionar Bot</h3>
              <select 
                v-model="control.selectedBot" 
                @change="resetControlSelected()"
                class="w-full px-3 py-2.5 border-2 border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 duration-300 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]"
              >
                <option value="">Seleccionar...</option>
                <option v-for="bot in bots" :key="bot.id" :value="bot.id">{{ bot.nombre }}</option>
              </select>
            </div>

            <!-- Si los bots son de envio masivo o carga de archivo  -->
            <div v-if="BOTS_MASIVOS.includes(selectedBotName)"  class="mb-6">
              <div class="mb-4">
                <button
                  @click="descargarFormato"
                  class="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 border border-blue-300 rounded-lg text-sm font-medium transition-all duration-300 hover:bg-blue-200 hover:shadow-md"
                >
                  📥 Descargar formato de archivo
                </button>
              </div>
              <h3 class="text-lg text-slate-800 dark:text-slate-200 mb-3">Cargar Archivo</h3>
              <!-- Botón para descargar formato -->
              <!-- Funcionalidad de cargar archivo que arrastre y solte en el cuadro -->
              <div
                class="border-2 border-dashed border-[#80006A] rounded-lg p-5 text-center bg-gray-50 dark:bg-[#21292eae] dark:border-slate-700  transition-all duration-300 hover:bg-blue-50 dark:hover:bg-slate-800 hover:border-[#80006A]"
                @dragover.prevent="handleDragOver"
                @dragleave="handleDragLeave"
                @drop.prevent="handleDrop"
                :class="{ 'bg-blue-100 border-blue-700': isDragging }"
              >
                <div class="text-2xl mb-2">📁</div>

                <div class="text-gray-700 dark:text-gray-400 mb-3">
                  {{ control.fileName || 'Arrastrar archivo aquí o usar el botón' }}
                </div>

                <input
                  type="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  class="hidden"
                  accept=".pdf,.xlsx,application/pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                />

                <button
                  type="button"
                  @click="triggerFileSelect"
                  class="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-slate-800 dark:text-slate-200 rounded-lg text-sm font-medium transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:bg-gray-300 dark:hover:bg-gray-600"
                >
                  Seleccionar archivo
                </button>
              </div>
            </div>
            <!-- Botón de Registro solo para los bots de retiro de usuario -->
            <div class="mb-6">
              <button
                v-if="BOTS_RETIRO.includes(selectedBotName)"
                @click="openDeactivationModal"
                class="w-full cursor-pointer flex items-center justify-center px-4 py-3 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-orange-200"
              >
                <span class="text-lg mr-2">📝</span>
                Registrar personas a inactivar
              </button>
            </div>

            <!-- funcionalidad para el soporte de patologias-->
            <div v-if="selectedBotName === BOT_TYPES.SOPORTE_PATOLOGIA" class="max-w-md mx-auto p-6 bg-white dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300  rounded-xl shadow-lg">
              <h2 class="text-xl font-bold mb-4 text-gray-800 dark:text-slate-200">
                Selecciona una fecha
              </h2>

              <Datepicker
                v-model="selectedDate"
                :day-class="getDayClass"
                :enable-time-picker="false"
                :disabled-dates="isDisabled"
                auto-apply
                inline
                @update:model-value="handleDateSelect"
              />

              <p v-if="selectedDate" class="mt-4 text-gray-700 dark:text-gray-400 text-center">
                Fecha seleccionada:
                <strong>{{ selectedDate.toLocaleDateString() }}</strong>
              </p>
            </div>

            <!-- Execute Button -->
            <button
              @click="ejecutarBot()"
              :disabled="!executeBot"
              :class="[
                'w-full py-4 text-white rounded-xl text-lg font-semibold transition-all duration-300',
                executeBot
                  ? 'cursor-pointer bg-gradient-to-r from-green-500 to-green-600 hover:-translate-y-1 hover:shadow-lg hover:shadow-green-500/30'
                  : 'cursor-not-allowed bg-gray-400'
              ]"
            >
              🚀 Ejecutar Bot
            </button>

            <!-- Status Summary -->
            <div class="bg-gray-50 dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300 rounded-lg p-4 mt-4">
              <h4 class="font-semibold text-slate-800 dark:text-slate-200 mb-2">Estado de Ejecución</h4>

              <p class="text-sm text-gray-700 dark:text-gray-400 mb-1">
                <!-- Si hay bot seleccionado -->
                <template v-if="control.selectedBot">
                  <span class="flex flex-col">
                    <span>✅ {{ selectedBotData.nombre }} listo</span>
                    <!-- Mostrar estado dinámico según condiciones -->
                    <span v-if="botEstado === 'pendiente'">⏳ Pendiente Formulario</span>
                    <span v-if="botEstado === 'ejecutable'">✅ Formulario listo</span>
                    <span v-if="botEstado === 'ejecutable'">✅ Bot Listo para ejecución</span>
                    <span v-if="botEstado === 'pendiente_fecha'">⏳ Pendiente Fecha</span>
                    <span v-if="botEstado === 'ejecutable_p'">✅ Bot Listo para ejecución</span>
                  </span>
                  <!-- Archivo -->
                  <p v-if="botEstado === 'archivo'" class="text-sm text-gray-700 dark:text-gray-400 mb-1">
                    📄 Archivo: {{ control.fileName || 'No seleccionado' }}
                  </p>
                </template>
                <!-- Si no hay bot seleccionado -->
                <template v-else>
                  ⏳ Ningún bot seleccionado
                </template>
              </p>
              
            </div>
          </div>

          <!-- Control de Usuarios -->
          <div v-if="user.rol === 'admin'" class="bg-white dark:bg-[#21292eae] dark:border-slate-800  rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100 dark:border-slate-600">
              <div class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white p-3 rounded-lg mr-4 text-xl">
                <UserCog /> 
              </div>
              <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">Control de Usuarios</h2>
            </div>
            
            <div class="space-y-4">
              <div>
                <label class="block text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Rol actual</label>
                <input type="text" :value="formatearRol(user.rol)" readonly class="w-full px-3 py-2 border-2 border-gray-200 dark:border-slate-700 dark:bg-slate-800 text-slate-800 dark:text-slate-200  transition-colors duration-300 rounded-lg bg-gray-100 cursor-default" />
              </div>
              <!-- Botón para abrir modal de gestión -->
              <button
                v-if="user.rol === 'admin'"
                @click="openUserManagementModal"
                class="w-full cursor-pointer flex items-center justify-center px-4 py-2.5 border-2 border-[#92658b] text-[#80006A] rounded-lg font-medium hover:bg-[#a789a275] hover:border-[#a789a254] transition-all duration-200 group"
              >
                <svg class="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                Ver Usuarios
              </button>
            </div>
          </div>
          <!-- Configuración 
          <div class="bg-white dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300  rounded-xl shadow-md p-6 border border-gray-100 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
            <div class="flex items-center mb-5 pb-4 border-b-2 border-gray-100">
              <div class="bg-gradient-to-r from-[#A65C99] to-[#80006A] text-white p-3 rounded-lg mr-4 text-xl">
               <Bolt />
              </div>
              <h2 class="text-xl font-semibold text-slate-800 dark:text-slate-200">Configuración</h2>
            </div>
            
            <!-- Parámetros por Bot 
            <div class="bg-gray-50 dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300 rounded-lg p-4 mb-4">
              <h4 class="font-semibold text-slate-800 dark:text-slate-200 mb-3">Parámetros por Bot</h4>
              <div class="space-y-3">
                <div>
                  <label class="block text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Timeout (segundos)</label>
                  <input 
                    v-model="config.timeout" 
                    type="number" 
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]"
                  >
                </div>
                <div>
                  <label class="block text-sm text-gray-600 dark:text-gray-400 font-medium mb-1">Reintentos</label>
                  <input 
                    v-model="config.retries" 
                    type="number" 
                    class="w-full px-3 py-2 border-2 border-gray-200 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-[#80006A] focus:border-[#80006A]"
                  >
                </div>
              </div>
            </div>

            <!-- Reglas de Ejecución 
            <div class="bg-gray-50 dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300 rounded-lg p-4 mb-4">
              <h4 class="font-semibold text-slate-800 dark:text-slate-200 mb-3">Reglas de Ejecución</h4>
              <div class="space-y-3">
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-700 dark:text-gray-400">Ejecutar cada lunes</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="config.weeklyExecution" type="checkbox" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-700 dark:text-gray-400">Notificaciones por email</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="config.emailNotifications" type="checkbox" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div class="flex justify-between items-center">
                  <span class="text-sm text-gray-700 dark:text-gray-400">Auto-reiniciar en errores</span>
                  <label class="relative inline-flex items-center cursor-pointer">
                    <input v-model="config.autoRestart" type="checkbox" class="sr-only peer">
                    <div class="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white dark:bg-[#21292eae] dark:border-slate-700 transition-colors duration-300  after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>
          </div>-->
        </div>
      </div>
    </div>
    <!-- Modals -->
    <ModalNewBot v-if="showModalNewBot && user.rol === 'admin'" :bot="botSelected" @close="showModalNewBot = false"/>
    <DashboardHistoriaClinica v-if="showModalHistoriaClinica" :bot="botSelected" :onclose="closeModalHistoriaCLinica"/>
    <DashboardAutorizaciones v-if="showModalAutorizaciones" :bot="botSelected" @close="showModalAutorizaciones = false"/>
    <DetailsModal v-if="isModalOpen" :bot="botSelected"/>
    <ControlUsersModal v-if="isModalControlUsersOpen" :onClose="closeModal"/>
    <FormDesactivationPerson v-if="showDeactivationModal" :onClose="closeModalForm" :botSelected="control.selectedBot"/>
    <LogModal v-if="isLogsModalOpen" :bot="botSelected" @close="isLogsModalOpen = false"/>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch} from 'vue'
import { storeToRefs } from 'pinia';
import { useTableroFunctions } from '@/stores/tablero-functions'
import DetailsModal from './Details-Modal.vue'
import ControlUsersModal from './Control-Users-Modal.vue';
import FormDesactivationPerson from './Form-Desactivation-Person.vue';
import RegistrosSection from './Registros-section.vue';
import NavVar from './Nav-var.vue';
import { LogOut, Monitor, Cog, UserCog, Bolt, SquarePen, Trash  } from 'lucide-vue-next';
import { useAuthStore } from '@/stores/Autentificate/auth';
import { useRouter } from 'vue-router'
import dayjs from 'dayjs'
import DashboardHistoriaClinica from './Dashboard-Historia-Clinica.vue';
import HeaderTablero from './Header-tablero.vue';
import NotificacionDashboard from './Notificacion-Dashboard.vue';
import perfil from './profile/perfil.vue';
import LogModal from './Log-Modal.vue';
import Datepicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import ModalNewBot from './Modal-New-Bot.vue';
import DashboardAutorizaciones from './autorizacion/Dashboard-Autorizaciones.vue';

// Stores--------------------------------------------------------------------------------------
const authStore = useAuthStore()
const router = useRouter()
const tableroFunctions = useTableroFunctions()
const { metricasBots } = storeToRefs(tableroFunctions)
//variables computed-----------------------------------------------------------------------------
const user = computed(() => authStore.user)
const bots = computed(() => tableroFunctions.bots)
const isModalOpen = computed(() => tableroFunctions.isModalOpen)
const provider = computed(() => authStore.provider) 
const formInactivation = computed(() => tableroFunctions.SolicitudInactivacion)
const executeBot = computed(() => tableroFunctions.executeBot)
const selectedBotName = computed(() => BOT_MAP[control.selectedBot] || null);
// Variables reactivas--------------------------------------------------------------------------------------
const botSelected = ref(null)
const fileInput = ref(null)
const isDragging = ref(false)
const isModalControlUsersOpen = ref(false)
const showDeactivationModal = ref(false)
const selectedTab = ref('bots')
const showModalHistoriaClinica = ref(false)
const showModalAutorizaciones = ref(false)
const showModalNewBot = ref(false)
const isLogsModalOpen = ref(false)
const botOptions = [1, 2, 3]
const fechasError = ref([])
const selectedLogId = ref(null)
const botEnEdicion = ref(null)
const nombreEditado = ref('')

// ENUMERACION DE LOS BOTS --------------------------------------------------------------------------------------------------------------------------------
const BOT_TYPES = Object.freeze({
  RETIRO_USUARIO_AVIDANTI: 'RETIRO_USUARIO_AVIDANTI',
  RETIRO_USUARIO_ODO: 'RETIRO_USUARIO_ODO',
  AUTOMATIZACION_FACTURAS: 'AUTOMATIZACION_FACTURAS',
  MASIVO_AVIDANTI: 'MASIVO_AVIDANTI',
  MASIVO_ODO: 'MASIVO_ODO',
  DESCARGA_HC: 'DESCARGA_HC',
  ENVIO_HC: 'ENVIO_HC',
  SOPORTE_PATOLOGIA: 'SOPORTE_PATOLOGIA',
  RETIRO_USUARIO_GOMEDYS: 'RETIRO_USUARIO_GOMEDYS',
  AUTOMATIZACION_AUTORIZACIONES: 'AUTOMATIZACION_AUTORIZACIONES'
});
const BOT_MAP = {
  1: BOT_TYPES.RETIRO_USUARIO_AVIDANTI,
  2: BOT_TYPES.AUTOMATIZACION_FACTURAS,
  3: BOT_TYPES.RETIRO_USUARIO_ODO,
  4: BOT_TYPES.MASIVO_AVIDANTI,
  5: BOT_TYPES.MASIVO_ODO,
  6: BOT_TYPES.DESCARGA_HC,
  7: BOT_TYPES.ENVIO_HC,
  8: BOT_TYPES.SOPORTE_PATOLOGIA,
  9: BOT_TYPES.RETIRO_USUARIO_GOMEDYS,
  10: BOT_TYPES.AUTOMATIZACION_AUTORIZACIONES
};
const BOTS_MASIVOS = [
  BOT_TYPES.MASIVO_AVIDANTI,
  BOT_TYPES.MASIVO_ODO,
  BOT_TYPES.DESCARGA_HC,
];

const BOTS_RETIRO = [
  BOT_TYPES.RETIRO_USUARIO_AVIDANTI,
  BOT_TYPES.AUTOMATIZACION_FACTURAS,
  BOT_TYPES.RETIRO_USUARIO_ODO,
];

const BOTS_SIN_PENDIENTES = [
  BOT_TYPES.RETIRO_USUARIO_AVIDANTI,
  BOT_TYPES.SOPORTE_PATOLOGIA,
  BOT_TYPES.RETIRO_USUARIO_ODO,
  BOT_TYPES.RETIRO_USUARIO_GOMEDYS
];

//--------------------------------------------------------------------------------------------------------------------------------
// funciones ---------------------------------------------------------------------------------------------------------------------
//verificar si el usuario esta autentificado
const checkSession = async () => { 
  try {
    await authStore.verifyAuthUser()
    if (user.value) {
      //console.log('Sesión verificada:', user.value.user_id, 'provider: ',provider.value)
      loadBots()
    } else {
      //console.log('No hay usuario autenticado')
      alert('No estas autentificado o su sesion ha expirado.')
    }
  } catch (err) {
    console.error('Error al verificar la sesión:', err)
    router.push('/')
    alert('No estas autentificado o su sesion ha expirado.')
    
  }
}

onMounted(async () => {
  checkSession();
  /*await Promise.all(
    bots.value.map(bot => tableroFunctions.loadRegistros({ bot_id: bot.id }))
  );*/
});

const getMaquinaPrincipal = (bot) => {
  return bot.Maquinas?.[0] || null;
};

const getOtrasMaquinas = (bot) => {
  return bot.Maquinas?.length > 1 ? bot.Maquinas.slice(1) : [];
};

const obtener_porcentaje = (procesados, total) => {
  if (!total || total === 0) return 0;
  return Math.round((procesados / total) * 100);
};

// funcion para filtrar los bots 
const filteredBots = computed(() => {
  return bots.value.filter(bot => {
    const matchesStatus = !filters.estado || bot.estado === filters.estado
    const matchesName = !filters.nombre || bot.nombre.toLowerCase().includes(filters.nombre.toLowerCase())
    return matchesStatus && matchesName
  })
})

// funcion para obtener la metrica del bot_id
function getMetricas(botId) {
  return metricasBots.value.find(m => m.bot_id === botId) || {
    exito: 0, error: 0, pendiente: 0, proceso: 0, procesados: 0, total_registros: 0
  };
}

// funcion para editar bot
const EditarBot = (bot) => {
  botSelected.value = bot
  showModalNewBot.value = true
  //console.log('bot seleccionado: ',botSelected.value)
}
// funcion para eliminar bot
const EliminarBot = (bot) => {
  const confirmar = confirm(`¿Estás seguro de eliminar el bot "${bot.nombre}"?`)
  if (!confirmar) return
  tableroFunctions.deleteBot(bot.id)
}

// funcion para crear nuevo bot
const NuevoBot = () => {
  botSelected.value = null
  showModalNewBot.value = true
  //console.log('bot seleccionado: ',botSelected.value)
}


// Estado del bot basado en condiciones esta funcion es para la parte de torre de control en la parte estado de Ejecucion
const botEstado = computed(() => {
  if (BOTS_RETIRO.includes(selectedBotName.value)){
    if (formInactivation.value.length === 0) return 'pendiente'

    if (formInactivation.value.length > 0) return 'ejecutable'
    return null
  }
    
  if (BOTS_MASIVOS.includes(selectedBotName.value) && !control.archivo) {
    return 'archivo'
  }

  if (selectedBotName.value === BOT_TYPES.SOPORTE_PATOLOGIA ) {
    if (!selectedDate.value) return 'pendiente_fecha'
    if (selectedDate.value) return 'ejecutable_p'
  }
})
const filters = reactive({
  date: '2025-01-28',
  estado: '',
  nombre: ''
})

const selectedBotData = computed(() => {
  return bots.value.find(bot => bot.id === control.selectedBot) || null
})

// funcion para abrir modal de nuevo bot

function triggerFileSelect() {
  fileInput.value.click()
}

// Cuando arrastramos encima
function handleDragOver() {
  isDragging.value = true
}

// Cuando salimos sin soltar
function handleDragLeave() {
  isDragging.value = false
}

// Cuando soltamos el archivo
function handleDrop(event) {
  isDragging.value = false
  const file = event.dataTransfer.files[0]
  console.log('Archivo soltado:', file);
  
  validateAndSetFile(file)
}

// Cuando seleccionamos desde el botón
function handleFileChange(event) {
  const file = event.target.files[0]
  if (file) {
    validateAndSetFile(file)
  }
}

// Validación del archivo
function validateAndSetFile(file) {
  const allowedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  if (!allowedTypes.includes(file.type)) {
    alert('Archivo no válido. Solo se aceptan PDF o Excel (.xlsx)')
    control.value.fileName = ''
    control.value.archivo = null
    return
  }
  console.log('archivo en validateandserfile: ',file);
  
  control.fileName = file.name
  control.archivo = file
  tableroFunctions.setExecuteBot(true)
}

const control = reactive({
  selectedBot: '',
  processingMode: 'normal',
  fileName: '',
  archivo: null // aquí se guarda el archivo
})

//  Watch que se activa al cambiar el bot seleccionado
watch(() => selectedBotName.value,
  async (newVal) => {
    if (newVal === BOT_TYPES.SOPORTE_PATOLOGIA) {
      loadFechasPatologia()
    }
  }
)

const loadFechasPatologia = async () => {
  try {
    fechasError.value = await tableroFunctions.LoadFechasSoportePatologia()
    //console.log('Fechas recibidas del backend:', data)

  } catch (err) {
    console.error('❌ Error al obtener fechas:', err)
  }
}
// fecha seleccionada
const selectedDate = ref(null)

// Fechas desde el backend (formato YYYY-MM-DD)
const fechasListo = ['2025-10-22', '2025-10-26']

// Asignar clases según el estado
function getDayClass(date) {
  if (!date) return ''

  const d = date.toISOString().split('T')[0]

  // Busca si existe un registro con esa fecha
  const log = fechasError.value.find(f => f.fecha === d)

  if (log) return 'bg-red-500 text-white rounded-full' // marcar en rojo

  // Ejemplo si luego agregas fechas “listas”
  // if (fechasListo.value.find(f => f.fecha === d)) return 'bg-green-500 text-white rounded-full'
  return ''
}

// Deshabilitar días que NO estén en fechasError
function isDisabled(date) {
  const d = date.toISOString().split('T')[0]
  return !fechasError.value.some(f => f.fecha === d)
}

//  Dispara el bot de patologias al seleccionar una fecha
async function handleDateSelect(date) {
  if (!date) return

  const fechaSeleccionada = date.toLocaleDateString('sv-SE').split('T')[0] // formato YYYY-MM-DD en fecha local
  const logSeleccionado = fechasError.value.find(f => f.fecha === fechaSeleccionada)

  if (logSeleccionado) {
    selectedLogId.value = logSeleccionado.id
    console.log('✅ Log seleccionado:', selectedLogId.value)
    tableroFunctions.setExecuteBot(true);
  } else {
    console.warn('⚠️ No hay log con error para esa fecha')
  }
}


// funcion para cargar los bots 
const loadBots = async() => { 
  try {
    await tableroFunctions.loadbots({ user_id: user.value.user_id, rol: user.value.rol })
    console.log('Bots cargados:', bots.value);
    
  } catch (err) {
    console.error('Error al cargar los bots:', err)
  }
}

const ejecutarBot = async () => { 
  //console.log('ejecutar bot: ', formInactivation.value);

  if (formInactivation.value !== null && formInactivation.value.length > 0) {
    //console.log('registros a inactivar: ', formInactivation.value);
    if(user.value.cargo){
      try {
        await tableroFunctions.createSolicitud(formInactivation.value, authStore.user.user_id, control.selectedBot);
        tableroFunctions.setSolicitudInactivacion([]);
        alert('Registro guardado satisfactoriamente');
        tableroFunctions.setExecuteBot(false);
      } catch (error) {
        //console.log(error.message); //  aquí captura el mensaje
        alert(error.message);       //  y lo muestra en el alert
      }
    }else{
      alert('Por favor ingrese su cargo antes de continuar');
      selectedTab.value = 'perfil';
    }
  }

  if (control.archivo != null) {
    console.log('archivo a procesar: ', control.archivo);
  }
  // Lógica para ejecutar el bot de patologias aqui
  if (selectedBotName.value === BOT_TYPES.SOPORTE_PATOLOGIA && selectedDate.value) {
    const fechaSeleccionada = selectedDate.value.toLocaleDateString('sv-SE').split('T')[0]
    try {
      await tableroFunctions.activateSoportePatologiaBot(selectedLogId.value, fechaSeleccionada)
      // actualizar la fecha de error para que no se pueda volver a seleccionar
      fechasError.value = fechasError.value.filter(f => f.id !== selectedLogId.value)
      selectedDate.value = null
      selectedLogId.value = null
      tableroFunctions.setExecuteBot(false);
      alert('Bot de Soporte de Patologías activado para la fecha ' + fechaSeleccionada)
    } catch (error) {
      alert('Ocurrió un error al activar el bot')
    }
  }
};



// Methods
const openDeactivationModal = () => {
  showDeactivationModal.value = true

}

const openUserManagementModal = async () => {
  isModalControlUsersOpen.value = true
}

const closeModal = () => {
  isModalControlUsersOpen.value = false
}

const closeModalForm = () => {
  showDeactivationModal.value = false
}

const openModalHistoriaClinica = () => {
  showModalHistoriaClinica.value = true
}

const openModalAutorizaciones = () => {
  showModalAutorizaciones.value = true
}

// funcion para cerrar el modal de historia clinica
const closeModalHistoriaCLinica = () => {
  showModalHistoriaClinica.value = false
}

function descargarFormato() {
  tableroFunctions.descargarFormato()
}


function resetControlSelected () {
  control.fileName = ''
  control.archivo = null // reiniciar archivo
  selectedDate.value = null
  selectedLogId.value = null
  tableroFunctions.setSolicitudInactivacion([])
  tableroFunctions.setExecuteBot(false)
}

/*const obtener_porcentaje = (procesados, total) => {
  if (total === 0) return 0
  return Math.round((procesados / total) * 100)
}*/

//funcion para formatear la fecha en formato 'DD/MM/YYYY HH:mm'
function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY HH:mm')
}


const config = reactive({
  timeout: 300,
  retries: 3,
  weeklyExecution: true,
  emailNotifications: false,
  autoRestart: true,
  userRole: 'admin'
})


const openModal = (bot_id, tipo) => {
  botSelected.value = bots.value.find(bot => bot.id === bot_id)
  if (tipo === 'detalles'){
    if (botSelected.value.id === 7) {
      openModalHistoriaClinica()
      return 
    }
    if (botSelected.value.id === 10) {
      openModalAutorizaciones()
      return 
    }

    tableroFunctions.openModal()
    //console.log('isopnemodal: ', tableroFunctions.isModalOpen );
  }
  if (tipo === 'logs'){
    isLogsModalOpen.value = true
  }
  
}

const formatearRol = (rol) => {
  switch (rol) {
    case 'admin': return 'Administrador';
    case 'usuario': return 'Usuario';
    case 'supervisor': return 'Supervisor';
    default: return rol;
  }
};

// Helper functions
const getStatusClass = (status) => {
  const classes = {
    activo: 'bg-green-100 text-green-800',
    error: 'bg-red-100 text-red-800',
    ejecucion: 'bg-yellow-100 text-yellow-800',
    pausado: 'bg-blue-100 text-blue-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

const getStatusText = (status) => {
  const texts = {
    activo: 'En linea',
    error: 'Error',
    ejecucion: 'En ejecucion',
    pausado: 'En pausa'
  }
  return texts[status] || 'Desconocido'
}


const getStatusBadgeClass = (estado) => {
  const classes = {
    activo: 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300',
    error: 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300',
    ejecucion: 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-300'
  }
  return classes[estado] || 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400'
}

const getStatusDotClass = (estado) => {
  const classes = {
    activo: 'bg-green-500 dark:bg-green-400',
    error: 'bg-red-500 dark:bg-red-400',
    ejecucion: 'bg-yellow-500 dark:bg-yellow-400'
  }
  return classes[estado] || 'bg-gray-500 dark:bg-gray-400'
}
</script>
<!-- CSS adicional para asegurar que funcione -->
<style>
/* Asegurar que el contenedor principal no desborde */
.main-container {
  max-width: 100vw !important;
  overflow-x: hidden !important;
}

/* Estilo para el layout principal si usas grid */
.layout-container {
  display: grid;
  grid-template-columns: 1fr 320px;
  gap: 1.5rem;
  max-width: 100vw;
  overflow-x: hidden;
}

/* En pantallas pequeñas */
@media (max-width: 1024px) {
  .layout-container {
    grid-template-columns: 1fr;
  }
}

/* Scrollbar personalizada */
.overflow-x-auto::-webkit-scrollbar {
  height: 8px;
}

.overflow-x-auto::-webkit-scrollbar-thumb {
  background-color: #d1d5db;
  border-radius: 4px;
}

.overflow-x-auto::-webkit-scrollbar-track {
  background-color: #f9fafb;
}

/* puedes ajustar el tamaño de los días si lo deseas */
.dp__calendar_item {
  width: 2.2rem;
  height: 2.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

</style>