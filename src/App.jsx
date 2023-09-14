import React from 'react'
import Login from "./Components/Login/Login"
import Signup from "./Components/Signup/Signup"
import Home from "./Components/Home/Home";
import Navbar from './Components/Navbar/Navbar';
import Services from "./Components/Services/Services"
import Tasks from "./Components/Tasks/Tasks";
import Message from "./Components/Message/Message"
import Footer from './Components/Footer/Footer';
import Error from "./Components/Error/Error";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/" element=
          {
            <>
              <Navbar />
              <Home id="home" />
              <Services id="service" />
              <Message id="message" />
            </>
          }>
        </Route>
        <Route element={<Login />} path="login" />
        <Route element={<Signup />} path="signup" />
        <Route element={<Tasks />} path={`tasks`}/>
        <Route path="*" element={<Error/>}/>
      </Routes>
      <Footer />
    </BrowserRouter>
    </>
  )
}
