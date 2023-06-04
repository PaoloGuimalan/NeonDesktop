import React, { useEffect, useRef, useState } from 'react'
import '../../styles/main/Home.css'
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion'
import FolderIcon from '@material-ui/icons/Folder'
import FileIcon from '@material-ui/icons/InsertDriveFile'
import ExeIcon from '@material-ui/icons/SaveRounded'
import UnknownIcon from '@material-ui/icons/BrokenImage'
import BatteryNotCharging from '@material-ui/icons/BatteryStd'
import BatteryCharging from '@material-ui/icons/BatteryChargingFull'
import BatteryAlert from '@material-ui/icons/BatteryAlert'
import { SET_CURRENT_PATH, SET_DATE_TIME, SET_DEFAULT_COMMAND_LINE, SET_SYSTEM_AUTH, SET_SYSTEM_CMD, SET_SYSTEM_CMD_DEFAULT } from '../../redux/types/types';import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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

  // const [datetime, setdatetime] = useState({
  //   time: "",
  //   date: ""
  // });

  const systemcmdref = useRef(null)
  const cmdrref = useRef(null)

  useEffect(() => {
    systemcmdref.current.scrollTop = systemcmdref.current.scrollHeight
  },[systemcmd])

  useEffect(() => {
    cmdrref.current.scrollTop = cmdrref.current.scrollHeight
    // console.log(commandline)
  },[commandline])

  const getData = (dirLink) => {
    ipcRenderer.send('dirList', dirLink);
  };

  const openFile = (path) => {
    ipcRenderer.send('openFile', path)
  }

  const executeCommandPrompt = (command) => {
    ipcRenderer.send('executeCommand', command)
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      // console.log('do validate')
      if(event.target.value.split("").length != 0){
        if(event.target.value == "cls"){
          dispatch({type: SET_DEFAULT_COMMAND_LINE, commandline: []})
        }
        else{
          executeCommandPrompt(event.target.value)
        }
      }
      event.currentTarget.value = "";
    }
  }

  const goToPath = (path) => {
    var currentPath = currentDir;
    var newPath = currentPath.split("\\").length == 1? `${currentDir}${path}` : `${currentDir}\\${path}`
    dispatch({type: SET_CURRENT_PATH, currentpath: newPath})
    dispatch({type: SET_SYSTEM_CMD, systemcmd: `Entered ${newPath}`})
    getData(newPath)
  }

  const goBackPath = () => {
    var currentPath = currentDir.split("\\")
    var poppedPath = currentPath.length == 1? currentPath : currentPath.pop()
    var finalNewPath = currentPath.length == 1? `${currentPath.join("")}\\` : currentPath.join("\\")
    dispatch({type: SET_CURRENT_PATH, currentpath: finalNewPath})
    dispatch({type: SET_SYSTEM_CMD, systemcmd: `Returned to ${finalNewPath}`})
    if(currentPath.length > 1){
      getData(finalNewPath)
    }
  }

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

  const options = {
    maintainAspectRatio: false,
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels:{
          color: "white"
        }
      }
    },
    scales: {
      y: {
          max: 100,
          min: 0,
          ticks: {
              stepSize: 10,
              color: "white"
          }
      }
    }
  };

  const labels = cpuregisters.map((cpur, i) => cpur.time)

  const data = {
    labels,
    datasets: [
      {
        label: 'CPU',
        data: cpuregisters.map((cpur, i) => cpur.register),
        borderColor: 'cyan',
        backgroundColor: 'cyan',
      },
      {
        label: 'Memory',
        data: memoryregisters.map((cpur, i) => cpur.register),
        borderColor: 'orange',
        backgroundColor: 'orange',
      }
    ],
  }

  const exitNeonDesktop = () => {
    // dispatch({type: SET_SYSTEM_CMD_DEFAULT, systemcmd: []})
    dispatch({type: SET_SYSTEM_AUTH, systemauth: {
      status: false,
      enabled: true,
    }})
    setTimeout(() => {
      dispatch({type: SET_SYSTEM_AUTH, systemauth: {
        status: false,
        enabled: false,
      }})
    }, 5000)
    setTimeout(() => {
      ipcRenderer.send("closeApp", "")
    }, 6000)
  }

  return (
    <div id='div_home'>
        <motion.div
        initial={{
          scale: 0
        }}
        animate={{
            border: systemauth.enabled? "solid 3px white" : "solid 3px transparent",
            boxShadow: systemauth.enabled? "0px 0px 30px white, inset 0px 0px 70px white" : "0px 0px 30px transparent, inset 0px 0px 70px transparent",
            scale: 1
        }}
        transition={{
            duration: 1,
            delay: 0
        }}
        id='div_neon_interface_home'>
            <motion.div
            animate={systemauth.enabled? {
                rotate: 360,
                borderTop: "solid 5px white",
                borderLeft: "solid 5px white",
                borderRight: "solid 5px white",
                borderBottom: "solid 5px white",
                borderRightStyle: "dashed",
                borderBottomStyle: "dashed"
            } : {
                borderTop: "solid 5px transparent",
                borderLeft: "solid 5px transparent",
                borderRight: "solid 5px transparent",
                borderBottom: "solid 5px transparent",
                borderRightStyle: "dashed",
                borderBottomStyle: "dashed"
            }}
            transition={{
                duration: 5,
                repeat: Infinity
            }}
            id='div_inner_neon_home'>
                <motion.div
                animate={systemauth.enabled? {
                    rotate: -360,
                    borderTop: "solid 5px white",
                    borderLeft: "solid 5px white",
                    borderRight: "solid 5px white",
                    borderBottom: "solid 5px white",
                    borderRightStyle: "dashed",
                    borderBottomStyle: "dashed"
                } : {
                    borderTop: "solid 5px transparent",
                    borderLeft: "solid 5px transparent",
                    borderRight: "solid 5px transparent",
                    borderBottom: "solid 5px transparent",
                    borderRightStyle: "dashed",
                    borderBottomStyle: "dashed"
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity
                }}
                id='div_inner2_neon_home'>
                </motion.div>
            </motion.div>
            <motion.p
            animate={{
                color: systemauth.enabled? "white" : "grey",
                textShadow: systemauth.enabled? "0px 0px 10px white" : "0px 0px 10px transparent"
            }}
            id='p_label_neon_home' onClick={() => { exitNeonDesktop() }}>NEON</motion.p>
        </motion.div>
        <motion.div
        animate={{
          left: systemauth.status? "5px" : "-100%"
        }}
        transition={{
          duration: 1,
          delay: 0
        }}
        id='div_top_header'>
          <div id='div_datetime_header'>
            <p id='p_time_label'>{datetime.time}</p>
            <p id='p_date_label'>{datetime.date}</p>
          </div>
          <div id='div_battery_container'>
            <div id='div_battery_icon_label'>
              {batterystatus.power? (
                <BatteryCharging style={{fontSize: "25px", color: "white"}} />
              ) : (
                batterystatus.percentage <= 20? (
                  <BatteryAlert style={{fontSize: "25px", color: "white"}} />
                ) : (
                  <BatteryNotCharging style={{fontSize: "25px", color: "white"}} />
                )
              )}
              <p id='p_batterylevel_label'>{batterystatus.percentage.toFixed(0)}% {batterystatus.power? "Charging" : "On Battery"}</p>
            </div>
            <div id='div_battery_level_bar_outer'>
              <motion.div
              animate={{
                width: `${batterystatus.percentage}%`
              }}
              id='div_battery_level_bar_inner'></motion.div>
            </div>
          </div>
        </motion.div>
        <motion.div
        animate={{
          top: systemauth.status? "5px" : "-100%"
        }}
        transition={{
          duration: 1,
          delay: systemauth.status? 3 : 0
        }}
        id='div_shortcut_widget'>
          <div id='div_shortcut_container'>
            <div id='div_shortcut_header'>
              <p id='p_shortcut_header_label'>Shortcuts</p>
            </div>
            <div id='div_shortcut_list'>
              {shortcutslist.map((scl, i) => {
                if(scl.isDirectory){
                  return(
                    <div key={i} className='div_shortcuts_template' onClick={() => { goToPath(scl.fileName) }}>
                      <FolderIcon style={{color: "black", fontSize: "35px"}} />
                      {/* <img src={scl.icon} /> */}
                      <p className='p_folder_shortcut_label'>{scl.fileName}</p>
                    </div>
                  )
                }
                else if(scl.isFile){
                  return(
                    <div key={i} className='div_shortcuts_template' onClick={() => { openFile(scl.filepath) }}>
                      <FileIcon style={{color: "black", fontSize: "35px"}} />
                      {/* <img src={scl.icon} className='img_files_indicator' /> */}
                      <p className='p_folder_shortcut_label'>{scl.fileName}</p>
                    </div>
                  )
                }
                else{
                    <div key={i} className='div_shortcuts_template' onClick={() => {  }}>
                      <UnknownIcon style={{color: "black", fontSize: "35px"}} />
                      {/* <img src={scl.icon} className='img_files_indicator' /> */}
                      <p className='p_folder_shortcut_label'>{scl.fileName}</p>
                    </div>
                }
              })}
            </div>
          </div>
          {/* <div id='div_slanted_status_container'>
            <div id='div_battery_icon_container'>
              {batterystatus.power? (
                <BatteryCharging style={{fontSize: "25px", color: "white"}} />
              ) : (
                batterystatus.percentage <= 20? (
                  <BatteryAlert style={{fontSize: "25px", color: "white"}} />
                ) : (
                  <BatteryNotCharging style={{fontSize: "25px", color: "white"}} />
                )
              )}
              <p id='p_batterylevel_label'>{batterystatus.percentage.toFixed(0)}%</p>
            </div>
            <div id='div_battery_level_bar_container'>
              <div id='div_battery_level_bar_outer'>
                  <motion.div
                  animate={{
                    height: batterystatus.percentage
                  }}
                  id='div_battery_level_bar_inner'></motion.div>
              </div>
            </div>
          </div> */}
        </motion.div>
        <motion.div
        animate={{
          left: systemauth.status? "5px" : "-100%"
        }}
        transition={{
          duration: 1,
          delay: 0.5
        }}
        id='div_system_cmd'>
          <div id='div_inner_system_cmd' ref={systemcmdref}>
            {systemcmd.map((scmd, i) => {
              return(
                <p key={i} id='p_system_cmd'>{scmd}</p>
              )
            })}
          </div>
        </motion.div>
        <motion.div
        animate={{
          left: systemauth.status? "5px" : "-100%"
        }}
        transition={{
          duration: 1,
          delay: 1
        }}
        id='div_file_system'>
          <div id='div_fs_header'>
            <p id='p_fs_label'>File System</p>
            <p id='p_fs_path_label'>{currentDir}</p>
          </div>
          <div id='div_fs_content'>
            <div className='div_folder_template' onClick={() => { goBackPath() }}>
              <FolderIcon style={{color: "white", fontSize: "35px"}} />
              <p className='p_folder_label'>..</p>
            </div>
            {directories.map((dr, i) => {
              if(dr.isDirectory){
                return(
                  <div key={i} className='div_folder_template' onClick={() => { goToPath(dr.fileName) }}>
                    <FolderIcon style={{color: "white", fontSize: "35px"}} />
                    {/* <img src={dr.icon} /> */}
                    <p className='p_folder_label'>{dr.fileName}</p>
                  </div>
                )
              }
              else if(dr.isFile){
                return(
                  <div key={i} className='div_folder_template' onClick={() => { openFile(dr.filepath) }}>
                    {/* <FileIcon style={{color: "white", fontSize: "35px"}} /> */}
                    <img src={dr.icon} className='img_files_indicator' />
                    <p className='p_folder_label'>{dr.fileName}</p>
                  </div>
                )
              }
              else{
                  <div key={i} className='div_folder_template' onClick={() => {  }}>
                    <UnknownIcon style={{color: "white", fontSize: "35px"}} />
                    {/* <img src={dr.icon} className='img_files_indicator' /> */}
                    <p className='p_folder_label'>{dr.fileName}</p>
                  </div>
              }
            })}
          </div>
        </motion.div>
        <motion.div
        animate={{
          right: systemauth.status? "5px" : "-1000px"
        }}
        transition={{
          duration: 1,
          delay: 1.5
        }}
        id='div_hardware_usage'>
          <div id='div_hu_header'>
            <p id='p_fs_label'>Hardwares</p>
          </div>
          <div id='div_graph_container'>
            <Line options={options} data={data} />
          </div>
        </motion.div>
        <motion.div
        animate={{
          right: systemauth.status? "5px" : "-1000px"
        }}
        transition={{
          duration: 1,
          delay: 2
        }}
        id='div_installed_softwares'>
          <div id='div_hu_header'>
            <p id='p_fs_label'>Softwares</p>
          </div>
          <div id='div_is_content'>
            {installedsoftwares.filter((fl, i) => fl.DisplayIcon).map((isf, i) => {
              if(isf.DisplayName){
                if(isf.DisplayIcon.includes(".exe")){
                  return(
                    <div key={i} className='div_folder_template' onClick={() => { openFile(isf.DisplayIcon.split(",")[0]) }}>
                      <ExeIcon style={{color: "white", fontSize: "35px"}} />
                      <p className='p_folder_label'>{isf.DisplayName}</p>
                    </div>
                  )
                }
              }
            })}
          </div>
        </motion.div>
        <motion.div
        animate={{
          right: systemauth.status? "5px" : "-1000px"
        }}
        transition={{
          duration: 1,
          delay: 2.5
        }}
        id='div_windows_cmd'>
          <div id='div_cmdr_header'>
            <p id='p_fs_label'>Command Line</p>
          </div>
          <div id='div_cmdr_container' ref={cmdrref}>
            {commandline.map((cmdr, i) => {
              return(
                <div key={i} className='p_cmdr_format' dangerouslySetInnerHTML={{__html: cmdr}}></div>
              )
            })}
            <div id='div_cmd_input_container'>
              <p id='p_cmd_prompt_label'>Neon&gt;</p>
              <input type='text' onKeyDown={handleKeyDown} id='input_cmd_prompt' />
            </div>
          </div>
        </motion.div>
    </div>
  )
}

export default Home