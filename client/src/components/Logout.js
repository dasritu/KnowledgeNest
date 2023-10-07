import React, { useEffect ,useContext} from 'react'
import { useNavigate } from 'react-router-dom'
import {UserContext} from "../App.js";
export default function Logout() {
 
const {state,dispatch}=useContext(UserContext);
    const navigate = useNavigate();
  
    const logoutaction = async () => {
      try {
        const response = await fetch('/logout', {
          method: 'GET',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
  
        if (response.status === 200) {
          dispatch({type:"USER",payload:false})
          localStorage.removeItem('role');
         navigate('/login');
         
        } else {
          console.error('Error:', response.status);
          // You can log more details about the error here if available.
          throw new Error('Error fetching data');
        }
      } catch (e) {
        console.error('Catch Error:', e);
        
      }
    }
  
    useEffect(() => {
        logoutaction ();
    }, []);

  return (
    <div>
      <h1>Hello Logout</h1>
    </div>
  )
}
