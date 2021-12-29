import { React } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import Button from '../Button';

const SignupLink = () => {
    const { loginWithRedirect } = useAuth0();

    return ( <
        Button type = "link"
        onClick = { loginWithRedirect }
        arg = {
            { screen_hint: "signup" }
        }
        text = "Sign up" / >
    )
}

export default SignupLink