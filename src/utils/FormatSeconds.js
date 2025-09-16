export function formatDuration(seconds) {
  if (!seconds && seconds !== 0) return '-';

  // Redondear a 1 decimal
  const rounded = parseFloat(seconds).toFixed(1);

  // Si es menor a 60, mostrar en segundos
  if (rounded < 60) {
    return `${rounded}s`;
  }

  // Si es mayor o igual a 60, convertir a minutos
  const minutes = (rounded / 60).toFixed(2); // máximo 2 decimales
  return `${minutes}m`;
}
