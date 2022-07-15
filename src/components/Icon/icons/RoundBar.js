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
        viewBox="0 0 32 32"
        width={size}
        height={size}
        fill={color}
        >
            <Path d="M16 22a6 6 0 116-6 6.007 6.007 0 01-6 6zm0-10a4 4 0 104 4 4.005 4.005 0 00-4-4z"></Path>
            <Path d="M16 26a10.016 10.016 0 01-7.453-3.333l1.49-1.334A8 8 0 1016 8V6a10 10 0 010 20z"></Path>
            <Path d="M16 30a14 14 0 1114-14 14.016 14.016 0 01-14 14zm0-26a12 12 0 1012 12A12.014 12.014 0 0016 4z"></Path>
        </Svg>
    );
}

export default Icon;