import React, { useState } from 'react';
import api from './api'
import useToken from './token'
import { useHistory, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet'
var sha256 = require('js-sha256').sha256;

//Function to the register panel
export default function Register()  {
    let history = useHistory()

    //Check if user is already authorized with valid token
    const { validateToken } = useToken();
    if (validateToken()) {
      //User is authorized, redirected to the main page
      history.push("/")
    }

    //Create states
    const [username, setUserName] = useState('');
    const [password, setPassword] = useState('');
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
          "api/register",
          {'Content-Type': 'application/json'},
          {"username" : username, "password" : sha256(password)}) //Sends the hash of the password
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
        //Redirects to login page
        history.push('/login')
      }
      
      document.getElementsByTagName('html')[0].setAttribute("dir", "ltr");
      return(
        <div className="login">
          <Helmet>
            <title>Register</title>
          </Helmet>
          <h2 className="login-header">Register</h2>
          <form onSubmit={handleSubmit} class="login-container">
            <input type="text" onClick={e => setErrorText('')} onChange={e => setUserName(e.target.value)} placeholder="Username"/>
            <input type="password" onClick={e => setErrorText('')} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
            <input type="submit" value="Register"/>
            <table>
            <tr>
            <th>
              <p>Already have an account?</p>
            </th>
            <th>
              <Link to="/login">Login</Link>
            </th>
            </tr>
          </table>
          </form>
          <h2 style={{color: 'red'}}>{errorText}</h2>
        </div>
  
      )
}
