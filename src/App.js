import './App.css';
import useToken from './token';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import Table from './table'
import React, { useState } from 'react';

//Function that redirects from the main url, if user is authorized,
//redirect to his table, if not, redirect to login page
function App() {
  const { validateToken } = useToken();
  let history = useHistory()
  if (!validateToken()) {
    history.push("/login")
  }
  return(
    <div>
      <Table />
    </div>
  )
}
export default App;
