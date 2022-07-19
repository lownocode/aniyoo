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
            <Path d="M284.3 245.1l110.9-110.9c7.8-7.8 7.8-20.5 0-28.3s-20.5-7.8-28.3 0L256 216.8 145.1 105.9c-7.8-7.8-20.5-7.8-28.3 0s-7.8 20.5 0 28.3l110.9 110.9-110.8 110.8c-7.8 7.8-7.8 20.5 0 28.3 3.9 3.9 9 5.9 14.1 5.9s10.2-2 14.1-5.9L256 273.3l110.9 110.9c3.9 3.9 9 5.9 14.1 5.9s10.2-2 14.1-5.9c7.8-7.8 7.8-20.5 0-28.3L284.3 245.1z"></Path>
        </Svg>
    );
}

export default Icon;