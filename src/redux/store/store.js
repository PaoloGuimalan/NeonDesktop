import { createStore, combineReducers } from 'redux'
import { setbatterystatus, setcommandline, setconfirmexitmodaltoggle, setconfirmexitmodaltoggledelay, setcpuregisters, setcurrentpath, setdatetime, setdevicehardwares, setdirectories, setinstalledsoftwares, setmemoryregisters, setshortcutslist, setsystemauth, setsystembrightness, setsystemcmd, setsystemvolume, settogglemediaaccessibility } from '../actions/actions';

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
    confirmexitmodaltoggledelay: setconfirmexitmodaltoggledelay,
    systemvolume: setsystemvolume,
    systembrightness: setsystembrightness,
    togglemediaaccessibility: settogglemediaaccessibility
})

const store = createStore(combiner);

export default store;