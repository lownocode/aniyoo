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
        viewBox="0 0 20 20"
        >
            <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <G transform="translate(-646 -1484)">
                    <G transform="translate(100 1428)">
                        <G transform="translate(544 54)">
                            <Path d="M0 0L24 0 24 24 0 24z"></Path>
                            <Path
                            fill={color}
                            d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM4 12c0-4.42 3.58-8 8-8 1.85 0 3.55.63 4.9 1.69L5.69 16.9A7.902 7.902 0 014 12zm8 8c-1.85 0-3.55-.63-4.9-1.69L18.31 7.1A7.902 7.902 0 0120 12c0 4.42-3.58 8-8 8z"
                            ></Path>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;