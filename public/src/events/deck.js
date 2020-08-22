const messageType = require('../message-types')
const { ipcMain } = require('electron')
const path = require('path')
const fs = require('fs')
const dataDir = require('../data-path')
const loadCards = require('../load-cards')
const practiceDataStore = require('../practice-store')

const Store = require('electron-store')
const store = new Store()

function removeFromPractice(fileName) {
  const practiceData = store.get(practiceDataStore)
  if (!practiceData || !practiceData[fileName]) {
    return
  }

  delete practiceData[fileName]

  store.set(practiceDataStore, practiceData)
}

const init = (mainWindow) => {
  ipcMain.on(messageType.MSG_REMOVE_FILE, (_, fileName) => {
    try {
      fs.unlinkSync(path.join(dataDir, fileName))
      removeFromPractice(fileName)
      // reload the cards and send them to the window
      loadCards(mainWindow)
    } catch (error) {
      throw new Error(error)
    }
  })

  ipcMain.on(messageType.MSG_SET_DECK_NAME, (_, deckData) => {
    try {
      // get the file contents
      const fileContentsObj = JSON.parse(
        fs.readFileSync(path.join(dataDir, deckData.fileName))
      )
      // set the new name
      fileContentsObj[0].customName = deckData.newName

      // write it again
      fs.writeFileSync(
        path.join(dataDir, deckData.fileName),
        JSON.stringify(fileContentsObj)
      )

      loadCards(mainWindow)
    } catch (error) {
      console.error('could not set the new deck name', error)
    }
  })
}

module.exports = init
