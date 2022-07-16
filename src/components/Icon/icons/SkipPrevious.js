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
        viewBox="0 0 13 12"
        >
            <G fill="none" fillRule="evenodd" stroke="none" strokeWidth="1">
                <G transform="translate(-582 -1000)">
                    <G transform="translate(100 852)">
                        <G transform="translate(476 142)">
                            <Path d="M0 0H24V24H0z"></Path>
                            <Path
                                fill={color}
                                d="M7 6c.55 0 1 .45 1 1v10c0 .55-.45 1-1 1s-1-.45-1-1V7c0-.55.45-1 1-1zm3.66 6.82l5.77 4.07c.66.47 1.58-.01 1.58-.82V7.93c0-.81-.91-1.28-1.58-.82l-5.77 4.07a1 1 0 000 1.64z"
                            ></Path>
                        </G>
                    </G>
                </G>
            </G>
        </Svg>
    );
}

export default Icon;