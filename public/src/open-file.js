const loadCards = require('./load-cards')
const { dialog } = require('electron')
const path = require('path')
const fs = require('fs')
const dataDir = require('./data-path')

async function openFile(mainWindow) {
  // open the modal asking for the JSON
  const files = dialog.showOpenDialogSync(mainWindow, {
    title: 'Upload JSON file from extension',
    filters: [
      {
        name: 'JSON',
        // ndjson is the extension the plugin uses
        extensions: ['json', 'ndjson'],
      },
    ],
    properties: ['openFile'],
  })

  // if they pick anything just leave
  if (!files) {
    return
  }
  // get the path of the first file
  const file = files[0]

  // read the contents of the file using fs
  const fileContent = fs.readFileSync(file)

  const fileName = `card-data-${Date.now()}.json`

  try {
    fs.writeFileSync(path.join(dataDir, fileName), fileContent)
  } catch (error) {
    throw new Error(error)
  }

  // tell the main window to load the cards
  loadCards(mainWindow)
}

module.exports = openFile
