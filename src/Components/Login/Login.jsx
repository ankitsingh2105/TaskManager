import React, { useState, useRef } from 'react';
import "./Login.css"
import { initializeApp } from "firebase/app";
import firebaseConfig from '../../firebaseConfig'

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';

import { Helmet } from 'react-helmet';

export default function Login() {

  const [passEmail, setpassEmail] = useState("op");
  const emailCheck = useRef();

  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleLogin = async (e) => {
    const email = e.target.email.value;
    const password = e.target.password.value;
    try {
      e.preventDefault();
      toast("Checking Credentials", { autoClose: 5000 });
      e.target.email.value = "";
      e.target.password.value = "";
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logging in", { autoClose: 1500 });
      window.location.href = `/tasks`;
    } catch (error) {
      toast.error("Invalid Credentials", { autoClose: 1500 });
    }
  }

  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  const forgotPass = async () => {
    console.log("bc1");
    await sendPasswordResetEmail(auth, passEmail);
    let isEmail = emailCheck.current.value;
    let check = isValidEmail(isEmail);
    try {
      // if (check) {
        toast.success("Email Sent please check you mail account", { autoClose: 1500 });
        // console.log("bc1");
      // }
      // else {
      //   toast.success("Please enter a valid email", { autoClose: 1500 });
      //   console.log("bc2");
      // }

    }
    catch (e) {
      console.log(e)
      toast.error("Something went wrong", e, { autoClose: 1500 });
    }
    console.log("0-")

  }

  const copyingEmail = (e) => {
    setpassEmail(e.target.value)
  }

  return (
    <main className="Login_main">

      <ToastContainer />
      <Helmet>
        <title>Collab Wave ~ Log In</title>
      </Helmet>

      <h1>
        Welcome back to Colab Wave
      </h1>
      <h2>~ Login to you ColabWave account ~</h2>
      <form onSubmit={handleLogin} action="">
        <input required useRef={emailCheck} type="email" placeholder='Email' name="email" />
        <input onChange={copyingEmail} required placeholder='Password' type="password" name="password" />
        <button onClick={handleLogin} >Login</button>
        <br />
      </form>
      <button onClick={forgotPass} >Forgot Password?</button>
      <h2>Don't have an account? Sign Up here</h2>
      <button onClick={() => { window.location.href = `/signup` }} >Sign Up</button>
      <br /><br />
    </main>
  )
}