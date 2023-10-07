import React,{useState} from 'react'
import { NavLink ,useNavigate} from 'react-router-dom';
import sign from '../image/signup.jpg';
import ReCAPTCHA from "react-google-recaptcha";
import '../styles/Signup.css';
export default function Signup() {
const[verified,setVerified]=useState(false);

function onChange(value) {
  console.log("Captcha value:", value);
  setVerified(true);
}


  const history=useNavigate();
const[user,setUser]=useState({
  name:"",email:"",stream:"BCA",year:"First",phone:"",password:"",cpassword:""
});


let name,value;
const handleInputs=(e)=>{
  console.log(e);
  name=e.target.name;
  value=e.target.value;

  setUser({...user,[name]:value})
}
const PostData=async(e)=>{
  e.preventDefault();
  const {name,email,stream,year,phone,password,cpassword} =user;

  const res =await fetch("/register",{
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body:JSON.stringify({

      name,email,stream,year,phone,password,cpassword
      
    })
  });
  const data=await res.json();

  if(res.status===422 || !data.message){
    window.alert("Invalid Registration");
  }
  else{
    window.alert("Registration Successfull");
    history("/login");
  }
 
}
  return (
    <div>
      
        <form method="POST">
          <div className="form">
          <figure>
            <img src={sign} alt="" />
            <div className="login-link">
            <NavLink to='/login'>Already Registered?Click on Login</NavLink>
          </div>
          </figure>

          <div className="form-info">
            <div className="heading">
              <h2>Sign Up ..</h2>
            </div>
          <div className="name">
            <label htmlFor="">
              Name:
            </label>
            <div className="input"><input type="text" name="name" id="" value={user.name} onChange={handleInputs}/></div>
            
          </div>
          <div className="email">
          <label htmlFor="">
              Email:
            </label>
            <div className="input"> <input type="email" name="email" id="" value={user.email} onChange={handleInputs}/></div>
           
          </div>
          <div className="stream">
          <label htmlFor="">
              Stream:
            </label>
            <div className="input">
            <select name="stream" id="stream" value={user.stream} onChange={handleInputs}>
                  <option value="BCA">BCA</option>
                  <option value="BBA">BBA</option>
                  <option value="MCA">MCA</option>
                </select></div>
            
          </div>
          <div className="year">
          <label htmlFor="">
              Year:
            </label>
            <div className="year">
            <select name="year" id="year" value={user.year} onChange={handleInputs}>
                  <option value="First">First</option>
                  <option value="Second">Second</option>
                  <option value="Third">Third</option>
                </select>
              </div>
            
          </div>
          <div className="phone">
          <label htmlFor="">
              Phone:
            </label>
            <div className="phone"> <input type="number" name="phone" id="" value={user.phone} onChange={handleInputs}/></div>
           
          </div>
          {/* <div className="cardNo">
          <label htmlFor="">
              CardNo:
            </label>
            <div className="input"><input type="text" name="cardNo" id="" value={user.cardNo} onChange={handleInputs}/></div>
            
          </div> */}
          <div className="password">
          <label htmlFor="">
              Password:
            </label>
            <div className="input"><input type="password" name="password" id="" value={user.password} onChange={handleInputs}/></div>
            
          </div>
          <div className="conpass">
          <label htmlFor="">
              Confirm Password:
            </label>
            <div className="input"><input type="password" name="cpassword" id="" value={user.cpassword} onChange={handleInputs}/></div>
            
          </div>
                  <ReCAPTCHA
            sitekey="6LeIxAcTAAAAAJcZVRqyHh71UMIEGNQ_MXjiZKhI"
            onChange={onChange}
          />
          <div className="submit">
            <input type="submit"  name="signup" id="signup" value="Register" disabled={!verified} onClick={PostData}/>
          </div>
         
          </div>
          </div>
        </form>
        
    </div>
  )
}
