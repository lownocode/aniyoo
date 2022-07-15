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
        viewBox="0 0 20 20"
        >
            <Path d="M6.5 2a2.5 2.5 0 00-2.456 2.03c.15-.02.302-.03.456-.03h8A3.5 3.5 0 0116 7.5v5.45a2.5 2.5 0 002-2.45V6a4 4 0 00-4-4H6.5z"></Path>
            <Path d="M4.5 5A2.5 2.5 0 002 7.5v6A2.5 2.5 0 004.5 16H5v1.028a1 1 0 001.581.814L9.161 16H12.5a2.5 2.5 0 002.5-2.5v-6A2.5 2.5 0 0012.5 5h-8z"></Path>
        </Svg>
    );
}

export default Icon;