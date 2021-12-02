import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Redirect,
} from "react-router-dom";
import Main from '../../containers/main';
import ROUTES from './routes';

class Routing extends React.Component {
  render () {
    return (
      <Router>
        <Switch>
          {ROUTES.map((el, idx) => (
              <Route 
                path={el.url}
                key={`${el.url}-${idx}`}
                render={() =>el.private ? <Main el={el} /> : el.component}
              />
            )
          )}
          <Redirect to='/login' />       
        </Switch>
      </Router>
    )
  }
}

export default Routing;