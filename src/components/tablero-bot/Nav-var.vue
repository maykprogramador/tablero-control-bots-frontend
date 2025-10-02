<template>
  <div class="border-b border-gray-200 mb-4 overflow-x-auto">
    <div class="flex min-w-max">
      <!-- Botón Bots -->
      <button
        @click="$emit('update:selectedTab', 'bots')"
        :class="[ 
          'flex items-center px-6 py-3 text-sm font-medium focus:outline-none transition-all whitespace-nowrap',
          selectedTab === 'bots'
            ? 'border-b-2 border-[#A65C99] text-[#9e378b]'
            : 'text-gray-600 hover:text-[#9e378b]'
        ]"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z">
          </path>
        </svg>
        Bots
      </button>

      <!-- Botón Solicitudes -->
      <button
        @click="$emit('update:selectedTab', 'solicitudes')"
        :class="[ 
          'flex items-center px-6 py-3 text-sm font-medium focus:outline-none transition-all whitespace-nowrap',
          selectedTab === 'solicitudes'
            ? 'border-b-2 border-[#A65C99] text-[#9e378b]'
            : 'text-gray-600 hover:text-[#9e378b]'
        ]"
      >
        <svg class="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
          </path>
        </svg>
        Solicitudes
      </button>

      <!-- Botón Notificaciones -->
      <button
        @click="$emit('update:selectedTab', 'notificaciones')"
        :class="[ 
          'flex items-center px-6 py-3 text-sm font-medium focus:outline-none transition-all whitespace-nowrap',
          selectedTab === 'notificaciones'
            ? 'border-b-2 border-[#A65C99] text-[#9e378b]'
            : 'text-gray-600 hover:text-[#9e378b]'
        ]"
      >
        <BellDot class="w-5 h-5 mr-1"/>
        Notificaciones
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'
import { BellDot } from 'lucide-vue-next'

defineProps({
  selectedTab: {
    type: String,
    required: true
  }
})

defineEmits(['update:selectedTab'])
</script>
