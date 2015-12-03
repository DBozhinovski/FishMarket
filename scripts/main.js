
import React from 'react'; //eslint-disable-line no-unused-vars
import ReactDOM from 'react-dom';

import { Router, Route } from 'react-router';
import { createHistory } from 'history';

import NotFound from './components/NotFound';
import StorePicker from './components/StorePicker';
import App from './components/App';

const routes = (
  <Router history={createHistory()}>
    <Route path='/' component={StorePicker} />
    <Route path='/store/:storeId' component={App} />
    <Route path='*' component={NotFound} />
  </Router>
);

ReactDOM.render(routes, document.querySelector('#main'));
