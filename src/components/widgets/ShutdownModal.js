import React from 'react'
import { motion } from 'framer-motion'
import { SET_CONFIRM_EXIT_MODAL_TOGGLE, SET_CONFIRM_EXIT_MODAL_TOGGLE_DELAY, SET_SYSTEM_AUTH, SET_SYSTEM_CMD_DEFAULT } from '../../redux/types/types'
import { useDispatch, useSelector } from 'react-redux'
import '../../styles/widgets/ShutdownModal.css'

const { ipcRenderer } = window.require('electron');

function ShutdownModal() {

   const confirmexitmodaltoggle = useSelector(state => state.confirmexitmodaltoggle)
   const confirmexitmodaltoggledelay = useSelector(state => state.confirmexitmodaltoggledelay)
   const dispatch = useDispatch()

   const executeCommandPrompt = (command) => {
    ipcRenderer.send('executeCommand', command)
   }

   const setconfirmexitmodaltoggle = (bool) => {
      dispatch({type: SET_CONFIRM_EXIT_MODAL_TOGGLE, confirmexitmodaltoggle: bool})
   }
  
   const setconfirmexitmodaltoggledelay = (bool) => {
      dispatch({type: SET_CONFIRM_EXIT_MODAL_TOGGLE_DELAY, confirmexitmodaltoggledelay: bool})
   }

   const exitNeonDesktop = () => {
    setconfirmexitmodaltoggle(false)
    setTimeout(() => { setconfirmexitmodaltoggledelay(false) }, 1000)
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
      dispatch({type: SET_SYSTEM_CMD_DEFAULT, systemcmd: []})
      executeCommandPrompt("shutdown -s -t 3")
      // ipcRenderer.send("closeApp", "")
    }, 6000)
  }

  return (
        <motion.div
        animate={{
          bottom: confirmexitmodaltoggle? "5px" : "-1000px",
          display: confirmexitmodaltoggledelay? "flex" : "none"
        }}
        transition={{
          duration: 0.4
        }}
        id='div_confirmexit_container'>
          <div id='div_confirmexit_header'>
            <p id='p_confirmexit_label'>Warning</p>
          </div>
          <div id='div_confirmexit_body'>
            <p id='div_confirmexit_body_content'>Are you sure you want to execute system shutdown?</p>
          </div>
          <div id='div_confirmexit_navigations'>
            <button className='btn_confirmexit' onClick={() => { exitNeonDesktop() }}>Proceed</button>
            <button className='btn_confirmexit' onClick={() => { setconfirmexitmodaltoggle(false); setTimeout(() => { setconfirmexitmodaltoggledelay(false) }, 1000) }}>Cancel</button>
          </div>
        </motion.div>
  )
}

export default ShutdownModal