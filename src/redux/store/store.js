import { createStore, combineReducers } from 'redux'
import { setcpuregisters, setcurrentpath, setdatetime, setdevicehardwares, setdirectories, setinstalledsoftwares, setmemoryregisters, setsystemauth, setsystemcmd } from '../actions/actions';

const combiner = combineReducers({
    systemauth: setsystemauth,
    currentpath: setcurrentpath,
    directories: setdirectories,
    installedsoftwares: setinstalledsoftwares,
    systemcmd: setsystemcmd,
    devicehardwares: setdevicehardwares,
    cpuregisters: setcpuregisters,
    memoryregisters: setmemoryregisters,
    datetime: setdatetime
})

const store = createStore(combiner);

export default store;