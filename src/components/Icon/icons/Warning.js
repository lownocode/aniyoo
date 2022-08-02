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
        width={size}
        height={size}
        fill={color}
        >
            <Path d="M120 144V96a8 8 0 0116 0v48a8 8 0 01-16 0zm116.768 67.981a23.754 23.754 0 01-20.791 12.011H40.023a24 24 0 01-20.771-36.022l87.977-151.993a24 24 0 0141.543 0l87.976 151.992a23.754 23.754 0 01.02 24.012zM222.9 195.984L134.924 43.992a8 8 0 00-13.848 0L33.1 195.984a8 8 0 006.923 12.008h175.954a8 8 0 006.923-12.008zM128 168a12 12 0 1012 12 12.013 12.013 0 00-12-12z"></Path>
        </Svg>
    );
}

export default Icon;