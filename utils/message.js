const messageList = []

function getMessageList() {
  return messageList
}

function addMessage(message) {
  messageList.push(message)

  if (messageList.length > 30) {
    messageList.shift()
  }

  return messageList
}

function clearMessages() {
  messageList.splice(0, messageList.length)

  return messageList
}

module.exports = {
  getMessageList,
  addMessage,
  clearMessages
}