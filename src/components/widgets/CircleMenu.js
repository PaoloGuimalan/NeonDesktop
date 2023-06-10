import React from 'react'
import '../../styles/widgets/CircleMenu.css'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import { SET_CONFIRM_EXIT_MODAL_TOGGLE, SET_CONFIRM_EXIT_MODAL_TOGGLE_DELAY, SET_SYSTEM_CMD, SET_TOGGLE_MEDIAACCESSIBILITY } from '../../redux/types/types'
import MenuIcon from '@material-ui/icons/Apps'
import MapIcon from '@material-ui/icons/Map'
import FolderIcon from '@material-ui/icons/Folder'
import UnknownIcon from '@material-ui/icons/BrokenImage'
import MediaSettingsIcon from '@material-ui/icons/Tune'

const { ipcRenderer } = window.require('electron');

function CircleMenu() {

  const systemauth = useSelector(state => state.systemauth)
  const togglemediaaccessibility = useSelector(state => state.togglemediaaccessibility)
  const dispatch = useDispatch()

  var systemcmdreport = (status, report) => {
    dispatch({type: SET_SYSTEM_CMD, systemcmd: {
      status: status,
      report: report
    }})
  }

  const setconfirmexitmodaltoggle = (bool) => {
    dispatch({type: SET_CONFIRM_EXIT_MODAL_TOGGLE, confirmexitmodaltoggle: bool})
  }

  const setconfirmexitmodaltoggledelay = (bool) => {
    dispatch({type: SET_CONFIRM_EXIT_MODAL_TOGGLE_DELAY, confirmexitmodaltoggledelay: bool})
  }

  const clearShutdownModal = () => {
    setconfirmexitmodaltoggle(false)
    setTimeout(() => { setconfirmexitmodaltoggledelay(false) }, 1000)
  }

  const openFile = (path) => {
    ipcRenderer.send('openFile', path)
  }

  const openMediaAccessibility = () => {
    clearShutdownModal()
    if(togglemediaaccessibility.toggle && togglemediaaccessibility.delay){
        dispatch({type: SET_TOGGLE_MEDIAACCESSIBILITY, togglemediaaccessibility: {
            toggle: false,
            delay: true
        }})

        setTimeout(() => {
            dispatch({type: SET_TOGGLE_MEDIAACCESSIBILITY, togglemediaaccessibility: {
                toggle: false,
                delay: false
            }})
        }, 1000)
    }
    else{
        dispatch({type: SET_TOGGLE_MEDIAACCESSIBILITY, togglemediaaccessibility: {
            toggle: true,
            delay: true
        }})
    }
  }

  const defaultCircleMenuIterable = [
    {
      available: true,
      title: "Menu",
      component: <MenuIcon style={{color: "white", fontSize: "35px"}} />,
      action: () => { systemcmdreport("warning","Menu still in development") }
    },
    {
      available: true,
      title: "Map",
      component: <MapIcon style={{color: "white", fontSize: "35px"}} />,
      action: () => { systemcmdreport("warning","Map still in development") }
    },
    {
      available: true,
      title: "File Explorer",
      component: <FolderIcon style={{color: "white", fontSize: "35px"}} />,
      action: () => { openFile("C:\\") }
    },
    {
      available: true,
      title: "Media and Accessibility",
      component: <MediaSettingsIcon style={{color: "white", fontSize: "35px"}} />,
      action: () => { openMediaAccessibility() }
    },
    {
      available: false,
      title: "Unavailable",
      component: <UnknownIcon style={{color: "grey", fontSize: "35px"}} />,
      action: () => {  systemcmdreport("error", "Module Unavailable")}
    },
    {
      available: false,
      title: "Unavailable",
      component: <UnknownIcon style={{color: "grey", fontSize: "35px"}} />,
      action: () => { systemcmdreport("error", "Module Unavailable") }
    },
    {
      available: false,
      title: "Unavailable",
      component: <UnknownIcon style={{color: "grey", fontSize: "35px"}} />,
      action: () => {  systemcmdreport("error", "Module Unavailable")}
    }
  ]

  return (
    <motion.div
        animate={{
          rotate: -360,
          scale: systemauth.status? 1 : 0
        }}
        transition={{
          delay: systemauth.status? 1 : 0,
          duration: 50,
          repeat: Infinity
        }}
        id='div_circle_menu'>
          {defaultCircleMenuIterable.map((btns, i) => {
            return(
              <motion.button
              title={btns.title}
              onClick={btns.action}
              initial={{
                left: (50 - 50*Math.cos(-0.5 * Math.PI - 2*(1/defaultCircleMenuIterable.length)*i*Math.PI)).toFixed(4) + "%",
                top: (50 - 50*Math.sin(-0.5 * Math.PI - 2*(1/defaultCircleMenuIterable.length)*i*Math.PI)).toFixed(4) + "%",
                scale: 0
              }}
              animate={{
                scale: systemauth.status? 1 : 0,
                opacity: btns.available? 1 : 0.8
              }}
              transition={{
                delay: 1,
                duration: 1
              }}
              className='btns_circle_menu'>
                <motion.div
                animate={{
                  rotate: 360,
                  boxShadow: btns.available? "0px 0px 10px white, inset 0px 0px 50px white" : "0px 0px 10px red, inset 0px 0px 50px red"
                }}
                transition={{
                  delay: 0,
                  duration: 50,
                  repeat: Infinity
                }}
                className='div_circle_btn_holder'>
                  {btns.component}
                </motion.div>
              </motion.button>
            )
          })}
        </motion.div>
  )
}

export default CircleMenu