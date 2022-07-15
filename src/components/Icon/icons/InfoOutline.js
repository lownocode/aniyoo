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
        viewBox="0 0 26 26"
        >
            <Path
            stroke={color}
            strokeMiterlimit="10"
            strokeWidth="2"
            d="M13 25c6.627 0 12-5.373 12-12S19.627 1 13 1 1 6.373 1 13s5.373 12 12 12z"
            ></Path>
            <Path
            fill={color}
            d="M13 9a1.3 1.3 0 100-2.6A1.3 1.3 0 0013 9zM13 19.7c-.8 0-1.4-.6-1.4-1.3v-6.8c0-.7.6-1.3 1.3-1.3h.1c.7 0 1.3.6 1.3 1.3v6.8c0 .7-.5 1.3-1.3 1.3z"
            ></Path>
        </Svg>
    );
}

export default Icon;