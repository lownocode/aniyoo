import React from "react";
import Svg, { Path } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
    } = props;

    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 64 64"
        width={size}
        height={size}
        >
            <Path
            fill="#FF0000"
            d="M62.603 16.596a8.06 8.06 0 00-5.669-5.669C51.964 9.57 31.96 9.57 31.96 9.57s-20.005.04-24.976 1.397a8.06 8.06 0 00-5.669 5.669C0 21.607 0 32 0 32s0 10.393 1.356 15.404a8.06 8.06 0 005.669 5.669C11.995 54.43 32 54.43 32 54.43s20.005 0 24.976-1.356a8.06 8.06 0 005.669-5.669C64 42.434 64 32 64 32s-.04-10.393-1.397-15.404z"
            ></Path>
            <Path fill="#fff" d="M25.592 41.612L42.187 32l-16.596-9.612z"></Path>
        </Svg>
    );
}

export default Icon;