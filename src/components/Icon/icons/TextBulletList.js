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
        fill="none"
        viewBox="0 0 24 24"
        >
            <Path
                fill={color}
                d="M5.25 3A2.25 2.25 0 003 5.25v13.5A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V5.25A2.25 2.25 0 0018.75 3H5.25zm3.5 5.25a1 1 0 11-2 0 1 1 0 012 0zm1.75 0a.75.75 0 01.75-.75h5.5a.75.75 0 010 1.5h-5.5a.75.75 0 01-.75-.75zm0 3.75a.75.75 0 01.75-.75h5.5a.75.75 0 110 1.5h-5.5a.75.75 0 01-.75-.75zm.75 3h5.5a.75.75 0 110 1.5h-5.5a.75.75 0 110-1.5zm-3.5-2a1 1 0 110-2 1 1 0 010 2zm1 2.75a1 1 0 11-2 0 1 1 0 012 0z"
            ></Path>
        </Svg>
    );
}

export default Icon;