const { app } = require('electron')
const path = require('path')

module.exports = path.join(app.getPath('userData'), '/cardData')
