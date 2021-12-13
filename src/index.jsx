import React from 'react';
import ReactDOM from 'react-dom';
import './assets/main.css';
import { CookiesProvider } from 'react-cookie';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'typeface-roboto';
import 'typeface-open-sans';

ReactDOM.render(
  <React.StrictMode>
    <CookiesProvider>
      <App />
    </CookiesProvider>
  </React.StrictMode>,
  // eslint-disable-next-line
  document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
