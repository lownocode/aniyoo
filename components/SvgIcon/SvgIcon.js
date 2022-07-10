import React from "react";

import Logo from "./icons/Logo";
import GoogleLogo from "./icons/GoogleLogo";

export const SvgIcon = (props) => {
    const { 
        size = 15,
        name
    } = props;

    return (
        name === "logo" ? <Logo size={size} /> : 
        name === "google-logo" ? <GoogleLogo size={size} /> : null
    )
};