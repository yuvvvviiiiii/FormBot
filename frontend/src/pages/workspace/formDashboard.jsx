import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar';
import styles from  './formDashboard.module.css';
import { createFile, createFileWithoutFolder, createFolder, deleteFile, deleteFolder, fetchData, getSharedUser, shareUser } from '../../apis';
import Folder from '../../components/Folder';
import Files from '../../components/Files';
import { FiFolderPlus } from "react-icons/fi";
import { FaPlus } from "react-icons/fa6";
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { useParams } from 'react-router-dom';


export default function FormDashboard() {
  const [data, setData] = useState([]);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isOpenModalfile, setIsOpenModalfile] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [folderData, setFolderData] = useState({
    folderName: '',
  })
  const [loading, setLoaing] = useState(false);
  const [sharedUser, setSharedUser] = useState([]);
  const [currentFolder, setCurrentFolder] = useState(null);
  const [filesWithoutFolder, setFilesWIthoutFolder] = useState(null);
  const [fileData, setFileData] = useState({
    fileName: '',
  });
  const[folderId, setFolderId] = useState(null);
  const [email, setEmail] = useState('')
  const [permission, setPermission] = useState('view')

  const userId = useParams();

  const getData = async () => {
    try {
      setLoaing(true);
      const response = await fetchData(userId.id);
      if(response){
        setData(response.data)
        if(currentFolder === null){
          setFilesWIthoutFolder(response.fileWithoutFolder);
        } else {
          const updatedFolder = response.data.find(folder => folder._id === folderId);
          if (updatedFolder) {
            setCurrentFolder(updatedFolder);
          }
        }
      }
    } catch (error) {
      toast.error(error.message)
    } finally {
      setLoaing(false);
    }
  };

  const fetchSharedUser = async() => {
    try {
      const response = await getSharedUser();
      setSharedUser(response?.sharedUsers);
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }
  }


  useEffect(() => {
    getData();
    fetchSharedUser();
  }, [userId]);


  const [isDarkMode, setIsDarkMode] = useState(true);
  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      return newMode;
    })
  }

  const handledelete = async (id) => {
    try{
      const response = await deleteFolder(id);
      toast.success(response.message);
      await getData();
    } catch (error) {
      toast.error(error.message)
    }
  }

  const handleCancelClick = () => {
    setIsOpenModal(false);
    setIsOpenModalfile(false);
    setIsShareModalOpen(false);
  }

  const openShareModal = (e) => {
    e.stopPropagation();
    setIsShareModalOpen(true);
  }

  const handleSubmitFolder = async (e) => {
    e.preventDefault();
    if(!folderData.folderName){
      toast.error('Please provide a folder name')
    }

    try {
      const response = await createFolder(folderData);
      if(response.status === 201){
        toast.success(response?.message);
      }
        setIsOpenModal(false);
        setFolderData({
          folderName: ''
        })
        await getData();
  
    } catch (error) {
      toast.error(error)
    }
  }

  const handleSubmitFile = async (e) => {
    e.preventDefault();
    if(!fileData.fileName){
      toast.error('Please Provide File Name');
      return
    }
    try {
      const response = await createFileWithoutFolder(fileData);
      if(response?.status === 201){
        toast.success(response?.message);
        console.log(response);
      };
      setIsOpenModalfile(false);
      setFileData({
        fileName: ''
      })
      await getData();
    } catch (error) {
      toast.error(error);
      console.log(error);
    }
  }

  const handleFileDelete = async (id) => {
    try {
      const response = await deleteFile(id);
      if(response.status === 200) {
        toast.success(response?.message);
      }
      console.log(response);
      toast.success(response?.message);

      await getData();
    } catch (error) {
      toast.error(error);
    }
  }

  const folderClick = (id) => {
    const folder = data.find((folder) => id == folder._id)
    if(folder){
      setCurrentFolder(folder);
      setFolderId(id);
    } else {
      console.log('not in folder');
    }
  }

  const handleFileWithFolderSubmit = async (e)=>{
    e.preventDefault();
    if(!folderId){
      return console.log('folder id not found');
    }
    console.log('permission', permission, 'email', email)
    try {
      const response = await createFile(folderId, fileData);
      if(response.status === 201){
        toast.success(response?.message);
        console.log(response);
      }
      setIsOpenModalfile(false);
        setFileData({
          fileName: ''
        })
        await getData();
    } catch (error) {
      console.log(error)
      toast.error(error)
    }
  }

  const handleSubmitShareModal = async (e) => {
    e.preventDefault();

    const payload = {
      email: email,
      permission: permission,
    };

    try {
      if(!email){
        toast.error('email id is required')
      }

      const response = await shareUser(payload);
      toast.success(response?.message);
    } catch (error) {
      toast.error(error.message);
    }
  }

  if(loading){
    return <h3>loading...</h3>
  }
  return (
    <div className={isDarkMode ? styles.formDashboard : styles.formDashboardDark} onClick={handleCancelClick}>
      <NavBar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} openShareModal={openShareModal} sharedUser={sharedUser}/>
      <div className={styles.folders}>
        <div className={isDarkMode ? styles.createFolder : styles.createFolderDark} onClick={(e) => {
          e.stopPropagation()
          setIsOpenModal(true)
          }}>
          <FiFolderPlus className={styles.folderIcon}/>
          <p>Create a folder</p>
        </div>
        
        {data && data?.map((folder) => (
          <Folder
          folderName={folder?.folderName}
          id={folder?._id}
          key={folder?._id}
          isDarkMode={isDarkMode}
          handledelete={handledelete}
          handleCancelClick={handleCancelClick}
          handleClick={folderClick}
          />
        ))}
        
      </div>
      <div className={styles.files}>
        <div className={styles.createFile} onClick={(e) => {
          e.stopPropagation()
          setIsOpenModalfile(true)
        }}>
          <FaPlus className={styles.plusIcon}/>
          <p>Create a typebot</p>
        </div>
        {currentFolder && (
          <Files filesData={currentFolder?.files} folderId={currentFolder?._id} handleFileDelete={handleFileDelete}/>
        )}
        {!currentFolder && (
          <Files filesData={filesWithoutFolder} folderId={null} handleFileDelete={handleFileDelete}/>
        )}
      </div>
      {/* modal for creating a folder */}
      {isOpenModal && (<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.modalHeader}>
        Create New Folder
        </p>
        <input type="text" placeholder='Enter folder name' className={styles.modalInput}
        onChange={(e) => setFolderData({ ...folderData, folderName: e.target.value })}
        />
        <div className={styles.modalBtn}>
          <button className={styles.submitBtn} onClick={handleSubmitFolder}>Done</button>
          <div className={styles.starightLine}></div>
          <button className={styles.cancelBtn} onClick={handleCancelClick}>Cancel</button>
        </div>
      </div>)}
      {/* modal for creating a file */}
      {isOpenModalfile && (<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <p className={styles.modalHeader}>
        Create New File
        </p>
        <input type="text" placeholder='Enter file name' className={styles.modalInput} onChange={(e) => setFileData({ ...fileData, fileName: e.target.value })}/>
        <div className={styles.modalBtn}>
          <button className={styles.submitBtn} onClick={(e) => {
            if(currentFolder === null){
              handleSubmitFile(e)
            } else if (currentFolder !== null) {
              handleFileWithFolderSubmit(e);
            }
            }}>Done</button>
          <div className={styles.starightLine}></div>
          <button className={styles.cancelBtn} onClick={handleCancelClick}>Cancel</button>
        </div>
      </div>)}
      
      
      {/* Share Modal */}
      {isShareModalOpen && (
        <div className={styles.shareModal} onClick={(e) => e.stopPropagation()}>
          <div className={styles.closeBtn} >
            <RxCross2 className={styles.closeIcon} onClick={handleCancelClick}/>
          </div>
          <div className={styles.shareHeader}>
            <p>Invite by Email</p>
            <select name="views" id="" onChange={(e) => setPermission(e.target.value)}>
              <option value="view">View</option>
              <option value="edit">Edit</option>
            </select>
          </div>
          <input type="text" placeholder='Enter email id' className={styles.modalEmail} onChange={(e) => setEmail(e.target.value)}/>
          <button className={styles.sendInvite} onClick={(e) => handleSubmitShareModal(e)}>Send Invite</button>
          <div className={styles.copyLink}>
            <p>Invite by link</p>
            <button>Copy link</button>
          </div>
        </div>
      )}
    </div>
  )
}