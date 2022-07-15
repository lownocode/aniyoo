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
        width={size}
        height={size}
        fill={color}
        viewBox="0 0 32 32"
        >
            <Path d="M11 24H21V26H11z"></Path>
            <Path d="M13 28H19V30H13z"></Path>
            <Path d="M23.04 16a9.486 9.486 0 01-1.862 2.143C20.107 19.135 19 20.16 19 22h2c0-.92.526-1.45 1.535-2.386A9.984 9.984 0 0025.275 16zM20 14a1 1 0 01-.894-.553L17.381 10H14V8h4a1 1 0 01.894.553L20 10.763l3.106-6.21a1.042 1.042 0 011.788 0L26.619 8H30v2h-4a1 1 0 01-.894-.553L24 7.237l-3.106 6.21A1 1 0 0120 14z"></Path>
            <Path d="M10.815 18.14A7.185 7.185 0 018 12a8.01 8.01 0 018-8V2A10.011 10.011 0 006 12a9.18 9.18 0 003.46 7.616C10.472 20.551 11 21.081 11 22h2c0-1.84-1.11-2.866-2.185-3.86z"></Path>
        </Svg>
    );
}

export default Icon;