import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import loadingGif from '../images/preloader.gif';
import styled from 'styled-components';

/*
  the logic for this component is taken from https://auth0.com/docs/libraries/auth0-react

  the app's components (children) must be wrapped in this component, which
  accounts for Auth0 to initialize and deal with the login process
*/
const AuthWrapper = ({children}) => {

    const {
      isLoading,
      error,
    } = useAuth0();

    /* if Auth0 is still attempting to login the user, show a loading spinner */
    if (isLoading) {
      return <Wrapper>
        <img src={loadingGif} alt='' />
      </Wrapper>
    }

    /* if Auth0 has encountered an error, return it here */
    if (error) {
      return <Wrapper>
        <h1>{error.message}</h1>
      </Wrapper>
    }

    /* everything is okay so render the app's components */
    return <>{children}</>;
}

const Wrapper = styled.section`
  min-height: 100vh;
  display: grid;
  place-items: center;
  img {
    width: 150px;
  }
`;

export default AuthWrapper;
