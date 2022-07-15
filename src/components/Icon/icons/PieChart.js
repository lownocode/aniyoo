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
        ariaHidden="true"
        viewBox="0 0 14 14"
        fill={color}
        width={size}
        height={size}
        >
            <Path d="M6.333 7.403l3.792 3.791q-.736.75-1.719 1.167-.982.417-2.073.417-1.451 0-2.677-.716-1.225-.715-1.94-1.94Q1 8.896 1 7.444q0-1.451.715-2.677.716-1.225 1.941-1.94 1.226-.716 2.677-.716v5.292zm1.299.041H13q0 1.09-.417 2.073-.416.983-1.166 1.72zm4.924-.888H7.222V1.222q1.452 0 2.677.716 1.226.715 1.941 1.94.716 1.226.716 2.678z"></Path>
        </Svg>
    );
}

export default Icon;