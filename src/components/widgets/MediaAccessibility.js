import React, { useEffect, useState } from 'react'
import '../../styles/widgets/MediaAccessibility.css'
import WifiIcon from '@material-ui/icons/Wifi'
import WifiOffIcon from '@material-ui/icons/WifiOff'
import BluetoothIcon from '@material-ui/icons/Bluetooth'
import BluetoothOffIcon from '@material-ui/icons/BluetoothDisabled'
import AirplaneModeIcon from '@material-ui/icons/AirplanemodeActive'
import AirplaneModeOffIcon from '@material-ui/icons/AirplanemodeInactive'
import VolumeIcon from '@material-ui/icons/VolumeUp'
import VolumeMutedIcon from '@material-ui/icons/VolumeOff'
import BrightnessIcon from '@material-ui/icons/BrightnessHigh'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'

const { ipcRenderer } = window.require('electron');

function MediaAccessibility() {

  const systemvolume = useSelector(state => state.systemvolume)
  const systembrightness = useSelector(state => state.systembrightness)
  const togglemediaaccessibility = useSelector(state => state.togglemediaaccessibility)
  const dispatch = useDispatch()

  useEffect(() => {
    if(systemvolume != 0){
        setlocalsystemvolume(systemvolume)
    }
  },[systemvolume])

  const [localsystemvolume, setlocalsystemvolume] = useState(0)

  const setsystemvolume = async (v) => {
    ipcRenderer.send('systemvolume', v);
  }

  const setsystembrightness = async (b) => {
    ipcRenderer.send('systembrightness', b);
  }

  const mutesystemvolume = async (currvolume) => {
    if(currvolume == 0){
        ipcRenderer.send('systemvolume', localsystemvolume);
    }
    else{
        ipcRenderer.send('systemvolume', 0);
    }
  }

  return (
    <motion.div
    animate={{
        bottom: togglemediaaccessibility.toggle? "5px" : "-1000px",
        display: togglemediaaccessibility.delay? "flex" : "none"
    }}
    transition={{
      duration: 0.4
    }}
    id='div_mediaAccessibility'>
        <div id='div_nav_options'>
            <button className='btn_nav_options'><WifiOffIcon style={{color: "black", fontSize: "20px"}} /></button>
            <button className='btn_nav_options'><BluetoothOffIcon style={{color: "black", fontSize: "20px"}} /></button>
            <button className='btn_nav_options'><AirplaneModeOffIcon style={{color: "black", fontSize: "20px"}} /></button>
        </div>
        <hr id='hr_divider'/>
        <div id='div_range_inputs'>
            <div id='div_volume_container'>
                <button id='btn_volume_icon' onClick={() => {
                    mutesystemvolume(systemvolume)
                }}>
                    {systemvolume == 0? (
                        <VolumeMutedIcon style={{color: "white", fontSize: "20px"}} />
                    ) : (
                        <VolumeIcon style={{color: "white", fontSize: "20px"}} />
                    )}
                </button>
                <input type='range' min={0} max={100} value={systemvolume} onChange={(e) => { setsystemvolume(e.target.value); setlocalsystemvolume(e.target.value) }} className='input_range' />
                <p className='p_system_numbering_label'>{systemvolume}</p>
            </div>
            <div id='div_volume_container'>
                <button id='btn_volume_icon'><BrightnessIcon style={{color: "white", fontSize: "20px"}} /></button>
                <input type='range' min={0} max={1} step={0.01} value={systembrightness} onChange={(e) => { setsystembrightness(e.target.value) }} className='input_range' />
                <p className='p_system_numbering_label'>{Math.round(systembrightness * 100)}</p>
            </div>
        </div>
    </motion.div>
  )
}

export default MediaAccessibility