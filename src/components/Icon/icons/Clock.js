import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

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
        viewBox="0 0 32 32"
        fill={color}
        >
            <Path
            fillRule="evenodd"
            d="M13 11.423V7a1 1 0 00-2 0v4.989a1.006 1.006 0 00.51.883l4.32 2.494a1 1 0 001-1.732L13 11.423zM12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"
            ></Path>
        </Svg>
    );
}

export default Icon;