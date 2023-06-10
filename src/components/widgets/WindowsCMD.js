import React, { useRef, useEffect, useState } from 'react'
import '../../styles/widgets/WindowsCMD.css'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion';
import { SET_COMMAND_LINE, SET_DEFAULT_COMMAND_LINE } from '../../redux/types/types';

const { ipcRenderer } = window.require('electron');

function WindowsCMD() {

  const systemauth = useSelector(state => state.systemauth)
  const commandline = useSelector(state => state.commandline)
  const dispatch = useDispatch()

  const cmdrref = useRef(null)

  useEffect(() => {
    setTimeout(() => {
      initcmdwelcomemessage()
    },6000)
  },[])

  const initcmdwelcomemessage = () => {
    var message = "<h1>Welcome, System is now ready for use.</h1> \n Neon Desktop Beta version 1.1.0";
    dispatch({type: SET_COMMAND_LINE, commandline: message.replace(/(?:\r\n|\r|\n)/g, '<br>')})
  }

  useEffect(() => {
    cmdrref.current.scrollTop = cmdrref.current.scrollHeight
    // console.log(commandline)
  },[commandline])

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
        else if(event.target.value == "init"){
          initcmdwelcomemessage()
        }
        else{
          executeCommandPrompt(event.target.value)
        }
      }
      event.currentTarget.value = "";
    }
  }

  return (
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
            <p id='p_cmdr_label'>Command Line</p>
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
          <div id='div_cmdr_footer'></div>
    </motion.div>
  )
}

export default WindowsCMD