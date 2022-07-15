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
        viewBox="0 0 32 32"
        fill={color}
        width={size}
        height={size}
        >
            <Path
            d="M19.47 31a2 2 0 01-1.8-1.09l-4-7.57a1 1 0 011.77-.93l4 7.57L29 3.06 3 12.49l9.8 5.26 8.32-8.32a1 1 0 011.42 1.42l-8.85 8.84a1 1 0 01-1.17.18L2.09 14.33a2 2 0 01.25-3.72l25.91-9.48a2 2 0 012.62 2.62l-9.48 25.91A2 2 0 0119.61 31z"
            ></Path>
        </Svg>
    );
}

export default Icon;