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
        width={size}
        height={size}
        viewBox="0 0 24 24"
        >
            <G
            fill="none"
            fillRule="evenodd"
            stroke="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            >
                <G stroke={color} strokeWidth="1.7" transform="translate(2 2)">
                    <Path d="M.75 10c0 6.937 2.313 9.25 9.25 9.25 6.937 0 9.25-2.313 9.25-9.25 0-6.937-2.313-9.25-9.25-9.25C3.063.75.75 3.063.75 10z"></Path>
                    <Path d="M13.416 9.855c0-.904-4.584-3.796-5.104-3.276-.519.52-.57 5.984 0 6.553.571.57 5.104-2.373 5.104-3.277z"></Path>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;