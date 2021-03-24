const express = require('express')
const http = require('http')
const ws = require('socket.io')
const path = require('path')

const app = express()
const server = http.createServer(app)
const io = ws(server)
const { getUserList, addUser, removeUser } = require('./utils/user')
const { getMessageList, addMessage, clearMessages } = require('./utils/message')

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')))

io.on('connect', socket => {
  console.log(`A user connected! ID: ${socket.id}`)

  socket.on('newUser', username => {
    const user = { username, id: socket.id }
    const userList = addUser(user)

    io.emit('userListRefresh', userList)
    const messageList = getMessageList()
    io.emit('messageListRefresh', messageList)
  })

  socket.on('newMessage', messageObject => {
    if (messageObject.message == '!clear') {
      clearMessages()
      return io.emit('clearMessages')
    }
    addMessage(messageObject)
    io.emit('receiveMessage', messageObject)
  })

  socket.on('disconnect', () => {
    console.log(`A user disconnected! ID: ${socket.id}`)

    const userList = removeUser(socket.id)
    io.emit('userListRefresh', userList)
  })
})

const PORT = process.env.PORT || 3000
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}!`)
})