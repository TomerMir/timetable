import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Register from './register'
import Login from './login'
import AdminPanel from './adminPanel'

//Mian function to route all urls to their corresponding pages
const Routing = () => {
  return(
    <Router>
      <Switch>
        <Route exact path="/login" component={Login}/>
        <Route exact path="/register" component={Register}/>
        <Route exact path="/admin" component={AdminPanel}/>
        <Route exact path="/" component={App} />
      </Switch>
    </Router>
  )
}

ReactDOM.render(
  <React.StrictMode>
    <Routing />
  </React.StrictMode>,
  document.getElementById('root')
);
