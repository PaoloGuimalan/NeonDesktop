import React, { useEffect, useRef, useState } from 'react'
import '../../styles/main/Home.css'
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'
import FolderIcon from '@material-ui/icons/Folder'
import FileIcon from '@material-ui/icons/InsertDriveFile'
import ExeIcon from '@material-ui/icons/SaveRounded'
import UnknownIcon from '@material-ui/icons/BrokenImage'
import MenuIcon from '@material-ui/icons/Apps'
import MapIcon from '@material-ui/icons/Map'
import { SET_COMMAND_LINE, SET_CONFIRM_EXIT_MODAL_TOGGLE, SET_CONFIRM_EXIT_MODAL_TOGGLE_DELAY, SET_CURRENT_PATH, SET_DATE_TIME, SET_DEFAULT_COMMAND_LINE, SET_SYSTEM_AUTH, SET_SYSTEM_CMD, SET_SYSTEM_CMD_DEFAULT } from '../../redux/types/types';
import NeonCircle from '../widgets/NeonCircle';
import DateTimeBattery from '../widgets/DateTimeBattery';
import CircleMenu from '../widgets/CircleMenu';
import ShutdownModal from '../widgets/ShutdownModal';
import Shortcuts from '../widgets/Shortcuts';
import SystemCMD from '../widgets/SystemCMD';
import DesktopFileSystem from '../widgets/DesktopFileSystem';
import HardwareMini from '../widgets/HardwareMini';
import InstalledSoftwares from '../widgets/InstalledSoftwares';
import WindowsCMD from '../widgets/WindowsCMD';

const { ipcRenderer } = window.require('electron');

function Home() {
  
  const currentDir = useSelector(state => state.currentpath)
  const directories = useSelector(state => state.directories);
  const systemauth = useSelector(state => state.systemauth)
  const systemcmd = useSelector(state => state.systemcmd)
  const installedsoftwares = useSelector(state => state.installedsoftwares)
  const devicehardwares = useSelector(state => state.devicehardwares)
  const datetime = useSelector(state => state.datetime)
  const cpuregisters = useSelector(state => state.cpuregisters)
  const memoryregisters = useSelector(state => state.memoryregisters)
  const commandline = useSelector(state => state.commandline)
  const shortcutslist = useSelector(state => state.shortcutslist)
  const batterystatus = useSelector(state => state.batterystatus)
  const dispatch = useDispatch()

  // const [confirmexitmodaltoggle, setconfirmexitmodaltoggle] = useState(false)
  // const [confirmexitmodaltoggledelay, setconfirmexitmodaltoggledelay] = useState(false);

  // const [datetime, setdatetime] = useState({
  //   time: "",
  //   date: ""
  // });

  // const systemcmdref = useRef(null)
  // const cmdrref = useRef(null

  var systemcmdreport = (status, report) => {
    dispatch({type: SET_SYSTEM_CMD, systemcmd: {
      status: status,
      report: report
    }})
  }

  // useEffect(() => {
  //   systemcmdref.current.scrollTop = systemcmdref.current.scrollHeight
  // },[systemcmd])

  useEffect(() => {
    setInterval(showTime, 1000)
    // console.log(installedsoftwares.filter((fl, i) => fl.DisplayIcon))
  },[])

  function showTime(){
    var date = new Date();
    var n = date.toDateString();
    var time = date.toLocaleTimeString();

    // setdatetime({
    //   time: time,
    //   date: n
    // });
    dispatch({type: SET_DATE_TIME, datetime: {
      time: time,
      date: n
    }})
  }

  return (
    <div id='div_home'>
        <NeonCircle />
        <DateTimeBattery />
        <CircleMenu />
        <ShutdownModal />
        <Shortcuts />
        <SystemCMD />
        <DesktopFileSystem />
        <HardwareMini />
        <InstalledSoftwares />
        <WindowsCMD />
    </div>
  )
}

export default Home