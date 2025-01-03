import React, { useEffect, useState } from 'react';
import styles from './formPage.module.css';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { fetchForm, submitFormData } from '../../apis';
import { AiOutlineSend } from "react-icons/ai";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css'

const FormPage = () => {
  const {id} = useParams();
  const [formData, setFormData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [formResponses, setFormResponses] = useState({});

  const fetchFormData = async () => {
    try {
      setLoading(true);
      const response = await fetchForm(id);
      setFormData(response?.file);
    } catch (error) {
      toast.error(error.toString());
    } finally{
      setLoading(false)
    }
  }
  const [date, setDate] = useState(new Date());

  
  useEffect(() => {
    fetchFormData();
  }, []);

  const handleInputChange = (key, value) => {
    setFormResponses((prev) => {
      if(value === ''){
        const { [key]: _, ...rest } = prev;
      return rest;
      }
      return { ...prev, [key]: value };
    })
  }

  const handleRatingChange = (rating) => {
    setFormResponses((prev) => ({ ...prev, rating }));
  };

  const handleIndividualSubmit = async (key) => {
    if (!formResponses[key]) {
      toast.error('Please fill out this field before submitting.');
      return;
    }
  
    const singleResponse = { [key]: formResponses[key] };
  
    try {
      const response = await submitFormData(id, singleResponse);
      if(response){
      toast.success(`Response for "${key}" submitted successfully!`);
      }
    } catch (error) {
      toast.error(`Failed to submit "${key}": ${error.message}`);
    }
  };

  const handleSubmitAll = async () => {
    try {
      const response = await submitFormData(id, formResponses);
      if(response){
        toast.success(response.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0'); // Ensures two digits
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const year = date.getFullYear();
    return `${day}-${month}-${year}`; // or `${day}/${month}/${year}` based on your preference
  };

  if(loading){
    return (<div>Loading...</div>)
  }

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        {formData && formData.map((form) => (
          <div className={styles.bubble} key={form._id}>
          {form.fileType === 'bubbles' && form.type === 'text' && (<><div className={styles.circle}></div>
          <p className={styles.bubbleTxt}>{form.data}</p></>)}
          {form.fileType === 'bubbles' && form.type === 'image' &&(<><div className={styles.circle}></div>
            <p className={styles.bubbleTxt}>{form.data}</p></>)}
          {form.fileType === 'inputs' && form.type === 'text' && (
            <>
            <div className={styles.inputForm}>
              <input type="text" placeholder='Enter Your Text Here' onChange={(e) => handleInputChange('text', e.target.value)}/>
              <div className={styles.sendBtn} onClick={() => handleIndividualSubmit('text')}>
                <AiOutlineSend className={styles.icon}/>
              </div>
            </div>
            </>
          )}
          {form.fileType === 'inputs' && form.type === 'email' && (
            <>
            <div className={styles.inputForm}>
              <input type="text" placeholder='Enter your email' onChange={(e) => handleInputChange('email', e.target.value)}/>
              <div className={styles.sendBtn} onClick={() => handleIndividualSubmit('email')}>
                <AiOutlineSend className={styles.icon}/>
              </div>
            </div>
            </>
          )}
          {form.fileType === 'inputs' && form.type === 'number' && (
            <>
            <div className={styles.inputForm}>
              <input type="number" placeholder='Enter a number' onChange={(e) => handleInputChange('number', e.target.value)}/>
              <div className={styles.sendBtn} onClick={() => handleIndividualSubmit('number')}>
                <AiOutlineSend className={styles.icon}/>
              </div>
            </div>
            </>
          )}
          {form.fileType === 'inputs' && form.type === 'phone' && (
            <>
            <div className={styles.inputForm}>
              <input type="number" placeholder='Enter your phone' onChange={(e) => handleInputChange('phone', e.target.value)}/>
              <div className={styles.sendBtn}>
                <AiOutlineSend className={styles.icon} onClick={() => handleIndividualSubmit('phone')}/>
              </div>
            </div>
            </>
          )}
          {form.fileType === 'inputs' && form.type === 'rating' && (
          <div className={styles.inputForm}>
            <div className={styles.ratingsForm}>
              {[1, 2, 3, 4, 5].map((num) => (
                <div
                  key={num}
                  className={`${styles.circle} ${formResponses.rating === num ? styles.active : ''}`}
                  onClick={() => handleRatingChange(num)}
                >
                  <p className={styles.circleTxt}>{num}</p>
                </div>
              ))}
            </div>
            <div className={styles.sendBtn} onClick={() => handleIndividualSubmit('rating')}>
              <AiOutlineSend className={styles.icon}/>
            </div>
          </div>
          )}
          {form.fileType === 'inputs' && form.type === 'date' && (
            <>
              <div className={styles.calendarContainer}>
                <div className={styles.calendarInputContainer}>
                  <input
                    type="text"
                    placeholder="Select a date"
                    value={date.toDateString()}
                    readOnly
                    className={styles.calendarInput}
                  />
                  <div className={styles.sendBtn} onClick={() => handleIndividualSubmit('date')}>
                  <AiOutlineSend className={styles.icon}/>
                  </div>
                </div>
                
                <Calendar
                  onChange={(selectedDate) => {
                    const formattedDate = formatDate(selectedDate);
                    setDate(selectedDate)
                    handleInputChange('date', formattedDate);
                  }}
                  value={date}
                  view="month"
                  next2Label={null}
                  prev2Label={null}
                  tileContent={null}
                  formatShortWeekday={(locale, date) =>
                    date.toLocaleDateString(locale, { weekday: 'short' }).toUpperCase()
                  }
                  navigationLabel={({ date }) => (
                    <div className={styles.calendarHeader}>
                      <span>
                        {date.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                      </span>
                      <button className={styles.yearDropdown}>▼</button>
                    </div>
                  )}
                />
              </div>
          </>
          )}
          {form.fileType === 'inputs' && form.type === 'buttons' && (
            <div className={styles.inputForm} onClick={handleSubmitAll}>
              <button className={styles.submitBtn}>Submit All</button>
            </div>
          )}
        </div>
        ) )}
      </div>
    </div>
  )

}

export default FormPage
