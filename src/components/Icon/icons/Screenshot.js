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
            <Path d="M9.662 17.75a1 1 0 01-1.324-1.5l8.355-7.378a1 1 0 011.33.006l2.646 2.378a1 1 0 11-1.338 1.488L17.35 10.96l-7.688 6.79zM19 5h-3a1 1 0 010-2h4a1 1 0 011 1v4a1 1 0 01-2 0V5zM5 5v3a1 1 0 11-2 0V4a1 1 0 011-1h4a1 1 0 110 2H5zm14 14v-3a1 1 0 012 0v4a1 1 0 01-1 1h-4a1 1 0 010-2h3zM5 19h3a1 1 0 010 2H4a1 1 0 01-1-1v-4a1 1 0 012 0v3zm4-7a3 3 0 110-6 3 3 0 010 6zm0-2a1 1 0 100-2 1 1 0 000 2z"></Path>
        </Svg>
    );
}

export default Icon;