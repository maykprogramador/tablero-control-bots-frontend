<script setup>
import { ref, computed, onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAnalyticsStore } from '@/stores/analitic-functions'
import { Line } from "vue-chartjs"

const analitycsStore = useAnalyticsStore()
const { enviosHistoriasClinicas } = storeToRefs(analitycsStore)
const modo = ref("semanal") // default
/*const data = {
  semanal: [
    { label: "Sem 1", valor: 120 },
    { label: "Sem 2", valor: 200 },
    { label: "Sem 3", valor: 150 },
    { label: "Sem 4", valor: 320 }
  ],
  mensual: [
    { label: "Ene", valor: 450 },
    { label: "Feb", valor: 380 },
    { label: "Mar", valor: 520 },
    { label: "Abr", valor: 610 }
  ]
}*/

const chartData = computed(() => {
  const dataset = enviosHistoriasClinicas.value[modo.value]

  return {
    labels: dataset.map(d => d.label),
    datasets: [
      {
        label: "Envíos",
        data: dataset.map(d => d.valor),
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        borderColor: "#0ea5e9",       // azul suave
        backgroundColor: "rgba(14,165,233,0.2)", // área suave
        pointBackgroundColor: "#0ea5e9",
        pointRadius: 5
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false }
  },
  scales: {
    y: {
      beginAtZero: false,
      grid: { color: "rgba(0,0,0,0.05)" },
      ticks: { padding: 8 }
    },
    x: {
      grid: { display: false }
    }
  }
}

onMounted(async () => {
  await analitycsStore.loadEnviosHistoriasClinicas()
  //console.log('historias: ',enviosHistoriasClinicas.value);
})

</script>

<template>
  <div class="bg-white rounded-2xl shadow p-6 space-y-4">

    <div class="flex justify-between items-center">
      <h2 class="text-sm font-bold text-slate-600 uppercase">
        Envíos Historias Clínicas
      </h2>

      <select
        v-model="modo"
        class="px-2 py-1 border border-slate-300 rounded-lg text-sm"
      >
        <option value="semanal">Semanal</option>
        <option value="mensual">Mensual</option>
      </select>
    </div>

    <div class="h-[380px]">
      <Line :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
