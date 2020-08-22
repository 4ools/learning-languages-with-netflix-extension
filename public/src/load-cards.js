const messageType = require('./message-types')
const { promisify } = require('util')
const fs = require('fs')
const dataDir = require('./data-path')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const path = require('path')

async function loadCards(mainWindow) {
  const cardFiles = await flashCardFiles()
  mainWindow.webContents.send(messageType.MSG_FLASH_CARD_FILES, cardFiles)
}

async function flashCardFiles() {
  const files = await getFiles(dataDir)
  let data = []
  files.forEach((fileName) => {
    data.push({
      file: fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length),
      content: JSON.parse(fs.readFileSync(fileName)),
    })
  })

  return data
}

async function getFiles(dir) {
  const subdirs = await readdir(dir)
  const files = await Promise.all(
    subdirs.map(async (subdir) => {
      const res = path.resolve(dir, subdir)
      return (await stat(res)).isDirectory() ? getFiles(res) : res
    })
  )
  return files.reduce((a, f) => a.concat(f), [])
}

module.exports = loadCards
