import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from './api'
import { Link, useHistory } from 'react-router-dom';
import useToken from './token'
import { Helmet } from 'react-helmet'
import Checkbox from "react-custom-checkbox";

var sha256 = require('js-sha256').sha256;

//Function to the login panel
export default function Login() {
    const { setToken, validateToken } = useToken();

    //Check if user is already authorized with valid token
    let history = useHistory()
    if (validateToken()) {
      //User is authorized, redirected to the main page
      history.push("/")
    }
    //Create states
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [stayLoggedIn, setStayLoggedIn] = useState('');
    const [errorText, setErrorText] = useState()

    //Function that submits and validates the data after the user clicks submit
    const handleSubmit = async e => {
      e.preventDefault();

      //Validates the data
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

      //Posts the data for the API server
      const token = await api.postData(
        "api/login",
        {'Content-Type': 'application/json'},
        {"username" : username, "password" : sha256(password), "stayLoggedIn" : stayLoggedIn}) //Sends the hash of the password
      if (token.data == false) {
          console.log("Failiure " + token.error)
          setErrorText("Error")
          return
      }

     //If the server returned error
     if (token.data.status == false) {
          setErrorText(token.data.err)
          return
      }

      //Sets the expiration date of the token in the local storage.
      var date = (new Date()).getTime() + token.data.exp*60000
      localStorage.setItem("tokenExp", date.toString())

      //Sets the token
      setToken(token.data.token);

      //Redirects to the main page
      history.push("/")
    }
    document.getElementsByTagName('html')[0].setAttribute("dir", "ltr");
    return(
      <div className="login">
        <Helmet>
          <title>Login</title>
        </Helmet>
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
              <Link to="/register">Register</Link>
            </th>
            </tr>
            
          </table>
        </form>
        <table>
        <tr>
              <th>
                <p>Stay logged in?</p>
              </th>
              <td>
                <input type="checkbox" className="big" onChange={e => setStayLoggedIn(e.target.checked)}/>
              </td>
            </tr>
        </table>
        <h2 style={{color: 'red'}}>{errorText}</h2>
      </div>

    )
}