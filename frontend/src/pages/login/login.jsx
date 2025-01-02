import styles from './login.module.css';
import { google_icon, elipse_icon1, elipse_icon2, orangeImg2, orangeImg1 } from '../../assets';
import { FaArrowLeft } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { login } from '../../apis';

export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })

  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState({
    email: null,
    password: null,
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    let errors = false;
    setFormError((formError) => {return {...formError, email: null, password: null}});
    if(!formData.email || formData.email.length < 1 || !formData.email.includes("@") || !formData.email.includes(".")) {
      setFormError((formError) => {return {...formError, email: 'Email is required'}});
      errors = true;
    }
    if(!formData.password) {
      setFormError((formError) => {return {...formError, password: 'Password is required'}});
      errors = true;
    }
    if(errors){
      return
    }

    try {
      setLoading(true);
      const response = await login(formData);
      toast.success(response?.message);
      setFormData({email: '', password: ''});
      setFormError({email: null, password: null});
      if(response?.token) {
        localStorage.setItem('token', response?.token);
        localStorage.setItem('userId', response?.id);
        localStorage.setItem('userName', response?.username);
        navigate(`/formDashboard/${response?.id}`);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  }

  if(loading) {
    return <div>Loading...</div>
  }

  return (
    <div className={styles.container}>
       <div className={styles.backbtn} onClick={() => navigate('/')}><FaArrowLeft className={styles.backIcon}/></div>
       <form className={styles.form} onSubmit={handleRegister}>
       <div className={styles.inputContainer}>
          <label htmlFor="name" className={formError && formError.email ? styles.error : styles.formText}>Email</label>
          <input type="text" placeholder='Enter your Email' onChange={(e) => setFormData({...formData, email: e.target.value})}/>
          {formError.email && <p className={styles.error}>{formError.email}</p>}
        </div>
       <div className={styles.inputContainer}>
          <label htmlFor="name" className={formError && formError.email ? styles.error : styles.formText}>Password</label>
          <input type="password" placeholder='Enter your password' onChange={(e) => setFormData({...formData, password: e.target.value})}/>
          {formError.password && <p className={styles.error}>{formError.password}</p>}
        </div>
        <button type="submit" className={styles.signUpBtn} >Log In</button>
        <p className={styles.text}>OR</p>
        <button className={styles.googleBtn}>
          <img src={google_icon} alt="google icon" />
          <span>Sign Up with Google</span>
        </button>
        <p className={styles.signup}>Don’t have an account?<span onClick={() => navigate('/register')}> Register now</span></p>
       </form>
       <img src = {elipse_icon1} className={styles.bottomImg}/>
      <img src={elipse_icon2} alt="" className={styles.rightImg}/>
      <img src={orangeImg1} alt="" className={styles.img1}/>
      <img src={orangeImg2} alt="" className={styles.img2}/>
    </div>
  )
}