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
        fill="none"
        viewBox="0 0 48 48"
        >
            <Path fill="none" fillOpacity="0.01" d="M0 0H48V48H0z"></Path>
            <Path
            stroke={color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="4"
            d="M14 24l1.25 1.25M44 14L24 34l-1.25-1.25M4 24l10 10 20-20"
            ></Path>
        </Svg>
    );
}

export default Icon;