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
            <Path d="M26.78 13.45L11.58 4A3 3 0 007 6.59v18.82a3 3 0 003 3 3 3 0 001.58-.41l15.2-9.41a3 3 0 000-5.1z"></Path>
        </Svg>
    );
}

export default Icon;