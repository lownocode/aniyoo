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
        fill={color}
        viewBox="0 0 24 24"
        >
            <Path d="M11.293 7.05l2.121-2.121a4 4 0 115.657 5.657l-4.243 4.242a4 4 0 01-5.656 0 1 1 0 011.414-1.414 2 2 0 002.828 0l4.243-4.242a2 2 0 10-2.829-2.829l-1 1.001a5.018 5.018 0 00-2.535-.294zm1.414 9.9l-2.121 2.121a4 4 0 11-5.657-5.657l4.243-4.242a4 4 0 015.656 0 1 1 0 01-1.414 1.414 2 2 0 00-2.828 0l-4.243 4.242a2 2 0 102.829 2.829l1-1.001a5.018 5.018 0 002.535.294z"></Path>
        </Svg>
    );
}

export default Icon;