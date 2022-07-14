import React from "react";

import Logo from "./icons/Logo";
import GoogleLogo from "./icons/GoogleLogo";
import AuthenticationLock from "./icons/AuthenticationLock";
import DiscordLogo from "./icons/DiscordLogo";
import UsersFriends from "./icons/UsersFriends";
import ArrowBack from "./icons/ArrowBack";
import FourDots from "./icons/FounrDots";
import Share from "./icons/Share";
import Bookmark from "./icons/Bookmark";
import BookmarkOutline from "./icons/BookmarkOutline";
import PencilWrite from "./icons/PencilWrite";

export const SvgIcon = (props) => {
    const { name } = props;

    return (
        name === "logo" ? <Logo {...props} /> : 
        name === "google-logo" ? <GoogleLogo {...props} /> : 
        name === "authentication-lock" ? <AuthenticationLock {...props} /> : 
        name === "discord-logo" ? <DiscordLogo {...props} /> : 
        name === "users-friends" ? <UsersFriends {...props} /> : 
        name === "arrow-back" ? <ArrowBack {...props} /> : 
        name === "four-dots" ? <FourDots {...props} /> : 
        name === "share" ? <Share {...props} /> : 
        name === "bookmark" ? <Bookmark {...props} /> : 
        name === "bookmark-outline" ? <BookmarkOutline {...props} /> : 
        name === "pencil-write" ? <PencilWrite {...props} /> : null
    )
};