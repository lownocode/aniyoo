import React from "react";

import Logo from "./icons/Logo";
import GoogleLogo from "./icons/GoogleLogo";
import AuthenticationLock from "./icons/AuthenticationLock";
import Discord from "./icons/Discord";
import UsersFriends from "./icons/UsersFriends";
import ArrowBack from "./icons/ArrowBack";
import FourDots from "./icons/FourDots";
import Share from "./icons/Share";
import Bookmark from "./icons/Bookmark";
import BookmarkOutline from "./icons/BookmarkOutline";
import PencilWrite from "./icons/PencilWrite";
import TextboxMore from "./icons/TextboxMore";
import Home from "./icons/Home";
import Search from "./icons/Search";
import TextBulletList from "./icons/TextBulletList";
import Notifications from "./icons/Notifications";
import UserEdit from "./icons/UserEdit";
import GlobeOnline from "./icons/GlobeOnline";
import Eye from "./icons/Eye";
import DoneDouble from "./icons/DoneDouble";
import Calendar from "./icons/Calendar";
import PauseRounded from "./icons/PauseRounded";
import CancelRounded from "./icons/CancelRounded";
import ChevronRight from "./icons/ChevronRight";
import Layers from "./icons/Layers";
import Comments from "./icons/Comments";
import UsersOutline from "./icons/UsersOutline";
import GearOutline from "./icons/GearOutline";
import Radio from "./icons/Radio";
import Code from "./icons/Code";
import PieChart from "./icons/PieChart";
import CopyOutline from "./icons/CopyOutline";
import NotificationsDisable from "./icons/NotificationsDisable";
import UserSearchOutline from "./icons/UserSearchOutline";
import UserProfile from "./icons/UserProfile";
import ShieldSecurity from "./icons/ShieldSecurity";
import Key from "./icons/Key";
import Gallery from "./icons/Gallery";
import ExitOutline from "./icons/ExitOutline";
import Apps from "./icons/Apps";
import Compass from "./icons/Compass";
import Bug from "./icons/Bug";
import UserOutline from "./icons/UserOutline";
import MoonOutline from "./icons/MoonOutline";
import SmileySad from "./icons/SmileySad";
import Feather from "./icons/Feather";
import Backspace from "./icons/Backspace";
import Close from "./icons/Close";
import Vk from "./icons/vk";
import Alphabet from "./icons/Alphabet";
import Email from "./icons/Email";
import EyeOutline from "./icons/EyeOutline";
import Telegram from "./icons/Telegram";
import Instagram from "./icons/Instagram";
import Tiktok from "./icons/Tiktok";
import InfoOutline from "./icons/InfoOutline";
import ExternalLink from "./icons/ExternalLink";
import ChevronDown from "./icons/ChevronDown";
import Reply from "./icons/Reply";
import ChevronUp from "./icons/ChevronUp";
import Send from "./icons/Send";
import Pause from "./icons/Pause";
import Play from "./icons/Play";
import Fire from "./icons/Fire";
import Clock from "./icons/Clock";
import TimeProgress from "./icons/TimeProgress";
import RoundBar from "./icons/RoundBar";
import StatusAi from "./icons/StatusAi";
import PlayGear from "./icons/PlayGear";
import Director from "./icons/Director";
import Star from "./icons/Star";
import StarOutline from "./icons/StarOutline";
import StarPremium from "./icons/StarPremium";
import PlusSquare from "./icons/PlusSquare";
import TrashOutline from "./icons/TrashOutline";
import OctagonWarningOutline from "./icons/OctagonWarningOutline";
import Mic from "./icons/Mic";
import Lock from "./icons/Lock";
import LockOpen from "./icons/LockOpen";
import SkipPrevious from "./icons/SkipPrevious";
import SkipNext from "./icons/SkipNext";
import ChevronRightDouble from "./icons/ChevronRightDouble";
import ChevronLeftDouble from "./icons/ChevronLeftDouble";
import Hd from "./icons/Hd";
import Speedometer from "./icons/Speedometer";
import Screenshot from "./icons/Screenshot";
import PictureInPicture from "./icons/PictureInPicture";
import Replay from "./icons/Replay";
import Block from "./icons/Block";
import JapanFlag from "./icons/JapanFlag";
import ChinaFlag from "./icons/ChinaFlag";
import ClockOutline from "./icons/ClockOutline";
import ForwardArrow from "./icons/ForwardArrow";
import MicOutline from "./icons/MicOutline";
import Options from "./icons/Options";
import VkVideoLogo from "./icons/VkVideoLogo";
import YoutubeLogo from "./icons/YoutubeLogo";
import SibnetLogo from "./icons/SibnetLogo";

