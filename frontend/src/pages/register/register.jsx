import styles from './register.module.css';
import { google_icon, elipse_icon1, elipse_icon2, orangeImg2, orangeImg1 } from '../../assets';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { register } from '../../apis';
import toast from 'react-hot-toast';

export default function Register() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    email: null,
    password: null,
    name: null,
    confirmPassword: null,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError((formError) => {return {...formError, email: null, password: null, name: null, confirmPassword: null}});
    if(!formData.email || formData.email.length < 1 || !formData.email.includes("@") || !formData.email.includes(".")) {
      setFormError((formError) => {return {...formError, email: 'Email is required'}});
      errors = true;
    }
    if(!formData.password) {
      setFormError((formError) => {return {...formError, password: 'Password is required'}});
      errors = true;
    }
    if(!formData.name || formData.name.length === 0) {
      setFormError((formError) => {return {...formError, name: 'Name is required'}});
      errors = true;
    }
    if(!formData.confirmPassword) {
      setFormError((formError) => {return {...formError, confirmPassword: 'Confirm Password is required'}});
      errors = true;
    }
    if(formData.password !== formData.confirmPassword) {
      setFormError((formError) => {return {...formError, confirmPassword: 'enter same password in both fields'}});
      errors = true;
    }
    if(errors){
      return
    }

    try {
      setLoading(true);
      const response = await register(formData);
      toast.success(response.message);
      setFormData({name: '', email: '', password: '', confirmPassword: ''});
      setFormError({email: null, password: null, name: null, confirmPassword: null});
      if(response.token){
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  if(loading){
    return(
      <div>Loading...</div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.backbtn}><FaArrowLeft className={styles.backIcon}/></div>
      <form className={styles.form} onSubmit={handleRegister}>
        <div className={styles.inputContainer}>
          <label htmlFor="name" className={formError && formError.name ? styles.error : styles.formText}>Username</label>
          <input type="text" placeholder='Enter a username' onChange={(e) => setFormData({...formData, name: e.target.value})}/>
          {formError.name && <p className={styles.error}>{formError.name}</p>}
        </div>
        <div className={styles.inputContainer}>
        <label htmlFor="email" className={formError && formError.email ? styles.error : styles.formText}>Email</label>
        <input type="email" placeholder='Enter your email' onChange={(e) => setFormData({...formData, email: e.target.value})}/>
        {formError.email && <p className={styles.error}>{formError.email}</p>}
        </div>
        <div className={styles.inputContainer}>
        <label htmlFor="password" className={formError && formError.password ? styles.error : styles.formText}>Password</label>
        <input type="password" placeholder='Enter Your Password' onChange={(e) => setFormData({...formData, password: e.target.value})}/>
        {formError.password && <p className={styles.error}>{formError.password}</p>}
        </div>
        <div className={styles.inputContainer}>
          <label htmlFor="password" className={formError && formError.confirmPassword ? styles.error : styles.formText}>Confirm Password</label>
          <input type='password' placeholder='Re-Enter your password' onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}/>
          {formError.confirmPassword && <p className={styles.error}>{formError.confirmPassword}</p>}
        </div>
        <button type="submit" className={styles.signUpBtn} >Sign Up</button>
        <p className={styles.text}>OR</p>
        <button className={styles.googleBtn}>
          <img src={google_icon} alt="google icon" />
          <span>Sign Up with Google</span>
        </button>
        <p className={styles.login}>Don’t have an account? <span onClick={() => navigate('/login')}>Login</span></p>
      </form>
      <img src = {elipse_icon1} className={styles.bottomImg}/>
      <img src={elipse_icon2} alt="" className={styles.rightImg}/>
      <img src={orangeImg1} alt="" className={styles.img1}/>
      <img src={orangeImg2} alt="" className={styles.img2}/>
    </div>
  )
}