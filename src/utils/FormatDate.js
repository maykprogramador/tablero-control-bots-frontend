
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
dayjs.extend(utc)

export function formatDate(date) {
  return dayjs(date).format('DD/MM/YYYY')
}

export function formatearFechaHora(fecha) {
  //console.log('fecha: ', fecha.toLocaleString('es-CO'));
  
  if (!fecha) return '-'

  // Si viene como objeto Date, lo convertimos a string
  if (fecha instanceof Date) {
    fecha = fecha.toISOString()
  }

  // Reemplazar la T por un espacio y quitar la Z (si existe)
  const fechaLimpia = fecha.replace('T', ' ').replace('Z', '')
  
  // Separar fecha y hora
  const [fechaPart, horaPart = '00:00:00'] = fechaLimpia.split(' ')
  const [year, month, day] = fechaPart.split('-')
  const [hour, minute] = horaPart.split(':')

  const meses = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic']
  const mes = meses[parseInt(month) - 1]

  return `${parseInt(day)} ${mes} ${year}, ${hour}:${minute}`
}

export function mostrarFecha(fechaISO) {
  if (!fechaISO) return '—'
  return dayjs.utc(fechaISO).format('D MMM YYYY, h:mm a')
}

