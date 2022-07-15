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
                d="M11.07 0c2.71 0 4.9 1.07 4.93 3.79v15.18c0 .17-.04.34-.12.49-.13.24-.35.42-.62.5-.26.08-.55.04-.79-.1l-6.48-3.24-6.49 3.24c-.15.08-.32.13-.49.13-.56 0-1.01-.46-1.01-1.02V3.79C0 1.07 2.2 0 4.9 0zm.68 6.04H4.22c-.43 0-.78.35-.78.79 0 .44.35.79.78.79h7.53c.43 0 .78-.35.78-.79 0-.44-.35-.79-.78-.79z"
                transform="translate(4 2)"
                ></Path>
            </G>
        </Svg>
    );
}

export default Icon;