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
        viewBox="0 0 14 14"
        >
            <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <G transform="translate(-785 -2019)">
                    <G transform="translate(100 1960)">
                        <G transform="translate(680 54)">
                            <Path d="M0 0L24 0 24 24 0 24z"></Path>
                            <Path
                            fill={color}
                            d="M6.4 9.2h.2c.77 0 1.4.63 1.4 1.4v7c0 .77-.63 1.4-1.4 1.4h-.2c-.77 0-1.4-.63-1.4-1.4v-7c0-.77.63-1.4 1.4-1.4zM12 5c.77 0 1.4.63 1.4 1.4v11.2c0 .77-.63 1.4-1.4 1.4-.77 0-1.4-.63-1.4-1.4V6.4c0-.77.63-1.4 1.4-1.4zm5.6 8c.77 0 1.4.63 1.4 1.4v3.2c0 .77-.63 1.4-1.4 1.4-.77 0-1.4-.63-1.4-1.4v-3.2c0-.77.63-1.4 1.4-1.4z"
                            ></Path>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;