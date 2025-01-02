import React, { useState } from 'react'
import FileComponent from './FileComponent';
import styles from './files.module.css';
import { useNavigate, useParams } from 'react-router-dom';

const Files = ({ filesData, folderId, handleFileDelete }) => {

  // const id = useParams();
  // const navigate = useNavigate();

  return (
    <div className={styles.files}>
      {filesData && filesData.map((file) => (
        <FileComponent fileData={file} folderId={folderId}  fileId={file._id} handleFileDelete={handleFileDelete} />
      ))}
    </div>
  )
}

export default Files
