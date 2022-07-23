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
        viewBox="0 0 24 24"
        fill={color}
        width={size}
        height={size}
        >
            <Path
            d="M12 15a4 4 0 004-4V6a4 4 0 00-8 0v5a4 4 0 004 4zm-2-9a2 2 0 014 0v5a2 2 0 01-4 0z"
            ></Path>
            <Path
            d="M19 11a1 1 0 00-2 0 5 5 0 01-10 0 1 1 0 00-2 0 7 7 0 006 6.92V20H8.89a.89.89 0 00-.89.89v.22a.89.89 0 00.89.89h6.22a.89.89 0 00.89-.89v-.22a.89.89 0 00-.89-.89H13v-2.08A7 7 0 0019 11z"
            ></Path>
        </Svg>
    );
}

export default Icon;