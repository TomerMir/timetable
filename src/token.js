import { useState } from 'react';
import jwt_decode from 'jwt-decode';

//Function that help to get, validate and save the token.
export default function useToken() {

  //Returns the token, gets it from the local storage and converts it to json.
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken
  };

  //Returns the token's expiration time.
  const getTokenExp = () => {
    const tokenExpString = localStorage.getItem('tokenExp');
    const exp = JSON.parse(tokenExpString);
    return exp
  };

  //Returns the decoded token.
  const decodeToken = () => {
    const decodedToken = jwt_decode(getToken());
    return decodedToken;
  }

  //Returns the admin field in the jwt.
  const isAdmin = () =>{
    const decodedToken = decodeToken();
    return decodedToken["admin"];
  }
  //Saves the token in the browser's local storage.
  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
  };
  
  //Validates the token, if not valid, removes it from 
  //the storage and returns false, else returns true.
  const validateToken = () => {
    const token = getToken()
    try {

      //If there is no token:
      if(!token){
        localStorage.clear()
        return false
      }
      const now = new Date()
      const exp = getTokenExp()

      //If there is nu expiration date:
      if (!exp) {
        console.log("Token exp was null")
        localStorage.clear()
        return false
      }

      //If token expired:
      const expDate = new Date(exp)
      if(now >= expDate){
        console.log("Token expired")
        localStorage.clear()
        return false
      }
    } catch (error) {
      console.log("error on validateToken: "+ error)
      localStorage.clear()
      return false
    }
    return true;
  }

  return {
    setToken: saveToken,
    validateToken,
    getToken,
    isAdmin
  }
}