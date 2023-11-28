import WebSocket from 'ws'

const wss = new WebSocket.Server({ port: 8080 })

const Clients = []

console.log('Server Online on port 8080')

function AllButOne(message: string, ws: WebSocket) {
  wss.clients.forEach((client) => {
    if (client !== ws) {
      client.send(message)
    }
  })
}

wss.on('connection', (ws) => {
  ws.on('message', (msg) => {
    const jsonData = JSON.parse(msg.toString())
    console.log(jsonData)
    if (jsonData.type == 'joined') {
      if (jsonData.id == undefined) {
        const index = Clients.findIndex((client) => client.ws === ws)
        const client = Clients[index]
        Clients.splice(index, 1)
        const message = {
          type: 'left',
          name: client.name,
        }
        AllButOne(JSON.stringify(message), ws)
        return
      }
      Clients.push({ id: jsonData.id, name: jsonData.name, ws: ws })
      const message = {
        type: 'joined',
        name: jsonData.name,
      }
      AllButOne(JSON.stringify(message), ws)
    }
    if (jsonData.type == 'message') {
      AllButOne(JSON.stringify(jsonData), ws)
    }
  })

  ws.on('close', () => {
    const index = Clients.findIndex((client) => client.ws === ws)
    const client = Clients[index]
    Clients.splice(index, 1)

    const message = {
      type: 'left',
      name: client.name,
    }

    AllButOne(JSON.stringify(message), ws)
  })
})
