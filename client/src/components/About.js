import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      <form method="GET" className='about' style={{display:'block'}}>
        
        <div className="filed">
        <h1 className="mt-5">WELCOME <span style={{color:'blue',textTransform:'uppercase'}}>{userData.name}</span> </h1>
        </div>
         <div className="details" >
          <h4>Email:{userData.email}</h4>
          <h4>Stream:{userData.stream}</h4>
          <h4>Year:{userData.year}</h4>
          <h4>PhoneNo:{userData.phone}</h4>
          
         </div>
      </form>
    </div>
  );
}
