export function capitalizarNombre(nombre) {
  if (!nombre) return 'Nombre del usuario';
  const nombreCapitalizado = nombre
    .toLowerCase()
    .split(' ')
    .map(palabra => palabra.charAt(0).toUpperCase() + palabra.slice(1))
    .join(' ');  
  return nombreCapitalizado
}