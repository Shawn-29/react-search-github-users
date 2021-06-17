import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';

ReactDOM.render(
  <React.StrictMode>
    {/* integrate Auth0 with a React app by wrapping the
      root component in a Auth0Provider component */}
    <Auth0Provider
      domain={process.env.REACT_APP_AUTH0_DOMAIN}
      clientId={process.env.REACT_APP_AUTH0_CLIENT_ID}
      /*
        cacheLocation by default is 'memory'; a problem occurs with this option
        if the user is logged in and then goes to an invalid page; the user,
        despite still being logged in, will be unable to reach the main app
        and have to click the login button again
      */
      cacheLocation='localstorage'
      /*
        the origin property returns the URL of where the current page
        originated from; for example, the origin for the URL
        "https://www.udemy.com/course/react-tutorial-and-projects-course/learn/lecture/21055066"
        is "https://www.udemy.com"
      */
      redirectUri={window.location.origin}
    >
      <GithubProvider>
        <App />
      </GithubProvider>
    </Auth0Provider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
