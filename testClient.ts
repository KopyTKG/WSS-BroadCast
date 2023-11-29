import WebSocket from 'ws'

const ws = new WebSocket('ws://localhost:8080/ws')

ws.on('open', () => {
  const data = {
    type: 'joined',
    id: '0x00',
    name: 'Admin',
  }
  ws.send(JSON.stringify(data))
})

ws.on('message', (message) => {
  console.log('received: %s', message)
})
