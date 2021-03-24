const registerForm = document.querySelector('#register-form')
const usernameInput = document.querySelector('#username')
const blackScreen = document.querySelector('#black-screen')

registerForm.addEventListener('submit', e => {
  e.preventDefault()

  const username = usernameInput.value.trim()
  if (username.length > 0 && username.length <= 24) {
    blackScreen.classList.add('hidden')
    return startChat(username)
  }
})

function startChat(username) {
  const socket = io()
  socket.emit('newUser', username)

  socket.on('userListRefresh', userList => {
    const userListElement = document.querySelector('#user-list')
    userListElement.innerHTML = ''

    userList.map(user => {
      const userNameElement = document.createElement('li')
      userNameElement.textContent = user.username
      userListElement.append(userNameElement)
    })
  })

  socket.on('receiveMessage', (messageObject) => {
    appendMessage(messageObject)
  })

  socket.on('messageListRefresh', messageList => {
    messageList.map(message => {
      appendMessage(message)
    })
  })

  socket.on('clearMessages', () => {
    const messages = document.querySelectorAll('.message')
    messages.forEach(message => message.remove())
  })
  
  function appendMessage({ username, message }) {
    const messageListElement = document.querySelector('#message-list')
    const messages = document.querySelectorAll('.message')
    if (messages.length == 30) {
      messages[0].remove()
    }
    
    const messageElement = document.createElement('li')
    messageElement.classList.add('message')
    
    const usernameElement = document.createElement('p')
    usernameElement.classList.add('username')
    usernameElement.textContent = username
    messageElement.appendChild(usernameElement)
    
    const messageBoxElement = document.createElement('div')
    messageBoxElement.classList.add('message-box')
    messageBoxElement.textContent = message
    messageElement.appendChild(messageBoxElement)
    
    messageListElement.appendChild(messageElement)
    
    const messageListArea = document.querySelector('#message-list-area')
    messageListArea.scrollTop = messageListArea.scrollHeight
  }
  
  const chatForm = document.querySelector('#chat-form')
  chatForm.addEventListener('submit', e => {
    e.preventDefault()
    const messageInput = document.querySelector('#message-input')
    
    const message = messageInput.value.trim()
    if (message.length > 0 && message.length <= 50) {
      messageInput.value = ''

      const messageObject = {
        username,
        message
      }

      socket.emit('newMessage', messageObject)
    }
  })
}