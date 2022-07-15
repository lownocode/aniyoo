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
        viewBox="0 0 16 20"
        width={size}
        height={size}
        >
            <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <G transform="translate(-444 -4100)">
                    <G transform="translate(100 4044)">
                        <G transform="translate(340 54)">
                            <Path d="M0 0L24 0 24 24 0 24z"></Path>
                            <Path
                                fill={color}
                                d="M12 22c1.1 0 2-.9 2-2h-4a2 2 0 002 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-1.29 1.29c-.63.63-.19 1.71.7 1.71h13.17c.89 0 1.34-1.08.71-1.71L18 16z"
                            ></Path>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;