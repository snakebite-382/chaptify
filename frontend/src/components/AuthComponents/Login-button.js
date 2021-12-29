import { React } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../Button";

const LoginButton = () => {
    const { loginWithRedirect } = useAuth0();
    return ( <
        Button type = "primary"
        onClick = { loginWithRedirect }
        text = "Log In" / >
    );
}

export default LoginButton;