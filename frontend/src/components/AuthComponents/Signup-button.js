import { React } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button';

const SignupButton = () => {
    const { loginWithRedirect } = useAuth0();

    return ( <
        Button type = "primary"
        onClick = { loginWithRedirect }
        arg = {
            { screen_hint: "signup" } }
        text = "Sign up" / >
    )
}

export default SignupButton