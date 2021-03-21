import './App.css';
import useToken from './token';
import { BrowserRouter as Router, Route, useHistory } from 'react-router-dom';
import { Helmet } from 'react-helmet'

function App() {
  const { validateToken } = useToken();
  let history = useHistory()
  if (!validateToken()) {
    history.push("/login")
  }
  return(
    <div>
      <Helmet>
        <title>Timetable</title>
      </Helmet>
      <p>Hello there</p>
    </div>
  )
}
export default App;
