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
        fill="none"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        className="icon icon-tabler icon-tabler-backspace"
        viewBox="0 0 24 24"
        >
            <Path stroke="none" d="M0 0h24v24H0z"></Path>
            <Path d="M20 6a1 1 0 011 1v10a1 1 0 01-1 1H9l-5-5a1.5 1.5 0 010-2l5-5zM12 10l4 4m0-4l-4 4"></Path>
        </Svg>
    );
}

export default Icon;