import React from 'react'
import { motion } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import FolderIcon from '@material-ui/icons/Folder'
import FileIcon from '@material-ui/icons/InsertDriveFile'
import ExeIcon from '@material-ui/icons/SaveRounded'
import UnknownIcon from '@material-ui/icons/BrokenImage'
import MenuIcon from '@material-ui/icons/Apps'
import MapIcon from '@material-ui/icons/Map'
import { SET_CURRENT_PATH, SET_SYSTEM_CMD } from '../../redux/types/types'
import '../../styles/widgets/DesktopFileSystem.css'

const { ipcRenderer } = window.require('electron');

function DesktopFileSystem() {

  const systemauth = useSelector(state => state.systemauth)
  const directories = useSelector(state => state.directories);
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

  const openFile = (path) => {
    ipcRenderer.send('openFile', path)
  }

  return (
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
  )
}

export default DesktopFileSystem