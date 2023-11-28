import WebSocket from 'ws'

const ws = new WebSocket('ws://localhost:8080')

ws.on('open', () => {
  const data = {
    type: 'joined',
    id: Math.random() * 100,
    name: 'test',
  }
  ws.send(JSON.stringify(data))
})

ws.on('message', (message) => {
  console.log('received: %s', message)
})
