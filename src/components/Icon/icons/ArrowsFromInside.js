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
            d="M6.97 4.78a.75.75 0 001.06 0l1.22-1.22v3.19a.75.75 0 001.5 0V3.56l1.22 1.22a.75.75 0 101.06-1.06l-2.5-2.5a.75.75 0 00-1.06 0l-2.5 2.5a.75.75 0 000 1.06zM4.78 8.03a.75.75 0 00-1.06-1.06l-2.5 2.5a.75.75 0 000 1.06l2.5 2.5a.75.75 0 001.06-1.06l-1.22-1.22h3.19a.75.75 0 000-1.5H3.56l1.22-1.22zM15.22 6.97a.75.75 0 011.06 0l2.5 2.5a.75.75 0 010 1.06l-2.5 2.5a.75.75 0 11-1.06-1.06l1.22-1.22h-3.19a.75.75 0 010-1.5h3.19l-1.22-1.22a.75.75 0 010-1.06zM9.25 16.44l-1.22-1.22a.75.75 0 00-1.06 1.06l2.5 2.5a.75.75 0 001.06 0l2.5-2.5a.75.75 0 10-1.06-1.06l-1.22 1.22v-3.19a.75.75 0 00-1.5 0v3.19z"
            ></Path>
        </Svg>
    );
}

export default Icon;