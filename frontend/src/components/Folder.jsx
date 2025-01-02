import React, { useEffect, useRef, useState } from 'react'
import styles from './folder.module.css';
import { RiDeleteBin5Line } from "react-icons/ri";

const Folder = ({ folderName, id, isDarkMode, handledelete, handleClick}) => {

  
    const [isFolderDeleteModalOpen, setIsFolderDeleteModalOpen] = useState(false);


    const modalRef = useRef(null);

    const openDeleteFolderModal = (e) => {
      e.stopPropagation();
      setIsFolderDeleteModalOpen(true);
    };

    const handleCancelClick = () => {
      setIsFolderDeleteModalOpen(false);
    };

    useEffect(() => {
      const handleClickOutside = (event) => {
          if (modalRef.current && !modalRef.current.contains(event.target)) {
            handleCancelClick();
          }
      };

      if (isFolderDeleteModalOpen) {
          document.addEventListener('mousedown', handleClickOutside);
      }

      return () => {
          document.removeEventListener('mousedown', handleClickOutside);
      };
  }, [isFolderDeleteModalOpen]);

  return (
    <>
    <div className={isDarkMode ? styles.folder : styles.folderDark} onClick={() => handleClick(id)}>
      <p>{folderName}</p>
      <RiDeleteBin5Line className={styles.deleteIcon} onClick={(e) => {
        e.stopPropagation();
        openDeleteFolderModal(e);
      }}/>
    </div>
      {/* { Delete Modal for folder */}
        {isFolderDeleteModalOpen && (<div className={styles.modal} ref={modalRef}>
          <p className={styles.modalHeader} onClick={(e) => e.stopPropagation()}>
          Are you sure you want to delete this folder ?
          </p>
          <div className={styles.modalDeleteBtn}>
            <button className={styles.submitBtn} onClick={() => handledelete(id)}>Confirm</button>
            <div className={styles.starightLine}></div>
            <button className={styles.cancelBtn} onClick={handleCancelClick}>Cancel</button>
          </div>
        </div>)}
        {/*isModalWithFolder && (<div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                <p className={styles.modalHeader}>
                Create New File
                </p>
                <input type="text" placeholder='Enter file name' className={styles.modalInput} onChange={(e) => setFileData({ ...fileData, fileName: e.target.value })}/>
                <div className={styles.modalBtn}>
                  <button className={styles.submitBtn} onClick={(e) => {
                    handleSubmit(e);
                    console.log('clicked');
                    closeModal();
                    }}>Done</button>
                  <div className={styles.starightLine}></div>
                  <button className={styles.cancelBtn} onClick={handleCancelClick}>Cancel</button>
                </div>
              </div>)} */}
        </>
  )
}

export default Folder
