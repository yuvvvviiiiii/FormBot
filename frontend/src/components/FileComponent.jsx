import React, { useState } from 'react';
import styles from './fileComponent.module.css';
import { RiDeleteBin5Line } from "react-icons/ri";
import { useNavigate } from 'react-router-dom';

const FileComponent = ({ fileData, fileId, handleFileDelete }) => {

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  
  const openModal = () => setIsDeleteModalOpen(true);
  const closeModal = () => setIsDeleteModalOpen(false);

  const naviagte = useNavigate();

  const handleFileClick = () => {
    naviagte(`/workspace-area/${fileId}`);
    localStorage.setItem('fileName', fileData.fileName);
  }

  return (
    <>
      <div className={styles.file} onClick={handleFileClick}>
        <p>{fileData?.fileName}</p>
        <RiDeleteBin5Line className={styles.deleteIcon} onClick={(e) => {
          e.stopPropagation();
          openModal();
        }}/>
      </div>
      {/* Delete Modal for file */}
      {isDeleteModalOpen && (<div className={styles.modal} >
        <p className={styles.modalHeader}>
        Are you sure you want to delete this Form ?
        </p>
        <div className={styles.modalDeleteBtn}>
          <button className={styles.submitBtn} onClick={() => handleFileDelete(fileId)}>Confirm</button>
          <div className={styles.starightLine}></div>
          <button className={styles.cancelBtn} onClick={() => closeModal()}>Cancel</button>
        </div>
      </div>)}
    </>
  )
}

export default FileComponent;
