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
        x="0"
        y="0"
        enableBackground="new 0 0 232.679 232.679"
        version="1.1"
        viewBox="0 0 232.679 232.679"
        xmlSpace="preserve"
        fill={color}
        width={size}
        height={size}
        >
            <Path
            fillRule="evenodd"
            d="M80.543 0H35.797c-9.885 0-17.898 8.014-17.898 17.898v196.883c0 9.885 8.013 17.898 17.898 17.898h44.746c9.885 0 17.898-8.013 17.898-17.898V17.898C98.44 8.014 90.427 0 80.543 0zm116.339 0h-44.746c-9.886 0-17.899 8.014-17.899 17.898v196.883c0 9.885 8.013 17.898 17.899 17.898h44.746c9.885 0 17.898-8.013 17.898-17.898V17.898C214.781 8.014 206.767 0 196.882 0z"
            clipRule="evenodd"
            ></Path>
        </Svg>
    );
}

export default Icon;