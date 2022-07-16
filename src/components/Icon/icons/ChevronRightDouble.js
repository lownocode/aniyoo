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
        enableBackground="new 0 0 32 32"
        viewBox="0 0 32 32"
        fill={color}
        width={size}
        height={size}
        >
            <Path
            d="M17 22c-.26 0-.51-.1-.71-.29a.996.996 0 010-1.41l4.3-4.3-4.29-4.29a.996.996 0 111.41-1.41l5 5c.39.39.39 1.02 0 1.41l-5 5c-.2.19-.45.29-.71.29z"
            ></Path>
            <Path
            d="M11 22c-.26 0-.51-.1-.71-.29a.996.996 0 010-1.41l4.3-4.3-4.29-4.29a.996.996 0 111.41-1.41l5 5c.39.39.39 1.02 0 1.41l-5 5c-.2.19-.45.29-.71.29z"
            ></Path>
        </Svg>
    );
}

export default Icon;