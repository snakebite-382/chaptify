import React from 'react';
import { useHistory } from 'react-router';
import { Auth0Provider } from '@auth0/auth0-react';

const Auth0ProviderWithHistory = ({ children }) => {
    const domain = process.env.REACT_APP_AUTH0_DOMAIN;
    const clientID = process.env.REACT_APP_AUTH0_CLIENT_ID;
    const history = useHistory();
    const audience = process.env.REACT_APP_AUTH0_AUDIENCE;

    const onRedirectCallback = (appstate) => {
        history.push(appstate?.returnTo || window.location.pathname);
    }

    return (
        <Auth0Provider
            domain={domain}
            clientId={clientID}
            audience={audience}
            redirectUri={window.location.origin}
            onRedirectCallback={onRedirectCallback}
        >
            {children}
        </Auth0Provider>
    )
}

export default Auth0ProviderWithHistory;