import React from "react";
import Svg, { Path, G } from "react-native-svg";

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
        >
            <G
            fill="none"
            fillRule="evenodd"
            stroke="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            >
                <G stroke={color} strokeWidth="1.5" transform="translate(4.5 2.5)">
                    <Path d="M4.042 6.718L10.897 6.718"></Path>
                    <Path d="M7.47 0C1.083 0 .004.932.004 8.429.004 16.822-.153 19 1.444 19c1.594 0 4.2-3.684 6.026-3.684 1.827 0 4.432 3.684 6.027 3.684 1.596 0 1.44-2.178 1.44-10.571C14.936.932 13.856 0 7.47 0z"></Path>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;