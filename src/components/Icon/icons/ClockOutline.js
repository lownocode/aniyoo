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
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={color}
        >
            <Path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm0 18a8 8 0 118-8 8 8 0 01-8 8z"></Path>
            <Path d="M16 11h-3V8a1 1 0 00-2 0v4a1 1 0 001 1h4a1 1 0 000-2z"></Path>
        </Svg>
    );
}

export default Icon;