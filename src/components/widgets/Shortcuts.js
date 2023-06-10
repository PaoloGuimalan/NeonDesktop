import React from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { SET_CURRENT_PATH, SET_SYSTEM_CMD } from '../../redux/types/types'
import FolderIcon from '@material-ui/icons/Folder'
import FileIcon from '@material-ui/icons/InsertDriveFile'
import ExeIcon from '@material-ui/icons/SaveRounded'
import UnknownIcon from '@material-ui/icons/BrokenImage'
import MenuIcon from '@material-ui/icons/Apps'
import MapIcon from '@material-ui/icons/Map'
import '../../styles/widgets/Shortcut.css'

const { ipcRenderer } = window.require('electron');

function Shortcuts() {
    
  const systemauth = useSelector(state => state.systemauth)
  const shortcutslist = useSelector(state => state.shortcutslist)
  const currentDir = useSelector(state => state.currentpath)
  const dispatch = useDispatch()

  const getData = (dirLink) => {
    ipcRenderer.send('dirList', dirLink);
  };

  const goToPath = (path) => {
    var currentPath = currentDir;
    var newPath = currentPath.split("\\").length == 1? `${currentDir}${path}` : `${currentDir}\\${path}`
    dispatch({type: SET_CURRENT_PATH, currentpath: newPath})
    dispatch({type: SET_SYSTEM_CMD, systemcmd: `Entered ${newPath}`})
    getData(newPath)
  }

  const openFile = (path) => {
    ipcRenderer.send('openFile', path)
  }

  return (
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
                    <div key={i} title={scl.fileName} className='div_shortcuts_template' onClick={() => { goToPath(scl.fileName) }}>
                      <FolderIcon style={{color: "black", fontSize: "35px"}} />
                      {/* <img src={scl.icon} /> */}
                      <p className='p_folder_shortcut_label'>{scl.fileName}</p>
                    </div>
                  )
                }
                else if(scl.isFile){
                  return(
                    <div key={i} title={scl.fileName} className='div_shortcuts_template' onClick={() => { openFile(scl.filepath) }}>
                      <FileIcon style={{color: "black", fontSize: "35px"}} />
                      {/* <img src={scl.icon} className='img_files_indicator' /> */}
                      <p className='p_folder_shortcut_label'>{scl.fileName}</p>
                    </div>
                  )
                }
                else{
                    <div key={i} title={scl.fileName} className='div_shortcuts_template' onClick={() => {  }}>
                      <UnknownIcon style={{color: "black", fontSize: "35px"}} />
                      {/* <img src={scl.icon} className='img_files_indicator' /> */}
                      <p className='p_folder_shortcut_label'>{scl.fileName}</p>
                    </div>
                }
              })}
            </div>
          </div>
        </motion.div>
  )
}

export default Shortcuts