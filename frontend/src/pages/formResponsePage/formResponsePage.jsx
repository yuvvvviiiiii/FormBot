import React, { useEffect, useState } from 'react';
import styles from './formResponsePage.module.css';
import SecondNavbar from '../../components/SecondNavbar';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getFormResponses } from '../../apis';
import { PieChart } from 'react-minimal-pie-chart';

const FormResponsePage = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  const {id} = useParams();

  const getResponse = async () => {
    try {
      setLoading(true);
      const response = await getFormResponses(id)
      setData(response);
      toast.success(response.message)
      console.log(response)
    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    getResponse();
  }, [])

  const toggleDarkMode = () => {
    setIsDarkMode((prevMode) => {
      const newMode = !prevMode;
      return newMode;
    })
  }

  const completedPercentage = (data.submitted/data.views) * 100;
  console.log(completedPercentage, data.submitted);
  const remainingPercentage = 100 - completedPercentage;



  return (
    <div className={isDarkMode ? styles.container : styles.containerDark}>
      <SecondNavbar isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />
      {
        data.length === 0 ?
        (<div className={styles.noResponse}>
          <p>No Response yet collected</p>
        </div>):
        (data && (<div className={styles.response}>
          <div className={styles.responseContainer}>
            <div className={styles.stats}>
              <div className={styles.views}>
                <p>Views</p>
                <span>{data.views}</span>
              </div>
              <div className={styles.start}>
                <p>Start</p>
                <span>{data.started}</span>
              </div>
            </div>
            <div className={styles.data}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>S.No</th>
                    <th>Submitted at</th>
                    <th>Text</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Rating</th>
                    <th>Number</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.responses && data?.responses.map((response, index) => (
                    <tr key={ response._id || index }>
                      <td>{index + 1}</td>
                      <td>{response.date}</td>
                      <td>{response.text}</td>
                      <td>{response.email}</td>
                      <td>{response.phone}</td>
                      <td>{response.rating}</td>
                      <td>{response.number}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.chart}>
              <PieChart
              data={[
                { title: 'Completed', value: completedPercentage, color: 'rgba(59, 130, 246, 1)' },
                { title: 'Remaining', value: remainingPercentage, color: 'rgba(144, 144, 144, 1)' },
              ]}
              lineWidth={20}
              paddingAngle={0}
              rounded
              startAngle={-90}
              totalValue={100}
              style={{ height: '270px', marginTop: '20px' }}
              label={({ dataEntry }) => {
                if (dataEntry.title === 'Completed') {
                  return ``;
                }
                return null;
              }}
              labelStyle={{
                fontSize: '8px',
                fontWeight: 'bold',
                fill: '#fff',
              }}
              labelPosition={70}
              />
              <div className={styles.completed}>
                <span>Completed</span>
                <p>{data.submitted}</p>
              </div>
              <div className={styles.completion}>
                <p>Completion rate</p>
                <span>{completedPercentage}%</span>
              </div>
            </div>
          </div>
        </div>))
      }
    </div>
  )
}

export default FormResponsePage
