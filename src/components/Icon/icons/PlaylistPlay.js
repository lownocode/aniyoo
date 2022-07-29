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
        viewBox="0 0 15 14"
        >
            <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <G transform="translate(-105 -999)">
                    <G transform="translate(100 852)">
                        <G transform="translate(0 142)">
                            <Path d="M0 0H24V24H0z"></Path>
                            <Path
                            fill={color}
                            d="M6 9h10c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1zm0-4h10c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1zm0 8h6c.55 0 1 .45 1 1s-.45 1-1 1H6c-.55 0-1-.45-1-1s.45-1 1-1zm9 .88v4.23c0 .39.42.63.76.43l3.53-2.12c.32-.19.32-.66 0-.86l-3.53-2.12a.508.508 0 00-.76.44z"
                            ></Path>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;