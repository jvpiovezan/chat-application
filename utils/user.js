const userList = []

function getUserList() {
  return userList
}

function addUser(user) {
  userList.push(user)

  return userList
}

function removeUser(id) {
  index = userList.map(user => user.id).indexOf(id)

  if (index == -1) return
  userList.splice(index, 1)

  return userList
}

module.exports = {
  getUserList,
  addUser,
  removeUser
}