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
        width={size}
        height={size}
        viewBox="0 0 24 24"
        >
            <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <Path
                fill={color}
                fillRule="nonzero"
                d="M6.644 18.782v-3.067c0-.777.632-1.408 1.414-1.413h2.875c.786 0 1.423.633 1.423 1.413v3.058c0 .674.548 1.222 1.227 1.227h1.96a3.46 3.46 0 002.444-1A3.41 3.41 0 0019 16.579V7.866c0-.735-.328-1.431-.895-1.902L11.443.674a3.115 3.115 0 00-3.958.071L.967 5.964A2.474 2.474 0 000 7.866v8.703C0 18.464 1.547 20 3.456 20h1.916c.327.002.641-.125.873-.354.232-.228.363-.54.363-.864h.036z"
                transform="translate(2.5 2)"
                ></Path>
            </G>
        </Svg>
    );
}

export default Icon;