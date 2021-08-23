import { useState } from 'react';
import jwt_decode from 'jwt-decode';


export default function useToken() {
  const getToken = () => {
    const tokenString = localStorage.getItem('token');
    const userToken = JSON.parse(tokenString);
    return userToken
  };

  const getTokenExp = () => {
    const tokenExpString = localStorage.getItem('tokenExp');
    const exp = JSON.parse(tokenExpString);
    return exp
  };

  const decodeToken = () => {
    const decodedToken = jwt_decode(getToken());
    return decodedToken;
  }

  const isAdmin = () =>{
    const decodedToken = decodeToken();
    return decodedToken["admin"];
  }

  const saveToken = userToken => {
    localStorage.setItem('token', JSON.stringify(userToken));
  };

  const validateToken = () => {
    const token = getToken()
    try {
      if(!token){
        localStorage.clear()
        return false
      }
      const now = new Date()
      const exp = getTokenExp()
      if (!exp) {
        console.log("Token exp was null")
        localStorage.clear()
        return false
      }
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