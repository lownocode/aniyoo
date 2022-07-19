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
        viewBox="0 0 20 20"
        >
            <Path
            d="M17.25 5h-2.364a2.501 2.501 0 00-4.771 0H2.75a.75.75 0 000 1.5h7.364a2.501 2.501 0 004.771 0h2.365a.75.75 0 000-1.5zM2.75 13.5a.75.75 0 000 1.5h2.364a2.501 2.501 0 004.772 0h7.364a.75.75 0 000-1.5H9.886a2.501 2.501 0 00-4.772 0H2.75z"
            ></Path>
        </Svg>
    );
}

export default Icon;