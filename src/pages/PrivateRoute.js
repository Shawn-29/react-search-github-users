import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';

const PrivateRoute = ({children, ...rest}) => {

  const {
    isAuthenticated,
    user
  } = useAuth0();

  const isUser = isAuthenticated && user;

  return <Route
    {...rest}
    render={() => {
      /* if the user is logged in, return the child components
        passed into this route that are to be rendered */
      return isUser ? children :
        /* if the user hasn't logged in, redirect the user to
          the login page */
        <Redirect to='/login'></Redirect>
    }}
  >
  </Route>
};
export default PrivateRoute;
