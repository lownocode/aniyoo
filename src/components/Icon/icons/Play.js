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
        enableBackground="new 0 0 232.153 232.153"
        version="1.1"
        viewBox="0 0 232.153 232.153"
        xmlSpace="preserve"
        fill={color}
        width={size}
        height={size}
        >
            <Path
            fillRule="evenodd"
            d="M203.791 99.628L49.307 2.294C44.74-.425 39.069.028 34.786.028 17.654.028 17.73 13.255 17.73 16.606v198.94c0 2.833-.075 16.579 17.056 16.579 4.283 0 9.955.451 14.521-2.267l154.483-97.333c12.68-7.545 10.489-16.449 10.489-16.449s2.192-8.904-10.488-16.448z"
            clipRule="evenodd"
            ></Path>
        </Svg>
    );
}

export default Icon;