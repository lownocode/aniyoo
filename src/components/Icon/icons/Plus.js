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
        enableBackground="new 0 0 512 512"
        version="1.1"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        fill={color}
        width={size}
        height={size}
        >
            <Path
            d="M381 236H276V131c0-11-9-20-20-20s-20 9-20 20v105H131c-11 0-20 9-20 20s9 20 20 20h105v105c0 11 9 20 20 20s20-9 20-20V276h105c11 0 20-9 20-20s-9-20-20-20z"
            ></Path>
        </Svg>
    );
}

export default Icon;