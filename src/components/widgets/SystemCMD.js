import React, { useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { useSelector } from 'react-redux'
import '../../styles/widgets/SystemCMD.css'

const { ipcRenderer } = window.require('electron');

function SystemCMD() {

  const systemauth = useSelector(state => state.systemauth)
  const systemcmd = useSelector(state => state.systemcmd) 
  
  const systemcmdref = useRef(null)

  useEffect(() => {
    systemcmdref.current.scrollTop = systemcmdref.current.scrollHeight
  },[systemcmd])

  return (
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
                <motion.p
                animate={{
                  color: scmd.status == "normal"? "white" : scmd.status == "success"? "lime" : scmd.status == "warning" ? "orange" : scmd.status == "error"? "red" : "normal"
                }}
                key={i} id='p_system_cmd'>{scmd.report}</motion.p>
              )
            })}
        </div>
    </motion.div>
  )
}

export default SystemCMD