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
        viewBox="0 0 640 512"
        fill={color}
        width={size}
        height={size}
        >
            <Path d="M274.7 304H173.3C77.61 304 0 381.6 0 477.3 0 496.5 15.52 512 34.66 512H413.3c19.2 0 34.7-15.5 34.7-34.7 0-95.7-77.6-173.3-173.3-173.3zM224 256c70.7 0 128-57.31 128-128S294.7 0 224 0 96 57.31 96 128s57.3 128 128 128zm408.3-121.6c-9.703-9-24.91-8.453-33.92 1.266l-87.05 93.75-38.39-38.39c-9.375-9.375-24.56-9.375-33.94 0s-9.375 24.56 0 33.94l56 56c4.5 4.534 10.6 7.034 17 7.034h.438a24.032 24.032 0 0017.16-7.672l104-112C642.6 158.6 642 143.4 632.3 134.4z"></Path>
        </Svg>
    );
}

export default Icon;