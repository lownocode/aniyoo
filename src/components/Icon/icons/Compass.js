import React from "react";
import Svg, { Path, G } from "react-native-svg";

const Icon = (props) => {
    const {
        size = 15,
        color = "#fff"
    } = props;

    return (
        <Svg
        xmlns="http://www.w3.org/2000/svg"
        x="0"
        y="0"
        enableBackground="new 0 0 28 28"
        version="1.1"
        viewBox="0 0 28 28"
        xmlSpace="preserve"
        width={size}
        height={size}
        >
            <G fill={color}>
                <Path d="M14 0C6.268 0 0 6.268 0 14s6.268 14 14 14 14-6.268 14-14S21.732 0 14 0zm0 26C7.373 26 2 20.627 2 14S7.373 2 14 2s12 5.373 12 12-5.373 12-12 12z"></Path>
                <Path d="M6.222 21.777s8.838-3.183 10.606-4.949c1.768-1.768 4.949-10.606 4.949-10.606s-8.838 3.183-10.605 4.95-4.95 10.605-4.95 10.605zm6.364-9.191l2.828 2.828c.707.707-6.363 3.535-6.363 3.535s2.828-7.07 3.535-6.363z"></Path>
            </G>
        </Svg>
    );
}

export default Icon;