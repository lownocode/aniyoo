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
            <G
            fill="none"
            fillRule="evenodd"
            stroke="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1"
            >
                <G stroke={color} strokeWidth="1.8" transform="translate(4.5 2.5)">
                    <Path d="M2.104 11.332a5.386 5.386 0 0010.772 0"></Path>
                    <Path d="M12.876 8.24V6.098a5.385 5.385 0 10-10.772 0V8.24"></Path>
                    <Path d="M7.49 18.763L7.49 16.718"></Path>
                    <Path d="M0.712 11.332L14.268 11.332"></Path>
                    <Path d="M5.997 7.952L8.982 7.952"></Path>
                    <Path d="M7.991 5.182L6.988 5.182"></Path>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;