import React, { useEffect, useState } from 'react'
import styles from './secondNavbar.module.css';
import { RxCross2 } from "react-icons/rx";
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SecondNavbar = ({ isDarkMode, toggleDarkMode, handleSubmit, fileName, fileId }) => {

  const navigate = useNavigate();
  const location = useLocation();

  const [currentPage, setCurrentPage] = useState(location.pathname)

  useEffect(() => {
    setCurrentPage(location.pathname)
  }, [location])

  const [activeShare, setActiveShare] = useState(false);

  const handleShare = () => {
    const currentUrl = `${window.location.origin}/form/${fileId}`;
    navigator.clipboard.writeText(currentUrl)
    .then(() => {
      toast.success('URL Copied to ClipBoard');
    })
    .catch((err) => {
      toast.error('failed to copy');
    })
    navigate(`/form/${fileId}`);
  }

  const handleNavigation = (path) => {
    setCurrentPage(path);
    navigate(path)
  }
  

  return (
    <div className={isDarkMode ? styles.navbar : styles.navBarDark}>
      <div className={styles.inpConatiner}>
        <input type="text" className={isDarkMode ? styles.formName : styles.formNameDark} placeholder='Enter Form Name' defaultValue={fileName}/>
      </div>
          <div className={isDarkMode ? styles.navBtn : styles.navBtnDark}>
            <button className={ currentPage === `/workspace-area/${fileId}` ? styles.glowFlow :
            isDarkMode ? styles.flow : styles.flowDark
          } onClick={() => handleNavigation(`/workspace-area/${fileId}`)}>Flow</button>
            <button className={ currentPage === `/form-response/${fileId}` ? styles.glowResponse :
              isDarkMode ? styles.response : styles.responseDark}
              onClick={() => handleNavigation(`/form-response/${fileId}`)}>Response</button>
          </div>
          <div className={styles.theme}>
            <span>Light</span>
            <div className={isDarkMode ? styles.modeToggle : styles.modeToggleDark} onClick={toggleDarkMode}>
              <div className={styles.modeCircle}></div>
            </div>
            <span>Dark</span>
          </div>
          <div className={styles.rightBtn}>
            <button className={activeShare ? styles.shareBtnActive : styles.shareBtn} onClick={() => handleShare()}>Share</button>
            <button className={styles.saveBtn} onClick={() => {
              handleSubmit()
              setActiveShare(true)
            }}>Save</button>
            <RxCross2 className={styles.cross}/>
          </div>
        </div>
  )
}

export default SecondNavbar
