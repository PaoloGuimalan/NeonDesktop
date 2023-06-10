import { createStore, combineReducers } from 'redux'
import { setbatterystatus, setcommandline, setconfirmexitmodaltoggle, setconfirmexitmodaltoggledelay, setcpuregisters, setcurrentpath, setdatetime, setdevicehardwares, setdirectories, setinstalledsoftwares, setmemoryregisters, setshortcutslist, setsystemauth, setsystemcmd } from '../actions/actions';

const combiner = combineReducers({
    systemauth: setsystemauth,
    currentpath: setcurrentpath,
    directories: setdirectories,
    installedsoftwares: setinstalledsoftwares,
    systemcmd: setsystemcmd,
    devicehardwares: setdevicehardwares,
    cpuregisters: setcpuregisters,
    memoryregisters: setmemoryregisters,
    datetime: setdatetime,
    commandline: setcommandline,
    shortcutslist: setshortcutslist,
    batterystatus: setbatterystatus,
    confirmexitmodaltoggle: setconfirmexitmodaltoggle,
    confirmexitmodaltoggledelay: setconfirmexitmodaltoggledelay
})

const store = createStore(combiner);

export default store;