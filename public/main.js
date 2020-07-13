// Module to control application life.
const isMac = process.platform === 'darwin'
const path = require('path')
const { promisify } = require('util')
const fs = require('fs')
const readdir = promisify(fs.readdir)
const stat = promisify(fs.stat)

const { BrowserWindow, Menu, app, dialog } = require('electron')

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
  // @TODO just for dev
  {
    label: 'View',
    submenu: [
      {
        label: 'Reload',
        accelerator: 'F5',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            // on reload, start fresh and close any old
            // open secondary windows
            if (focusedWindow.id === 1) {
              BrowserWindow.getAllWindows().forEach((win) => {
                if (win.id > 1) win.close()
                win.reload()
              })
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
])

function createWindow() {
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
  // @TODO just for dev
  mainWindow.loadURL('http://localhost:3000')

  Menu.setApplicationMenu(menu)

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })

  readFiles()
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

function openFile() {
  // open the modal asking for the JSON
  const files = dialog.showOpenDialogSync(mainWindow, {
    title: 'Upload JSON file from extension',
    filters: [
      {
        name: 'JSON',
        extensions: ['json'],
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

  const dataDir = path.join(__dirname, '..', 'src/data')

  fs.writeFileSync(path.join(dataDir, fileName), fileContent)

  // grab all the files in data
  // convert to {name, contents} structure
  // send it to the front end
  getFiles(dataDir)
    .then((files) => console.log(files))
    .catch((e) => console.error(e))

  // tell the front end to re-render the items in the menu
  mainWindow.webContents.send('reloadCards', {})
}

function readFiles() {
  const dataDir = path.join(__dirname, '..', 'src/data')
  getFiles(dataDir)
    .then((files) => {
      console.log('we are in here')
      console.log(files)
    })
    .catch((e) => console.error(e))
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
