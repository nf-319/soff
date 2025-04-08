let socket: WebSocket | null = null

export const connectSocket = (url: string): WebSocket => {
  socket = new WebSocket(url)

  socket.onopen = () => {
    console.log('✅ Socket connected')
  }

  socket.onclose = (e) => {
    console.log('🔌 Socket closed', e.reason)
  }

  socket.onerror = (err) => {
    console.error('❌ Socket error:', err)
  }

  return socket
}

export const getSocket = () => socket
