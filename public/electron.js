// Module to control application life.
const isMac = process.platform === 'darwin'
const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const Store = require('electron-store')
const url = require('url')
const isDev = require('electron-is-dev')
const { BrowserWindow, Menu, app, dialog, ipcMain } = require('electron')

// messages we send and recieve
const MSG_FLASH_CARD_FILES = 'flashCardFiles'
const MSG_REMOVE_FILE = 'removeFile'
const MSG_SET_DARK_MODE = 'setDarkMode'
const MSG_RATE_CARD = 'rateCard'
const MSG_GET_PRACTICE_CARDS = 'getPracticeCards'
const MSG_PRACTICE_CARDS = 'practiceCards'

const store = new Store()

// this is used in a few places so lets slap it up here, it is where we
// keep the card decks
const dataDir = path.join(app.getPath('userData'), '/cardData')
// if the dataDir does not exist then make it now
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

// just a const name for the practice data
const practiceDataStore = 'praticeData'

// reload on changes
if (isDev) {
  require('electron-reload')(__dirname, {
    electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
    ignored: [/node_modules|[/\\]\./, '/src/data/**'],
    argv: [],
  })
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const menu = Menu.buildFromTemplate([
  ...(isMac
    ? [
        {
          label: app.name,
          submenu: [
            { role: 'about' },
            { type: 'separator' },
            { role: 'services' },
            { type: 'separator' },
            { role: 'hide' },
            { role: 'hideothers' },
            { role: 'unhide' },
            { type: 'separator' },
            { role: 'quit' },
          ],
        },
      ]
    : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'Upload',
        click() {
          // mainWindow.webContents.send('openUploads', {})
          openFile()
        },
      },
    ],
  },
  ...(!isDev
    ? []
    : [
        {
          label: 'View',
          submenu: [
            {
              label: 'Reload',
              accelerator: 'F5',
              click: (_, focusedWindow) => {
                if (focusedWindow) {
                  // on reload, start fresh and close any old
                  // open secondary windows
                  if (focusedWindow.id === 1) {
                    reloadWindow()
                  }
                }
              },
            },
            {
              label: 'Toggle Dev Tools',
              accelerator: 'F12',
              click: () => {
                mainWindow.webContents.toggleDevTools()
              },
            },
          ],
        },
      ]),
])

async function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      // contextIsolation: true,
      preload: __dirname + '/preload.js',
    },
  })

  // store.clear()

  const startUrl = isDev
    ? 'http://localhost:3000'
    : url.format({
        pathname: path.join(__dirname, '/index.html'),
        protocol: 'file:',
        slashes: true,
      })

  mainWindow.loadURL(startUrl).then(async () => {
    // we need to tell the client what json files to load in
    loadCards()
    setDarkMode()
  })

  if (isDev) {
    mainWindow.webContents.toggleDevTools()
  }

  Menu.setApplicationMenu(menu)

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  ipcMain.on(MSG_REMOVE_FILE, (_, fileName) => {
    try {
      fs.unlinkSync(path.join(dataDir, fileName))
      removeFromPractice(fileName)
      // reload the cards and send them to the window
      loadCards()
    } catch (error) {
      throw new Error(error)
    }
  })

  ipcMain.on(MSG_SET_DARK_MODE, (_, mode) => {
    // set it in electron store
    store.set('darkMode', mode)
  })

  // when a card is updated with a rating
  ipcMain.on(MSG_RATE_CARD, (_, { item, deckName, rating }) => {
    let practiceData = store.get(practiceDataStore)
    // must be the first card ever rated so lets set up the store
    if (!practiceData) {
      // init it and get it again
      store.set(practiceDataStore, {})
      practiceData = store.get(practiceDataStore)
    }

    // if there was no deck name, we have a rating on the practice screen
    // so we need to find the card by its time updated and update the rating
    // and time practiced
    if (!deckName) {
      Object.keys(practiceData).forEach((deckName) => {
        Object.keys(practiceData[deckName]).forEach((cardName) => {
          if (Number(cardName) === Number(item.timeCreated)) {
            practiceData[deckName][cardName].lastPractice = Date.now()
            practiceData[deckName][cardName].rating = rating
          }
        })
      })
    } else {
      // if we do not already have the deck
      if (!practiceData[deckName]) {
        practiceData[deckName] = {}
      }

      // if the card is not in the deck, add it there
      if (!practiceData[deckName][item.timeCreated]) {
        practiceData[deckName][item.timeCreated] = item
      }

      // now we update the time last practiced and the rating
      // these are then used by practice mode to work out
      // what decks to practice
      practiceData[deckName][item.timeCreated].lastPractice = Date.now()
      practiceData[deckName][item.timeCreated].rating = rating
    }

    // set the store again
    store.set(practiceDataStore, practiceData)
  })

  ipcMain.on(MSG_GET_PRACTICE_CARDS, () => {
    // we will get some cards and send em back
    let cards = []
    const practiceData = store.get(practiceDataStore)

    if (!practiceData) {
      // just let them know right away, we have nothing to
      // practice here
      mainWindow.webContents.send(MSG_PRACTICE_CARDS, cards)
      return
    }

    // we will give each card a weight based on the difficulty * time
    const weights = []
    Object.keys(practiceData).forEach((deckName) => {
      Object.keys(practiceData[deckName]).forEach((cardName) => {
        const card = practiceData[deckName][cardName]
        weights.push({
          weight: card.rating * card.lastPractice,
          card,
        })
      })
    })

    // now we have the cards by weight we just sort and grab the top x
    // and return them
    weights.sort(sortCardsByWeight).reverse()

    const cuttingPoint = weights.length > 20 ? 20 : weights.length
    cards = weights.slice(0, cuttingPoint).map((weightCard) => weightCard.card)
    const formattedCards = { cards }

    mainWindow.webContents.send(MSG_PRACTICE_CARDS, formattedCards)
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

function sortCardsByWeight(a, b) {
  if (a.weight < b.weight) {
    return -1
  }
  if (a.weight > b.weight) {
    return 1
  }
  return 0
}

function removeFromPractice(fileName) {
  const practiceData = store.get(practiceDataStore)
  if (!practiceData || !practiceData[fileName]) {
    return
  }

  delete practiceData[fileName]

  store.set(practiceDataStore, practiceData)
}

// tell the webapp to set the dark mode if we have it in the store
function setDarkMode() {
  mainWindow.webContents.send(MSG_SET_DARK_MODE, store.get('darkMode'))
}

async function loadCards() {
  const cardFiles = await flashCardFiles()
  mainWindow.webContents.send(MSG_FLASH_CARD_FILES, cardFiles)
}

async function openFile() {
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

  // tell the front end to re-render the items in the menu
  mainWindow.webContents.send(MSG_FLASH_CARD_FILES, await flashCardFiles())
}

function reloadWindow() {
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.id > 1) win.close()
    win.reload()
  })
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
