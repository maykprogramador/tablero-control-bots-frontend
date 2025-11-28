<template>
  <div class="relative bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 border border-slate-600 shadow-xl overflow-hidden group hover:shadow-2xl hover:-translate-y-1 transition-all duration-300" >
    <!-- Background Hover Effect -->
    <div
      class="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300"
      :style="{ backgroundImage: `linear-gradient(135deg, var(--color-${color}), transparent)` }"
    ></div>

    <!-- Content -->
    <div class="relative z-10">

      <!-- Icon -->
      <div :class="`w-12 h-12 rounded-xl bg-${color}-500/20 flex items-center justify-center mb-4`">
        <component :is="computedIcon" class="w-6 h-6" :class="`text-${color}-400`" />
      </div>

      <!-- Title -->
      <p class="text-sm font-medium text-slate-400 mb-2 uppercase tracking-wide">{{ title }}</p>

      <!-- Value + Trend -->
      <div class="flex items-end justify-between">

        <h3 class="text-3xl font-bold text-white">
          {{ formattedValue }}
        </h3>

        <div
          v-if="trend !== null && trend !== undefined"
          :class="trend >= 0 ? 'text-green-400' : 'text-red-400'"
          class="text-sm font-semibold flex items-center gap-1"
        >
          <span v-if="trend >= 0">▲</span>
          <span v-else>▼</span>
          {{ Math.abs(trend) }}%
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  ActivityIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  BotIcon,
  FileTextIcon,
  SendIcon,
  CheckIcon,
  XCircleIcon,
} from "lucide-vue-next";

// Props
const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  icon: { type: String, required: true }, // 'bot', 'activity', 'alert-circle', ...
  color: { type: String, default: "blue" },
  trend: { type: Number, default: null },
});

// Convert icon string → component
const iconsMap = {
  bot: BotIcon,
  activity: ActivityIcon,
  "alert-circle": AlertCircleIcon,
  "check-circle": CheckCircleIcon,
  "check-circle-2": CheckIcon,
  "file-text": FileTextIcon,
  send: SendIcon,
  check: CheckIcon,
  "x-circle": XCircleIcon,
};

// Computed icon component
const computedIcon = computed(() => iconsMap[props.icon] ?? ActivityIcon);

// Allow formatted values (ej: “45%”)
const formattedValue = computed(() => props.value);
</script>

<style scoped>
:root {
  --color-blue: #3b82f6;
  --color-green: #10b981;
  --color-red: #ef4444;
  --color-emerald: #10b981;
  --color-purple: #8b5cf6;
  --color-cyan: #06b6d4;
  --color-amber: #f59e0b;
  --color-orange: #f97316;
}
</style>
