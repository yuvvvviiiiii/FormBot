import { useState } from 'react';
import styles from './workspaceArea.module.css';
import SecondNavbar from '../../components/SecondNavbar';
import { LuMessageSquare } from "react-icons/lu";
import { FiImage } from "react-icons/fi";
import { TfiVideoClapper } from "react-icons/tfi";
import { MdGif } from "react-icons/md";
import { RxText } from "react-icons/rx";
import { HiHashtag } from "react-icons/hi";
import { MdAlternateEmail } from "react-icons/md";
import { FiPhone } from "react-icons/fi";
import { FiCalendar } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa6";
import { TfiCheckBox } from "react-icons/tfi";
import { ImFlag } from "react-icons/im";
import { RiDeleteBin5Line } from "react-icons/ri";
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { addFileData } from '../../apis';

export default function WorkSpaceArea () {

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [components, setComponents] = useState([]);
  const [inputValues, setInputValues] = useState({});

  const { id } = useParams();

    const toggleDarkMode = () => {
      setIsDarkMode((prevMode) => {
        const newMode = !prevMode;
        return newMode;
      })
    }

    const getFileName = () => {
      const fileName = localStorage.getItem('fileName');
      return fileName;
    }


    const fileName = getFileName();

    const addComponent = (type, label, fileType) => {
      if (type !== 'gif' && type !== 'video') {
        const newComponent = { type, label, fileType, id: Date.now() };
        setComponents((prev) => [...prev, newComponent]);
        setInputValues((prev) => ({ ...prev, [newComponent.id]: '' }));
      }
    };

    const bubbles = [
      {type: 'text', fileType:'bubbles', label: 'Text', icon: <LuMessageSquare/>},
      {type: 'image',fileType:'bubbles', label: 'Image', icon: <FiImage/>},
      {label: 'Video', type: 'video', icon: <TfiVideoClapper/>},
      {label: 'GIF', type:'gif', icon: <MdGif/>}
    ];

    const inputs = [
      { type: 'text', fileType:'inputs', label: 'Text', icon: <RxText /> },
      { type: 'number', fileType:'inputs', label: 'Number', icon: <HiHashtag /> },
      { type: 'email', fileType:'inputs', label: 'Email', icon: <MdAlternateEmail /> },
      { type: 'phone', fileType:'inputs', label: 'Phone', icon: <FiPhone /> },
      { type: 'date', fileType:'inputs', label: 'Date', icon: <FiCalendar /> },
      { type: 'rating', fileType:'inputs', label: 'Rating', icon: <FaRegStar /> },
      { type: 'buttons', fileType:'inputs', label: 'Buttons', icon: <TfiCheckBox /> }
    ]
    
    // handle input change dynamically
    const handleInputChange = (id, value) => {
      setInputValues((prev) => ({
        ...prev,
        [id]: value,
      }));
    };
    
    const deleteComponent = (id) => {
      setComponents((prev) => prev.filter((item) => item.id !== id));
      setInputValues((prev) => {
        const updatedValues = { ...prev };
        delete updatedValues[id];
        return updatedValues;
      });
    };

    const dataForPost = () => {
      const postData = components.map((comp) => {
        const dataValue = inputValues[comp.id] || '';
        return {
          type: comp.type,
          fileType: comp.fileType,
          data: dataValue
        };
      })
      return postData;
    }

    const data =  dataForPost();
    

    const handleSubmit = async () => {
      try {
        const response = await addFileData(id, data);
        toast.success(response?.message);
        console.log(response);
      } catch (error) {
        toast.error(error.toString());
        console.log(error);
      }
      console.log('id', id);
      console.log('data', data);
    }

  return (
      <div className={isDarkMode ? styles.container : styles.containerDark}>
        <SecondNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} handleSubmit={handleSubmit} fileName={fileName} fileId={id} />
        <div className={isDarkMode ? styles.content : styles.contentDark}>
          <div className={isDarkMode ? styles.left : styles.leftDark}>
            <div className={styles.options}>
              <div className={styles.bubbles}>
                <p className={styles.header}>Bubbles</p>
                <div className={styles.bubbleOption}>
                  {bubbles?.map((bubble) => (
                    <div className={isDarkMode ? styles.bubble: styles.bubbleDark} key={bubble.type} onClick={() => addComponent(bubble.type, bubble.label, bubble.fileType)}>
                    <div className={styles.icon}>{bubble.icon}</div>
                    <p>{bubble.label}</p>
                  </div>
                  ))}
                </div>
              </div>
              <div className={styles.inputs}>
                <p className={styles.header}>Inputs</p>
                <div className={styles.inputOption}>
                {inputs.map((input) => (
                  <div className={isDarkMode ? styles.input : styles.inputDark} key={input.type} onClick={() => addComponent(input.type, input.label, input.fileType)}>
                  <div className={styles.inputicon}>{input.icon}</div>
                  <p>{input.label}</p>
                </div>
                ))}
                </div>
              </div>
            </div>
          </div>
          <div className={isDarkMode ? styles.right : styles.rightDark}>
            <div className={isDarkMode ? styles.start : styles.startDark}>
              <ImFlag className={styles.flagIcon}/>
              <p>Start</p>
            </div>
            {components.map((comp, index) => (
              <div className={isDarkMode ? styles.bubblesText : styles.bubblesTextDark} key={index}>
              <p className={isDarkMode ? styles.textHeader : styles.textHeaderDark}>{comp.label}</p>
              <div className={styles.textInput}>
                {comp.type === 'text' && comp.fileType === 'bubbles' && (<>
                  <LuMessageSquare className={styles.bubbleIcon}/>
                  <input type="text" placeholder='Edit Text here' className={isDarkMode ? styles.formInput : styles.formInputDark} value={inputValues[comp.id] || ''} onChange={(e) => handleInputChange(comp.id, e.target.value)}/>
                  </>)}
                {comp.type === 'image' && comp.fileType === 'bubbles' && (<>
                  <FiImage className={styles.bubbleIcon}/>
                  <input type="text" placeholder='Edit Text here' className={isDarkMode ? styles.formInput : styles.formInputDark} value={inputValues[comp.id] || ''} onChange={(e) => handleInputChange(comp.id, e.target.value)}/>
                  </>)}
                {comp.type === 'text' && comp.fileType === 'inputs' && <p className={styles.hint}>Hint : User will input a text on his form</p>}
                {comp.type === 'number' && comp.fileType === 'inputs' && <p className={styles.hint}>Hint : User will input a email on his form</p>}
                {comp.type === 'email' && comp.fileType === 'inputs' && <p className={styles.hint}>Hint : User will input a email on his form</p>}
                {comp.type === 'phone' && comp.fileType === 'inputs' && <p className={styles.hint}>Hint : User will input a phone on his form</p>}
                {comp.type === 'date' && comp.fileType === 'inputs' && <p className={styles.hint}>Hint : User will select a date</p>}
                {comp.type === 'rating' && comp.fileType === 'inputs' && <p className={styles.hint}>Hint : User will tap to rate out of 5</p>}
                {comp.type === 'buttons' && comp.fileType === 'inputs' && <button>Button Example</button>}
              </div>
              <RiDeleteBin5Line className={styles.deleteIcon} onClick={() => deleteComponent(comp.id)}/>
            </div>
            ))
            }
          </div>
        </div>
      </div>
  )
}