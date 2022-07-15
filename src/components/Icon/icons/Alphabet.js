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
        version="1.1"
        viewBox="0 0 24 24"
        >
            <Path d="M16 6c-1.64 0-3 1.36-3 3v12h2V9c0-.57.43-1 1-1h1c.57 0 1 .43 1 1v1c0 .57-.43 1-1 1h-1v2h1c.57 0 1 .43 1 1v1c0 .57-.43 1-1 1h-1v2h1c1.65 0 3-1.35 3-3v-1c0-.82-.41-1.54-1-2 .59-.46 1-1.18 1-2V9c0-1.64-1.35-3-3-3M7 9c-1.64 0-3 1.36-3 3v3c0 1.65 1.36 3 3 3h.7c.5 0 .95-.19 1.3-.5v.5h2V9H9v.5c-.35-.31-.8-.5-1.3-.5M7 11h1c.57 0 1 .43 1 1v3c0 .57-.43 1-1 1H7c-.57 0-1-.43-1-1v-3c0-.57.43-1 1-1z"></Path>
        </Svg>
    );
}

export default Icon;