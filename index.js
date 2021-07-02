const bodyParser = require('body-parser')
const express = require('express')
const http = require('http')
const path = require('path')
const io = require('socket.io')

const PORT = process.env.PORT || 3000

let NEXT_MOVE = 'down'

const httpServer = express()
const host = http.createServer(httpServer)

// Express web server
httpServer.use(bodyParser.json())
httpServer.get('/', httpIndex)
httpServer.post('/start', httpStart)
httpServer.post('/move', httpMove)
httpServer.post('/end', httpEnd)

httpServer.get('/controller', function(request, response) {
  response.sendFile(path.join(__dirname, '/controller.html'))
})

function httpIndex(request, response) {
  var battlesnakeInfo = {
    apiversion: '1',
    author: '',
    color: '#3E338F',
    head: 'default',
    tail: 'default'
  }
  response.status(200).json(battlesnakeInfo)
}

function httpStart(request, response) {
  response.status(200).send('ok')
}

function httpEnd(request, response) {
  response.status(200).send('ok')
}

function httpMove(request, response) {
  // Give ourselves 1000ms to respond to the game engine
  var responseDelay = request.body.game.timeout - 1000

  setTimeout(function() {
    response.status(200).send({
      move: NEXT_MOVE
    })
  }, responseDelay)
}

// Websocket Server
const wsServer = io(host)

wsServer.on('connection', function(socket) {
  console.log('Client connected... ')
  socket.on('move', function(msg) {
    console.log('BROWSER: ' + msg)
    NEXT_MOVE = msg
  })
})

// Start server
host.listen(PORT, function() {
    console.log(`Battlesnake Server listening at http://127.0.0.1:${PORT}`)
})
