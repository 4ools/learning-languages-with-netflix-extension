// Module to control application life.
const isMac = process.platform === 'darwin'
const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)
const Store = require('electron-store')

// messages we send and recieve
const MSG_FLASH_CARD_FILES = 'flashCardFiles'
const MSG_REMOVE_FILE = 'removeFile'
const MSG_SET_DARK_MODE = 'setDarkMode'

const store = new Store()

const { BrowserWindow, Menu, app, dialog, ipcMain } = require('electron')

// this is used in a few places so lets slap it up here, it is where we
// keep the card decks
const dataDir = path.join(__dirname, '..', 'src/data')

// reload on changes
require('electron-reload')(__dirname, {
  electron: path.join(__dirname, '../node_modules', '.bin', 'electron'),
})

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

const isProd = process.env.NODE_ENV === 'production'

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
  ...(isProd
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
      nodeIntegration: true,
      preload: __dirname + '/preload.js',
    },
  })

  // and load the index.html of the app.
  // @TODO just for dev using isProd
  mainWindow.loadURL('http://localhost:3000').then(async () => {
    // we need to tell the client what json files to load in
    loadCards()
    setDarkMode()
  })

  if (!isProd) {
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
      // reload the cards and send them to the window
      loadCards()
    } catch (error) {
      // console it so I can debug
      console.error(error)
      alert('there was an error the cards no longer exits')
    }
  })

  ipcMain.on(MSG_SET_DARK_MODE, (_, mode) => {
    // set it in electron store
    store.set('darkMode', mode)
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
    console.log('are we calling this again?')
    createWindow()
  }
})

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

  // @TODO date of the first item in the list
  const fileName = `card-data-${Date.now()}.json`

  fs.writeFileSync(path.join(dataDir, fileName), fileContent)

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
  const dataDir = path.join(__dirname, '..', 'src/data')
  const files = await getFiles(dataDir)

  // remove the full path and just return the filename
  // for example /users/me/thing.json to just thing.json
  return files.map((fileName) =>
    fileName.substring(fileName.lastIndexOf('/') + 1, fileName.length)
  )
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
