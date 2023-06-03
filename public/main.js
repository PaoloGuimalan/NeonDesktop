const { app, BrowserWindow, ipcMain, contextBridge, ipcRenderer, shell } = require('electron')
const find = require('find-process');
const fs = require("fs")
const exec = require("child_process").exec

const path = require('path')
const url = require("url")
const isDev = require('electron-is-dev')
const os = require("os-utils")

const fetchInstalledSoftware = require("fetch-installed-software")

require('@electron/remote/main').initialize()

async function getDirectoryList(path){
  var data = [];
  var newPath = path.split("\\").length == 1? `${path}` : `${path}\\`

  var dirs = fs.readdirSync(path, {withFileTypes: true})
  data = dirs.map((dr, i) => ({fileName: dr.name, isFile: dr.isFile(), isDirectory: dr.isDirectory(), filepath: `${newPath}${dr.name}`}))

  return data;
}

async function getInstalledSoftwares(){
  return fetchInstalledSoftware.getAllInstalledSoftwareSync();
}

function commandLineExec(command, callback){
  exec(command, function(error, stdout, stderr){ callback(stdout); });
}

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 700,
    frame: false,
    fullscreen: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
      contextIsolation: false
    }
  })

  win.removeMenu()

  // win.webContents.openDevTools()

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )

  setInterval(() => {
    os.cpuUsage((v) => {
      win.webContents.send('hardware', {
        cpu: v*100,
        totalcpu: os.cpuCount(),
        memory: os.freememPercentage()*100,
        totalmemory: os.totalmem()/1024,
        // harddrive: os.harddrive(),
        // processes: os.getProcesses()
      })
    })
    // os.cpuUsage((v) => {
    //   console.log({
    //     cpu: v*100,
    //     totalcpu: os.cpuCount(),
    //     memory: os.freememPercentage()*100,
    //     totalmemory: os.totalmem()/1024,
    //     // harddrive: os.harddrive((total, free, used) => ({
    //     //   total,
    //     //   free,
    //     //   used
    //     // })),
    //     // processes: os.getProcesses((result) => result)
    //   })
    // })
  },3000)

  // const win2 = new BrowserWindow({
  //   width: 400,
  //   height: 400,
  //   frame: true,
  //   fullscreen: false,
  //   webPreferences: {
  //     nodeIntegration: true,
  //     enableRemoteModule: true
  //   }
  // })

  // win2.removeMenu()
  // win2.loadURL(
  //   isDev
  //     ? `file://${path.join(__dirname, '../public/voiceCatcherModule/index.html')}`
  //     : `file://${path.join(__dirname, '../build/voiceCatcherModule/index.html')}`
  // )

  // require("electron").shell.openExternal("google.com")
  // window.open('./voiceCatcherModule/index.html','winname','directories=no,titlebar=no,toolbar=no,location=no,status=no,menubar=no,scrollbars=no,resizable=no,width=400,height=350');
}

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
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

app.on('before-quit' , (e) => {
    find('port', 3000)
      .then(function(list) {
      if(list[0] != null){
          process.kill(list[0].pid, 'SIGHUP');
      }
    }).catch((e) => {
        console.log(e.stack || e);
    })
});

ipcMain.on('dirList', (event, arg) => {
  getDirectoryList(arg).then((data) => {
    // console.log(data)
    event.sender.send('dirList', data)
  }).catch((err) => {
    console.log(err)
  })
})

ipcMain.on('getFileIcon', (event, arg) => {
  app.getFileIcon(arg.filepath).then((value) => {
    event.sender.send('getFileIcon', {...arg, icon: value.toDataURL()})
  }).catch((err) => {
    console.log(err)
  })
})

ipcMain.on('installedsoftwares', (event, arg) => {
  getInstalledSoftwares(arg).then((data) => {
    // console.log(data)
    event.sender.send('installedsoftwares', data)
  }).catch((err) => {
    console.log(err)
  })
})

ipcMain.on('executeCommand', (event, arg) => {
  commandLineExec(arg, (result) => {
    // console.log(result)
    event.sender.send('executeCommand', result)
  })
})

ipcMain.on('openFile', (event, arg) => {
  shell.openPath(arg)
})

ipcMain.on('closeApp', (evt, arg) => {
  app.exit(0)
});
