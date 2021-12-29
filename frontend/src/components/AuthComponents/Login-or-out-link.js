import React from "react";

import LoginLink from "./Login-link";
import LogoutLink from "./Logout-link";

import { useAuth0 } from "@auth0/auth0-react";

const LoginOrOutLink = () => {
    const { isAuthenticated } = useAuth0();

    return isAuthenticated ? < LogoutLink / > : < LoginLink / > ;
};

export default LoginOrOutLink;