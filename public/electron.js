// Module to control application life.
// messages we send and recieve
const messageType = require('./src/message-types')
const dataDir = require('./src/data-path')
const menu = require('./src/menu')
const loadCards = require('./src/load-cards')
const path = require('path')
const fs = require('fs')
const Store = require('electron-store')
const url = require('url')
const isDev = require('electron-is-dev')
const { BrowserWindow, Menu, app } = require('electron')
const practiceEvents = require('./src/events/practice')
const deckEvents = require('./src/events/deck')
const darkModeEvents = require('./src/events/dark-mode')

const store = new Store()

// this is used in a few places so lets slap it up here, it is where we
// keep the card decks

// if the dataDir does not exist then make it now
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir)
}

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
    loadCards(mainWindow)
    setDarkMode()
  })

  if (isDev) {
    mainWindow.webContents.toggleDevTools()
  }

  Menu.setApplicationMenu(menu(mainWindow))

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  // init all the events we will listen to
  practiceEvents(mainWindow)
  darkModeEvents()
  deckEvents(mainWindow)
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

// tell the webapp to set the dark mode if we have it in the store
function setDarkMode() {
  mainWindow.webContents.send(
    messageType.MSG_SET_DARK_MODE,
    store.get('darkMode')
  )
}
