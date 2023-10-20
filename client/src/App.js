//import logo from './logo.svg';
import './App.css';
import { initialState,reducer } from './reducer/UseReducer';
import About from './components/About';
import Contact from './components/Contact';
import Home from './components/Home';
import Login from './components/Login';
import Navbar from './components/Navbar';
import { Routes, Route } from 'react-router-dom'; // Import Routes and Route
import Signup from './components/Signup';
import Logout from './components/Logout';
import { createContext, useReducer } from 'react';
import Admin from './components/Admin';


export const UserContext = createContext();

function App() {
  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <>
      <UserContext.Provider value={{ state, dispatch }}>
        <Navbar scrollToSection={scrollToSection} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup/>} />
        <Route path="/logout" element={<Logout/>} />
        <Route path="/admin" element={<Admin/>}/>
       
      </Routes>
      </UserContext.Provider>
    </>
  );
}

export default App;
