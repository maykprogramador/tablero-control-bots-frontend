export function capitalizarPrimeraLetra(texto){
  if (!texto) return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1)
}