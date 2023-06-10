import React from 'react'
import '../../styles/widgets/InstalledSoftwares.css'
import { useDispatch, useSelector } from 'react-redux'
import ExeIcon from '@material-ui/icons/SaveRounded'
import { motion } from 'framer-motion'

const { ipcRenderer } = window.require('electron');

function InstalledSoftwares() {

  const systemauth = useSelector(state => state.systemauth)
  const installedsoftwares = useSelector(state => state.installedsoftwares)
  const dispatch = useDispatch()

  const openFile = (path) => {
    ipcRenderer.send('openFile', path)
  }

  return (
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
                    <div key={i} title={isf.DisplayName} className='div_folder_template' onClick={() => { openFile(isf.DisplayIcon.split(",")[0]) }}>
                      <ExeIcon style={{color: "white", fontSize: "35px"}} />
                      <p className='p_folder_label'>{isf.DisplayName}</p>
                    </div>
                  )
                }
              }
            })}
          </div>
    </motion.div>
  )
}

export default InstalledSoftwares