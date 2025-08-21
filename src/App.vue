<script setup>
import { RouterLink, RouterView } from 'vue-router'
import { onMounted } from 'vue'
import { useTableroFunctions } from '@/stores/tablero-functions'
const store = useTableroFunctions()


onMounted(() => {
  store.iniciarSocket()
})

</script>

<template>
  <RouterView />
</template>

<style scoped>

</style>
