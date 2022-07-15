import React from "react";
import Svg, { Path } from "react-native-svg";

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
        fill={color}
        width={size}
        height={size}
        >
            <Path d="M21.75 12A4.75 4.75 0 0017 7.25h-5A4.75 4.75 0 007.25 12v5A4.75 4.75 0 0012 21.75h5A4.75 4.75 0 0021.75 17v-5zm-1.5 0v5A3.247 3.247 0 0117 20.25h-5A3.247 3.247 0 018.75 17v-5A3.247 3.247 0 0112 8.75h5A3.247 3.247 0 0120.25 12z"></Path>
            <Path d="M16.404 5.219A4.75 4.75 0 0012 2.25H7A4.75 4.75 0 002.25 7v5a4.75 4.75 0 002.969 4.404.75.75 0 10.562-1.39A3.251 3.251 0 013.75 12V7A3.247 3.247 0 017 3.75h5c1.364 0 2.532.84 3.014 2.031a.75.75 0 101.39-.562z"></Path>
        </Svg>
    );
}

export default Icon;