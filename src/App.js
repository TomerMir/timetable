import './App.css';
import useToken from './token';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';

function App() {
  const { validateToken } = useToken();
  let history = useHistory()
  if (!validateToken()) {
    history.push("/login")
  }
  return(
    <p>Hello there</p>
  )
}
export default App;
