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
                    <Path d="M19.25 10a9.25 9.25 0 11-18.5 0 9.25 9.25 0 0118.5 0z"></Path>
                    <Path d="M14.1907 10.7672L9.6607 10.6932 9.6607 5.8462"></Path>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;