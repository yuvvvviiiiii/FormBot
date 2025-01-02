import styles from './settings.module.css';
import { FaRegUser, FaLock } from "react-icons/fa";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { TbLogout } from "react-icons/tb";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { updateUser } from '../../apis';

export default function Settings () {

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [data, setData] = useState({
    name: null, email: null, oldPassword: null, newPassword: null
  })

  const toggleVisibility = () => {
    setShowPassword(!showPassword);
  }
  const toggleVisibilityEmail = () => {
    setShowEmail(!showEmail);
  }
  const toggleVisibilityNewPass = () => {
    setShowNewPass(!showNewPass);
  }

  const handleUpdate = async (e) => {
    e.preventDefault();
    if(data.name === null && data.email === null && data.oldPassword === null && data.newPassword === null ){
      return toast.error('Please Fill atleast one field');
    }
    try {
      const response = await updateUser(data);
      toast.success(response?.message);
    } catch (error) {
      toast.error(error)
    } finally{
      setData({
        name: null,
        email: null,
        oldPassword: null,
        newPassword: null
      })
    }

  }

  const handleLogOut = () => {
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    localStorage.removeItem('token');
    navigate('/');
  }

  return (
    <div className={styles.container}>
      <p className={styles.settingsHeader}>Settings</p>
      <div className={styles.setting}>
        <div className={styles.inputGroup}>
          <FaRegUser className={styles.inputIcon}/>
          <input
           type="text" 
           placeholder='Name' 
           className={styles.inputField}
           value={data.name || ""}
            onChange={(e) => setData({...data, name: e.target.value })}
           />
        </div>
        {/* Password Input with Visibility Toggle */}
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showEmail ? "text" : "password"}
              placeholder="Update Email"
              value={data.email || ""}
              className={styles.inputField}
              onChange={(e) => setData({...data, email: e.target.value })}
            />
            {showEmail ? (
              <AiOutlineEyeInvisible
                className={styles.toggleIcon}
                onClick={toggleVisibilityEmail}
              />
            ) : (
              <AiOutlineEye
                className={styles.toggleIcon}
                onClick={toggleVisibilityEmail}
              />
            )}
          </div>
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Old Password"
              className={styles.inputField}
              value={data.oldPassword || ""}
              onChange={(e) => setData({...data, oldPassword: e.target.value })}
            />
            {showPassword ? (
              <AiOutlineEyeInvisible
                className={styles.toggleIcon}
                onClick={toggleVisibility}
              />
            ) : (
              <AiOutlineEye
                className={styles.toggleIcon}
                onClick={toggleVisibility}
              />
            )}
          </div>
          <div className={styles.inputGroup}>
            <FaLock className={styles.inputIcon} />
            <input
              type={showNewPass ? "text" : "password"}
              placeholder="New Password"
              className={styles.inputField}
              value={data.newPassword || ""}
              onChange={(e) => setData({...data, newPassword: e.target.value })}
            />
            {showNewPass ? (
              <AiOutlineEyeInvisible
                className={styles.toggleIcon}
                onClick={toggleVisibilityNewPass}
              />
            ) : (
              <AiOutlineEye
                className={styles.toggleIcon}
                onClick={toggleVisibilityNewPass}
              />
            )}
          </div>
          <button className={styles.updateBtn} onClick={handleUpdate}>Update</button>
      </div>
      <div className={styles.logout} onClick={handleLogOut}>
        <TbLogout className={styles.logoutIcon}/>
        <p>Log Out</p>
        </div>
    </div>
  )
}