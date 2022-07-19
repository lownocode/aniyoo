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
        className="icon icon-tabler icon-tabler-arrow-forward"
        viewBox="0 0 24 24"
        >
            <Path stroke="none" d="M0 0h24v24H0z"></Path>
            <Path d="M15 11l4 4-4 4m4-4H8a4 4 0 010-8h1"></Path>
        </Svg>
    );
}

export default Icon;