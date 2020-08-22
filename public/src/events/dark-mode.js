const messageType = require('../message-types')
const { ipcMain } = require('electron')
const Store = require('electron-store')
const store = new Store()

const init = () => {
  ipcMain.on(messageType.MSG_SET_DARK_MODE, (_, mode) => {
    // set it in electron store
    store.set('darkMode', mode)
  })
}

module.exports = init
