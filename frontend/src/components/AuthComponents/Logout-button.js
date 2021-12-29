import { React } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from './Button';


const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
        <Button type="primary" onClick={logout} arg={{returnTo: window.location.origin}} text="Logout"/>
    );
}

export default LogoutButton;