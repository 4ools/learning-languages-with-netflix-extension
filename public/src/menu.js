const isMac = process.platform === 'darwin'
const { Menu, app } = require('electron')
const isDev = require('electron-is-dev')
const openFile = require('./open-file')
const reloadWindow = require('./reload-window')

const menu = (mainWindow) => {
  Menu.buildFromTemplate([
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
            openFile(mainWindow)
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
}

module.exports = menu
