import React from "react";
import Svg, { Path, G } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
        color = "#fff"
    } = props;

    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        fillRule="evenodd"
        strokeLinejoin="round"
        strokeMiterlimit="2"
        clipRule="evenodd"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        >
            <G fill={color}>
                <Path d="M11.995 8.75a3.251 3.251 0 000 6.5 3.251 3.251 0 000-6.5zm0 1.5a1.75 1.75 0 11-.001 3.501 1.75 1.75 0 01.001-3.501z"></Path>
                <Path d="M8.745 5.072a.75.75 0 01-1.125.649 104.83 104.83 0 01-.495-.286 2.248 2.248 0 00-3.074.824l-1 1.732a2.248 2.248 0 00.824 3.074l.495.285a.75.75 0 010 1.3l-.495.285a2.249 2.249 0 00-.824 3.074l1 1.732a2.249 2.249 0 003.074.824l.495-.286a.75.75 0 011.125.649v.572a2.25 2.25 0 002.25 2.25h2a2.25 2.25 0 002.25-2.25v-.572a.75.75 0 011.125-.649l.495.286a2.25 2.25 0 003.074-.824l1-1.732a2.253 2.253 0 00-.824-3.074l-.495-.285a.75.75 0 010-1.3l.495-.285a2.254 2.254 0 00.824-3.074l-1-1.732a2.25 2.25 0 00-3.074-.824l-.495.286a.75.75 0 01-1.125-.649V4.5a2.25 2.25 0 00-2.25-2.25h-2a2.25 2.25 0 00-2.25 2.25v.572zm1.5 0V4.5a.749.749 0 01.75-.75h2a.75.75 0 01.75.75v.572A2.25 2.25 0 0017.12 7.02l.495-.286a.75.75 0 011.025.275l1 1.732a.754.754 0 01-.275 1.025l-.495.285a2.25 2.25 0 000 3.898l.495.285a.753.753 0 01.275 1.025l-1 1.732a.749.749 0 01-1.025.275 70.758 70.758 0 00-.495-.286 2.25 2.25 0 00-3.375 1.948v.572a.75.75 0 01-.75.75h-2a.749.749 0 01-.75-.75v-.572A2.25 2.25 0 006.87 16.98l-.495.286a.75.75 0 01-1.025-.275l-1-1.732a.75.75 0 01.275-1.025l.495-.285a2.25 2.25 0 000-3.898l-.495-.285a.752.752 0 01-.275-1.025l1-1.732a.752.752 0 011.025-.275l.495.286a2.25 2.25 0 003.375-1.948z"></Path>
            </G>
        </Svg>
    );
}

export default Icon;