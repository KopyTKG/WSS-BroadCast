import Express from 'express'
import expressWs from 'express-ws'
const wss = expressWs(Express())
const app = wss.app

const aWss = wss.getWss()

const Clients = []

function AllButOne(message: string, ws: unknown) {
  aWss.clients.forEach((client) => {
    if (client !== ws) {
      client.send(message)
    }
  })
}

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.ws('/ws', (ws) => {
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

app.listen(8080)
