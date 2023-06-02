import logo from './logo.svg';
import './App.css';
import { motion } from 'framer-motion'
import Home from './components/main/Home';
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './redux/store/store';
import { Navigate, Route, Routes } from 'react-router-dom';
import Splash from './components/main/Splash';
import { useEffect, useState } from 'react';
import { SET_CPU_REGISTERS, SET_CURRENT_PATH, SET_DEFAULT_DIRECTORIES, SET_DEVICE_HARDWARES, SET_DIRECTORIES, SET_INSTALLED_SOFTWARES, SET_MEMORY_REGISTERS, SET_SYSTEM_AUTH, SET_SYSTEM_CMD } from './redux/types/types';

const { app, ipcRenderer } = window.require('electron');

function App() {

  const currentDir = useSelector(state => state.currentpath)
  const systemauth = useSelector(state => state.systemauth)
  const systemcmd = useSelector(state => state.systemcmd)
  const datetime = useSelector(state => state.datetime)
  const dispatch = useDispatch()

  const [switchscreen, setswitchscreen] = useState(false)

  useEffect(() => {

    return () => {
      ipcRenderer.removeAllListeners();
    };
  },[])

  useEffect(() => {
    if(systemauth.enabled){
      initModules()
    }
  },[systemauth.enabled])

  useEffect(() => {
    if(systemcmd[systemcmd.length - 1] == `System Setup Complete`){
      dispatch({type: SET_SYSTEM_AUTH, systemauth: {
        status: true,
        enabled: true,
      }})
      setTimeout(() => {
        setswitchscreen(true)
      }, 5000)
    }
  },[systemcmd])

  var systemcmdreport = (report) => {
    dispatch({type: SET_SYSTEM_CMD, systemcmd: report})
  }

  const initModules = () => {
    setTimeout(() => {systemcmdreport("Initializing Modules...")}, 1500)
      initCurrentPath().then(() => {
        getData("C:\\").then(() => {
          initDirList().then(() => {
            initGetFileIcon().then(() => {
              getInstalledSoftwares().then(() => {
                initInstalledSoftwares().then(() => {
  
                }).catch((err) => {  })
              }).catch((err) => {
  
              })
            }).catch((err) => {

            })
          }).catch((err) => {

          })
        }).catch((err) => {

        })
      }).catch((err) => {
        
      })

      //CPU separate init
      setTimeout(() => {systemcmdreport(`Scanning device hardwares`)}, 1500)
      initCPU().then(() => {

      }).catch((err) => {

      })
  }

  const initCPU = async () => {
    ipcRenderer.on("hardware", (event, arg) => {
      // setTimeout(() => {systemcmdreport(`Scanning device hardwares`)}, 1500)
      dispatch({type: SET_DEVICE_HARDWARES, devicehardwares: arg})
      dispatch({type: SET_CPU_REGISTERS, cpuregisters: {
        time: datetime.time,
        register: arg.cpu
      }})
      dispatch({type: SET_MEMORY_REGISTERS, memoryregisters: {
        time: datetime.time,
        register: arg.memory
      }})
    })
  }

  const getData = async (dirLink) => {
    ipcRenderer.send('dirList', dirLink);
    setTimeout(() => {systemcmdreport("Checking Directories ...")}, 1500)
  };

  const getInstalledSoftwares = async () => {
    ipcRenderer.send('installedsoftwares', "");
    setTimeout(() => {systemcmdreport("Checking Installed Softwares ...")}, 1500)
  }; 

  const initCurrentPath = async () => {
    setTimeout(() => {systemcmdreport("Scanning Drive C ...")}, 1500)
    dispatch({type: SET_CURRENT_PATH, currentpath: "C:\\"})
    setTimeout(() => {systemcmdreport("Drive C Initialized")}, 1500)
  }

  const getFileIconData = (data) => {
    ipcRenderer.send("getFileIcon", data)
  }

  const initGetFileIcon = async () => {
    ipcRenderer.on('getFileIcon', (event, arg) => {
      // setTimeout(() => {systemcmdreport(`${arg.fileName} scanned`)}, 1500)
      dispatch({type: SET_DIRECTORIES, directories: arg})
      // console.log(arg)
    })
  }

  const initDirList = async () => {
    ipcRenderer.on('dirList', (event, arg) => {
        dispatch({type: SET_DEFAULT_DIRECTORIES, directories: []})
        arg.map((data, i) => {
          getFileIconData(data)
        })
        setTimeout(() => {systemcmdreport(`${arg.length} directories scanned in ${currentDir}`)}, 1500)
        // arg.map((dr, i) => {
        //   setTimeout(() => {systemcmdreport(`${dr.fileName} scanned`)}, 1500)
        // })
    })
  }

  const initInstalledSoftwares = async () => {
    ipcRenderer.on('installedsoftwares', (event, arg) => {
        dispatch({type: SET_INSTALLED_SOFTWARES, installedsoftwares: arg})
        setTimeout(() => {systemcmdreport(`${arg.length} Installed Softwares detected`)}, 1500)
        arg.map((dr, i) => {
          setTimeout(() => {systemcmdreport(`${dr.DisplayName} software scanned`)}, 1500)
        })
        setTimeout(() => {systemcmdreport(`System Setup Complete`)}, 1500)
    })
  }

  return (
    <div id='div_app'>
      <Routes>
        <Route path='/' element={switchscreen? <Navigate to='/home' /> : <Splash />} />
        <Route path='/home' element={switchscreen? <Home /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  );
}

export default App;
