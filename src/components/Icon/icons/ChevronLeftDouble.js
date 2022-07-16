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
            d="M15 22c-.26 0-.51-.1-.71-.29l-5-5a.996.996 0 010-1.41l5-5a.996.996 0 111.41 1.41L11.41 16l4.29 4.29c.39.39.39 1.02 0 1.41-.19.2-.44.3-.7.3z"
            ></Path>
            <Path
            d="M21 22c-.26 0-.51-.1-.71-.29l-5-5a.996.996 0 010-1.41l5-5a.996.996 0 111.41 1.41L17.41 16l4.29 4.29c.39.39.39 1.02 0 1.41-.19.2-.44.3-.7.3z"
            ></Path>
        </Svg>
    );
}

export default Icon;