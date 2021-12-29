import { React } from 'react';
import { Route } from 'react-router';
import { withAuthenticationRequired } from '@auth0/auth0-react';
import Loading from '../components/Loading';

const ProtectedRoute = ({component, ...args}) => {
    return(
        <Route
            component={withAuthenticationRequired(component, {
                onRedirecting: () => <Loading/>
            })}

            {...args}
        />
    );
}

export default ProtectedRoute