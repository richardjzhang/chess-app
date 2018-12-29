// @flow

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import App from 'pages/App';
import './index.css';

const root = document.getElementById('root');
if (root !== null) {
  ReactDOM.render(
    <Router>
      <Route component={() => <App />} />
    </Router>,
    root,
  );
}
