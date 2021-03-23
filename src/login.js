import React, { useState } from 'react';
import PropTypes from 'prop-types';
import api from './api'
import { Link, useHistory } from 'react-router-dom';
import useToken from './token'
import { Helmet } from 'react-helmet'
var sha256 = require('js-sha256').sha256;


export default function Login() {
    const { setToken, validateToken } = useToken();
    let history = useHistory()
    if (validateToken()) {
      history.push("/")
    }
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
        "login",
        {'Content-Type': 'application/json'},
        {"username" : username, "password" : sha256(password)})
      if (token.data == false) {
          console.log("Failiure " + token.error)
          setErrorText("Error")
          return
      }
     if (token.data.status == false) {
          setErrorText("Incorrect username or password")
          return
      }
      var date = (new Date()).getTime() + token.data.exp*60000
      localStorage.setItem("tokenExp", date.toString())
      setToken(token.data.token);
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
        <h2 style={{color: 'red'}}>{errorText}</h2>
      </div>

    )
}