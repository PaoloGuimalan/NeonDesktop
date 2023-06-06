import logo from './logo.svg';
import './App.css';
import { motion } from 'framer-motion'
import Home from './components/main/Home';
import { Provider, useDispatch, useSelector } from 'react-redux'
import store from './redux/store/store';
import { Navigate, Route, Routes } from 'react-router-dom';
import Splash from './components/main/Splash';
import { useEffect, useState } from 'react';
import { SET_BATTERY_STATUS, SET_COMMAND_LINE, SET_CPU_REGISTERS, SET_CURRENT_PATH, SET_DEFAULT_DIRECTORIES, SET_DEFAULT_SHORTCUTS_LIST, SET_DEVICE_HARDWARES, SET_DIRECTORIES, SET_INSTALLED_SOFTWARES, SET_MEMORY_REGISTERS, SET_SHORTCUTS_LIST, SET_SYSTEM_AUTH, SET_SYSTEM_CMD } from './redux/types/types';

const { app, ipcRenderer } = window.require('electron');

function App() {

  const currentDir = useSelector(state => state.currentpath)
  const systemauth = useSelector(state => state.systemauth)
  const systemcmd = useSelector(state => state.systemcmd)
  const datetime = useSelector(state => state.datetime)
  const batterstatus = useSelector(state => state.batterstatus)
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
    if(systemcmd[systemcmd.length - 1]?.report == `System Setup Complete`){
      dispatch({type: SET_SYSTEM_AUTH, systemauth: {
        status: true,
        enabled: true,
      }})
      setTimeout(() => {
        setswitchscreen(true)
      }, 5000)
    }
  },[systemcmd])

  var systemcmdreport = (status, report) => {
    dispatch({type: SET_SYSTEM_CMD, systemcmd: {
      status: status,
      report: report
    }})
  }

  const initModules = () => {
    setTimeout(() => {systemcmdreport("normal","Initializing Modules...")}, 1500)
      initCurrentPath().then(() => {
        getData("C:\\").then(() => {
          initDirList().then(() => {
            initGetFileIcon().then(() => {
              initCommandLine().then(() => {
                initBatteryPower().then(() => {
                  initShortcuts().then(() => {
                    getShortcuts().then(() => {
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
            }).catch((err) => {

            })
          }).catch((err) => {

          })
        }).catch((err) => {

        })
      }).catch((err) => {
        
      })

      //CPU separate init
      setTimeout(() => {systemcmdreport("normal",`Scanning device hardwares`)}, 1500)
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

  const initBatteryPower = async () => {
    // ipcRenderer.on("batterystatus", (event, arg) => {
    //   // setTimeout(() => {systemcmdreport(`Scanning device hardwares`)}, 1500)
    //   if(arg.trigger == "charging"){
    //     dispatch({type: SET_BATTERY_STATUS, batterstatus: {
    //       ...batterstatus,
    //       power: arg.power
    //     }})
    //   }
    //   else if(arg.trigger == "not-charging"){
    //     dispatch({type: SET_BATTERY_STATUS, batterstatus: {
    //       ...batterstatus,
    //       power: arg.power
    //     }})
    //   }
    // })
    navigator.getBattery().then((battery) => {
      // console.log(battery)
      dispatch({type: SET_BATTERY_STATUS, batterstatus: {
        power: battery.charging,
        percentage: battery.level * 100
      }})

      battery.addEventListener('chargingchange', function() {
        // console.log(battery)
        dispatch({type: SET_BATTERY_STATUS, batterstatus: {
          power: battery.charging,
          percentage: battery.level * 100
        }})
      });

      battery.addEventListener('levelchange', function() {
        // console.log(battery)
        dispatch({type: SET_BATTERY_STATUS, batterstatus: {
          power: battery.charging,
          percentage: battery.level * 100
        }})
      });
    })
  }

  const getData = async (dirLink) => {
    ipcRenderer.send('dirList', dirLink);
    setTimeout(() => {systemcmdreport("normal","Checking Directories ...")}, 1500)
  };

  const getInstalledSoftwares = async () => {
    ipcRenderer.send('installedsoftwares', "");
    setTimeout(() => {systemcmdreport("normal","Checking Installed Softwares ...")}, 1500)
  }; 

  const getShortcuts = async () => {
    ipcRenderer.send('getShortcuts', "Desktop");
    setTimeout(() => {systemcmdreport("normal","Scanning Desktop Shortcuts ...")}, 1500)
  }

  const initCurrentPath = async () => {
    setTimeout(() => {systemcmdreport("normal","Scanning Drive C ...")}, 1500)
    dispatch({type: SET_CURRENT_PATH, currentpath: "C:\\"})
    setTimeout(() => {systemcmdreport("normal","Drive C Initialized")}, 1500)
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
        setTimeout(() => {systemcmdreport("normal",`${arg.length} directories scanned in ${currentDir}`)}, 1500)
        // arg.map((dr, i) => {
        //   setTimeout(() => {systemcmdreport(`${dr.fileName} scanned`)}, 1500)
        // })
    })
  }

  const initInstalledSoftwares = async () => {
    ipcRenderer.on('installedsoftwares', (event, arg) => {
        dispatch({type: SET_INSTALLED_SOFTWARES, installedsoftwares: arg})
        setTimeout(() => {systemcmdreport("normal",`${arg.length} Installed Softwares detected`)}, 1500)
        arg.map((dr, i) => {
          setTimeout(() => {systemcmdreport("normal",`${dr.DisplayName} software scanned`)}, 1500)
        })
        setTimeout(() => {systemcmdreport("success",`System Setup Complete`)}, 1500)
    })
  }

  const initCommandLine = async () => {
    ipcRenderer.on('executeCommand', (event, arg) => {
      // alert(arg)
      dispatch({type: SET_COMMAND_LINE, commandline: arg.replace(/(?:\r\n|\r|\n)/g, '<br>')})
      // dispatch({type: SET_COMMAND_LINE, commandline: arg})
    })
  }

  const initShortcuts = async () => {
    ipcRenderer.on('getShortcuts', (event, arg) => {
      dispatch({type: SET_DEFAULT_SHORTCUTS_LIST, shortcutslist: []})
      arg.map((data, i) => {
        // getFileIconData(data)
        dispatch({type: SET_SHORTCUTS_LIST, shortcutslist: data})
      })
      setTimeout(() => {systemcmdreport("normal",`${arg.length} shortcuts retrieved`)}, 1500)
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
