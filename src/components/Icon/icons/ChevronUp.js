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
        viewBox="0 0 32 32"
        >
            <Path
            d="M24 21a1 1 0 01-.71-.29L16 13.41l-7.29 7.3a1 1 0 11-1.42-1.42l8-8a1 1 0 011.42 0l8 8a1 1 0 010 1.42A1 1 0 0124 21z"
            fill={color}
            ></Path>
        </Svg>
    );
}

export default Icon;