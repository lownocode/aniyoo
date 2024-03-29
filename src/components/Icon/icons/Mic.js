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
        fill={color}
        width={size}
        height={size}
        viewBox="0 0 16 16"
        >
            <Path d="M5 3a3 3 0 016 0v5a3 3 0 01-6 0V3z"></Path>
            <Path
            fillRule="evenodd"
            d="M3.5 6.5A.5.5 0 014 7v1a4 4 0 008 0V7a.5.5 0 011 0v1a5 5 0 01-4.5 4.975V15h3a.5.5 0 010 1h-7a.5.5 0 010-1h3v-2.025A5 5 0 013 8V7a.5.5 0 01.5-.5z"
            ></Path>
        </Svg>
    );
}

export default Icon;