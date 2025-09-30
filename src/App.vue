<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
import { useNotificacionesStore } from './stores/notificacion-functions'
const storeTablero = useTableroFunctions()
const storeNotificacion = useNotificacionesStore()

onMounted(() => {
  storeTablero.iniciarSocket()
  storeNotificacion.iniciarSocketNotificaciones()
})

</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
