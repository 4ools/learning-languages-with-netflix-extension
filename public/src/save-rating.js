const path = require('path')
const fs = require('fs')
const dataDir = require('./data-path')
const messageType = require('./message-types')

const saveRating = (mainWindow, item, fileName, rating) => {
  try {
    const pathToFile = path.join(dataDir, fileName)
    const currentItems = JSON.parse(fs.readFileSync(pathToFile))
    const newItems = currentItems.map((card) => {
      if (card.timeCreated === item.timeCreated) {
        card.rating = rating
      }
      return card
    })
    // write the new items to file
    fs.writeFileSync(path.join(dataDir, fileName), JSON.stringify(newItems))

    // tell the FE we have update a deck of cards
    mainWindow.webContents.send(messageType.MSG_FLASH_CARD_FILE, {
      file: fileName,
      content: newItems,
    })
  } catch (error) {
    throw new Error(`could not write rating to file: ${fileName}, ${item}`)
  }
}

module.exports = saveRating
