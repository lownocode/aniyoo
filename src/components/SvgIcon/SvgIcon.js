import React from "react";

import Logo from "./icons/Logo";
import GoogleLogo from "./icons/GoogleLogo";
import AuthenticationLock from "./icons/AuthenticationLock";
import DiscordLogo from "./icons/DiscordLogo";
import UsersFriends from "./icons/UsersFriends";

export const SvgIcon = (props) => {
    const { name } = props;

    return (
        name === "logo" ? <Logo {...props} /> : 
        name === "google-logo" ? <GoogleLogo {...props} /> : 
        name === "authentication-lock" ? <AuthenticationLock {...props} /> : 
        name === "discord-logo" ? <DiscordLogo {...props} /> : 
        name === "users-friends" ? <UsersFriends {...props} /> : null
    )
};