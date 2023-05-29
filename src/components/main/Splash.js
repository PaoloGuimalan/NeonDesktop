import React, { useEffect, useState } from 'react'
import '../../styles/main/Splash.css'
import { useDispatch, useSelector } from 'react-redux';
import { SET_CURRENT_PATH, SET_SYSTEM_AUTH, SET_SYSTEM_CMD } from '../../redux/types/types';
import { motion } from 'framer-motion'

const { ipcRenderer } = window.require('electron');

function Splash() {

  const currentDir = useSelector(state => state.currentpath)
  const directories = useSelector(state => state.directories);
  const systemauth = useSelector(state => state.systemauth)
  const systemcmd = useSelector(state => state.systemcmd)
  const dispatch = useDispatch()

  const enableNeon = () => {
    if(!systemauth.enabled){
      dispatch({type: SET_SYSTEM_AUTH, systemauth: {
        status: false,
        enabled: true,
      }})
      dispatch({type: SET_SYSTEM_CMD, systemcmd: "System starting..."})
    }
  }

  return (
    <div id='div_splash'>
        <motion.div
        animate={{
            border: systemauth.enabled? "solid 3px white" : "solid 3px transparent",
            boxShadow: systemauth.enabled? "0px 0px 30px white, inset 0px 0px 70px white" : "0px 0px 30px transparent, inset 0px 0px 70px transparent",
            scale: systemauth.status? 0 : 1
        }}
        transition={{
            duration: systemauth.status? 1 : 0,
            delay: systemauth.status? 1 : 0
        }}
        id='div_neon_interface'>
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
            id='div_inner_neon'>
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
                id='div_inner2_neon'>
                </motion.div>
            </motion.div>
            <motion.p
            animate={{
                color: systemauth.enabled? "white" : "grey",
                textShadow: systemauth.enabled? "0px 0px 10px white" : "0px 0px 10px transparent"
            }}
            id='p_label_neon' onClick={() => { enableNeon() }}>NEON</motion.p>
        </motion.div>
        <motion.div
        animate={{
          left: systemauth.status? "-100%" : 0
        }}
        transition={{
          duration: systemauth.status? 1 : 0,
          delay: systemauth.status? 1 : 0
        }}
        id='div_startup_cmd'>
          {systemcmd.map((scmd, i) => {
            return(
              <p key={i} className='p_startup_cmd'>{scmd}</p>
            )
          })}
        </motion.div>
    </div>
  )
}

export default Splash