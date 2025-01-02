import { useNavigate } from 'react-router-dom';
import { banner_img, blur, orange_bg, orange_triangle, right_icon, } from '../../assets';
import styles from './landingPage.module.css';

export default function LandingPage() {

  const navigate = useNavigate();
  const handleClick = () => {
    const token = localStorage.getItem('token');
    if(token) {
      navigate('/');
    } else{
      navigate('/login');
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.navbar}>
        <div className={styles.navlogo}>
          <div className={styles.navIcon}>
            <div className={styles.orange}>
              <div className={styles.circle1}></div>
              <div className={styles.bar1}></div>
            </div>
            <div className={styles.white}>
              <div className={styles.bar2}></div>
              <div className={styles.circle2}></div>
            </div>
          </div>
          <div className={styles.logo}>FormBot</div>
        </div>
        <div className={styles.btn}>
        <button className={styles.signin} onClick={handleClick}>Sign in</button>
        <button className={styles.formbot} onClick={handleClick}>Create a FormBot</button>
        </div>
      </div>
      <div className={styles.content}>
        <div className={styles.left}>
          <div className={styles.orangePart}>
            <img src={blur} alt="" className={styles.dots}/>
            <img src={orange_triangle} alt="" className={styles.orangeImg}/>
            <img src={orange_bg} alt="" className={styles.orangeBackGround}/>
          </div>
        </div>
        <div className={styles.midContent}>
          <p className={styles.header}>
            Build advanced chatbots visually
          </p>
          <p className={styles.headerText}>
          Typebot gives you powerful blocks to create unique chat experiences. Embed them anywhere on your web/mobile apps and start collecting results like magic.
          </p>
          <button className={styles.headerBtn} onClick={handleClick}>Create a FormBot for free</button>
        </div>
        <div className={styles.right}>
          <img src={blur} alt="" className={styles.dotsright}/>
          <img src={right_icon} alt="" className={styles.right_icon}/>
        </div>
      </div>
      <div className={styles.banner}> 
        <img src={banner_img} alt="" />
      </div>
      <div className={styles.footer}>
        <div className={styles.logo}>
        <p className={styles.madeBy}>Made with ❤️ by
        @cuvette</p>
        </div>
        <div className={styles.product}>
          <p>Product</p>
          <p>Status</p>
          <p>Documentation</p>
          <p>RoadMap</p>
          <p>Pricing</p>
        </div>
        <div className={styles.communtiy}>
          <p>Communtiy</p>
          <p>Discord</p>
          <p>GitHub repository</p>
          <p>Twitter</p>
          <p>LinkedIn</p>
          <p>OSS Firends</p>
        </div>
        <div className={styles.company}>
          <p>Company</p>
          <p>About</p>
          <p>Contact</p>
          <p>Terms of Service</p>
          <p>Privacy Policy</p>
        </div>
      </div>
    </div>
  )
} 