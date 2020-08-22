const { BrowserWindow } = require('electron')

function reloadWindow() {
  BrowserWindow.getAllWindows().forEach((win) => {
    if (win.id > 1) win.close()
    win.reload()
  })
}

module.exports = reloadWindow
