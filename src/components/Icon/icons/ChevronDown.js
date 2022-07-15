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
        width={size}
        height={size}
        >
            <Path
            d="M16 21a1 1 0 01-.71-.29l-8-8a1 1 0 111.42-1.42l7.29 7.3 7.29-7.3a1 1 0 011.42 1.42l-8 8A1 1 0 0116 21z"
            fill={color}
            ></Path>
        </Svg>
    );
}

export default Icon;