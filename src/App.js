import './App.css';
import useToken from './token';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './login'

function App() {
  const { token, setToken } = useToken();
  if (!token) {
    return(<Login setToken={setToken} />)
  }
  return(
    <h1>{token}</h1>
  )
}
export default App;
