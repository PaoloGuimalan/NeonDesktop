const poweron = require("../../../resources/sounds/startup1.wav")
const systemcmdeff = require("../../../resources/sounds/cmdstdout.wav")
const clickeff = require("../../../resources/sounds/clickeffect.wav")

var poweronAudio = null
var systemcmdAudio = null
var clickAudio = null

function initeffects(){
    poweronAudio = new Audio(poweron)
    systemcmdAudio = new Audio(systemcmdeff)
    clickAudio = new Audio(clickeff)
}

function turnon(){
    poweronAudio.play()
}

function systemcmdlog(){
    systemcmdAudio.play()
}

function clicksound(){
    clickAudio.play()
}

export { initeffects, turnon, systemcmdlog, clicksound }