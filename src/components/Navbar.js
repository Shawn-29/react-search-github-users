import React from 'react';
import styled from 'styled-components';
import { useAuth0 } from '@auth0/auth0-react';

const Navbar = () => {

  /* data provided by Auth0 */
  const {
    isAuthenticated, /* user has been authenticated and logged in */
    loginWithRedirect, /* function to login user then redirect on success */
    logout, /* function to log the user out */
    user, /* object with user data such as email */
    isLoading /* Auth0 is busy logging the user in or out */
  } = useAuth0();

  /* log Auth0 data */
  // console.log('isAuthenticated:', isAuthenticated);
  // console.log('user:', user);
  // console.log('isLoading:', isLoading);

  const isUser = isAuthenticated && user;

  return <Wrapper>
    {
      isUser &&
        /* Auth0 uses a picture based on the app that logged which could be from an external
          source (e.g. it will use the user's Twitter picture if the user logs in from Twitter)
          so make sure it exists */
        user.picture &&
        <img src={user.picture} alt={user.name} />
    }
    {
      isUser &&
        user.name &&
        <h4>Welcome, <strong>{user.name.toUpperCase()}</strong></h4>
    }
    {
      isUser ?
        <button onClick={() => {
          /* redirect the user to the base URL */
          logout({returnTo: window.location.origin});
        }}>Logout</button> :
        <button onClick={loginWithRedirect}>Login</button>
    }
  </Wrapper>
};

const Wrapper = styled.nav`
  padding: 1.5rem;
  margin-bottom: 4rem;
  background: var(--clr-white);
  text-align: center;
  display: grid;
  grid-template-columns: auto auto 100px;
  justify-content: center;
  align-items: center;
  gap: 1.5rem;
  h4 {
    margin-bottom: 0;
    font-weight: 400;
  }
  img {
    width: 35px !important;
    height: 35px;
    border-radius: 50%;
    object-fit: cover;
  }
  button {
    background: transparent;
    border: transparent;
    font-size: 1.2rem;
    text-transform: capitalize;
    letter-spacing: var(--spacing);
    color: var(--clr-grey-5);
    cursor: pointer;
  }
`;

export default Navbar;
