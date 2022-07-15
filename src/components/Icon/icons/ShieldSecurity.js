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
        enableBackground="new 0 0 512 512"
        version="1.1"
        viewBox="0 0 512 512"
        xmlSpace="preserve"
        fill={color}
        width={size}
        height={size}
        >
            <Path d="M449.4 136.3c-41.3 0-74.8-33.5-74.8-74.8 0-2.4.1-4.9.4-7.3H140.8c.2 2.4.3 4.8.3 7.3 0 10.4-2.1 20.4-6 29.4-11.4 26.8-38 45.5-68.9 45.5-3.3 0-6.4-.2-9.6-.6 1.3 35.5 6.9 69.6 16.4 101.7 11.3 38.6 28.1 74.2 49.3 105.6 34.5 51.1 80.6 91.2 133.7 114.8 112.8-50.2 194-174.6 199.3-321.8-2 .1-3.9.2-5.9.2zM389 253.6H256.1v157.3h-.1c-38.3-20.8-72.2-52.1-98.7-91.5-13.7-20.3-25.2-42.4-34.3-65.8h133.1V96.3h81.6c11 35 38 63 72.4 75.3-3.9 28.4-11 56-21.1 82z"></Path>
        </Svg>
    );
}

export default Icon;