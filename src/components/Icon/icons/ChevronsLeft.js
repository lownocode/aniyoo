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
        className="icon icon-tabler icon-tabler-chevrons-left"
        viewBox="0 0 24 24"
        >
            {/* <Path stroke="none" d="M0 0h24v24H0z"></Path> */}
            <Path d="M11 7L6 12 11 17"></Path>
            <Path d="M17 7L12 12 17 17"></Path>
        </Svg>
    );
}

export default Icon;