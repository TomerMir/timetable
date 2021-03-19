import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from './api'
import './login.css';
import { Link, BrowserRouter as Router } from 'react-router-dom';


export default function Login({ setToken }) {
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [errorText, setErrorText] = useState()

    const handleSubmit = async e => {
      e.preventDefault();

      if (username.length < 5) {
        setErrorText("Username need to be at least 5 characters long")
        return
      }

      if (password.length < 5) {
        setErrorText("Password need to be at least 5 characters long")
        return
      }

      if (username.length > 20) {
        setErrorText("Username cant be longer than 20")
        return
      }

      if (password.length > 20) {
        setErrorText("Password cant be longer than 20")
        return
      }

      const token = await api.postData(
        "http://127.0.0.1:5000/login",
        {'Content-Type': 'application/json'},
        {"username" : username, "password" : password})
      if (token.data == false) {
          console.log("Failiure " + token.error)
          setErrorText("Error, contact Tomer the king")
          return
      }
      console.log(token)
     if (token.data.status == false) {
          setErrorText("Incorrect username or password")
      }
      else{
        console.log(token.data.token)
        setToken(token.data.token);
      }
    }
  
    return(
      <div className="login">
        <h2 className="login-header">Log in</h2>
        <form onSubmit={handleSubmit} class="login-container">
          <input type="text" onClick={e => setErrorText('')} onChange={e => setUserName(e.target.value)} placeholder="Username"/>
          <input type="password" onClick={e => setErrorText('')} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
          <input type="submit" value="Log in"/>
          <table>
            <tr>
            <th>
              <p>Don't have an accout?</p>
            </th>
            <th>
              <Router><Link>Register</Link></Router>
            </th>
            </tr>
          </table>
        </form>
        <h2 style={{color: 'red'}}>{errorText}</h2>
      </div>

    )
  }
  
  Login.propTypes = {
    setToken: PropTypes.func.isRequired
  };