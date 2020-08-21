// define some message names that we use in the system
const MSG_FLASH_CARD_FILES = 'flashCardFiles'
const MSG_REMOVE_FILE = 'removeFile'
const MSG_SET_DARK_MODE = 'setDarkMode'
const MSG_RATE_CARD = 'rateCard'
const MSG_GET_PRACTICE_CARDS = 'getPracticeCards'
const MSG_PRACTICE_CARDS = 'practiceCards'
const MSG_SET_DECK_NAME = 'setDeckName'

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

export {
  onMessage,
  sendMessage,
  MSG_FLASH_CARD_FILES,
  MSG_REMOVE_FILE,
  MSG_SET_DARK_MODE,
  MSG_RATE_CARD,
  MSG_GET_PRACTICE_CARDS,
  MSG_PRACTICE_CARDS,
  MSG_SET_DECK_NAME,
}
