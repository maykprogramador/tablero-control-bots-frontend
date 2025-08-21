// src/utils/resetStores.js
import { pinia } from '@/main'

export function resetAllStores() {
  for (const store of pinia._s.values()) {
    if (typeof store.resetState === 'function') {
      store.resetState()
    }
  }
}
