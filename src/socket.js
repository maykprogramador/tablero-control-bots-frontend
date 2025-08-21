import { io } from 'socket.io-client'
import { API_BASE_URL_BACK } from './config.js'

// Conexión al backend Socket.IO
const socket = io(`${API_BASE_URL_BACK}`, {
  withCredentials: true
})

export default socket
