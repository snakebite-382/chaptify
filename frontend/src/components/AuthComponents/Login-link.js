import { React } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import Button from "../Button";

const LoginLink = () => {
    const { loginWithRedirect } = useAuth0();
    return ( <
        Button type = "link"
        onClick = { loginWithRedirect }
        text = "Log In"
        />
    );
}

export default LoginLink;