import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/About.css';
import login from '../image/About.png'
export default function About() {
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  const callAboutPage = async () => {
    try {
      const response = await fetch('/about', {
        method: 'GET',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (response.status === 200) {
        const data = await response.json();
        console.log('Data:', data);
        setUserData(data);
      } else {
        console.error('Error:', response.status);
        // You can log more details about the error here if available.
        throw new Error('Error fetching data');
      }
    } catch (e) {
      console.error('Catch Error:', e);
      navigate('/login');
    }
  }

  useEffect(() => {
    callAboutPage();
  }, []);

  return (
    <div>
      <div className="aboutbody">
      <form method="GET" className='about' style={{ display: 'block' }}>

        <div className="filed">
          <h1 className="mt-5" style={{
            textTransform: 'uppercase', color: 'black',
            'text-transform': 'uppercase',
            'font-stretch': 'expanded',
            'font-family': 'monospace'
          }}>WELCOME <span style={{
            textTransform: 'uppercase', color: '#5e1d55',
            'text-transform': 'uppercase',
            'font-stretch': 'expanded',
            'font-family': 'monospace'
          }}>{userData.name}</span> </h1>
        </div>

        <div className="details" >
          <div className="img">
            <img src={login} alt="" />
          </div>
          <div className="detail-data">
            <div className="card-heading">
              <h4>STUDENT</h4>
            </div>
            <div className="body">
              <h4>Email: {userData.email}</h4>
              <h4>Stream: {userData.stream}</h4>
              <h4>Year: {userData.year}</h4>
              <h4>Phone Number: {userData.phone}</h4>
              <h4>Card Number: {userData.cardNo}</h4>
            </div>

          </div>
        </div>
      </form>
      </div>
    </div>
  );
}
