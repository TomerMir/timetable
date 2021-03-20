import './App.css';
import useToken from './token';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import Login from './login'

function App() {
  let history = useHistory()
  if (!token) {
    history.push("/login")
  }
  return(
    <p>Hello there</p>
  )
}
export default App;
