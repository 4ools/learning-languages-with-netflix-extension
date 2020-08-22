// send message from the client
const sendMessage = (messageName, message) => {
  // if we are not in a react context
  if (!window.ipcRenderer) {
    return
  }
  window.ipcRenderer.send(messageName, message)
}

// get a message in the client
const onMessage = (messageName, callback) => {
  if (!window.ipcRenderer) {
    return
  }
  window.ipcRenderer.on(messageName, callback)
}

export { onMessage, sendMessage }