export const Icon = (props) => {
    const { name } = props;

    const icon = {
        "logo": <Logo {...props} />,
        "google-logo": <GoogleLogo {...props} />,
        "authentication-lock": <AuthenticationLock {...props} />,
        "discord": <Discord {...props} />,
        "users-friends": <UsersFriends {...props} />,
        "arrow-back": <ArrowBack {...props} />,
        "four-dots": <FourDots {...props} />,
        "share": <Share {...props} />,
        "bookmark": <Bookmark {...props} />,
        "bookmark-outline": <BookmarkOutline {...props} />,
        "pencil-write": <PencilWrite {...props} />,
        "textbox-more": <TextboxMore {...props} />,
        "home": <Home {...props} />,
        "search": <Search {...props} />,
        "text-bullet-list": <TextBulletList {...props} />,
        "notifications": <Notifications {...props} />,
        "user-edit": <UserEdit {...props} />,
        "globe-online": <GlobeOnline {...props} />,
        "eye": <Eye {...props} />,
        "done-double": <DoneDouble {...props} />,
        "calendar": <Calendar {...props} />,
        "pause-rounded": <PauseRounded {...props} />,
        "cancel-rounded": <CancelRounded {...props} />,
        "chevron-right": <ChevronRight {...props} />,
        "layers": <Layers {...props} />,
        "comments": <Comments {...props} />,
        "users-outline": <UsersOutline {...props} />,
        "gear-outline": <GearOutline {...props} />,
        "radio": <Radio {...props} />,
        "code": <Code {...props} />,
        "pie-chart": <PieChart {...props} />,
        "copy-outline": <CopyOutline {...props} />,
        "notifications-disable": <NotificationsDisable {...props} />,
        "user-search-outline": <UserSearchOutline {...props} />,
        "user-profile": <UserProfile {...props} />,
        "shield-security": <ShieldSecurity {...props} />,
        "key": <Key {...props} />,
        "gallery": <Gallery {...props} />,
        "exit-outline": <ExitOutline {...props} />,
        "apps": <Apps {...props} />,
        "compass": <Compass {...props} />,
        "bug": <Bug {...props} />,
        "user-outline": <UserOutline {...props} />,
        "moon-outline": <MoonOutline {...props} />,
        "smiley-sad": <SmileySad {...props} />,
        "feather": <Feather {...props} />,
        "backspace": <Backspace {...props} />,
        "close": <Close {...props} />,
        "vk": <Vk {...props} />,
        "alphabet": <Alphabet {...props} />,
        "email": <Email {...props} />,
        "eye-outline": <EyeOutline {...props} />,
        "telegram": <Telegram {...props} />,
        "instagram": <Instagram {...props} />,
        "tiktok": <Tiktok {...props} />,
        "info-outline": <InfoOutline {...props} />,
        "external-link": <ExternalLink {...props} />,
        "chevron-down": <ChevronDown {...props} />,
        "chevron-up": <ChevronUp {...props} />,
        "reply": <Reply {...props} />,
        "send": <Send {...props} />,
        "pause": <Pause {...props} />,
        "play": <Play {...props} />,
        "fire": <Fire {...props} />,
        "clock": <Clock {...props} />,
        "time-progress": <TimeProgress {...props} />,
        "play-gear": <PlayGear {...props} />,
        "director": <Director {...props} />,
        "status-ai": <StatusAi {...props} />,
        "round-bar": <RoundBar {...props} />,
        "star": <Star {...props} />,
        "star-outline": <StarOutline {...props} />,
        "star-premium": <StarPremium {...props} />,
        "plus-square": <PlusSquare {...props} />,
        "trash-outline": <TrashOutline {...props} />,
        "octagon-warning-outline": <OctagonWarningOutline {...props} />,
        "mic": <Mic {...props} />,
        "lock": <Lock {...props} />,
        "lock-open": <LockOpen {...props} />,
        "skip-previous": <SkipPrevious {...props} />,
        "skip-next": <SkipNext {...props} />,
        "chevron-right-double": <ChevronRightDouble {...props} />,
        "chevron-left-double": <ChevronLeftDouble {...props} />,
        "hd": <Hd {...props} />,
        "speedometer": <Speedometer {...props} />,
        "screenshot": <Screenshot {...props} />,
        "picture-in-picture": <PictureInPicture {...props} />,
        "replay": <Replay {...props} />,
        "block": <Block {...props} />,
        "japan-flag": <JapanFlag {...props} />,
        "china-flag": <ChinaFlag {...props} />,
        "clock-outline": <ClockOutline {...props} />,
        "forward-arrow": <ForwardArrow {...props} />,
        "mic-outline": <MicOutline {...props} />,
        "options": <Options {...props} />,
        "vk-video-logo": <VkVideoLogo {...props} />,
        "youtube-logo": <YoutubeLogo {...props} />,
        "sibnet-logo": <SibnetLogo {...props} />,
    }[name];

    return (
        <>
            {
                icon
            }
        </>
    );
};