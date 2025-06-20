import WebSocket from 'ws'
import http, { IncomingMessage, ServerResponse } from 'http'
import { setupWSConnection } from './utils'

const wss: WebSocket.Server = new WebSocket.Server({ noServer: true })
const server = http.createServer((_request: IncomingMessage, response: ServerResponse) => {
  response.writeHead(200, { 'Content-Type': 'text/plain' })
  response.end('okay')
})

wss.on('connection', setupWSConnection)

server.on('upgrade', (request: IncomingMessage, socket: any, head: Buffer) => {
  wss.handleUpgrade(request, socket, head, (ws: WebSocket) => {
    wss.emit('connection', ws, request)
  })
})

export default server;

