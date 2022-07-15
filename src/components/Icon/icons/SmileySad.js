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
        viewBox="0 0 256 256"
        fill={color}
        width={size}
        height={size}
        >
            <Path d="M128 230a102 102 0 11102-102 102.116 102.116 0 01-102 102zm0-192a90 90 0 1090 90 90.102 90.102 0 00-90-90zm44.583 143.193a6 6 0 002.189-8.198 54.027 54.027 0 00-93.543 0 6 6 0 1010.387 6.008 42.194 42.194 0 0120.038-17.705 41.959 41.959 0 0146.045 9.003 42.194 42.194 0 016.686 8.703 5.997 5.997 0 008.198 2.189zM92 118a10 10 0 1110-10 10.011 10.011 0 01-10 10zm72 0a10 10 0 1110-10 10.011 10.011 0 01-10 10z"></Path>
        </Svg>
    );
}

export default Icon;