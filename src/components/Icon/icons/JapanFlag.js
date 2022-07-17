import React from "react";
import Svg, { Path, Circle } from "react-native-svg";

const Icon = (props) => {
    const {
        width,
        height
    } = props;

    return (
        <Svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={width}
        height={height}
        viewBox="0 0 900 700"
        >
            <Path fill="#fff" d="M0 0H900V600H0z"></Path>
            <Circle cx="450" cy="300" r="180" fill="#bc002d"></Circle>
        </Svg>
    );
}

export default Icon;