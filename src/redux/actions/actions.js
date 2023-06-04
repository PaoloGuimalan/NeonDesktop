import { SET_BATTERY_STATUS, SET_COMMAND_LINE, SET_CPU_REGISTERS, SET_CURRENT_PATH, SET_DATE_TIME, SET_DEFAULT_COMMAND_LINE, SET_DEFAULT_DIRECTORIES, SET_DEFAULT_SHORTCUTS_LIST, SET_DEVICE_HARDWARES, SET_DIRECTORIES, SET_INSTALLED_SOFTWARES, SET_MEMORY_REGISTERS, SET_SHORTCUTS_LIST, SET_SYSTEM_AUTH, SET_SYSTEM_CMD, SET_SYSTEM_CMD_DEFAULT } from "../types/types"


export const systemauthstate = {
    status: false,
    enabled: false,
}

export const setsystemauth = (state = systemauthstate, action) => {
    switch(action.type){
        case SET_SYSTEM_AUTH:
            return action.systemauth;
        default:
            return state;
    }
}

export const setcurrentpath = (state = "", action) => {
    switch(action.type){
        case SET_CURRENT_PATH:
            return action.currentpath;
        default:
            return state;
    }
}

export const setdirectories = (state = [], action) => {
    switch(action.type){
        case SET_DIRECTORIES:
            return state.concat(action.directories);
        case SET_DEFAULT_DIRECTORIES:
            return action.directories;
        default:
            return state;
    }
}

export const setinstalledsoftwares = (state = [], action) => {
    switch(action.type){
        case SET_INSTALLED_SOFTWARES:
            return action.installedsoftwares;
        default:
            return state;
    }
}

export const setsystemcmd = (state = [], action) => {
    switch(action.type){
        case SET_SYSTEM_CMD:
            var shifted = state.length >= 100? state.shift() : state;
            return state.concat(action.systemcmd);
        case SET_SYSTEM_CMD_DEFAULT:
            return action.systemcmd;
        default:
            return state;
    }
}

export const devicehardwaresstate = {
    cpu: 0,
    totalcpu: 0,
    memory: 0,
    totalmemory: 0,
    // harddrive: os.harddrive(),
    // processes: os.getProcesses()
}

export const setdevicehardwares = (state = devicehardwaresstate, action) => {
    switch(action.type){
        case SET_DEVICE_HARDWARES:
            return action.devicehardwares;
        default:
            return state;
    }
}

export const setcpuregisters = (state = [], action) => {
    switch(action.type){
        case SET_CPU_REGISTERS:
            var shifted = state.length >= 20? state.shift() : state;
            return state.concat(action.cpuregisters);
        default:
            return state;
    }
}

export const setmemoryregisters = (state = [], action) => {
    switch(action.type){
        case SET_MEMORY_REGISTERS:
            var shifted = state.length >= 20? state.shift() : state;
            return state.concat(action.memoryregisters);
        default:
            return state;
    }
}

export const setdatetime = (state = { time: "", date: "" }, action) => {
    switch(action.type){
        case SET_DATE_TIME:
            return action.datetime;
        default:
            return state;
    }
}

export const setcommandline = (state = [], action) => {
    switch(action.type){
        case SET_COMMAND_LINE:
            var shifted = state.length >= 100? state.shift() : state;
            // console.log(action.commandline)
            return state.concat(action.commandline);
        case SET_DEFAULT_COMMAND_LINE:
            return action.commandline;
        default:
            return state;
    }
}

export const setshortcutslist = (state = [], action) => {
    switch(action.type){
        case SET_SHORTCUTS_LIST:
            var shifted = state.length >= 100? state.shift() : state;
            return state.concat(action.shortcutslist);
        case SET_DEFAULT_SHORTCUTS_LIST:
            return action.shortcutslist;
        default:
            return state;
    }
}

export const batterystatusstate = {
    power: "not-charging",
    percentage: 0
}

export const setbatterystatus = (state = batterystatusstate, action) => {
    switch(action.type){
        case SET_BATTERY_STATUS:
            return action.batterstatus;
        default:
            return state;
    }
}