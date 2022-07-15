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
            fill={color}
            d="M12 25a1 1 0 01-.71-.29 1 1 0 010-1.42l7.3-7.29-7.3-7.29a1 1 0 111.42-1.42l8 8a1 1 0 010 1.42l-8 8A1 1 0 0112 25z"
            ></Path>
        </Svg>
    );
}

export default Icon;