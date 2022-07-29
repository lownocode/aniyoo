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
        viewBox="0 0 20 20"
        >
            <Path
            d="M2.75 4.5a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2.75 7.5a.75.75 0 000 1.5h14.5a.75.75 0 000-1.5H2.75zM2 11.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zM2.75 13.5a.75.75 0 000 1.5h9.5a.75.75 0 000-1.5h-9.5z"
            ></Path>
        </Svg>
    );
}

export default Icon;