const {
  BrowserWindow,
  app
} = require('electron')

const isDev = process.env.NODE_ENV === 'development'
const baseUrl = `file://${__dirname}`
const devUrl = `http://localhost:3000`

app.on('ready', () => {

  const mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    backgroundColor: '#ebecee',
    center: true
  })

  const splash = new BrowserWindow({
    show: true,
    width: 600,
    height: 400,
    backgroundColor: '#ebecee',
    center: true,
    frame: false
  })

  splash.loadURL(`${baseUrl}/splash.html`)

  splash.webContents.on('did-finish-load', () => {
    if (isDev) {
      mainWindow.loadURL(devUrl)
    } else {
      mainWindow.loadURL(`${baseUrl}/index.html`)
    }
  })

  mainWindow.webContents.on('did-finish-load', () => {
    !splash.isDestroyed() && splash.destroy()
    mainWindow.show()
    mainWindow.focus()
    mainWindow.maximize()
  })

  mainWindow.on('closed', () => {
    app.quit()
  })

})

app.on('window-all-closed', () => {
  app.quit()
})