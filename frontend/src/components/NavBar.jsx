import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import styles from './navbar.module.css';

const NavBar = ({ isDarkMode, toggleDarkMode, openShareModal, sharedUser }) => {

  const [selectedValue, setSelectedValue] = useState(null);
  const userName = localStorage.getItem('userName').toString();

  const navigate = useNavigate();
  
  const handleSelectChange = (e) => {
    const value = e.target.value;
    setSelectedValue(value);

    const selectedSharedUser = sharedUser?.find(user => user.name === value)

   if (selectedSharedUser) {
      navigate(`/formdashboard/${selectedSharedUser.userId}`);
    } else if (value === 'settings') {
      navigate('/settings');
    } else if (value === 'Logout') {
      handleLogOut();
    }
  };

  const handleLogOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
    navigate('/');
  }

  return (
    <div className={isDarkMode ? styles.navbar : styles.navBarDark}>
       <div className={isDarkMode ? styles.username : styles.usernameDark}>
        <select onChange={handleSelectChange}>
          <option value={userName}>{userName}'s WorkSpace</option>
          {sharedUser && sharedUser?.map((user) => (
            <option value={user.name} key={user.userId}>{user.name}'s WorkSpace</option>
          ))}
          <option value="settings">Settings</option>
          <option value="Logout" className={styles.logout}>Log Out</option>
        </select>
      </div>
      <div className={styles.theme}>
        <span>Light</span>
        <div className={isDarkMode ? styles.modeToggle : styles.modeToggleDark} onClick={toggleDarkMode}>
          <div className={styles.modeCircle}></div>
        </div>
        <span>Dark</span>
      </div>
      <button className={styles.shareBtn} onClick={(e) => {
        e.stopPropagation();
        openShareModal(e);
      }}>Share</button>
    </div>
  )
}

export default NavBar
